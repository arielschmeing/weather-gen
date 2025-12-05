import { Weather } from 'src/modules/weather/schemas/weather.schema';

export const insightsPrompt = (weathers: Weather[]) => {
  return `Você receberá a seguir um array de objetos Weather no formato JSON.
Cada objeto possui: createdAt, latitude, longitude, temperature, umidade, wind, sky, precipitation_probability.

Sua tarefa é analisar TODOS os dados e retornar insights climáticos contendo:

1. averageTemperature — média das temperaturas do período.
2. averageHumidity — média da umidade.
3. temperatureTrend — "subindo", "caindo" ou "estável".
   - Compare os 3 últimos registros para detectar a tendência.
4. comfortScore — pontuação de 0 a 100 baseada em temperatura, umidade e vento.
5. dayClassification — uma classificação geral como:
   - "frio", "quente", "agradável", "chuvoso", "abafado", etc.
6. alerts — lista de alertas relevantes, como:
   - "Calor extremo", "Alta chance de chuva", "Frio intenso".
   - Apenas se fizer sentido.
7. summary — um texto descritivo claro e direto com insights sobre o período analisado.

REGRAS IMPORTANTES:
- NÃO escreva explicações.
- NÃO escreva texto fora do JSON.
- RESPONDA SOMENTE com um JSON com o formato:

{
  "averageTemperature": number,
  "averageHumidity": number,
  "temperatureTrend": "subindo" | "caindo" | "estável",
  "comfortScore": number,
  "dayClassification": string,
  "alerts": string[],
  "summary": string
}

Agora aqui estão os dados (array JSON):
${JSON.stringify(weathers)}
`;
};
