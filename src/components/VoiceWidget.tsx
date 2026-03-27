"use client";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onspeechend: (() => void) | null;
    onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
    onresult: ((e: SpeechRecognitionEvent) => void) | null;
  }
  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
  var SpeechRecognition: { new(): SpeechRecognition };
}

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "ai"; text: string };

export default function VoiceWidget() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hello! Welcome to Ember & Salt. You can type or speak to me. How can I help you?" }
  ]);
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Load best available voice once
  useEffect(() => {
    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(v => v.name === "Google UK English Female") ||
        voices.find(v => v.name === "Google US English") ||
        voices.find(v => v.name === "Samantha") ||
        voices.find(v => v.name === "Karen") ||
        voices.find(v => v.name === "Moira") ||
        voices.find(v => v.lang === "en-GB" && v.localService === false) ||
        voices.find(v => v.lang === "en-US" && v.localService === false) ||
        voices.find(v => v.lang.startsWith("en"));
      if (preferred) voiceRef.current = preferred;
    };
    loadVoice();
    window.speechSynthesis.onvoiceschanged = loadVoice;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
    sentences.forEach((sentence, index) => {
      const utterance = new SpeechSynthesisUtterance(sentence.trim());
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.rate = 0.88;
      utterance.pitch = 1.0;
      utterance.volume = 1;
      if (index === 0) utterance.onstart = () => setSpeaking(true);
      if (index === sentences.length - 1) utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const newMessages = [...messages, { role: "user" as const, text }];
    setMessages(newMessages);
    setInputText("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();
      const aiReply = data.reply || "Sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: "ai", text: aiReply }]);
      speak(aiReply);
    } catch {
      const err = "Sorry, something went wrong.";
      setMessages(prev => [...prev, { role: "ai", text: err }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const startListening = () => {
    setError("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Use Chrome or Edge for voice.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      const current = final || interim;
      setTranscript(current);
      transcriptRef.current = current;
      setInputText(current);
    };
    recognition.onspeechend = () => recognition.stop();
    recognition.onend = async () => {
      setListening(false);
      const finalText = transcriptRef.current;
      setTranscript("");
      transcriptRef.current = "";
      if (finalText.trim()) sendMessage(finalText);
    };
    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setListening(false);
      if (e.error !== "no-speech") setError("Mic error: " + e.error);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const s = {
    input: {
      flex: 1, background: "rgba(0,0,0,0.4)",
      border: "1px solid rgba(201,169,110,0.2)",
      color: "#d6c4aa", padding: "0.6rem 1rem",
      fontSize: "0.82rem", outline: "none",
      fontFamily: "inherit", borderRadius: 2,
    } as React.CSSProperties,
  };

  return (
    <div style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>

      {open && (
        <div style={{ width: 360, height: 500, background: "rgba(10,7,5,0.98)", border: "1px solid rgba(201,169,110,0.2)", backdropFilter: "blur(16px)", borderRadius: 4, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>

          {/* Header */}
          <div style={{ padding: "0.9rem 1.2rem", borderBottom: "1px solid rgba(201,169,110,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: speaking ? "#c9a96e" : listening ? "#f59e0b" : "#4ade80" }} />
              <span style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9a96e" }}>
                {speaking ? "Speaking..." : listening ? "Listening..." : "AI Host — Online"}
              </span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#7a6e62", cursor: "pointer", fontSize: "1rem" }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "0.5rem", alignItems: "flex-end" }}>
                {m.role === "ai" && (
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", flexShrink: 0 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "75%", padding: "0.65rem 1rem", fontSize: "0.82rem", lineHeight: 1.55,
                  background: m.role === "user" ? "rgba(201,169,110,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${m.role === "user" ? "rgba(201,169,110,0.3)" : "rgba(255,255,255,0.07)"}`,
                  color: m.role === "user" ? "#e8c98a" : "#d6c4aa",
                  borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}>🤖</div>
                <div style={{ padding: "0.65rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px 12px 12px 2px", display: "flex", gap: "4px", alignItems: "center" }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a96e", animation: `bounce 1s ease ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {transcript && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ maxWidth: "75%", padding: "0.65rem 1rem", fontSize: "0.82rem", color: "#7a6e62", border: "1px dashed rgba(201,169,110,0.2)", borderRadius: "12px 12px 2px 12px" }}>
                  {transcript}...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Waveform */}
          {listening && (
            <div style={{ padding: "0.4rem 1.2rem", borderTop: "1px solid rgba(201,169,110,0.08)", display: "flex", alignItems: "center", gap: "3px", justifyContent: "center" }}>
              {[0.3,0.6,1,0.7,0.4,0.8,0.5,1,0.6,0.3].map((h, i) => (
                <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.08}s`, height: `${h * 20}px` }} />
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid rgba(201,169,110,0.1)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              ref={inputRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              style={s.input}
            />
            <button
              onClick={listening ? stopListening : startListening}
              title={listening ? "Stop" : "Speak"}
              style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${listening ? "#c9a96e" : "rgba(201,169,110,0.3)"}`, background: listening ? "rgba(201,169,110,0.2)" : "transparent", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              {listening ? "⏹️" : "🎤"}
            </button>
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim() || loading}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: inputText.trim() ? "#c9a96e" : "rgba(201,169,110,0.1)", cursor: inputText.trim() ? "pointer" : "default", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}
            >
              ➤
            </button>
          </div>

          {error && <div style={{ padding: "0.4rem 1rem", background: "rgba(239,68,68,0.1)", color: "#fca5a5", fontSize: "0.7rem", textAlign: "center" }}>{error}</div>}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        title="Chat with AI Host"
        style={{ width: 60, height: 60, borderRadius: "50%", background: open ? "rgba(201,169,110,0.2)" : "rgba(10,7,5,0.95)", border: `2px solid ${open ? "#c9a96e" : "rgba(201,169,110,0.4)"}`, cursor: "pointer", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.5)", transition: "all 0.3s" }}
      >
        {open ? "✕" : "🎤"}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}