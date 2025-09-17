import React, { useState } from 'react';
import { ContentItem } from '@/lib/types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Download, 
  Share2, 
  MessageSquare, 
  Calendar,
  Clock,
  Tag,
  Brain,
  Copy,
  FileText
} from 'lucide-react';
import { ChatMetadataDisplay } from './ChatMetadataDisplay';
import { toast } from 'sonner';

interface ChatExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItem;
  messages?: Array<{
    id: string;
    content: string;
    sender_type: 'user' | 'ai' | 'system';
    created_at: string;
  }>;
}

export function ChatExportModal({ 
  isOpen, 
  onClose, 
  content, 
  messages = [] 
}: ChatExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'text' | 'markdown' | 'json'>('text');

  const formatChatForExport = (format: 'text' | 'markdown' | 'json') => {
    const chatTitle = content.title;
    const chatDate = new Date(content.created_at).toLocaleDateString();
    
    switch (format) {
      case 'text':
        return formatAsText(chatTitle, chatDate, messages);
      case 'markdown':
        return formatAsMarkdown(chatTitle, chatDate, messages);
      case 'json':
        return formatAsJSON(content, messages);
      default:
        return '';
    }
  };

  const formatAsText = (title: string, date: string, msgs: typeof messages) => {
    let output = `${title}\n`;
    output += `Exported on: ${date}\n`;
    output += `Messages: ${msgs.length}\n\n`;
    output += `${'='.repeat(50)}\n\n`;
    
    msgs.forEach((msg, index) => {
      const timestamp = new Date(msg.created_at).toLocaleTimeString();
      const sender = msg.sender_type === 'user' ? 'You' : 'Shattara AI';
      output += `[${timestamp}] ${sender}:\n${msg.content}\n\n`;
    });
    
    return output;
  };

  const formatAsMarkdown = (title: string, date: string, msgs: typeof messages) => {
    let output = `# ${title}\n\n`;
    output += `**Exported:** ${date}  \n`;
    output += `**Messages:** ${msgs.length}\n\n`;
    output += `---\n\n`;
    
    msgs.forEach((msg, index) => {
      const timestamp = new Date(msg.created_at).toLocaleTimeString();
      const sender = msg.sender_type === 'user' ? '**You**' : '**Shattara AI**';
      output += `### ${sender} *${timestamp}*\n\n${msg.content}\n\n`;
    });
    
    return output;
  };

  const formatAsJSON = (content: ContentItem, msgs: typeof messages) => {
    return JSON.stringify({
      title: content.title,
      created_at: content.created_at,
      updated_at: content.updated_at,
      metadata: content.metadata,
      messages: msgs.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_type: msg.sender_type,
        created_at: msg.created_at
      }))
    }, null, 2);
  };

  const handleCopyToClipboard = async () => {
    try {
      const exportedContent = formatChatForExport(exportFormat);
      await navigator.clipboard.writeText(exportedContent);
      toast.success('Chat copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    const exportedContent = formatChatForExport(exportFormat);
    const filename = `${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${exportFormat}`;
    
    const blob = new Blob([exportedContent], { 
      type: exportFormat === 'json' ? 'application/json' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Chat exported successfully!');
  };

  const handleShare = async () => {
    try {
      const exportedContent = formatChatForExport('text');
      
      if (navigator.share) {
        await navigator.share({
          title: content.title,
          text: exportedContent
        });
      } else {
        await navigator.clipboard.writeText(exportedContent);
        toast.success('Chat copied to clipboard for sharing!');
      }
    } catch (error) {
      toast.error('Failed to share chat');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Export Chat Conversation
          </DialogTitle>
          <DialogDescription>
            Export your chat conversation in various formats
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Chat Metadata */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-medium mb-3">{content.title}</h3>
            <ChatMetadataDisplay content={content} />
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Export Format</h4>
            <div className="flex gap-2">
              {[
                { value: 'text', label: 'Plain Text', icon: FileText },
                { value: 'markdown', label: 'Markdown', icon: FileText },
                { value: 'json', label: 'JSON', icon: FileText }
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={exportFormat === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExportFormat(value as typeof exportFormat)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <h4 className="font-medium">Preview</h4>
            <Textarea
              value={formatChatForExport(exportFormat)}
              readOnly
              className="h-32 text-xs font-mono"
              placeholder="Export preview will appear here..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}