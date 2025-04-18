import Together from "together-ai";
import dotenv from "dotenv";
dotenv.config();

const client = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

function extractJSON(text) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return text.slice(start, end + 1);
    }
  } catch (err) {
    console.error("❌ extractJSON failed:", err);
  }
  return null;
}

function truncateText(text, maxLength = 2000) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export async function analyzeEmailMeta(subject, body) {
  const firstLine = body.split("\n").filter(Boolean)[0];
  const input = `Subject: ${subject}\nFirst line of body: ${firstLine}`;

  const prompt = `
You are a classification agent for email triage. Based on the subject and the first line of the email body, return the following in JSON:

- priority: "high" | "medium" | "low"
- sentiment: "positive" | "neutral" | "negative"
- label: "otp" | "work" | "meeting" | "personal" | "transaction" | "support" | "marketing" | "other"
- intent: "inform" | "request" | "confirm" | "escalate" | "notify"

Input:
${input}

Respond ONLY in JSON:
{
  "priority": "...",
  "sentiment": "...",
  "label": "...",
  "intent": "..."
}
`;

  try {
    const response = await client.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: [
        {
          role: "system",
          content: "Respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    const jsonText = extractJSON(content);
    if (!jsonText) throw new Error("No JSON block found in classification.");

    const result = JSON.parse(jsonText);
    return {
      priority: result.priority || "medium",
      sentiment: result.sentiment || "neutral",
      label: result.label || "other",
      intent: result.intent || "inform",
    };
  } catch (error) {
    console.error("🛑 Classification Error:", error.message || error);
    return {
      priority: "medium",
      sentiment: "neutral",
      label: "other",
      intent: "inform",
    };
  }
}
export async function summarizeAndReply(emailBody, count =5, replycount = 5) {
  const truncatedEmail = truncateText(emailBody);

  const prompt = `
You are a helpful and professional email assistant. Given the email below, respond strictly with a valid JSON object.

Instructions:
1. Summarize the email in approximately ${count} lines.
2. Suggest a reply in approximately ${replycount} lines. If no reply is needed, return: "This email does not require a reply."

Email:
"""
${truncatedEmail}
"""

Respond ONLY with:
{
  "summary": "...",
  "reply": "..."
}
`;

  try {
    const response = await client.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: [
        {
          role: "system",
          content: "Respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 700,
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    const jsonText = extractJSON(content);
    if (!jsonText) throw new Error("No JSON block found in summary/reply.");

    const result = JSON.parse(jsonText);

    return {
      summary: result.summary || "No summary generated.",
      reply: result.reply || "No reply generated.",
    };
  } catch (error) {
    console.error("🛑 Summary/Reply Error:", error.message || error);
    return {
      summary: "Failed to process summary.",
      reply: "Could not generate reply.",
    };
  }
}
async function test() {
  const subject = "Issue with Damaged Product - Urgent Help Needed";
  const email = `
I hope you’re doing well. I’m writing to report an issue with my recent order (#12345).
The product received is damaged and doesn’t match the description. I’ve attached photos for reference.
Please help with a refund or replacement, and confirm the return policy.
  `;

  const meta = await analyzeEmailMeta(subject, email);
  const summaryReply = await summarizeAndReply(email);

  console.log("🧠 Meta:", meta);
  console.log("✉️ Summary + Reply:", summaryReply);
}

test();
