import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const shopifyAccessToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
    const shopifyStoreDomain = Deno.env.get('SHOPIFY_STORE_DOMAIN');

    if (!shopifyAccessToken || !shopifyStoreDomain) {
      console.error('Missing Shopify credentials');
      throw new Error('Shopify credentials not configured');
    }

    // Clean up the domain - remove protocol if present
    const cleanDomain = shopifyStoreDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    console.log(`Fetching collections from Shopify store: ${cleanDomain}`);

    // Fetch collections from Shopify Admin API
    const response = await fetch(
      `https://${cleanDomain}/admin/api/2024-01/graphql.json`,
      {
        headers: {
          'X-Shopify-Access-Token': shopifyAccessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Shopify API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const customCollections = await response.json();
    console.log(`Fetched ${customCollections.custom_collections?.length || 0} custom collections`);

    // Also fetch smart collections
    const smartResponse = await fetch(
      `https://${cleanDomain}/admin/api/2024-01/smart_collections.json`,
      {
        headers: {
          'X-Shopify-Access-Token': shopifyAccessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    let smartCollections = { smart_collections: [] };
    if (smartResponse.ok) {
      smartCollections = await smartResponse.json();
      console.log(`Fetched ${smartCollections.smart_collections?.length || 0} smart collections`);
    }

    // Combine and format collections
    const allCollections = [
      ...(customCollections.custom_collections || []),
      ...(smartCollections.smart_collections || []),
    ].map((collection: any) => ({
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      image: collection.image?.src || null,
      productsCount: collection.products_count || 0,
    }));

    console.log(`Returning ${allCollections.length} total collections`);

    return new Response(JSON.stringify({ collections: allCollections }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Shopify collections:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
