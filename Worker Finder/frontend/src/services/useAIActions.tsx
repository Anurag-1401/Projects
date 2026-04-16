import { useNavigate } from 'react-router-dom';

type AgentAction =
  | { action: 'SEARCH_WORKERS'; service: string; location?: string; date?: string }
  | { action: 'SHOW_WORKERS'; category: string }
  | { action: 'BOOK_WORKER'; workerId: string; date: string }
  | { action: 'OPEN_PAYMENT'; workerId: string }
  | { action: 'NAVIGATE'; path: string }
  | { action: 'CHAT'; message?: string }
  | { action: 'SHOW_RECOMMENDATIONS'; service?: string; workers?: any[] };

export const useAgentActions = () => {
  const navigate = useNavigate();

  // 🔥 EXECUTE AI ACTIONS
  const executeAction = (action: AgentAction): string | null => {
    switch (action.action) {

      // 🧠 SEARCH (AI INTENT → ROUTE)
      case 'SEARCH_WORKERS':
        if (action.service) {
          navigate(`/${action.service}`);
        }
        return null;

      // 📂 SHOW CATEGORY
      case 'SHOW_WORKERS':
        navigate(`/${action.category}`);
        return null;

      // 💳 BOOK WORKER → PAYMENT PAGE
      case 'BOOK_WORKER':
        navigate(`/payment?workerId=${action.workerId}&date=${action.date}`);
        return null;

      // 💰 DIRECT PAYMENT
      case 'OPEN_PAYMENT':
        navigate(`/payment?workerId=${action.workerId}`);
        return null;

      // 🌐 GENERIC NAVIGATION
      case 'NAVIGATE':
        if (action.path) {
          navigate(action.path);
        }
        return null;

      case 'SHOW_RECOMMENDATIONS':
      if (Array.isArray(action.workers) && action.workers.length > 0) {
        navigate(`/${action.workers[0].category}`, {
          state: { workers: action.workers }
        });
      }
      return null;

      // 💬 CHAT (no navigation)
      case 'CHAT':
        return null;
    }

      const _exhaustiveCheck: never = action;
      return `Unhandled action: ${JSON.stringify(_exhaustiveCheck)}`;
  };

  // 🧠 FALLBACK (WHEN AI FAILS)
  const parseFallback = (input: string): { actions: AgentAction[]; message: string } => {
    const lower = input.toLowerCase().trim();

    // 🔧 PLUMBER
    if (lower.includes('plumber')) {
      return {
        actions: [{ action: 'SHOW_RECOMMENDATIONS', service: 'plumber' }],
        message: "Showing available plumbers 🔧"
      };
    }

    // ⚡ ELECTRICIAN
    if (lower.includes('electrician')) {
      return {
        actions: [{ action: 'SEARCH_WORKERS', service: 'electrician' }],
        message: "Here are top electricians ⚡"
      };
    }

    // 🧹 CLEANER
    if (lower.includes('cleaner') || lower.includes('cleaning')) {
      return {
        actions: [{ action: 'SEARCH_WORKERS', service: 'cleaner' }],
        message: "Showing cleaners 🧹"
      };
    }

    // 🪚 CARPENTER
    if (lower.includes('carpenter')) {
      return {
        actions: [{ action: 'SEARCH_WORKERS', service: 'carpenter' }],
        message: "Here are carpenters 🪚"
      };
    }

    // 🎨 PAINTER
    if (lower.includes('painter') || lower.includes('painting')) {
      return {
        actions: [{ action: 'SEARCH_WORKERS', service: 'painter' }],
        message: "Showing painters 🎨"
      };
    }

    // 🧱 MASON
    if (lower.includes('mason')) {
      return {
        actions: [{ action: 'SEARCH_WORKERS', service: 'mason' }],
        message: "Here are masons 🧱"
      };
    }

    // 📦 GENERIC SHOW ALL WORKERS
    if (lower.includes('show workers') || lower.includes('services')) {
      return {
        actions: [{ action: 'NAVIGATE', path: '/' }],
        message: "Here are all available services 👇"
      };
    }

    // 💳 PAYMENT
    if (lower.includes('payment') || lower.includes('pay')) {
      return {
        actions: [{ action: 'NAVIGATE', path: '/payment' }],
        message: "Redirecting to payment 💳"
      };
    }

    // 🏠 HOME
    if (lower.includes('home')) {
      return {
        actions: [{ action: 'NAVIGATE', path: '/' }],
        message: "Taking you home 🏠"
      };
    }

    // ❓ DEFAULT
    return {
      actions: [{ action: 'CHAT' }],
      message:
        "I can help you find workers 👷\n\nTry:\n• Need plumber\n• Show electricians\n• Book cleaner"
    };
  };

  return { executeAction, parseFallback };
};