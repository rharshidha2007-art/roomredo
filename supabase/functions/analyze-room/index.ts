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
    const { imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    if (!imageBase64) {
      console.error("No image provided");
      throw new Error("No image provided");
    }

    console.log("Starting room analysis...");

    // Step 1: Analyze the room using vision model
    const analysisResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: `You are an expert interior designer. Analyze the room in the image and provide:
1. A detailed description of the current furniture and layout
2. 4 creative redesign suggestions with specific furniture arrangements and decoration ideas
3. A detailed prompt that could be used to generate an image of the improved room design

Respond in JSON format:
{
  "currentLayout": "description of current room",
  "suggestions": [
    {
      "title": "Suggestion title",
      "description": "Detailed description of the arrangement",
      "icon": "sparkles|lightbulb|palette|layout"
    }
  ],
  "imagePrompt": "A detailed prompt for generating the redesigned room image"
}`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this room and provide furniture arrangement and decoration suggestions. Focus on practical improvements that would make the space more functional and aesthetically pleasing."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error("Analysis API error:", analysisResponse.status, errorText);
      
      if (analysisResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (analysisResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Analysis failed: ${errorText}`);
    }

    const analysisData = await analysisResponse.json();
    console.log("Analysis response received");
    
    let analysisContent = analysisData.choices?.[0]?.message?.content;
    
    // Parse the JSON from the response
    let parsedAnalysis;
    try {
      // Remove markdown code blocks if present
      if (analysisContent.includes("```json")) {
        analysisContent = analysisContent.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (analysisContent.includes("```")) {
        analysisContent = analysisContent.replace(/```\n?/g, "");
      }
      parsedAnalysis = JSON.parse(analysisContent.trim());
    } catch (parseError) {
      console.error("Failed to parse analysis:", parseError, analysisContent);
      throw new Error("Failed to parse room analysis");
    }

    console.log("Generating redesigned room image...");

    // Step 2: Generate the redesigned room image
    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: `Create a beautiful, professional interior design photo of: ${parsedAnalysis.imagePrompt}. 
            
The image should be photorealistic, well-lit, and showcase modern interior design principles. 
Show the room from a similar angle as a real estate or interior design photograph.
Make it warm, inviting, and aspirational. Ultra high resolution.`
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error("Image generation error:", imageResponse.status, errorText);
      
      // Return analysis without generated image if image generation fails
      return new Response(JSON.stringify({
        currentLayout: parsedAnalysis.currentLayout,
        suggestions: parsedAnalysis.suggestions,
        generatedImage: null,
        imageError: "Could not generate redesign image"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const imageData = await imageResponse.json();
    console.log("Image generation response received");
    
    const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    return new Response(JSON.stringify({
      currentLayout: parsedAnalysis.currentLayout,
      suggestions: parsedAnalysis.suggestions,
      generatedImage: generatedImage || null
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-room function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
