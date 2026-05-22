export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { content } = req.body;
    
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    
    const openAIKey = process.env.OPENAI_API_KEY;
    
    if (!openAIKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAIKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an AI that generates Instagram captions and hashtags. Return JSON only with "captions" (array of 5 captions) and "hashtags" (array of 10 hashtags).'
                    },
                    {
                        role: 'user',
                        content: `Generate 5 engaging Instagram captions and 10 relevant hashtags for this content: ${content}`
                    }
                ],
                temperature: 0.8
            })
        });
        
        const data = await response.json();
        const aiOutput = data.choices[0].message.content;
        
        // Try to parse JSON from AI response
        let parsed;
        try {
            parsed = JSON.parse(aiOutput);
        } catch {
            // Fallback if AI doesn't return clean JSON
            parsed = {
                captions: [aiOutput.substring(0, 200), aiOutput.substring(200, 400)],
                hashtags: ['#ai', '#automation', '#influencer', '#contentcreator']
            };
        }
        
        res.status(200).json(parsed);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
