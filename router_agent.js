import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

/**
 * Extract valid JSON from any text (first complete block)
 */
function extractJSON(text) {
  if (!text || typeof text !== "string") return null;
  const match = text.match(/\{[\s\S]*?\}/); // non-greedy match
  return match ? match[0] : null;
}

/**
 * 🔁 Summarize and reply to an email using OpenRouter AI
 * @param {string} emailText - The full email body
 * @param {number} summaryLength - Rough number of lines for summary
 * @param {number} replyLength - Rough number of lines for reply
 * @returns {Promise<Object>} - JSON object with summary and reply
 */
/**
 * 🧠 Classify an email's metadata: priority, sentiment, label, and intent
 */
export async function classifyEmailOpenRouter(subject, body) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const firstLine = body.split("\n").filter(Boolean)[0] || "";

  const prompt = `
  You are an email classification assistant. Based ONLY on the subject and first line of the email body, return the following as a valid JSON object.
  
  Respond ONLY with a JSON object in this exact format:
  {
    "priority": "high" | "medium" | "low",
    "sentiment": "positive" | "neutral" | "negative",
    "label": "otp" | "work" | "meeting" | "personal" | "transaction" | "support" | "marketing" | "other",
    "intent": "inform" | "request" | "confirm" | "escalate" | "notify"
  }
  
  ⚠️ Do NOT include any explanation or extra text. Respond only with the JSON block.
  
  Subject: ${subject}
  First line of body: ${firstLine}
  `;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-v3-base:free", // more structured output than DeepSeek
          messages: [
            {
              role: "system",
              content: "You respond with valid JSON only. No commentary.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.4,
          max_tokens: 300,
        }),
      }
    );

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    const jsonText = extractJSON(content);

    if (!jsonText)
      throw new Error("No JSON block found in classification response.");

    const result = JSON.parse(jsonText);

    return {
      priority: result.priority || "medium",
      sentiment: result.sentiment || "neutral",
      label: result.label || "other",
      intent: result.intent || "inform",
      source: "openrouter",
    };
  } catch (err) {
    console.error("🛑 Error classifying email:", err.message || err);
    return {
      priority: "medium",
      sentiment: "unknown",
      label: "other",
      intent: "inform",
      source: "openrouter",
      error: err.message,
    };
  }
}

export async function summarizeAndReplyOpenRouter(
  emailText,
  summaryLength = 5,
  replyLength = 5
) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const prompt = `
You are a professional email assistant. Read the email below and respond with a valid JSON object.

Instructions:
1. Summarize the email in approximately ${summaryLength} lines.
2. Suggest a professional reply in approximately ${replyLength} lines.
3. If a reply is not needed, use: "This email does not require a reply."

⚠️ Do not include any text before or after the JSON.
Respond ONLY in this format:
{
  "summary": "...",
  "reply": "..."
}

Email:
"""
${emailText}
"""
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-v3-base:free", // more compliant with structured JSON
          messages: [
            {
              role: "system",
              content: "You respond only with valid JSON. No commentary.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.5,
          max_tokens: 700,
        }),
      }
    );

    const data = await response.json();
    // console.log(data)
    const content = data.choices?.[0]?.message?.content?.trim();

    // console.log("🧾 Raw Model Output:\n", content);

    const jsonText = extractJSON(content);
    if (!jsonText) throw new Error("No JSON block found in response.");

    const result = JSON.parse(jsonText);

    return {
      summary: result.summary || "No summary generated.",
      reply: result.reply || "No reply generated.",
      source: "openrouter",
    };
  } catch (err) {
    console.error("🛑 Error generating summary and reply:", err.message || err);
    return {
      summary: "Failed to process summary.",
      reply: "Could not generate reply.",
      source: "openrouter",
      error: err.message,
    };
  }
}

async function test() {
  const email = `
  Hi team,
  
  Just a quick reminder that we have the design review meeting tomorrow at 10 AM in Conference Room B.
  Please bring any materials or mockups you want to present.
  
  Thanks,
  Alex
    `;

  const result = await summarizeAndReplyOpenRouter(email);
  console.log("🧠 Summary + Reply:\n", JSON.stringify(result, null, 2));
}

async function testClassification() {
  const subject = "Reminder: Design Review Meeting Tomorrow";
  const emailBody = `
  Hi team,
  
  Just a quick reminder that our design review is scheduled for 10 AM tomorrow in Room B.
  Please bring mockups or final drafts if possible.
  
  Thanks!
    `;

  const classification = await classifyEmailOpenRouter(subject, emailBody);
  console.log("📊 Email Classification:", classification);
}

testClassification();
test();
