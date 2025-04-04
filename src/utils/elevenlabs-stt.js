import { useState, useRef } from "react";
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
  apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
});

export const useElevenLabsSTT = () => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const supportsSpeechRecognition =
    typeof window !== "undefined" && !!window.MediaRecorder;

  const start = async () => {
    if (!supportsSpeechRecognition) return;

    setTranscript("");
    audioChunksRef.current = [];
    setListening(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      try {
        const result = await client.speechToText.convert({
          file: audioBlob,
          model_id: "scribe_v1",
          tag_audio_events: false,
          language_code: "spa",
          diarize: false,
        });

        setTranscript(result.text);
      } catch (err) {
        console.error("STT error:", err);
      }
      setListening(false);
    };

    mediaRecorder.start();
  };

  const stop = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const resetTranscript = () => setTranscript("");

  return {
    transcript,
    listening,
    supportsSpeechRecognition,
    start,
    stop,
    resetTranscript,
  };
};
