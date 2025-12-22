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

    // GraphQL query to fetch collections (Storefront API)
    const query = `{
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
            }
          }
        }
      }
    }`;

    // Fetch collections from Shopify Storefront API using GraphQL
    const response = await fetch(
      `https://${cleanDomain}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token': shopifyAccessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      console.error(`Shopify API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('GraphQL response:', JSON.stringify(result, null, 2));

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(`GraphQL error: ${result.errors[0]?.message || 'Unknown error'}`);
    }

    // Format collections from GraphQL response
    const collections = result.data?.collections?.edges?.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      image: edge.node.image?.url || null,
    })) || [];

    console.log(`Returning ${collections.length} total collections`);

    return new Response(JSON.stringify({ collections }), {
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
