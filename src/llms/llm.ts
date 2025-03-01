import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";


export async function getModel(engine: string, model_name: string, apiKey: string) {
  let model;
  console.log("getModel called");
  if (engine.toLowerCase() === "openai") {
    model = new ChatOpenAI({
      apiKey: apiKey,
      model: model_name,
      maxTokens: 2000,  // Adjusted for more controlled response length
      temperature: 0.7, // Added for more focused responses
      presencePenalty: 0.0,  // Added to prevent unnecessary elaboration
      frequencyPenalty: 0.0, // Added to maintain natural language
    });
  } else if (engine.toLowerCase() === "anthropic") {
    console.log("Using Anthropic model");
    model = new ChatAnthropic({
      apiKey: apiKey,
      model: model_name,
      maxTokens: 2000,  // Added to match OpenAI's constraint
      temperature: 0.7, // Added for consistency with OpenAI
    });
  } else {
    throw new Error("Unsupported engine. Use 'openai' or 'anthropic'.");
  }

  return model;
}

