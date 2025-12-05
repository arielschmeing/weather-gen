import { GenerateContentResult } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AICoreMapper {
  toResponse(result: GenerateContentResult) {
    return result.response
      .text()
      .trim()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
  }
}
