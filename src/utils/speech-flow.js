import { useEffect, useRef, useState } from "react";
import {
  useBrowserSTT,
  startBrowserSTT,
  stopBrowserSTT,
} from "@/utils/browser-stt";
import { browserTTS, cancelBrowserTTS } from "@/utils/browser-tts";

export default function useSpeechFlow({ onTextDetected }) {
  const [shouldProcess, setShouldProcess] = useState(false);
  const [shouldAlert, setShouldAlert] = useState(false);
  const hasProcessedRef = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useBrowserSTT();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setShouldAlert(true);
    }
  }, [browserSupportsSpeechRecognition]);

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
    cancelBrowserTTS();
    hasProcessedRef.current = false;
    resetTranscript();
    startBrowserSTT();
  };

  const stop = () => {
    stopBrowserSTT();
  };

  const reset = () => {
    setShouldProcess(false);
    resetTranscript();
  };

  const speak = (text) => {
    browserTTS(text);
  };

  return {
    shouldAlert,
    shouldProcess,
    transcript,
    listen,
    stop,
    reset,
    speak,
  };
}
