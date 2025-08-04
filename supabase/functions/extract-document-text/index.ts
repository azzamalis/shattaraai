import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentExtractorRequest {
  contentId: string;
  storagePath: string;
  fileType: string;
}

// Function to extract text from different document types
async function extractDocumentText(fileBuffer: Uint8Array, fileType: string): Promise<string> {
  try {
    switch (fileType) {
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        // For Word documents, we'll use a simple approach for now
        // In a production environment, you might want to use a more sophisticated library
        const textDecoder = new TextDecoder('utf-8', { ignoreBOM: true });
        let text = textDecoder.decode(fileBuffer);
        
        // Basic cleanup for Word documents
        text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, ' '); // Remove control characters
        text = text.replace(/\s+/g, ' ').trim(); // Normalize whitespace
        
        // Extract readable text (this is a very basic approach)
        const words = text.split(/\s+/).filter(word => 
          word.length > 2 && 
          /^[a-zA-Z0-9\-'.,:;!?()]+$/.test(word)
        );
        
        return words.join(' ');

      case 'text/plain':
        return new TextDecoder('utf-8').decode(fileBuffer);

      case 'text/csv':
        const csvText = new TextDecoder('utf-8').decode(fileBuffer);
        // Convert CSV to readable format
        const lines = csvText.split('\n');
        return lines.map((line, index) => {
          if (index === 0) return `Headers: ${line}`;
          return `Row ${index}: ${line}`;
        }).join('\n');

      case 'application/json':
        const jsonText = new TextDecoder('utf-8').decode(fileBuffer);
        try {
          const jsonData = JSON.parse(jsonText);
          return `JSON Content:\n${JSON.stringify(jsonData, null, 2)}`;
        } catch {
          return jsonText;
        }

      case 'text/html':
        const htmlText = new TextDecoder('utf-8').decode(fileBuffer);
        // Basic HTML text extraction
        return htmlText
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

      case 'text/xml':
      case 'application/xml':
        const xmlText = new TextDecoder('utf-8').decode(fileBuffer);
        // Basic XML text extraction
        return xmlText
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

      default:
        // Try to decode as text for unknown types
        try {
          const text = new TextDecoder('utf-8').decode(fileBuffer);
          // Check if it's mostly readable text
          const readableChars = text.replace(/[^\x20-\x7E\s]/g, '').length;
          const totalChars = text.length;
          
          if (readableChars / totalChars > 0.7) {
            return text;
          } else {
            throw new Error('File appears to be binary');
          }
        } catch {
          throw new Error(`Unsupported file type: ${fileType}`);
        }
    }
  } catch (error) {
    console.error('Error extracting document text:', error);
    throw new Error(`Failed to extract text from document: ${error.message}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentId, storagePath, fileType }: DocumentExtractorRequest = await req.json();
    
    console.log('Extracting document text for:', { contentId, storagePath, fileType });
    
    if (!contentId || !storagePath) {
      throw new Error('contentId and storagePath are required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download document from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(storagePath.replace(/^.*\/documents\//, ''));

    if (downloadError) {
      console.error('Error downloading document:', downloadError);
      throw new Error(`Failed to download document: ${downloadError.message}`);
    }

    if (!fileData) {
      throw new Error('No file data received');
    }

    console.log('Document downloaded successfully, extracting text...');

    // Convert blob to buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Extract text based on file type
    const extractedText = await extractDocumentText(buffer, fileType || 'text/plain');

    if (!extractedText || extractedText.trim().length === 0) {
      console.warn('No text extracted from document');
    }

    console.log(`Extracted ${extractedText.length} characters from document`);

    // Update the content table with extracted text
    const { error: updateError } = await supabase
      .from('content')
      .update({ 
        text_content: extractedText,
        metadata: {
          extractedAt: new Date().toISOString(),
          fileType: fileType,
          textLength: extractedText.length,
          extractionMethod: 'server-side'
        }
      })
      .eq('id', contentId);

    if (updateError) {
      console.error('Error updating content:', updateError);
      throw new Error(`Failed to update content: ${updateError.message}`);
    }

    console.log(`Successfully updated content ${contentId} with extracted text`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        contentId,
        textLength: extractedText.length,
        fileType,
        message: 'Document text extracted and saved successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in extract-document-text function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});