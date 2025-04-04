import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export const useBrowserSTT = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  return {
    transcript,
    listening,
    resetTranscript,
    supportsSpeechRecognition: browserSupportsSpeechRecognition,
    start: () =>
      SpeechRecognition.startListening({
        language: "es-ES",
        continuous: false,
        interimResults: false,
      }),
    stop: () => SpeechRecognition.stopListening(),
  };
};
