
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContentItem } from '@/lib/types';
import { useContentContext } from '@/contexts/ContentContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Upload, Loader2 } from 'lucide-react';

interface EditContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentItem: ContentItem | null;
  onSave?: (updatedItem: ContentItem) => void;
}

// Function to format date to input-friendly format
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function EditContentModal({ open, onOpenChange, contentItem, onSave }: EditContentModalProps) {
  const { onUpdateContent } = useContentContext();
  const [editedContent, setEditedContent] = useState<Partial<ContentItem>>(contentItem || {});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // When the contentItem prop changes, update the local state
    setEditedContent(contentItem || {});
  }, [contentItem]);

  const handleSave = async () => {
    if (editedContent.id && contentItem) {
      await onUpdateContent(editedContent.id, editedContent);
      if (onSave) {
        onSave({ ...contentItem, ...editedContent } as ContentItem);
      }
      onOpenChange(false);
    } else {
      toast.error("Content ID is missing");
    }
  };

  const handleFileReplace = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !contentItem) return;

    setUploading(true);
    try {
      // Delete old file if it exists
      if (contentItem.storage_path) {
        await supabase.storage
          .from('pdf-files')
          .remove([contentItem.storage_path]);
      }

      // Upload new file
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${contentItem.user_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pdf-files')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pdf-files')
        .getPublicUrl(filePath);

      // Update the edited content with new file info
      setEditedContent(prev => ({
        ...prev,
        url: publicUrl,
        storage_path: filePath,
        filename: file.name,
        metadata: {
          ...prev.metadata,
          fileSize: file.size,
          fileType: file.type,
          updatedAt: new Date().toISOString()
        }
      }));

      toast.success('File replaced successfully');
    } catch (error) {
      console.error('Error replacing file:', error);
      toast.error(`Failed to replace file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  if (!contentItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogDescription>
            Make changes to your content here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              type="text"
              id="title"
              value={editedContent.title || ''}
              onChange={(e) => setEditedContent(prev => ({ ...prev, title: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select onValueChange={(value) => setEditedContent(prev => ({ ...prev, type: value as ContentItem['type'] }))}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" defaultValue={contentItem.type} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="file">File</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="recording">Recording</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
                <SelectItem value="audio_file">Audio File</SelectItem>
                <SelectItem value="live_recording">Live Recording</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              type="text"
              id="url"
              value={editedContent.url || ''}
              onChange={(e) => setEditedContent(prev => ({ ...prev, url: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              Filename
            </Label>
            <Input
              type="text"
              id="filename"
              value={editedContent.filename || ''}
              onChange={(e) => setEditedContent(prev => ({ ...prev, filename: e.target.value }))}
              className="col-span-3"
            />
          </div>
          
          {/* File replacement section for files with storage_path */}
          {contentItem.storage_path && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file-replace" className="text-right">
                Replace File
              </Label>
              <div className="col-span-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    id="file-replace"
                    onChange={handleFileReplace}
                    className="hidden"
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,audio/*,video/*"
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    className="w-full"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Choose New File
                      </>
                    )}
                  </Button>
                </label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="text-content" className="text-right mt-2">
              Text Content
            </Label>
            <Textarea
              id="text-content"
              value={editedContent.text_content || ''}
              onChange={(e) => setEditedContent(prev => ({ ...prev, text_content: e.target.value }))}
              className="col-span-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="created-date">Created Date</Label>
            <Input
              id="created-date"
              type="datetime-local"
              value={formatDateForInput(new Date(contentItem.created_at))}
              onChange={(e) => {
                const date = new Date(e.target.value);
                if (!isNaN(date.getTime())) {
                  setEditedContent(prev => ({ ...prev, created_at: date.toISOString() }));
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Content ID: {contentItem.id}
            </p>
            <p className="text-xs text-muted-foreground">
              Created {formatDistanceToNow(new Date(contentItem.created_at), { addSuffix: true })}
            </p>
          </div>
          <Button type="button" onClick={handleSave} disabled={uploading}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
