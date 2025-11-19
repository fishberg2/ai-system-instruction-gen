
import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // This is a placeholder for the API key.
    // In a real Applet environment, process.env.API_KEY would be provided.
    const apiKey = (window as any).process?.env?.API_KEY ?? '';
    if (!apiKey) {
      console.warn("API_KEY is not set. Using a mock response.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateSystemInstruction(description: string): Promise<string> {
    const prompt = `You are an expert in crafting system instructions for large language models. Based on the user's request, generate a concise, clear, and effective system instruction. The output should ONLY be the system instruction itself, without any preamble, explanation, or markdown formatting.

User's request: "${description}"`;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text.trim();
    } catch (error) {
      console.error('Error generating system instruction:', error);
      // Check for common API key related issues first
      if (error instanceof Error && error.message.includes('API key not valid')) {
          throw new Error('The provided API key is not valid. Please check your configuration.');
      }
      throw new Error('Failed to communicate with the AI model. Please try again later.');
    }
  }
}
