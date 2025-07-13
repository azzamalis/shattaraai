import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import pdfParse from 'https://esm.sh/pdf-parse@1.1.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { contentId, storagePath } = await req.json()

    if (!contentId || !storagePath) {
      throw new Error('contentId and storagePath are required')
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

    console.log(`Processing PDF extraction for contentId: ${contentId}, storagePath: ${storagePath}`)

    // Download PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('pdfs')
      .download(storagePath)

    if (downloadError) {
      console.error('Error downloading PDF:', downloadError)
      throw new Error(`Failed to download PDF: ${downloadError.message}`)
    }

    if (!fileData) {
      throw new Error('No file data received')
    }

    console.log('PDF downloaded successfully, extracting text...')

    // Convert blob to buffer for pdf-parse
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Extract text from PDF
    const result = await pdfParse(buffer)
    const extractedText = result.text

    if (!extractedText || extractedText.trim().length === 0) {
      console.warn('No text extracted from PDF')
    }

    console.log(`Extracted ${extractedText.length} characters from PDF`)

    // Update the content table with extracted text
    const { error: updateError } = await supabase
      .from('content')
      .update({ text_content: extractedText })
      .eq('id', contentId)

    if (updateError) {
      console.error('Error updating content:', updateError)
      throw new Error(`Failed to update content: ${updateError.message}`)
    }

    console.log(`Successfully updated content ${contentId} with extracted text`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        contentId,
        textLength: extractedText.length,
        message: 'PDF text extracted and saved successfully'
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