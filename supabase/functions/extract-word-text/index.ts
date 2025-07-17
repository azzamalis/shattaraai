import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contentId, fileUrl } = await req.json()

    if (!contentId || !fileUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing contentId or fileUrl' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Processing Word document:', { contentId, fileUrl })

    // Download the file
    const fileResponse = await fetch(fileUrl)
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.statusText}`)
    }

    const fileBuffer = await fileResponse.arrayBuffer()
    const uint8Array = new Uint8Array(fileBuffer)

    let extractedText = ''

    try {
      // For .docx files, we'll use a simple approach to extract text
      // Convert buffer to string and extract readable text
      const decoder = new TextDecoder('utf-8')
      const fileContent = decoder.decode(uint8Array)
      
      // Basic text extraction for DOCX (XML-based format)
      if (fileUrl.toLowerCase().includes('.docx')) {
        // Extract text between XML tags
        const textMatches = fileContent.match(/<w:t[^>]*>([^<]*)<\/w:t>/g)
        if (textMatches) {
          extractedText = textMatches
            .map(match => {
              const textMatch = match.match(/<w:t[^>]*>([^<]*)<\/w:t>/)
              return textMatch ? textMatch[1] : ''
            })
            .filter(text => text.trim().length > 0)
            .join(' ')
        }
      } else {
        // For .doc files or fallback, try to extract readable text
        // Remove non-printable characters and extract readable content
        extractedText = fileContent
          .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ') // Remove control characters
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim()
          .substring(0, 50000) // Limit to 50k characters
      }

      // Clean up the extracted text
      extractedText = extractedText
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s.,!?;:()\-"']/g, '')
        .trim()

      if (!extractedText || extractedText.length < 10) {
        throw new Error('No readable text could be extracted from the document')
      }

    } catch (extractionError) {
      console.error('Text extraction error:', extractionError)
      // Fallback: return a basic message
      extractedText = `Document content could not be extracted. File: ${fileUrl.split('/').pop()}`
    }

    // Update the content record with extracted text
    const { error: updateError } = await supabase
      .from('content')
      .update({ 
        text_content: extractedText,
        updated_at: new Date().toISOString()
      })
      .eq('id', contentId)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error(`Failed to update content: ${updateError.message}`)
    }

    console.log('Successfully extracted text:', {
      contentId,
      textLength: extractedText.length,
      preview: extractedText.substring(0, 100) + '...'
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        text: extractedText,
        length: extractedText.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to extract text from document' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})