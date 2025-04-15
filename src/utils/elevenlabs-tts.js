import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
  apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
});

const voiceId = "JBFqnCBsd6RMkjVDRZzb";

let curretAudio = null;

const decodeBase64Audio = (base64) => {
  const binaryString = atob(base64);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return byteArray;
};

export const generateAudioFromText = async (text) => {
  const response = await client.textToSpeech.streamWithTimestamps(voiceId, {
    output_format: "mp3_44100_128",
    text,
    model_id: "eleven_multilingual_v2",
  });

  const audioChunks = [];
  for await (const item of response) {
    if (item.audio_base64) {
      audioChunks.push(decodeBase64Audio(item.audio_base64));
    }
  }

  return new Blob(audioChunks, { type: "audio/mp3" });
};

export const createAudioURL = (blob) => {
  return URL.createObjectURL(blob);
};

export const downloadAudio = (url, filename = "tts-audio.mp3") => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const elevenLabsTTS = {
  speak: async (text) => {
    const blob = await generateAudioFromText(text);
    const audio = new Audio(createAudioURL(blob));
    await audio.play();
  },
  cancel: () => {
    if (curretAudio) {
      curretAudio.pause();
      curretAudio.currentTime = 0;
      curretAudio = null;
    }
  },
};
