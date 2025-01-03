import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { parse } from 'npm:pdf-parse'

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
    const { fileUrl } = await req.json()
    console.log('Processing PDF from URL:', fileUrl)
    
    if (!fileUrl) {
      throw new Error('No file URL provided')
    }

    // Download the PDF file
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`)
    }
    
    const pdfBuffer = await response.arrayBuffer()
    console.log('PDF downloaded, size:', pdfBuffer.byteLength)

    // Parse PDF content
    const data = await parse(new Uint8Array(pdfBuffer))
    const text = data.text
    
    console.log('Text extraction complete, length:', text.length)

    return new Response(
      JSON.stringify({ text }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('PDF processing error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})