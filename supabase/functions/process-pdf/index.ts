import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fileUrl } = await req.json()
    console.log('Processing PDF from URL:', fileUrl)
    
    // Download the PDF file
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error('Failed to download PDF')
    }
    
    const pdfData = await response.arrayBuffer()
    console.log('PDF downloaded, size:', pdfData.byteLength)

    // Use pdf.js-extract to get the text content
    const pdfjs = await import('https://cdn.skypack.dev/pdfjs-dist@3.11.174/build/pdf.js')
    const pdfjsWorker = await import('https://cdn.skypack.dev/pdfjs-dist@3.11.174/build/pdf.worker.js')
    
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

    const pdf = await pdfjs.getDocument({ data: pdfData }).promise
    console.log('PDF loaded, pages:', pdf.numPages)

    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map(item => item.str).join(' ')
      text += pageText + '\n'
    }

    console.log('Text extraction complete, length:', text.length)

    return new Response(
      JSON.stringify({ text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('PDF processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})