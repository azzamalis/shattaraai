import { RichMessage } from '@/components/chat/RichMessage';
import { Copy, ThumbsUp, ThumbsDown, Volume2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QuizChatInterfaceProps {
  messages: any[];
  isSending: boolean;
}

export const QuizChatInterface = ({ messages, isSending }: QuizChatInterfaceProps) => {
  if (messages.length === 0) return null;

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex flex-col space-y-4 py-4">
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col">
          {message.sender_type === 'user' ? (
            // User message
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-[80%]">
                <RichMessage content={message.content} />
              </div>
            </div>
          ) : (
            // AI message
            <div className="flex flex-col gap-2">
              <div className="bg-muted rounded-2xl px-4 py-3 max-w-[95%]">
                <RichMessage content={message.content} />
              </div>
              
              {/* Action buttons for AI messages */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                  onClick={() => handleCopy(message.content)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Typing indicator */}
      {isSending && (
        <div className="flex justify-start">
          <div className="bg-muted rounded-2xl px-4 py-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
