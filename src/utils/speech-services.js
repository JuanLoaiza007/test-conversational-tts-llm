import { useElevenLabsSTT } from "@/utils/elevenlabs-stt";
import { elevenLabsTTS } from "@/utils/elevenlabs-tts";

const defaultSTT = useElevenLabsSTT;
const defaultTTS = elevenLabsTTS;

export const getSpeechServices = ({ useSTT = true } = {}) => {
  return {
    stt: useSTT ? defaultSTT : null,
    tts: defaultTTS,
  };
};
