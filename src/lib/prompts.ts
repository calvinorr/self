// Curated writing prompts for journaling inspiration
// Organized by category for variety

export const writingPrompts = [
  // Self-Reflection (15)
  "What am I grateful for today, and why?",
  "What's one thing I learned about myself this week?",
  "If I could talk to my younger self, what would I say?",
  "What does my ideal day look like?",
  "What are three things I'm proud of accomplishing?",
  "What fears have been holding me back lately?",
  "What would I do if I knew I couldn't fail?",
  "What brings me genuine joy, not just temporary happiness?",
  "When do I feel most like myself?",
  "What do I need to forgive myself for?",
  "What would my 80-year-old self want me to know?",
  "What patterns do I notice in my thoughts lately?",
  "What am I avoiding, and why?",
  "What does success mean to me right now?",
  "What am I ready to let go of?",

  // Emotions & Feelings (10)
  "How am I really feeling right now, beneath the surface?",
  "What emotion have I been suppressing lately?",
  "When was the last time I felt truly at peace?",
  "What triggered my strongest emotion this week?",
  "How has my mood changed throughout today?",
  "What makes me feel safe and secure?",
  "What am I anxious about, and is it within my control?",
  "When did I last feel genuinely happy?",
  "What would I tell a friend feeling the way I do now?",
  "How do I want to feel tomorrow?",

  // Relationships (10)
  "Who has positively influenced my life recently?",
  "What relationship needs more attention right now?",
  "How can I be a better friend/partner/family member?",
  "Who do I need to have a difficult conversation with?",
  "What boundaries do I need to set or maintain?",
  "Who inspires me, and why?",
  "What qualities do I value most in the people around me?",
  "How have my relationships shaped who I am?",
  "Who would I like to reconnect with?",
  "What do I wish people understood about me?",

  // Growth & Goals (10)
  "What's one small step I can take toward my goals today?",
  "What skill do I want to develop this year?",
  "What's stopping me from pursuing what I want?",
  "What would I attempt if growth was guaranteed?",
  "How have I grown in the past year?",
  "What habits are serving me well?",
  "What habits do I want to change?",
  "What does my future self need me to do today?",
  "What's one thing I could do differently tomorrow?",
  "What challenge has taught me the most?",

  // Daily Life (10)
  "What was the best part of today?",
  "What surprised me today?",
  "What moment today do I want to remember?",
  "What was challenging today, and how did I handle it?",
  "What did I notice today that I usually overlook?",
  "How did I take care of myself today?",
  "What's one thing I wish I had done differently today?",
  "What am I looking forward to?",
  "What do I need more of in my daily life?",
  "What do I need less of?",

  // Creativity & Dreams (5)
  "If I could live anywhere, where would it be and why?",
  "What's a dream I've never told anyone?",
  "If I had unlimited resources, what would I create?",
  "What story do I want my life to tell?",
  "What would I do with an extra hour each day?",
];

export function getRandomPrompt(): string {
  return writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
}

export function getPromptsByCategory(): Record<string, string[]> {
  return {
    "Self-Reflection": writingPrompts.slice(0, 15),
    "Emotions & Feelings": writingPrompts.slice(15, 25),
    "Relationships": writingPrompts.slice(25, 35),
    "Growth & Goals": writingPrompts.slice(35, 45),
    "Daily Life": writingPrompts.slice(45, 55),
    "Creativity & Dreams": writingPrompts.slice(55, 60),
  };
}
