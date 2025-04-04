"use client";
import React from "react";
import { Card } from "@/components/ui/card";

export default function ChatWindow({ messages }) {
  return (
    <Card className="w-full max-w-md p-4 bg-white shadow-md rounded-lg flex flex-col gap-2 h-[500px] overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg max-w-[75%] ${
            msg.sender === "user"
              ? "bg-blue-500 text-white self-end"
              : "bg-gray-200 text-black self-start"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </Card>
  );
}
