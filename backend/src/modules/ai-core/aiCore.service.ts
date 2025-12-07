import { Injectable, Logger } from '@nestjs/common';
import {
  GenerateContentResult,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env.schema';
import { AIServiceException } from 'src/exceptions';

@Injectable()
export class AICoreService {
  private readonly logger = new Logger(AICoreService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly config: ConfigService<Env>) {
    this.genAI = new GoogleGenerativeAI(this.config.getOrThrow('AI_API_KEY'));
  }

  async ask(prompt: string): Promise<GenerateContentResult> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const response = await model.generateContent(prompt);

      if (!response || !response.response) {
        throw new AIServiceException('Empty response from AI');
      }

      return response;
    } catch (error) {
      this.logger.error('Error communicating with Gemini AI', error);
      if (error instanceof AIServiceException) throw error;
      throw new AIServiceException(
        'Failed to communicate with AI service. Please try again later.',
      );
    }
  }
}
