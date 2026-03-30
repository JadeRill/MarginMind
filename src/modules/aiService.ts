import { streamText, type ModelMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import OpenAI from "openai";
import type { AIProvider, AISettings } from "../utils/aiPrefs";

export type AIChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function* streamAIReply(args: {
  settings: AISettings;
  messages: AIChatMessage[];
  abortSignal?: AbortSignal;
}) {
  const { settings, messages, abortSignal } = args;
  const apiKey = settings.apiKey.trim();
  if (!apiKey) {
    throw new Error("API key is missing. Set it in Preferences.");
  }

  if (settings.provider === "volcengine") {
    yield* streamVolcengine({ settings, messages, abortSignal, apiKey });
    return;
  }

  if (settings.provider === "openaiCompatible") {
    yield* streamOpenAICompatible({ settings, messages, abortSignal, apiKey });
    return;
  }

  yield* streamOpenRouter({ settings, messages, abortSignal, apiKey });
}

async function* streamOpenRouter(args: {
  settings: AISettings;
  messages: AIChatMessage[];
  abortSignal?: AbortSignal;
  apiKey: string;
}) {
  const { settings, messages, abortSignal, apiKey } = args;
  const openrouter = createOpenRouter({
    apiKey,
    baseURL: settings.baseURL.trim() || "https://openrouter.ai/api/v1",
  });
  const requestMessages = toModelMessages(messages);
  const model = openrouter(settings.model, {
    provider: getOpenRouterProviderConstraint(settings.provider),
  });

  const result = streamText({
    model,
    messages: requestMessages,
    temperature: clamp(settings.temperature, 0, 2),
    maxOutputTokens: Math.max(1, Math.floor(settings.maxTokens)),
    abortSignal,
  });

  for await (const part of result.fullStream) {
    if (part.type === "error") {
      throw new Error(normalizeErrorMessage(part.error));
    }
    if (part.type === "text-delta" && part.text) {
      yield part.text;
    }
  }
}

async function* streamVolcengine(args: {
  settings: AISettings;
  messages: AIChatMessage[];
  abortSignal?: AbortSignal;
  apiKey: string;
}) {
  const { settings, messages, abortSignal, apiKey } = args;
  const baseURL =
    settings.baseURL.trim() || "https://ark.cn-beijing.volces.com/api/v3";

  const client = new OpenAI({
    apiKey,
    baseURL,
    dangerouslyAllowBrowser: true,
  });

  const stream = await client.chat.completions.create(
    {
      model: settings.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: clamp(settings.temperature, 0, 2),
      max_tokens: Math.max(1, Math.floor(settings.maxTokens)),
      stream: true,
    },
    { signal: abortSignal },
  );

  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) {
      yield delta;
    }
  }
}

async function* streamOpenAICompatible(args: {
  settings: AISettings;
  messages: AIChatMessage[];
  abortSignal?: AbortSignal;
  apiKey: string;
}) {
  const { settings, messages, abortSignal, apiKey } = args;
  const baseURL = settings.baseURL.trim();
  if (!baseURL) {
    throw new Error("Base URL is required for OpenAI Compatible provider.");
  }

  const client = new OpenAI({
    apiKey,
    baseURL,
    dangerouslyAllowBrowser: true,
  });

  const stream = await client.chat.completions.create(
    {
      model: settings.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: clamp(settings.temperature, 0, 2),
      max_tokens: Math.max(1, Math.floor(settings.maxTokens)),
      stream: true,
    },
    { signal: abortSignal },
  );

  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) {
      yield delta;
    }
  }
}

function normalizeErrorMessage(error: unknown) {
  if (!error) return "Unknown stream error.";
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const maybe = error as {
      message?: string;
      error?: { message?: string };
      cause?: { message?: string };
    };
    if (maybe.message) return maybe.message;
    if (maybe.error?.message) return maybe.error.message;
    if (maybe.cause?.message) return maybe.cause.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function toModelMessages(messages: AIChatMessage[]): ModelMessage[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

function getOpenRouterProviderConstraint(provider: AIProvider) {
  switch (provider) {
    case "openai":
      return { only: ["openai"] };
    case "anthropic":
      return { only: ["anthropic"] };
    case "openrouter":
      return undefined;
    default:
      return undefined;
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
