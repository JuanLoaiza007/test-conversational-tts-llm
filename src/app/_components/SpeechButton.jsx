"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

export default function SpeechButton({ listening, onClick }) {
  return (
    <Button
      onClick={onClick}
      className="mt-4 p-4 rounded-full shadow-md flex items-center justify-center"
    >
      {listening ? (
        <MicOff className="w-6 h-6 text-red-500" />
      ) : (
        <Mic className="w-6 h-6 text-green-500" />
      )}
    </Button>
  );
}
