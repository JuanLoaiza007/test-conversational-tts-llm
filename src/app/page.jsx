"use client";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { request_gemini } from "@/utils/gemini";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";

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

    // Procesar solo una vez cuando el usuario termine de hablar
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
            if (!isProcessingRef.current) return;
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
        continuous: false,
        interimResults: false,
      });
      setListening(true);
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
        onClick={handleListenClick}
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
