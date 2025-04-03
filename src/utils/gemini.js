import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const GEMINI_ROL = `
Eres un entrevistador de trabajo en el puesto de desarrollador de software de una empresa prestigiosa. Cada respuesta debe ser breve y concisa, en menos de un parrafo.
`;

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: GEMINI_ROL,
});

const generationConfig = {
  temperature: 0.2,
  topP: 1.0,
  topK: 40,
  maxOutputTokens: 1024,
};

export async function request_gemini(user_message) {
  try {
    console.log("Iniciando solicitud de IA...");
    const result = await model.startChat({ generationConfig, history: [] })
      .sendMessage(`
      ## Contexto:
      - Ubicación: Colombia
      - Moneda: COP
      - Salario mínimo: $1.423.500 COP.

      responde a esto que ha dicho el usuario:
      ${user_message}
    `);
    return result.response.text();
  } catch {
    return "Hubo un error al procesar la solicitud de IA.";
  }
}
