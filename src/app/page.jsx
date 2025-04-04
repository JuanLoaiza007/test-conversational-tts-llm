"use client";
import { useState, useEffect } from "react";
import useSpeechFlow from "@/utils/speech-flow";
import ChatWindow from "@/app/_components/ChatWindow";
import SpeechButton from "@/app/_components/SpeechButton";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);

  const { shouldAlert, shouldProcess, transcript, listen, stop, reset, speak } =
    useSpeechFlow({
      onTextDetected: (text) => handleNewMessage(text, "user"),
    });

  useEffect(() => {
    if (shouldAlert)
      alert("Lo siento, tu navegador no soporta Speech Recognition.");
  }, [shouldAlert]);

  useEffect(() => {
    if (shouldProcess && transcript.trim()) {
      stop();
      reset();
      setListening(false);
    }
  }, [shouldProcess, transcript, stop, reset]);

  const handleNewMessage = async (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);

    if (sender === "user") {
      try {
        const { request_gemini } = await import("@/utils/gemini");
        const response = await request_gemini([...messages, { text, sender }]);
        setMessages((prev) => [...prev, { text: response, sender: "ai" }]);
        speak(response);
      } catch (error) {
        console.error("Error al procesar la solicitud LLM:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Error al obtener respuesta de la IA.", sender: "ai" },
        ]);
      }
    }
  };

  const handleListenClick = () => {
    if (listening) {
      stop();
      setListening(false);
    } else {
      reset();
      listen();
      setListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <ChatWindow messages={messages} />
      <SpeechButton listening={listening} onClick={handleListenClick} />
    </div>
  );
}
