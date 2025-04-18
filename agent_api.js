import { analyzeEmailMeta, summarizeAndReply } from "./together_agent.js";
import {
  classifyEmailOpenRouter,
  summarizeAndReplyOpenRouter,
} from "./router_agent.js";

export async function classfying_with_fallback(subject, body) {
  try {
    const primary = await analyzeEmailMeta(subject, body);
    if (primary && !primary.error) return primary;

    console.warn("⚠️ Meta/Together failed, falling back to OpenRouter...");
    const fallback = await classifyEmailOpenRouter(subject, body);
    if (fallback && !fallback.error) return fallback;

    throw new Error("Both Meta and Router classification failed.");
  } catch (err) {
    return {
      priority: "medium",
      sentiment: "unknown",
      label: "other",
      intent: "inform",
      source: "triage-failure",
      error: "Email triage was unsuccessful. " + err.message,
    };
  }
}


//sumary
export async function summarizeAndReplyWithFallback(body, summaryLength = 5, replyLength = 5) {
    try {
      const primary = await summarizeAndReply(body, summaryLength, replyLength);
      if (primary && !primary.error) return primary;
  
      console.warn("⚠️ Meta/Together failed, falling back to OpenRouter...");
      const fallback = await summarizeAndReplyOpenRouter(body, summaryLength, replyLength);
      if (fallback && !fallback.error) return fallback;
  
      throw new Error("Both Meta and Router summarization failed.");
    } catch (err) {
      return {
        summary: "Email triage was unsuccessful.",
        reply: "Unable to generate reply.",
        source: "triage-failure",
        error: err.message
      };
    }
  }
  
