

## Analysis: Current Upload Workflow Bottlenecks

### Current Flow (Step by Step)
```text
User selects file
       ↓
1. [CLIENT] Show immediate toast (startImmediateUploadToast)
       ↓
2. [CLIENT] Upload file to Supabase Storage via XHR (with progress tracking)
       ↓
3. [CLIENT] Wait for signed URL generation
       ↓
4. [CLIENT] Insert content record into database
       ↓
5. [CLIENT] Transition toast to content tracking
       ↓
6. [CLIENT] processContentAutomatically() triggers background processing
       ↓
7. [CLIENT - AUDIO] Convert file to base64 in memory (convertFileToBase64Chunked)
       ↓
8. [CLIENT] Send base64 data to edge function (audio-transcription)
       ↓
9. [EDGE] Decode base64 back to binary
       ↓
10. [EDGE] Send to OpenAI Whisper
       ↓
11. [EDGE] Trigger chapter generation
       ↓
12. [DATABASE] Update content with results
```

### Identified Bottlenecks

| Bottleneck | Location | Impact | Current Behavior |
|------------|----------|--------|------------------|
| **Base64 conversion** | Client (step 7) | HIGH | Audio files are read, converted to base64 (33% size increase), then sent to edge function |
| **Double file transfer** | Client → Storage → Client → Edge | HIGH | File uploads to storage, then client re-reads it and sends base64 to edge function |
| **Sequential operations** | Steps 2-6 | MEDIUM | Database insert waits for storage upload to complete |
| **Signed URL generation** | Step 3 | LOW | Extra API call after upload completion |
| **Blocking UI during base64** | Step 7 | MEDIUM | Large files cause UI to appear frozen during conversion |

### Why It Feels Slow

1. **Audio/Video Files**: After storage upload (steps 2-3), the client reads the file AGAIN and converts to base64 (step 7), then sends to the edge function. This effectively doubles the data transfer.

2. **PDF Files**: Client-side PDF extraction using pdfjs-dist runs synchronously, blocking the main thread.

3. **No Parallel Operations**: Database insert and processing trigger happen sequentially instead of overlapping.

---

## Optimization Plan

### Phase 1: Eliminate Base64 Double-Transfer (Highest Impact)

**Current Issue**: For audio files, the client:
1. Uploads file to Supabase Storage
2. Then converts the same file to base64
3. Sends base64 (33% larger) to the edge function

**Solution**: Use the URL-based pipeline already partially implemented in `audio-transcription/index.ts`:
- The edge function already has `processAudioFileFromUrl()` that downloads the file directly from storage
- Change the client to pass `audioFileUrl` instead of `audioData` (base64)

**Files to modify**:
- `src/hooks/useContent.ts` (lines 691-765) - Remove base64 conversion, pass storage URL instead

### Phase 2: Optimistic Database Insert

**Current Issue**: Database insert waits for storage upload to complete fully.

**Solution**: 
- Insert content record immediately with `processing_status: 'uploading'`
- Update with storage URL once upload completes
- This allows the UI to show the content item immediately and progress can be tracked from the start

**Files to modify**:
- `src/hooks/useContent.ts` - Split addContentWithFile into two phases
- `src/lib/storage.ts` - No changes needed (already supports progress callbacks)

### Phase 3: Parallel Processing for PDFs

**Current Issue**: PDF text extraction runs on main thread using pdfjs-dist.

**Solution**:
- Move PDF extraction to Web Worker for non-blocking UI
- Alternative: Use server-side extraction via `extract-pdf-text` edge function and skip client-side

**Files to modify**:
- `src/hooks/useContent.ts` - Use server-side extraction by default
- Create `src/workers/pdfExtractor.worker.ts` (optional enhancement)

### Phase 4: Immediate Content Tracking

**Current Issue**: The toast starts at 5%, then jumps to 15% after database insert.

**Solution**:
- Define clearer progress stages:
  - 0-50%: Storage upload (real XHR progress)
  - 50-55%: Database insert
  - 55-90%: Backend processing (transcription/chapters)
  - 90-100%: Complete

**Files to modify**:
- `src/components/ui/progress-toast.tsx` - Update step definitions
- `src/hooks/useProgressToast.ts` - Better stage tracking

---

## Technical Implementation Details

### Change 1: URL-Based Audio Processing

```typescript
// In useContent.ts - processContentAutomatically
// BEFORE (current):
const base64Audio = await convertFileToBase64Chunked(file);
await supabase.functions.invoke('audio-transcription', {
  body: {
    audioData: base64Audio,  // ← 33% larger than original file
    recordingId: contentId,
    // ...
  }
});

// AFTER (optimized):
await supabase.functions.invoke('audio-transcription', {
  body: {
    audioFileUrl: finalContentData.url,  // ← Use storage URL directly
    contentId: contentId,
    originalFileName: file.name,
    // ...
  }
});
```

### Change 2: Optimistic Content Creation

```typescript
// Split the workflow:
// 1. Create record immediately (before upload completes)
// 2. Start storage upload with progress
// 3. Update record with URL when upload completes
// 4. Trigger processing
```

### Change 3: Edge Function Already Supports URL Mode

The `audio-transcription` function (lines 747-759) already has:
```typescript
if (audioFileUrl) {
  console.log('Processing audio file from URL:', audioFileUrl);
  const backgroundProcessing = processAudioFileFromUrl(...);
}
```

We just need to ensure the client uses this path instead of the legacy base64 path.

---

## Expected Performance Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Data transferred for 10MB audio | ~23MB (10MB upload + 13MB base64) | 10MB | ~56% reduction |
| Time for audio upload + processing trigger | ~8-15 seconds | ~4-7 seconds | ~50% faster |
| UI responsiveness during upload | Blocked during base64 | Always responsive | Much smoother |
| Perceived start time | ~2-3 seconds | Immediate | User sees progress instantly |

---

## Summary of Files to Modify

1. **`src/hooks/useContent.ts`**
   - Remove base64 conversion for audio files
   - Pass storage URL to edge function instead
   - Implement optimistic content record creation

2. **`src/hooks/useProgressToast.ts`**
   - Better progress stage mapping (0-50% for upload, 50-100% for processing)

3. **`src/components/ui/progress-toast.tsx`**
   - Update `PROCESSING_STEPS` to reflect new stages

4. **`src/components/dashboard/ActionCards.tsx`**
   - Minor adjustments to support optimistic record creation

5. **Edge functions remain unchanged** - The URL-based pipeline already exists and works

