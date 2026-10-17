'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Msg {
  role: 'user' | 'model';
  text: string;
}

const SUGGESTIONS = [
  'How is the delivery fee calculated?',
  'Can I cancel my shipment?',
  'What do the statuses mean?',
];

const GREETING: Msg = {
  role: 'model',
  text: 'Hi! I can answer questions about booking, fees, payments and shipment statuses. How can I help?',
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user' as const, text }];
    setMessages(next);
    setInput('');
    setError(null);
    setLoading(true);
    try {
      // The greeting is UI-only, so it is not sent to the model.
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(1).slice(-10) }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.success) {
        setError(body.message || 'The assistant is unavailable right now.');
        return;
      }
      setMessages((m) => [...m, { role: 'model', text: body.data.reply }]);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open && (
        <div
          role="dialog"
          aria-label="AI assistant"
          className="border-ink-100 bg-white mb-3 flex h-[28rem] max-h-[75vh] w-[calc(100vw-2rem)] max-w-sm flex-col rounded-sm border shadow-xl"
        >
          <div className="border-ink-100 flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="text-signal-600 h-4 w-4" />
              <p className="font-display text-ink-900 text-sm font-semibold">AI assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-ink-500 hover:text-ink-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <p
                  className={
                    m.role === 'user'
                      ? 'bg-ink-900 text-chalk-50 max-w-[85%] rounded-sm px-3 py-2 text-sm whitespace-pre-wrap'
                      : 'bg-chalk-100 text-ink-900 max-w-[85%] rounded-sm px-3 py-2 text-sm whitespace-pre-wrap'
                  }
                >
                  {m.text}
                </p>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="border-ink-100 text-ink-700 hover:bg-ink-100 rounded-sm border px-2.5 py-1.5 text-left text-xs"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <p className="text-ink-500 text-xs" role="status">
                Thinking...
              </p>
            )}
            {error && (
              <p className="text-alert-600 text-xs" role="alert">
                {error}
              </p>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-ink-100 flex gap-2 border-t p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fees, status, payment..."
              maxLength={500}
              aria-label="Your message"
              disabled={loading}
            />
            <Button type="submit" variant="signal" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      )}

      <Button
        type="button"
        variant="signal"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        className="ml-auto flex h-12 rounded-sm px-4 shadow-lg"
      >
        <Bot className="h-5 w-5" />
        <span className="hidden sm:inline">Ask AI</span>
      </Button>
    </div>
  );
}
