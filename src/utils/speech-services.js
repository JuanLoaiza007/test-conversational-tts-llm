import { useBrowserSTT } from "@/utils/browser-stt";
import { browserTTS } from "@/utils/browser-tts";
import { useElevenLabsSTT } from "@/utils/elevenlabs-stt";
import { elevenLabsTTS } from "@/utils/elevenlabs-tts";

const defaultSTT = useBrowserSTT;
const defaultTTS = browserTTS;

export const getSpeechServices = ({ useSTT = true } = {}) => {
  return {
    stt: defaultSTT,
    tts: defaultTTS,
  };
};
