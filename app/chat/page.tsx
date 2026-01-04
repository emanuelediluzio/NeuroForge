"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am NeuroForge. I can help you train your own AI models. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // TODO: Replace with actual backend call
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
      });

      if (!response.ok) throw new Error("Backend error");

      const data = await response.json();
      const botMsg: Message = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { role: "assistant", content: "I'm having trouble connecting to the local backend. Is it running?" };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-black border-r border-gray-800 flex-col transition-all duration-300 ease-in-out z-30",
        "fixed inset-y-0 left-0 w-64 md:relative md:translate-x-0 md:flex",
        isSidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden"
      )}>
        <div className="p-4 flex items-center justify-between">
          <Button variant="ghost" className="flex-1 justify-start gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-200" onClick={() => {
            setMessages([{ role: "assistant", content: "Ready to start a new training session." }]);
            setIsSidebarOpen(false);
          }}>
            <Plus size={16} />
            New Chat
          </Button>
          {/* Close button for mobile */}
          <Button variant="ghost" size="icon" className="md:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <Menu size={20} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Today</div>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800 text-sm truncate transition-colors text-gray-300">
            New Training Run
          </button>
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold">NF</div>
            <div className="text-sm font-medium">NeuroForge Local</div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative w-full">
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-4 md:hidden bg-gray-900 z-10 shrink-0">
          <Button variant="ghost" size="icon" className="text-gray-400" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </Button>
          <span className="font-semibold text-sm">NeuroForge</span>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Plus size={20} />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-4", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center mt-1">
                    <Bot size={18} className="text-white" />
                  </div>
                )}
                <div className={cn(
                  "rounded-2xl px-5 py-3 max-w-[85%] text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-gray-700 text-white rounded-br-none"
                    : "bg-transparent text-gray-100 rounded-bl-none"
                )}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center mt-1">
                    <User size={18} className="text-gray-300" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center mt-1">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="flex items-center gap-1 h-10 px-4">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message NeuroForge..."
                className="w-full bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-xl py-6 pr-12 focus-visible:ring-offset-0 focus-visible:ring-gray-600"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className={cn("absolute right-2 top-1/2 -translate-y-1/2 rounded-lg transition-all", input.trim() ? "bg-white text-black hover:bg-gray-200" : "bg-gray-700 text-gray-400")}
              >
                <Send size={18} />
              </Button>
            </form>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-600">NeuroForge can make mistakes. Consider checking important information.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
