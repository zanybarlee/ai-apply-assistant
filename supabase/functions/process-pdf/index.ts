import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { parse } from 'npm:pdf-parse'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    const { fileUrl } = await req.json()
    console.log('Processing PDF from URL:', fileUrl)
    
    if (!fileUrl) {
      throw new Error('No file URL provided')
    }

    // Download the PDF file
    const pdfResponse = await fetch(fileUrl, {
      headers: {
        'Accept': 'application/pdf'
      }
    })
    
    if (!pdfResponse.ok) {
      console.error('Failed to download PDF:', pdfResponse.status, pdfResponse.statusText)
      throw new Error(`Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`)
    }
    
    const pdfBuffer = await pdfResponse.arrayBuffer()
    console.log('PDF downloaded successfully, size:', pdfBuffer.byteLength)

    // Parse PDF content
    const data = await parse(new Uint8Array(pdfBuffer))
    console.log('PDF parsed successfully, text length:', data.text.length)

    return new Response(
      JSON.stringify({ 
        text: data.text,
        status: 'success'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('PDF processing error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        status: 'error'
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