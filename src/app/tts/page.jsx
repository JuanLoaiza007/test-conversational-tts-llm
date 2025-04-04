"use client";

import { useState } from "react";
import { Speaker, Loader2 } from "lucide-react";
import useSpeechFlow from "@/utils/speech-flow";
import { getSpeechServices } from "@/utils/speech-services";

export default function TTSComponent() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { speak } = useSpeechFlow({
    onTextDetected: () => {},
    ...getSpeechServices({ useSTT: false }),
  });

  const handleGenerateAndPlayAudio = async () => {
    setIsLoading(true);
    try {
      await speak(text);
    } catch (error) {
      console.error("Error al reproducir el audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Texto a Voz</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        placeholder="Escribe tu texto aquí..."
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleGenerateAndPlayAudio}
        className="mt-4 px-4 py-2 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
        ) : (
          <Speaker className="mr-2 h-5 w-5" />
        )}
        {isLoading ? "Generando..." : "Generar Voz"}
      </button>
    </div>
  );
}
