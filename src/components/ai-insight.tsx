"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIInsightProps {
  title: string;
  content: string;
  existingInsight?: string | null;
  onInsightGenerated: (insight: string) => void;
}

export function AIInsight({
  title,
  content,
  existingInsight,
  onInsightGenerated,
}: AIInsightProps) {
  const [insight, setInsight] = useState(existingInsight || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Conversation state
  const [showConversation, setShowConversation] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [isConversing, setIsConversing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when conversation opens
  useEffect(() => {
    if (showConversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showConversation]);

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  };

  const handleAnalyze = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: stripHtml(content) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      setInsight(data.text);
      onInsightGenerated(data.text);
      // Reset conversation when regenerating insight
      setMessages([]);
      setShowConversation(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("AI Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isConversing) return;

    const userQuestion = question.trim();
    setQuestion("");
    setError(null);
    setIsConversing(true);

    // Add user message immediately
    const newMessages: Message[] = [...messages, { role: "user", content: userQuestion }];
    setMessages(newMessages);

    try {
      const response = await fetch("/api/analyze/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: stripHtml(content),
          insight,
          messages,
          question: userQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add assistant response
      setMessages([...newMessages, { role: "assistant", content: data.text }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      // Remove the user message on error
      setMessages(messages);
    } finally {
      setIsConversing(false);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setShowConversation(false);
    setQuestion("");
  };

  const handleSaveInsights = async () => {
    if (messages.length < 2 || isSummarizing) return;

    setError(null);
    setIsSummarizing(true);

    try {
      const response = await fetch("/api/analyze/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: stripHtml(content),
          insight,
          messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save insights");
      }

      // Update insight with enriched version
      setInsight(data.text);
      onInsightGenerated(data.text);
      // Clear conversation after saving
      setMessages([]);
      setShowConversation(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Save insights error:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Check if we have enough exchanges to offer save
  const canSaveInsights = messages.length >= 2;

  const displayText = insight;

  // No insight yet - show generate button
  if (!displayText && !isLoading) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span
                className="material-symbols-outlined text-xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
              >
                psychology
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Insight</h3>
              <p className="text-sm text-muted-foreground">Get personalized reflections on your entry</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!content.trim()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            Generate Insight
          </button>
        </div>
        {error && (
          <p className="mt-4 text-sm text-destructive flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </p>
        )}
      </div>
    );
  }

  // Has insight - show insight card with conversation option
  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <span
              className="material-symbols-outlined text-xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
            >
              psychology
            </span>
          </div>
          <h3 className="font-semibold text-foreground">AI Insight</h3>
        </div>
        <div className="flex items-center gap-1">
          {canSaveInsights && (
            <button
              onClick={handleSaveInsights}
              disabled={isSummarizing}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
              title="Save conversation insights to entry"
            >
              {isSummarizing ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  Save insights
                </>
              )}
            </button>
          )}
          {messages.length > 0 && !canSaveInsights && (
            <button
              onClick={handleClearConversation}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
              title="Clear conversation"
            >
              <span className="material-symbols-outlined text-lg">delete_sweep</span>
            </button>
          )}
          {messages.length > 0 && canSaveInsights && (
            <button
              onClick={handleClearConversation}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
              title="Discard conversation"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
          {!isLoading && (
            <button
              onClick={handleAnalyze}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
              title="Regenerate insight"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* Initial Insight */}
      <div className="mt-4 pl-[52px]">
        {isLoading ? (
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
            <span className="text-sm">Analyzing your entry...</span>
          </div>
        ) : (
          <>
            <p className="font-body text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {displayText}
            </p>

            {/* Conversation Messages */}
            {messages.length > 0 && (
              <div className="mt-6 space-y-4 border-t border-primary/10 pt-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
                        <span
                          className="material-symbols-outlined text-sm text-primary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          psychology
                        </span>
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2.5 max-w-[85%] ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-elevated text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                        <span className="material-symbols-outlined text-sm text-primary-foreground">
                          person
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {isConversing && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <span
                        className="material-symbols-outlined text-sm text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        psychology
                      </span>
                    </div>
                    <div className="bg-surface-elevated rounded-lg px-4 py-2.5">
                      <span className="material-symbols-outlined text-base text-muted-foreground animate-spin">
                        progress_activity
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Ask More / Conversation Input */}
            {!showConversation && messages.length === 0 ? (
              <button
                onClick={() => setShowConversation(true)}
                className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                Ask more about this insight
              </button>
            ) : (
              <form onSubmit={handleAskQuestion} className="mt-4">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    disabled={isConversing}
                    className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!question.trim() || isConversing}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-lg">send</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}
        {error && (
          <p className="mt-4 text-sm text-destructive flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
