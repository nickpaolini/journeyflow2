import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are an expert customer journey mapper. Based on the user's description, generate a detailed customer journey map with properly categorized steps using our comprehensive step type system.

Return ONLY a valid JSON object (no markdown, no commentary, no additional text before or after the JSON) with the following structure:
{
  "journeyTitle": "Optional overall title for the map",
  "steps": [
    { 
      "tempId": "s1", 
      "title": "Step Title 1", 
      "description": "Description for step 1.",
      "stepType": "action",
      "stepColor": "#10b981"
    },
    { 
      "tempId": "s2", 
      "title": "Step Title 2", 
      "description": "Description for step 2.",
      "stepType": "email",
      "stepColor": "#3b82f6"
    }
  ],
  "connections": [
    {
      "fromTempId": "s1",
      "toTempId": "s2"
    }
  ]
}

Step Type Guidelines - Choose the most appropriate type based on the INTENT and NATURE of the step:

- "action": Customer performs an action or task (e.g., clicking buttons, filling forms, making purchases, navigating pages) [⚡ #10b981]
- "decision": Customer makes a choice that impacts journey path (e.g., selecting plan options, choosing payment method, deciding to continue or abandon) [❓ #f59e0b]
- "wait": Waiting period or delay in the process (e.g., waiting for approval, processing time) [⏱️ #6b7280]
- "email": Email communication sent or received (e.g., confirmation, notification) [📧 #3b82f6]
- "sms": SMS/text message sent or received (e.g., verification code, alert) [📱 #8b5cf6]
- "webhook": Automated system-to-system notification or integration (e.g., webhook trigger, API call) [🔗 #ef4444]
- "feedback": Customer expresses feelings, ratings, or reviews (e.g., leaving reviews, rating experiences, providing testimonials, complaining) [💬 #FFD700]
- "discovery": Customer discovers or learns about something new (e.g., product discovery, feature exploration) [🔍 #00BFFF]
- "support": Customer service or self-service interactions (e.g., contacting helpdesk, using live chat, accessing FAQ, getting assistance) [🆘 #06b6d4]
- "milestone": Significant achievements or desired outcomes (e.g., completing onboarding, reaching goals, account activation, successful purchase) [🏁 #84cc16]
- "internal": Backend or internal process that influences customer experience (e.g., order processing, account verification, payment processing, inventory checks) [⚙️ #64748b]

Color Mapping (use exact HEX codes):
- action: #10b981 (emerald green)
- decision: #f59e0b (amber)
- wait: #6b7280 (gray)
- email: #3b82f6 (blue)
- sms: #8b5cf6 (purple)
- webhook: #ef4444 (red)
- feedback: #FFD700 (gold)
- discovery: #00BFFF (deep sky blue)
- support: #06b6d4 (cyan)
- milestone: #84cc16 (lime green)
- internal: #64748b (slate)

Categorization Examples:
- "Customer reads product description" → discovery (#00BFFF)
- "Customer fills out registration form" → action (#10b981)
- "Customer clicks 'Buy Now' button" → action (#10b981)
- "System sends confirmation email" → email (#3b82f6)
- "System sends SMS verification" → sms (#8b5cf6)
- "System triggers webhook" → webhook (#ef4444)
- "Customer chooses premium plan" → decision (#f59e0b)
- "Customer leaves 5-star review" → feedback (#FFD700)
- "Customer contacts support" → support (#06b6d4)
- "Customer completes onboarding" → milestone (#84cc16)
- "System processes payment" → internal (#64748b)
- "Customer waits for approval" → wait (#6b7280)

Guidelines:
- Each step title should be 2-4 words maximum
- Each step description should be 1-2 sentences maximum (approximately 50-80 characters)
- Focus on the INTENT and NATURE of the step, not just keywords
- Consider the customer's perspective and what they're trying to accomplish
- Use clear, actionable language
- Avoid lengthy explanations - be concise and direct
- Categorize each step into the most appropriate type from the list above
- Always include both stepType and stepColor for each step
- Connections are optional - if not provided, steps will be connected sequentially
- If a suitable journey cannot be generated from the prompt, return an empty steps array.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    // Clean the response and parse JSON
    const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim()
    
    try {
      const jsonResponse = JSON.parse(cleanedResponse)
      
      // Validate the structure
      if (!jsonResponse || !Array.isArray(jsonResponse.steps)) {
        throw new Error('Invalid response structure')
      }

      return NextResponse.json(jsonResponse)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError)
      console.error('Problematic response:', responseText)
      return NextResponse.json(
        { error: 'AI response was not valid JSON. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error: unknown) {
    console.error('Error calling OpenAI:', error)
    
    if (error instanceof Error && error.message === 'Too many requests. Please try again later.') {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate journey' },
      { status: 500 }
    )
  }
}