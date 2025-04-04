"use client";
import { useEffect, useState } from "react";
import { getSpeechServices } from "@/utils/speech-services";
import useSpeechFlow from "@/utils/speech-flow";
import { Mic, StopCircle, RefreshCw } from "lucide-react";

export default function STTTester() {
  const [detectedText, setDetectedText] = useState("");
  const { stt, tts } = getSpeechServices();

  const { transcript, listening, shouldAlert, listen, stop, reset } =
    useSpeechFlow({
      stt,
      tts,
      onTextDetected: () => {},
    });

  useEffect(() => {
    setDetectedText(transcript);
  }, [transcript]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-2xl shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Speech-to-Text Tester</h2>

      {shouldAlert && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          Tu navegador no soporta reconocimiento de voz.
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={listen}
          className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
          title="Start Listening"
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          onClick={stop}
          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
          title="Stop Listening"
        >
          <StopCircle className="w-5 h-5" />
        </button>
        <button
          onClick={reset}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          title="Reset"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-2">
        <p className="text-sm text-gray-600">
          Estado: {listening ? "🎙️ Escuchando..." : "⏹️ Detenido"}
        </p>
      </div>

      <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 whitespace-pre-wrap">
        <strong>Transcripción:</strong>
        <div>{transcript || "(sin entrada aún)"}</div>
      </div>

      {detectedText && (
        <div className="mt-4 bg-green-100 p-3 rounded-md text-green-800">
          <strong>Texto procesado:</strong>
          <div>{detectedText}</div>
        </div>
      )}
    </div>
  );
}
