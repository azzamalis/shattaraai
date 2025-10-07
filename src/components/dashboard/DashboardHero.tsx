import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { EnhancedPromptInput } from '@/components/ui/enhanced-prompt-input';
import { NewFeaturePromo } from './NewFeaturePromo';
import { ActionCards } from './ActionCards';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
interface DashboardHeroProps {
  onPasteClick: () => void;
}
export function DashboardHero({
  onPasteClick
}: DashboardHeroProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    onAddContent,
    addContentWithFile,
    onAddContentWithMetadata
  } = useContent();
  const handleAISubmit = async (value: string, files?: File[]) => {
    try {
      // Upload files to storage first if present
      const uploadedFiles: Array<{
        name: string;
        type: string;
        size: number;
        url: string;
        uploadedAt: string;
      }> = [];

      if (files && files.length > 0) {
        console.log('DashboardHero - Starting file upload process', { fileCount: files.length, userId: user.id });
        const { uploadFileToStorage } = await import('@/lib/storage');
        
        for (const file of files) {
          try {
            console.log('DashboardHero - Uploading file:', { name: file.name, size: file.size, type: file.type });
            const fileUrl = await uploadFileToStorage(file, 'chat', user.id);
            console.log('DashboardHero - File uploaded successfully:', { name: file.name, url: fileUrl });
            
            uploadedFiles.push({
              name: file.name,
              type: file.type,
              size: file.size,
              url: fileUrl,
              uploadedAt: new Date().toISOString()
            });
          } catch (error) {
            console.error(`DashboardHero - Failed to upload ${file.name}:`, error);
            console.error('DashboardHero - Error details:', {
              errorMessage: error instanceof Error ? error.message : 'Unknown error',
              errorStack: error instanceof Error ? error.stack : undefined,
              file: { name: file.name, size: file.size, type: file.type }
            });
            toast.error(`Failed to upload ${file.name}`);
          }
        }
        
        console.log('DashboardHero - Upload process complete:', { 
          totalFiles: files.length, 
          successfulUploads: uploadedFiles.length 
        });
      }

      // Create content entry with uploaded files in metadata
      const title = value.slice(0, 100) + (value.length > 100 ? '...' : '');
      
      const contentId = await onAddContentWithMetadata({
        title: title,
        type: 'chat',
        text_content: value,
        room_id: null,
        processing_status: 'pending',
        metadata: {
          initialQuery: value,
          hasAttachments: uploadedFiles.length > 0,
          attachmentCount: uploadedFiles.length,
          attachments: uploadedFiles,
          createdFrom: 'dashboard_hero'
        }
      });

      if (contentId) {
        // Navigate with content ID and initial query
        const searchParams = new URLSearchParams();
        searchParams.set('query', value);
        if (uploadedFiles.length > 0) {
          searchParams.set('hasFiles', 'true');
        }
        
        navigate(`/chat/${contentId}?${searchParams.toString()}`);
        toast.success('Starting conversation with Shattara AI');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start conversation');
    }
  };
  return <div className="max-w-[800px] mx-auto mb-12">
      <NewFeaturePromo />
      
      <motion.h1 initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8 md:mb-12 text-center font-normal md:text-3xl">What do you need help learning?</motion.h1>
      
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <ActionCards onPasteClick={onPasteClick} />
      </motion.div>
      
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="relative my-6 sm:my-8">
        <EnhancedPromptInput onSubmit={handleAISubmit} />
      </motion.div>

      {/* Quick Tips Section with matching subtle styling */}
      
    </div>;
}