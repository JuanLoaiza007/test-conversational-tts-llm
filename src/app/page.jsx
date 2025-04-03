"use client";
import { useState, useEffect, useRef } from "react";
import { request_gemini } from "@/utils/gemini";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Lo siento, tu navegador no soporta Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("Reconocimiento de voz iniciado");
      window.speechSynthesis.cancel();
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      console.log("Texto detectado:", result);
      setMessages((prev) => [...prev, { text: result, sender: "user" }]);
      process(result);
    };

    recognition.onspeechend = () => {
      console.log("Detección de voz finalizada");
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Error en el reconocimiento de voz:", event.error);
      if (event.error === "network") {
        alert(
          "Error de red detectado. Verifica tu conexión a Internet y los permisos del navegador."
        );
      }
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const listen = () => {
    if (recognitionRef.current) {
      setListening(true);
      console.log("Iniciando reconocimiento de voz...");
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error al iniciar reconocimiento:", error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setListening(false);
      console.log("Deteniendo reconocimiento de voz...");
      recognitionRef.current.stop();
    }
  };

  const process = async (text) => {
    try {
      const data = await request_gemini(text);
      setMessages((prev) => [
        ...prev,
        { text: data || "No se obtuvo respuesta.", sender: "ai" },
      ]);
      say(data);
    } catch (error) {
      console.error("Error al procesar la solicitud LLM:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error al obtener respuesta de la IA.", sender: "ai" },
      ]);
    }
  };

  const say = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("El navegador no soporta Speech Synthesis.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md p-4 bg-white shadow-md rounded-lg flex flex-col gap-2 h-[500px] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[75%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </Card>
      <Button
        onClick={listening ? stopListening : listen}
        className="mt-4 p-4 rounded-full shadow-md flex items-center justify-center"
      >
        {listening ? (
          <MicOff className="w-6 h-6 text-red-500" />
        ) : (
          <Mic className="w-6 h-6 text-green-500" />
        )}
      </Button>
    </div>
  );
}
