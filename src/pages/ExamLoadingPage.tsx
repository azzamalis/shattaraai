import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExamLoadingScreen } from '@/components/dashboard/ExamLoadingScreen';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react';
import { handleError, showErrorToast, retryWithBackoff } from '@/lib/errorHandling';

interface ExamError {
  message: string;
  errorCode?: string;
  errorDetails?: Record<string, any>;
  retryable?: boolean;
  examData?: any;
}

export default function ExamLoadingPage() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<ExamError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    generateExam();
  }, []);

  const generateExam = useCallback(async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Get exam config from localStorage
      const examConfigStr = localStorage.getItem('examConfig');
      if (!examConfigStr) {
        setError({
          message: 'Exam configuration not found. Please go back and configure your exam.',
          retryable: false
        });
        return;
      }

      const examConfig = JSON.parse(examConfigStr);

      // Validate selected content IDs
      if (!examConfig.selectedContentIds || examConfig.selectedContentIds.length === 0) {
        setError({
          message: 'No content selected for the exam. Please go back and select study materials.',
          retryable: false
        });
        return;
      }

      // Get ONLY the content selected by user in Step 1
      console.log(`Loading exam with ${examConfig.selectedContentIds?.length || 0} selected content items`);
      
      const { data: roomContent, error: contentError } = await supabase
        .from('content')
        .select('id, title, type, text_content')
        .in('id', examConfig.selectedContentIds);

      if (contentError) {
        console.error('Error fetching room content:', contentError);
        setError({
          message: 'Failed to load study materials. Please try again.',
          errorCode: 'CONTENT_FETCH_ERROR',
          errorDetails: { supabaseError: contentError.message },
          retryable: true
        });
        return;
      }

      if (!roomContent || roomContent.length === 0) {
        setError({
          message: 'No content found for the selected materials. Please go back and select different content.',
          retryable: false
        });
        return;
      }

      // Call OpenAI exam generation with detailed error handling
      console.log('Calling exam generation edge function...');
      
      const { data, error: invokeError } = await supabase.functions.invoke('openai-generate-exam', {
        body: {
          roomId,
          roomContent: roomContent || [],
          additionalResources: examConfig.additionalResources || [],
          examConfig: {
            numQuestions: parseInt(examConfig.numQuestions) || 25,
            questionType: examConfig.questionType || 'Both',
            examLength: parseInt(examConfig.examLength) || 60,
            selectedTopics: examConfig.selectedTopics || []
          }
        }
      });

      // Handle edge function invocation error
      if (invokeError) {
        console.error('Edge function invocation error:', invokeError);
        const errorInfo = handleError(invokeError, 'exam generation');
        setError({
          message: errorInfo.message,
          errorCode: 'EDGE_FUNCTION_ERROR',
          errorDetails: { originalError: invokeError.message },
          retryable: true
        });
        return;
      }

      // Handle unsuccessful response from edge function
      if (!data?.success) {
        console.error('Exam generation failed:', data?.error, data?.errorCode, data?.errorDetails);
        
        // Determine if we should show retry option
        const isRetryable = data?.retryable !== false;
        
        // Build a user-friendly error message
        let userMessage = data?.error || 'Failed to generate exam';
        
        // Add more context based on error code
        if (data?.errorCode === 'DB_SAVE_FAILED') {
          userMessage = 'Failed to save exam to database. Please try again.';
        } else if (data?.errorCode === 'QUESTIONS_SAVE_FAILED') {
          userMessage = 'Failed to save exam questions. Please try again.';
        } else if (data?.errorCode === 'TIMEOUT') {
          userMessage = 'The request timed out. Your content might be too large. Try selecting fewer materials.';
        } else if (data?.errorCode === 'NETWORK_ERROR') {
          userMessage = 'Network error occurred. Please check your connection and try again.';
        }
        
        setError({
          message: userMessage,
          errorCode: data?.errorCode,
          errorDetails: data?.errorDetails,
          retryable: isRetryable,
          examData: data?.examData
        });
        return;
      }

      // Validate exam data
      if (!data.exam || !data.exam.questions || data.exam.questions.length === 0) {
        setError({
          message: 'The generated exam is empty. Please try again with different content.',
          errorCode: 'EMPTY_EXAM',
          retryable: true
        });
        return;
      }

      // Store generated exam in localStorage
      localStorage.setItem('generatedExam', JSON.stringify(data.exam));
      
      // Store exam ID if available
      if (data.exam.examId) {
        localStorage.setItem('currentExamId', data.exam.examId);
        console.log('Exam saved with ID:', data.exam.examId);
      }
      
      // Show success feedback
      toast.success(`Exam generated with ${data.exam.questions.length} questions!`);
      
      // Navigate to exam page after a short delay
      setTimeout(() => {
        const contentId = examConfig.selectedContentIds?.[0] || roomId;
        navigate(`/exam/${contentId}`);
      }, 1500);

    } catch (error) {
      console.error('Unexpected error generating exam:', error);
      const errorInfo = handleError(error, 'exam generation');
      setError({
        message: errorInfo.message,
        errorCode: 'UNEXPECTED_ERROR',
        errorDetails: { technicalDetails: errorInfo.technicalDetails },
        retryable: true
      });
    } finally {
      setIsGenerating(false);
    }
  }, [navigate, roomId]);

  const handleRetry = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      toast.error('Maximum retry attempts reached. Please try again later.');
      return;
    }
    
    setRetryCount(prev => prev + 1);
    toast.info(`Retrying exam generation (attempt ${retryCount + 2}/${MAX_RETRIES + 1})...`);
    await generateExam();
  }, [retryCount, generateExam]);

  const handleGoBack = useCallback(() => {
    navigate(`/rooms/${roomId}`);
  }, [navigate, roomId]);

  const handleLoadingComplete = () => {
    // This will be called by ExamLoadingScreen if needed
    if (!isGenerating && !error) {
      const examConfig = localStorage.getItem('examConfig');
      if (examConfig) {
        const config = JSON.parse(examConfig);
        const contentId = config.selectedContentIds?.[0] || roomId;
        navigate(`/exam/${contentId}`);
      } else {
        navigate(`/exam/${roomId}`);
      }
    }
  };

  // Show error state with retry options
  if (error && !isGenerating) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto p-6 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Exam Generation Failed
            </h2>
            <p className="text-muted-foreground">
              {error.message}
            </p>
          </div>
          
          {error.errorCode && (
            <p className="text-xs text-muted-foreground/70 font-mono">
              Error code: {error.errorCode}
            </p>
          )}
          
          <div className="flex flex-col gap-3">
            {error.retryable && retryCount < MAX_RETRIES && (
              <Button 
                onClick={handleRetry}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again {retryCount > 0 && `(${retryCount}/${MAX_RETRIES} attempts used)`}
              </Button>
            )}
            
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Room
            </Button>
          </div>
          
          {error.errorDetails && (
            <details className="text-left text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Technical Details
              </summary>
              <pre className="mt-2 p-3 bg-muted rounded-md overflow-auto max-h-32">
                {JSON.stringify(error.errorDetails, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <ExamLoadingScreen onComplete={handleLoadingComplete} />
  );
}
