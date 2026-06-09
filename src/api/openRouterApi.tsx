interface OpenRouterMessage {
  content?: unknown;
}

interface OpenRouterChoice {
  message?: OpenRouterMessage;
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
  error?: {
    message?: string;
  };
}

function parseContent(content: unknown): string {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const textParts = content
      .map((part) => {
        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .filter(Boolean);

    return textParts.join("\n").trim();
  }

  return "";
}

function parseErrorMessage(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as OpenRouterResponse;
    return parsed.error?.message ?? raw;
  } catch {
    return raw;
  }
}

export async function askOpenRouter(options: {
  apiKey: string;
  model: string;
  prompt: string;
}): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `******
      "Content-Type": "application/json",
      "HTTP-Referer": "https://www.raycast.com",
      "X-Title": "Open Router Raycast Extension",
    },
    body: JSON.stringify({
      model: options.model,
      messages: [{ role: "user", content: options.prompt }],
    }),
  });

  if (!response.ok) {
    const rawError = await response.text();
    throw new Error(parseErrorMessage(rawError) || `OpenRouter request failed (${response.status})`);
  }

  const body = (await response.json()) as OpenRouterResponse;
  const content = parseContent(body.choices?.[0]?.message?.content);

  if (!content) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return content;
}
