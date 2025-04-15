import { useEffect, useRef, useState } from "react";

export default function useSpeechFlow({ onTextDetected, stt, tts }) {
  const [shouldProcess, setShouldProcess] = useState(false);
  const [shouldAlert, setShouldAlert] = useState(false);
  const hasProcessedRef = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    supportsSpeechRecognition,
    start,
    stop,
  } = stt();

  useEffect(() => {
    if (!supportsSpeechRecognition) {
      setShouldAlert(true);
    }
  }, [supportsSpeechRecognition]);

  useEffect(() => {
    if (!transcript.trim()) return;

    if (!listening && !hasProcessedRef.current) {
      hasProcessedRef.current = true;
      const userText = transcript.trim();
      onTextDetected(userText);
      setShouldProcess(true);
    }
  }, [listening, transcript]);

  const listen = () => {
    tts.cancel();
    hasProcessedRef.current = false;
    resetTranscript();
    start();
  };

  const stopListening = () => {
    stop();
  };

  const reset = () => {
    setShouldProcess(false);
    resetTranscript();
  };

  const speak = (text) => {
    tts.speak(text);
  };

  const cancel = () => {
    tts.cancel();
  };

  return {
    shouldAlert,
    shouldProcess,
    transcript,
    listening,
    listen,
    stop: stopListening,
    reset,
    speak,
    cancel
  };
}
