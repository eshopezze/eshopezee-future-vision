import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock product catalog for demonstration
const productCatalog = [
  { id: 1, name: "Premium Wireless Headphones", category: "Electronics", price: 2499, tags: ["audio", "music", "wireless", "bluetooth"] },
  { id: 2, name: "Smart Fitness Watch Pro", category: "Electronics", price: 3999, tags: ["fitness", "health", "smartwatch", "tracking"] },
  { id: 3, name: "Minimalist Leather Wallet", category: "Fashion", price: 999, tags: ["leather", "wallet", "accessories", "men"] },
  { id: 4, name: "Portable Bluetooth Speaker", category: "Electronics", price: 1799, tags: ["audio", "music", "portable", "speaker"] },
  { id: 5, name: "Designer Sunglasses", category: "Fashion", price: 1599, tags: ["eyewear", "summer", "fashion", "uv protection"] },
  { id: 6, name: "Yoga Mat Premium", category: "Fitness", price: 899, tags: ["yoga", "exercise", "fitness", "mat"] },
  { id: 7, name: "Stainless Steel Water Bottle", category: "Home", price: 599, tags: ["hydration", "eco-friendly", "gym", "travel"] },
  { id: 8, name: "Wireless Charging Pad", category: "Electronics", price: 1299, tags: ["charging", "wireless", "phone", "tech"] },
  { id: 9, name: "Cotton Casual T-Shirt", category: "Fashion", price: 699, tags: ["clothing", "casual", "cotton", "summer"] },
  { id: 10, name: "Running Shoes Pro", category: "Fitness", price: 4999, tags: ["running", "sports", "shoes", "fitness"] },
  { id: 11, name: "Silk Saree Collection", category: "Ethnic Wear", price: 5999, tags: ["saree", "ethnic", "traditional", "women", "silk"] },
  { id: 12, name: "Gold Plated Necklace Set", category: "Jewelry", price: 2999, tags: ["jewelry", "necklace", "gold", "women", "ethnic"] },
  { id: 13, name: "Men's Formal Watch", category: "Watches", price: 7999, tags: ["watch", "formal", "men", "analog"] },
  { id: 14, name: "Smart Home Hub", category: "Electronics", price: 4499, tags: ["smart home", "automation", "iot", "alexa"] },
  { id: 15, name: "Laptop Backpack", category: "Bags", price: 1499, tags: ["laptop", "travel", "office", "backpack"] },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || query.trim().length < 2) {
      return new Response(JSON.stringify({ suggestions: [], products: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Processing search query:', query);

    // Use AI to understand the natural language query
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a smart e-commerce search assistant. Analyze the user's natural language search query and extract:
1. Keywords to search for
2. Categories that might be relevant
3. Intent (what they're looking for)
4. Price range if mentioned
5. Alternative search suggestions

Available categories: Electronics, Fashion, Fitness, Home, Ethnic Wear, Jewelry, Watches, Bags

Respond using the extract_search_params function.`
          },
          { role: "user", content: query }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_search_params",
              description: "Extract search parameters from natural language query",
              parameters: {
                type: "object",
                properties: {
                  keywords: {
                    type: "array",
                    items: { type: "string" },
                    description: "Keywords extracted from the query"
                  },
                  categories: {
                    type: "array",
                    items: { type: "string" },
                    description: "Relevant product categories"
                  },
                  intent: {
                    type: "string",
                    description: "What the user is looking for"
                  },
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 alternative search suggestions"
                  }
                },
                required: ["keywords", "categories", "intent", "suggestions"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_search_params" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI Response:', JSON.stringify(aiResponse));

    let searchParams = {
      keywords: [query.toLowerCase()],
      categories: [],
      intent: query,
      suggestions: []
    };

    // Extract the function call arguments
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        searchParams = JSON.parse(toolCall.function.arguments);
      } catch (e) {
        console.error('Failed to parse AI response:', e);
      }
    }

    console.log('Search params:', searchParams);

    // Score and filter products based on AI understanding
    const scoredProducts = productCatalog.map(product => {
      let score = 0;
      const lowerName = product.name.toLowerCase();
      const lowerCategory = product.category.toLowerCase();
      
      // Match keywords
      searchParams.keywords.forEach((keyword: string) => {
        const lowerKeyword = keyword.toLowerCase();
        if (lowerName.includes(lowerKeyword)) score += 10;
        if (product.tags.some(tag => tag.includes(lowerKeyword))) score += 5;
        if (lowerCategory.includes(lowerKeyword)) score += 8;
      });

      // Match categories
      searchParams.categories.forEach((cat: string) => {
        if (lowerCategory === cat.toLowerCase()) score += 15;
      });

      return { ...product, score };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

    return new Response(JSON.stringify({
      query,
      intent: searchParams.intent,
      suggestions: searchParams.suggestions,
      products: scoredProducts,
      keywords: searchParams.keywords
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in smart-search function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
