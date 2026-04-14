"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  createdAt: string;
}

interface MessageChatProps {
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
  initialMessages: ChatMessage[];
}

export function MessageChat({
  currentUserId,
  otherUserId,
  otherUserName,
  initialMessages,
}: MessageChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !otherUserId) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: otherUserId,
          content: input.trim(),
        }),
      });

      if (res.ok) {
        const msg = await res.json();
        setMessages([
          ...messages,
          {
            id: msg.id,
            content: msg.content,
            senderId: currentUserId,
            senderName: "Tu",
            createdAt: msg.createdAt,
          },
        ]);
        setInput("");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="p-4 border-b">
        <p className="font-medium">{otherUserName}</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Niciun mesaj încă. Începe conversația!
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isMine
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMine
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrie un mesaj..."
          disabled={sending || !otherUserId}
        />
        <Button type="submit" size="icon" disabled={sending || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
