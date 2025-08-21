/**
 * Audio chunking utilities for real-time transcription
 */

export class AudioChunker {
  private chunks: Blob[] = [];
  private mediaRecorder: MediaRecorder | null = null;
  private onChunkReady: (audioData: string) => void;
  private chunkDuration: number;
  private isRecording = false;

  constructor(
    onChunkReady: (audioData: string) => void,
    chunkDuration = 5000 // 5 seconds default
  ) {
    this.onChunkReady = onChunkReady;
    this.chunkDuration = chunkDuration;
  }

  async startChunking(stream: MediaStream) {
    if (this.isRecording) {
      return;
    }

    try {
      this.isRecording = true;
      this.chunks = [];

      // Create MediaRecorder with optimal settings for Whisper
      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000,
      };

      // Fallback to other formats if webm is not supported
      let mimeType = options.mimeType;
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
        }
      }

      this.mediaRecorder = new MediaRecorder(stream, {
        ...options,
        mimeType
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.processChunk();
      };

      // Start recording and set up chunking interval
      this.mediaRecorder.start();
      this.scheduleNextChunk();

      console.log('Audio chunking started with format:', mimeType);
    } catch (error) {
      console.error('Error starting audio chunking:', error);
      this.isRecording = false;
      throw error;
    }
  }

  private scheduleNextChunk() {
    if (!this.isRecording || !this.mediaRecorder) {
      return;
    }

    setTimeout(() => {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        // Stop current chunk and start new one
        this.mediaRecorder.stop();
        
        // Immediately start next chunk if still recording
        if (this.isRecording) {
          setTimeout(() => {
            if (this.mediaRecorder && this.isRecording) {
              this.mediaRecorder.start();
              this.scheduleNextChunk();
            }
          }, 100); // Small delay to allow processing
        }
      }
    }, this.chunkDuration);
  }

  private async processChunk() {
    if (this.chunks.length === 0) {
      return;
    }

    try {
      // Combine chunks into single blob
      const combinedBlob = new Blob(this.chunks, { type: this.chunks[0].type });
      this.chunks = []; // Clear chunks for next iteration

      // Convert to base64 for transmission
      const audioData = await this.blobToBase64(combinedBlob);
      
      // Send to transcription
      this.onChunkReady(audioData);
      
      console.log('Audio chunk processed, size:', combinedBlob.size);
    } catch (error) {
      console.error('Error processing audio chunk:', error);
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix to get just the base64 data
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  stopChunking() {
    this.isRecording = false;
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    // Process any remaining chunks
    if (this.chunks.length > 0) {
      this.processChunk();
    }

    console.log('Audio chunking stopped');
  }

  async getFinalAudio(stream: MediaStream): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Blob[] = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const combinedBlob = new Blob(chunks, { type: chunks[0]?.type || 'audio/webm' });
          const audioData = await this.blobToBase64(combinedBlob);
          resolve(audioData);
        } catch (error) {
          reject(error);
        }
      };

      mediaRecorder.start();
      
      // Stop after a short duration to capture final audio
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }, 1000);
    });
  }
}

// Utility function to get user media with optimal settings for transcription
export async function getOptimalAudioStream(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 44100,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    });

    console.log('Audio stream acquired with optimal settings');
    return stream;
  } catch (error) {
    console.error('Error getting audio stream:', error);
    throw new Error('Could not access microphone for transcription');
  }
}