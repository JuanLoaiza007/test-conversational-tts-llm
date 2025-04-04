import { useBrowserSTT } from "@/utils/browser-stt";
import { browserTTS } from "@/utils/browser-tts";

export const getSpeechServices = () => {
  return {
    stt: useBrowserSTT,
    tts: browserTTS,
  };
};
