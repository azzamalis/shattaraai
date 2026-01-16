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
    const { contentId, storagePath, fileUrl } = await req.json()

    // Support both old API (contentId + storagePath) and new API (fileUrl)
    if (!fileUrl && (!contentId || !storagePath)) {
      throw new Error('Either fileUrl OR (contentId and storagePath) are required')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    // ========== SECURITY: For fileUrl path, require authentication ==========
    let userId: string | null = null
    
    if (fileUrl) {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        console.error('Missing or invalid Authorization header for fileUrl request')
        return new Response(
          JSON.stringify({ error: 'Unauthorized', success: false }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create client with user's auth token to verify JWT
      const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      })

      const token = authHeader.replace('Bearer ', '')
      const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token)

      if (claimsError || !claimsData?.claims) {
        console.error('JWT validation failed:', claimsError?.message)
        return new Response(
          JSON.stringify({ error: 'Unauthorized', success: false }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      userId = claimsData.claims.sub as string
      console.log('Authenticated user for fileUrl extraction:', userId)
    }

    // Initialize service client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    let fileData: Blob | null = null;

    // Handle fileUrl (new API for chat attachments - requires auth)
    if (fileUrl) {
      console.log(`Fetching PDF from URL for user ${userId}: ${fileUrl}`)
      
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
      
      // Verify user owns the content if contentId is provided
      const authHeader = req.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        })
        
        const token = authHeader.replace('Bearer ', '')
        const { data: claimsData } = await supabaseAuth.auth.getClaims(token)
        
        if (claimsData?.claims) {
          userId = claimsData.claims.sub as string
          
          // Verify ownership
          const { data: contentData, error: contentError } = await supabase
            .from('content')
            .select('user_id')
            .eq('id', contentId)
            .single()
          
          if (contentError) {
            console.error('Error fetching content:', contentError)
          } else if (contentData && contentData.user_id !== userId) {
            console.error('User does not own content:', { userId, contentUserId: contentData.user_id })
            return new Response(
              JSON.stringify({ error: 'Forbidden', success: false }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
      }
      
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
