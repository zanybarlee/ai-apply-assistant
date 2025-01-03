import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { service_name } = await req.json()
    
    // Get the API key from Supabase secrets
    const apiKey = Deno.env.get(service_name)
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not found' }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    return new Response(
      JSON.stringify({ [service_name]: apiKey }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})