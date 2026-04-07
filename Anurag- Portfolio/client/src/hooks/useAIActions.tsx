import { useNavigate } from 'react-router-dom';

type AgentAction =
  | { action: 'NAVIGATE'; path: string; params?: Record<string, string> }
  | { action: 'OPEN_PROJECT'; projectSlug: string }
  | { action: 'SHOW_SKILLS' }
  | { action: 'SHOW_ABOUT' }
  | { action: 'OPEN_RESUME' }
  | { action: 'CONTACT' }
  | { action: 'SCROLL'; section: string }
  | { action: 'TOGGLE_THEME'; theme: 'light' | 'dark' }
  | { action: 'CHAT'; message?: string };


export const useAgentActions = () => {
  const navigate = useNavigate();

  const executeAction = (action: AgentAction): string | null => {
  switch (action.action) {

    case 'NAVIGATE':
      if (action.path) {
        const params = action.params
          ? '?' + new URLSearchParams(action.params).toString()
          : '';
        navigate(action.path + params);
      }
      return null;

    case 'SHOW_ABOUT':
      navigate('/explore');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return null;

    case 'SHOW_SKILLS':
      navigate('/explore');
      setTimeout(() => {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return null;

    case 'OPEN_PROJECT':
      navigate('/project');
      return null;

    case 'OPEN_RESUME':
      window.open('/resume.pdf', '_blank');
      return null;

    case 'CONTACT':
      navigate('/contact');
      return null;

    case 'SCROLL':
      setTimeout(() => {
        document.getElementById(action.section)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return null;

    default:
      return `Unknown action: ${action.action}`;
  }
};

  // Keyword-based fallback for when AI is unavailable
 const parseFallback = (input: string): { actions: AgentAction[]; message: string } => {
  const lower = input.toLowerCase().trim();

  // 👨‍💻 ABOUT
  if (lower.includes('about') || lower.includes('who are you') || lower.includes('introduction')) {
    return {
      actions: [{ action: 'SHOW_ABOUT' }],
      message: "Here's a quick overview about Anurag 👨‍💻"
    };
  }

  // ⚡ SKILLS
  if (
    lower.includes('skill') ||
    lower.includes('tech stack') ||
    lower.includes('technologies')
  ) {
    return {
      actions: [{ action: 'SHOW_SKILLS' }],
      message: "Here are my technical skills ⚡"
    };
  }

  // 🚀 PROJECTS (FIXED - correct route)
  if (
    lower.includes('project') ||
    lower.includes('work') ||
    lower.includes('portfolio')
  ) {
    return {
      actions: [{ action: 'NAVIGATE', path: '/project' }],
      message: "Let me show you my projects 🚀"
    };
  }

  // 📊 EXPERIENCE (FIXED - multi action)
  if (
    lower.includes('experience') ||
    lower.includes('internship') ||
    lower.includes('background')
  ) {
    return {
      actions: [
        { action: 'NAVIGATE', path: '/explore' },
        { action: 'SCROLL', section: 'experience' }
      ],
      message: "Here is my experience 📊"
    };
  }

  // 📄 RESUME
  if (lower.includes('resume') || lower.includes('cv')) {
    return {
      actions: [{ action: 'OPEN_RESUME' }],
      message: "Opening my resume 📄"
    };
  }

  // 📞 CONTACT
  if (
    lower.includes('contact') ||
    lower.includes('hire') ||
    lower.includes('reach')
  ) {
    return {
      actions: [{ action: 'CONTACT' }],
      message: "Let's connect 🤝"
    };
  }

  // 🏠 HOME
  if (lower.includes('home') || lower === 'go home') {
    return {
      actions: [{ action: 'NAVIGATE', path: '/' }],
      message: "Taking you to the home page 🏠"
    };
  }

  // 🌙 THEME (FIXED)
  if (lower.includes('dark mode')) {
    return {
      actions: [{ action: 'TOGGLE_THEME', theme: 'dark' }],
      message: "Dark mode activated 🌙"
    };
  }

  if (lower.includes('light mode')) {
    return {
      actions: [{ action: 'TOGGLE_THEME', theme: 'light' }],
      message: "Light mode activated ☀️"
    };
  }

  // 🤖 RECRUITER MODE
  if (lower.includes('recruiter') || lower.includes('hire you')) {
    return {
      actions: [
        { action: 'SHOW_SKILLS' },
        { action: 'NAVIGATE', path: '/project' }
      ],
      message:
        "Great! Let me walk you through my strongest skills and projects tailored for hiring 🚀"
    };
  }

  // ❓ DEFAULT
  return {
    actions: [{ action: 'CHAT' }],
    message:
      "I'm not sure what you mean 🤔\n\nTry asking:\n• Show projects\n• What are your skills?\n• Open resume\n• Contact Anurag"
  };
};
  return { executeAction, parseFallback };
};
