import fs from "fs";
import path from "path";

const logFilePath = path.resolve("./public", "chat-log.json");

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { question, answer, topic, timestamp } = req.body;

  try {
    const log = fs.existsSync(logFilePath)
      ? JSON.parse(fs.readFileSync(logFilePath))
      : [];

    log.push({ question, answer, topic, timestamp });
    fs.writeFileSync(logFilePath, JSON.stringify(log, null, 2));
    res.status(200).json({ message: "Loggad" });
  } catch (err) {
    res.status(500).json({ message: "Loggningsfel" });
  }
}