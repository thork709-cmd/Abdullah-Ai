import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const GEMINI_KEY = process.env.GEMINI_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.json({ reply: "Please type something." });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Abdullah AI, created by Abdullah Riaz, Class XI student of TPC. Be friendly, smart, helpful. User: ${message}` }] }]
      })
    });
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not understand. Try again.";
    res.json({ reply });
  } catch (e) {
    res.json({ reply: "Server error. Please try again." });
  }
});

app.post("/api/image", async (req, res) => {
  const { prompt } = req.body;
  const cleanPrompt = prompt || "Beautiful colorful AI art";
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=512&height=512&seed=${Math.floor(Math.random() * 10000)}&nologo=true`;
  res.json({ imageUrl });
});

app.post("/api/video", async (req, res) => {
  const { prompt } = req.body;
  res.json({
    text: `Your video concept: ${prompt}`,
    videoUrl: "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-city-at-night-1584/1080p.mp4"
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Abdullah AI running on port ${PORT}`));
