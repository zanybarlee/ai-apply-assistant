import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    
    const pdfData = await response.arrayBuffer()
    console.log('PDF downloaded, size:', pdfData.byteLength)

    // Initialize PDF.js
    const pdfjs = await import('https://cdn.skypack.dev/pdfjs-dist@3.11.174/build/pdf.min.js')
    const pdfjsWorker = await import('https://cdn.skypack.dev/pdfjs-dist@3.11.174/build/pdf.worker.min.js')
    
    // Configure PDF.js worker
    if (typeof globalThis.window === 'undefined') {
      globalThis.window = { pdfjsWorker } as any;
    }
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    console.log('PDF loaded, pages:', pdf.numPages)

    // Extract text from all pages
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      text += pageText + '\n';
      console.log(`Processed page ${i}/${pdf.numPages}`);
    }

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