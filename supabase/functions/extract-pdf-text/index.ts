import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as pdfjsLib from 'https://esm.sh/pdfjs-dist@3.11.174/build/pdf.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@3.11.174/build/pdf.worker.mjs'

async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdfDoc = await loadingTask.promise
    
    let fullText = ''
    const totalPages = pdfDoc.numPages
    
    // Limit to first 50 pages for performance
    const pagesToProcess = Math.min(totalPages, 50)
    
    console.log(`Extracting text from ${pagesToProcess} pages (total: ${totalPages})`)
    
    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
      const page = await pdfDoc.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n\n'
    }
    
    return fullText.trim()
  } catch (error) {
    console.error('PDF text extraction error:', error)
    throw new Error(`Failed to extract text: ${error.message}`)
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { contentId, storagePath, fileUrl } = await req.json()

    // Support both old API (contentId + storagePath) and new API (fileUrl)
    if (!fileUrl && (!contentId || !storagePath)) {
      throw new Error('Either fileUrl OR (contentId and storagePath) are required')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    let fileData: Blob | null = null;

    // Handle fileUrl (new API for chat attachments)
    if (fileUrl) {
      console.log(`Fetching PDF from URL: ${fileUrl}`)
      
      // Extract bucket and path from public URL
      // Format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
      const urlParts = fileUrl.split('/storage/v1/object/public/')
      if (urlParts.length !== 2) {
        throw new Error('Invalid fileUrl format')
      }
      
      const [bucket, ...pathParts] = urlParts[1].split('/')
      const path = pathParts.join('/')
      
      console.log(`Downloading from bucket: ${bucket}, path: ${path}`)
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path)
      
      if (error) {
        console.error('Error downloading PDF from URL:', error)
        throw new Error(`Failed to download PDF: ${error.message}`)
      }
      
      fileData = data
    } else {
      // Handle old API (contentId + storagePath)
      console.log(`Processing PDF extraction for contentId: ${contentId}, storagePath: ${storagePath}`)
      
      const { data, error: downloadError } = await supabase.storage
        .from('pdfs')
        .download(storagePath)

      if (downloadError) {
        console.error('Error downloading PDF:', downloadError)
        throw new Error(`Failed to download PDF: ${downloadError.message}`)
      }

      fileData = data
    }

    if (!fileData) {
      throw new Error('No file data received')
    }

    console.log('PDF downloaded successfully, extracting text...')

    // Convert blob to buffer for PDF.js
    const arrayBuffer = await fileData.arrayBuffer()

    // Extract text from PDF using PDF.js
    const extractedText = await extractTextFromPDF(arrayBuffer)

    if (!extractedText || extractedText.trim().length === 0) {
      console.warn('No text extracted from PDF - possibly scanned or image-based')
      return new Response(
        JSON.stringify({ 
          success: true, 
          text: '',
          warning: 'No text content found. This may be a scanned or image-based PDF.',
          contentId,
          textLength: 0,
          message: 'PDF processed but no text extracted'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Extracted ${extractedText.length} characters from PDF`)

    // Update the content table if contentId provided (old API)
    if (contentId) {
      const { error: updateError } = await supabase
        .from('content')
        .update({ text_content: extractedText })
        .eq('id', contentId)

      if (updateError) {
        console.error('Error updating content:', updateError)
        throw new Error(`Failed to update content: ${updateError.message}`)
      }

      console.log(`Successfully updated content ${contentId} with extracted text`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        text: extractedText,
        contentId,
        textLength: extractedText.length,
        message: 'PDF text extracted successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in extract-pdf-text function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})