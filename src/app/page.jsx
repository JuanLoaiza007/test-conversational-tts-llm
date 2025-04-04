"use client";

import { useRef, useState } from "react";
import useSpeechFlow from "@/utils/speech-flow";
import { getSpeechServices } from "@/utils/speech-services";
import { request_gemini } from "@/utils/gemini";
import ChatWindow from "@/app/_components/ChatWindow";
import SpeechButton from "@/app/_components/SpeechButton";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const isProcessingRef = useRef(false);

  const { stt, tts } = getSpeechServices();

  const handleTextDetected = async (userText) => {
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);

    if (!isProcessingRef.current) {
      isProcessingRef.current = true;

      try {
        const response = await request_gemini([
          ...messages,
          { text: userText, sender: "user" },
        ]);
        setMessages((prev) => [...prev, { text: response, sender: "ai" }]);
        speech.speak(response);
      } catch (err) {
        console.error("Error:", err);
        setMessages((prev) => [
          ...prev,
          { text: "Error al obtener respuesta de la IA.", sender: "ai" },
        ]);
      } finally {
        isProcessingRef.current = false;
        speech.reset();
      }
    }
  };

  const speech = useSpeechFlow({
    onTextDetected: handleTextDetected,
    stt,
    tts,
  });

  const handleListenClick = () => {
    if (speech.listening) {
      speech.stop();
    } else {
      speech.listen();
    }
  };

  if (speech.shouldAlert) {
    alert("Lo siento, tu navegador no soporta Speech Recognition.");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <ChatWindow messages={messages} />
      <SpeechButton listening={speech.listening} onClick={handleListenClick} />
    </div>
  );
}
