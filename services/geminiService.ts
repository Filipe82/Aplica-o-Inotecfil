
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI SDK using the API key from environment variables as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIDiagnosis = async (device: string, brand: string, model: string, problem: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Diagnóstico técnico para Suporte Técnico:
      Dispositivo: ${device}
      Marca: ${brand}
      Modelo: ${model}
      Problema: ${problem}

      Forneça um diagnóstico estruturado incluindo:
      1. Causas prováveis.
      2. Testes recomendados.
      3. Estimativa de tempo de reparo.
      4. Peças que podem ser necessárias.
      Responda em Português do Brasil com tom profissional.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return "Desculpe, ocorreu um erro ao gerar o diagnóstico inteligente. Verifique sua conexão ou tente novamente mais tarde.";
  }
};

export const suggestPrice = async (device: string, problem: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Baseado em um suporte técnico padrão no Brasil, qual a faixa de preço média cobrada pelo reparo de um ${device} com o problema: ${problem}? Responda apenas com a faixa de preço em Reais (Ex: R$ 200 - R$ 350).`,
      config: {
        temperature: 0.2,
      }
    });
    return response.text;
  } catch (error) {
    return "Consulte a tabela de preços interna.";
  }
};
