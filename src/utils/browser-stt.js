import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export const startBrowserSTT = (language = "es-ES") => {
  SpeechRecognition.startListening({
    language,
    continuous: false,
    interimResults: false,
  });
};

export const stopBrowserSTT = () => {
  SpeechRecognition.stopListening();
};

export const useBrowserSTT = () => {
  return useSpeechRecognition();
};
