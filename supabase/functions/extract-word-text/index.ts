import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import mammoth from 'https://esm.sh/mammoth@1.9.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  contentId: string
  storageUrl: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { contentId, storageUrl }: RequestBody = await req.json()
    
    console.log(`Processing Word document for content ID: ${contentId}`)
    
    // Download the Word document from storage
    const response = await fetch(storageUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    
    // Extract text using mammoth
    const result = await mammoth.extractRawText({ arrayBuffer })
    const extractedText = result.value
    
    console.log(`Extracted ${extractedText.length} characters from Word document`)
    
    // Update the content record with extracted text
    const { error: updateError } = await supabase
      .from('content')
      .update({ 
        text_content: extractedText,
        metadata: {
          ...{}, // Keep existing metadata
          textExtracted: true,
          extractedAt: new Date().toISOString(),
          textLength: extractedText.length
        }
      })
      .eq('id', contentId)

    if (updateError) {
      console.error('Error updating content:', updateError)
      throw updateError
    }

    console.log(`Successfully updated content ${contentId} with extracted text`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        textLength: extractedText.length,
        contentId 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in extract-word-text function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to extract text from Word document' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})