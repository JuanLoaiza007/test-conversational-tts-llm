// lib/elevenlabs-tts.js
import { ElevenLabsClient } from "elevenlabs";

// Inicializa el cliente de ElevenLabs
const initializeClient = () => {
  return new ElevenLabsClient({
    apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
  });
};

// Convierte base64 a Uint8Array para formar el blob de audio
const decodeBase64Audio = (base64) => {
  const binaryString = atob(base64);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return byteArray;
};

// Genera el audio desde el texto usando ElevenLabs
export const generateAudioFromText = async (
  text,
  voiceId = "JBFqnCBsd6RMkjVDRZzb"
) => {
  const client = initializeClient();

  const response = await client.textToSpeech.streamWithTimestamps(voiceId, {
    output_format: "mp3_44100_128",
    text: text,
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

// Crea una URL desde el blob para reproducir el audio
export const createAudioURL = (blob) => {
  return URL.createObjectURL(blob);
};

// Descarga el audio automáticamente
export const downloadAudio = (audioURL, filename = "tts-audio.mp3") => {
  const downloadLink = document.createElement("a");
  downloadLink.href = audioURL;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
