"use client";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { request_gemini } from "@/utils/gemini";
import ChatWindow from "@/app/_components/ChatWindow";
import SpeechButton from "@/app/_components/SpeechButton";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const isProcessingRef = useRef(false);
  const hasProcessedRef = useRef(false);

  const {
    transcript,
    listening: isListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Lo siento, tu navegador no soporta Speech Recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    console.log("Transcripción actual:", transcript);
    console.log("Estado de listening:", listening);
    if (!transcript.trim()) return;
    // Procesa el mensaje solo cuando se haya detenido la escucha y aún no se haya procesado
    if (!isListening && listening && !hasProcessedRef.current) {
      hasProcessedRef.current = true;
      const userText = transcript.trim();
      console.log("Texto detectado correctamente:", userText);
      resetTranscript();
      setListening(false);
      handleNewMessage(userText, "user");
    }
  }, [isListening, transcript]);

  const say = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNewMessage = async (text, sender) => {
    setMessages((prev) => {
      const newMessages = [...prev, { text, sender }];
      if (sender === "user" && !isProcessingRef.current) {
        isProcessingRef.current = true;
        request_gemini(newMessages)
          .then((response) => {
            console.log("Respuesta IA:", response);
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: response, sender: "ai" },
            ]);
            say(response);
          })
          .catch((error) => {
            console.error("Error al procesar la solicitud LLM:", error);
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: "Error al obtener respuesta de la IA.", sender: "ai" },
            ]);
          })
          .finally(() => {
            isProcessingRef.current = false;
          });
      }
      return newMessages;
    });
  };

  const handleListenClick = () => {
    if (listening) {
      console.log("Deteniendo escucha...");
      SpeechRecognition.stopListening();
      setListening(false);
    } else {
      console.log("Iniciando escucha...");
      window.speechSynthesis.cancel();
      hasProcessedRef.current = false;
      resetTranscript();
      SpeechRecognition.startListening({
        language: "es-ES",
        continuous: false, // Se detiene automáticamente al dejar de hablar
        interimResults: false,
      });
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
