"use client";
import { useState, useRef, useEffect } from "react";
import { Speaker, Loader2 } from "lucide-react";
import {
  generateAudioFromText,
  createAudioURL,
  downloadAudio,
} from "@/utils/elevenlabs-tts";

export default function TTSComponent() {
  const [text, setText] = useState("");
  const [audioURL, setAudioURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null); // Referencia al elemento de audio

  // Efecto para reproducir el audio automáticamente cuando cambia la URL
  useEffect(() => {
    if (audioRef.current && audioURL) {
      // Reproduce el audio apenas esté disponible
      audioRef.current.play().catch((error) => {
        console.error("Error al reproducir el audio:", error);
      });
    }
  }, [audioURL]);

  // Maneja el flujo: generar audio, crear URL y reproducirlo
  const handleGenerateAndPlayAudio = async () => {
    setIsLoading(true);

    try {
      const audioBlob = await generateAudioFromText(text);
      const url = createAudioURL(audioBlob);
      setAudioURL(url);
      // downloadAudio(url);
    } catch (error) {
      console.error("Error al generar audio:", error);
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
        cols="50"
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

      {audioURL && (
        <audio
          ref={audioRef}
          controls
          src={audioURL}
          className="mt-4 w-full rounded-md border border-gray-300"
        />
      )}
    </div>
  );
}
