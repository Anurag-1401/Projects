import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, Sparkles, Loader2, Zap, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAgentActions } from '@/hooks/useAIActions';
import { supabase } from '@/supabase/supabaseClient';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: any[];
  timestamp: Date;
}

const QUICK_COMMANDS = [
  { label: '👨‍💻 About Me', command: 'Tell me about Anurag' },
  { label: '📂 Projects', command: 'Show my projects' },
  { label: '📄 Resume', command: 'Open resume' },
  { label: '📞 Contact', command: 'Contact Anurag' },
];

const AIAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Anurag AI 🤖 I can guide you through my projects, skills, and experience. Ask me anything!",     
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { executeAction, parseFallback } = useAgentActions();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const processResponse = (data: { actions: any[]; message: string }) => {
    // Execute each action
    const errors: string[] = [];
    for (const action of data.actions) {
      if (action.action !== 'CHAT') {
        const error = executeAction(action);
        if (error) errors.push(error);
      }
    }

    let responseMessage = data.message;
    if (errors.length > 0) {
      responseMessage += '\n\n⚠️ ' + errors.join('\n');
    }

    return responseMessage;
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Try AI-powered response first
      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const { data, error } = await supabase.functions.invoke('ai-agentII', {
        body: { message: trimmed, conversationHistory },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      const responseMessage = processResponse(data);
      
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseMessage,
          actions: data.actions,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.warn('AI unavailable, using fallback:', err);
      // Fallback to keyword-based parsing
      const fallbackResult = parseFallback(trimmed);
      const responseMessage = processResponse(fallbackResult);

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseMessage,
          actions: fallbackResult.actions,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCommand = (command: string) => {
    setInput(command);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const tooltips = [
  "AI Assistant 🤖",
  "Ask me anything",
  "Chat with AI"
];

const [tooltipIndex, setTooltipIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setTooltipIndex((prev) => (prev + 1) % tooltips.length);
  }, 1000);

  return () => clearInterval(interval);
}, [tooltips.length]);

  return (
    <>
      {/* Floating Button */}
  <div className="fixed bottom-6 right-6 z-[60]">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className={cn(
      'peer rounded-full p-4 transition-all duration-300 hover:scale-110',
      'bg-primary text-white shadow-lg shadow-primary/40',
      'border border-white/20'
    )}
  >
    {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
  </button>

  {/* Tooltip */}
  <div
    className={cn(
      "pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 transition-all duration-300",
      !isOpen ? "opacity-0 peer-hover:opacity-100" : "opacity-0"
    )}
  >

    <div className="rounded-xl bg-black text-white px-4 py-2 shadow-xl text-sm min-w-[160px] text-center">

      <span className="transition-all duration-300">
        {tooltips[tooltipIndex]}
      </span>

    </div>
  </div>
</div>

      {/* Chat Panel */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-[60] flex flex-col rounded-2xl',
          'bg-white text-black dark:bg-black dark:text-white',
          'shadow-2xl border border-gray-200 dark:border-gray-800',
          'w-[380px] max-h-[600px]',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        )}
      >
        {/* Header */}
       <div className="flex items-center gap-3 rounded-t-2xl bg-primary p-4 text-white shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              Anurag's AI Assistant
            </h3>
            <p className="text-xs text-white/80">
              Your personal developer assistant
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/80">
              Online
            </span>
          </div>             
      </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                )}
              >
                {msg.role === 'assistant' && (
                  <Bot className="inline h-3.5 w-3.5 mr-1 opacity-60" />
                )}
                <span className="whitespace-pre-wrap">{msg.content}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Commands */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd.label}
                onClick={() => handleQuickCommand(cmd.command)}
                className="text-xs bg-muted hover:bg-accent rounded-full px-3 py-1.5 transition-colors text-foreground"
              >
                {cmd.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 rounded-full border-muted text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="rounded-full h-9 w-9 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-1.5">
            <Zap className="inline h-3 w-3" /> Powered by AI • Type naturally or use commands
          </p>
        </div>
      </div>
    </>
  );
};

export default AIAgent;