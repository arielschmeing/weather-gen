import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherDocument = HydratedDocument<Weather>;

@Schema()
export class Weather {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  umidade: number;

  @Prop({ required: true })
  wind: number;

  @Prop({ required: true })
  sky: number;

  @Prop({ required: true })
  precipitation_probability: number;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
