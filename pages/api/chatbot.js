import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Du är en kundtjänstassistent på Botrygg. Svara baserat på Botryggs interna rutiner, särskilt vad gäller uthyrning, service, energi, inflytt, parkering, och andrahandsuthyrning."
        },
        { role: "user", content: message }
      ],
      max_tokens: 600,
      temperature: 0.6,
    });

    const reply = response.data.choices?.[0]?.message?.content?.trim();
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ message: "API-fel" });
  }
}