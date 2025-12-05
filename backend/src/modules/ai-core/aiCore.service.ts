import { Injectable } from '@nestjs/common';
import {
  GenerateContentResult,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env.schema';

@Injectable()
export class AICoreService {
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly config: ConfigService<Env>) {
    this.genAI = new GoogleGenerativeAI(this.config.getOrThrow('AI_API_KEY'));
  }

  async ask(prompt: string): Promise<GenerateContentResult> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const response = await model.generateContent(prompt);

    return response;
  }
}
