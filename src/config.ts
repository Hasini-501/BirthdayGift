/**
 * =========================================================================
 * 💌 QUICK SETUP INSTRUCTIONS FOR ME:
 * 1. Open public/photos
 * 2. Put your birthday photos there
 * 3. Name them photo1.jpg, photo2.jpg, etc.
 * 4. Change captions in the memories array below
 * 5. Or use the "✨ Edit memories" button in the bottom corner of the website
 *    to drag-and-drop photos directly from your browser!
 * =========================================================================
 */

import sailuHeroImage from './assets/images/sailu_portrait_1789181767044.jpg';
import customData from './customData.json';

export const getPublicAssetUrl = (path: string): string => {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const clean = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${clean}`;
};

export interface MemoryItem {
  id: string;
  image: string;
  fallbackImage: string;
  caption: string;
  date?: string;
  tag?: string;
  rotation?: number;
}

const defaultMemories: MemoryItem[] = [
  {
    id: "mem-1",
    image: getPublicAssetUrl("photos/photo1.jpg"),
    fallbackImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    caption: "the day we couldn't stop laughing 😭",
    date: "Core Memory",
    tag: "Unfiltered joy",
    rotation: -3
  },
  {
    id: "mem-2",
    image: getPublicAssetUrl("photos/photo2.jpg"),
    fallbackImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    caption: "proof that we actually leave the house 💅",
    date: "Sunny Day Out",
    tag: "Glam mode",
    rotation: 2.5
  },
  {
    id: "mem-3",
    image: getPublicAssetUrl("photos/photo3.jpg"),
    fallbackImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    caption: "one of my favorite memories 🥹",
    date: "Golden Hour",
    tag: "Pure warmth",
    rotation: -2
  },
  {
    id: "mem-4",
    image: getPublicAssetUrl("photos/photo4.jpg"),
    fallbackImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    caption: "chaos, as usual 😂",
    date: "Midnight Shenanigans",
    tag: "Zero braincells",
    rotation: 3.5
  },
  {
    id: "mem-5",
    image: getPublicAssetUrl("photos/photo5.jpg"),
    fallbackImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    caption: "us being us 💗",
    date: "Coffee & Talks",
    tag: "Safe haven",
    rotation: -4
  },
  {
    id: "mem-6",
    image: getPublicAssetUrl("photos/photo6.jpg"),
    fallbackImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    caption: "that one trip we swore we'd do every single year ✈️",
    date: "Road Trip",
    tag: "Adventure",
    rotation: 1.5
  },
  {
    id: "mem-7",
    image: getPublicAssetUrl("photos/photo7.jpg"),
    fallbackImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    caption: "our 2 AM deep talk about the universe and snacks 🌙",
    date: "Sleepover",
    tag: "Soul food",
    rotation: -2.5
  },
  {
    id: "mem-8",
    image: getPublicAssetUrl("photos/photo8.jpg"),
    fallbackImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    caption: "forever grateful the universe brought you to me 🌸",
    date: "Celebration",
    tag: "Bestie forever",
    rotation: 3
  }
];

const resolvedBestFriendName = customData?.bestFriendName || "Sailu";
const resolvedHeroFallback = customData?.heroPhoto ? getPublicAssetUrl(customData.heroPhoto) : getPublicAssetUrl("photos/hero.jpg");
const resolvedMemories: MemoryItem[] = (customData?.memories && customData.memories.length > 0)
  ? customData.memories.map((m: any) => ({
      id: m.id || `mem-${Math.random()}`,
      image: getPublicAssetUrl(m.image),
      fallbackImage: m.fallbackImage ? (m.fallbackImage.startsWith('http') ? m.fallbackImage : getPublicAssetUrl(m.fallbackImage)) : getPublicAssetUrl(m.image),
      caption: m.caption || '',
      date: m.date || 'Special Moment',
      tag: m.tag || 'Memory',
      rotation: typeof m.rotation === 'number' ? m.rotation : 0,
    }))
  : defaultMemories;

export interface ReasonItem {
  id: number;
  emoji: string;
  frontText: string;
  backText: string;
  tag: string;
}

export interface SurpriseBox {
  id: string;
  title: string;
  emoji: string;
  color: string;
  ribbonColor: string;
  message: string;
  subtext: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    comment: string;
    isFunny?: boolean;
  }[];
}

export interface TimelineMoment {
  id: number;
  tag: string; // "Then", "Now", "Forever"
  title: string;
  description: string;
  emoji: string;
  date?: string;
}

export const BIRTHDAY_CONFIG = {
  // 🌸 NAMES & CORE TEXT
  bestFriendName: resolvedBestFriendName, // Best friend's name
  bestFriendNickname: "bestie",
  senderName: "Your forever annoying best friend",
  
  // 🎂 HERO SECTION
  heroGreeting: "Happy Birthday,",
  heroSubtitle: "To my best friend, my safe place, my partner in chaos, and one of my favorite humans ever.",
  heroBadge: "Today is YOUR day 🎂",
  heroImage: sailuHeroImage,
  heroImageFallback: resolvedHeroFallback,

  // 💌 SECTION 1: A LITTLE LETTER FOR YOU
  letter: {
    heading: "A little letter for you 💌",
    salutation: `Dear ${resolvedBestFriendName},`,
    paragraphs: [
      "I don't think I say this enough, but I'm genuinely so lucky to have you in my life.",
      "Thank you for being there through the stupid conversations, random laughs, dramatic moments, bad days, good days, and all the completely unserious things in between.",
      "Some people come into our lives and somehow become family. You're one of those people for me.",
      "I hope this year brings you everything you've been wishing for, because you deserve so much happiness.",
      "No matter where life takes us, I hope we always find our way back to each other.",
      `Happy birthday, idiot. I love you more than you know. 🥹💗`
    ],
    signature: "— Your forever annoying best friend"
  },

  // 📸 SECTION 2: OUR LITTLE MEMORIES (POLAROID SCRAPBOOK)
  memories: resolvedMemories,

  // 🫶 SECTION 3: REASONS WHY YOU'RE MY PERSON
  reasons: [
    {
      id: 1,
      emoji: "✨",
      frontText: "Reason #1",
      backText: "Because you make even boring days fun.",
      tag: "Instant Sunshine"
    },
    {
      id: 2,
      emoji: "🔐",
      frontText: "Reason #2",
      backText: "Because I can tell you literally anything.",
      tag: "Vault of Secrets"
    },
    {
      id: 3,
      emoji: "🧠",
      frontText: "Reason #3",
      backText: "Because you somehow understand my nonsense.",
      tag: "Shared Braincell"
    },
    {
      id: 4,
      emoji: "🌸",
      frontText: "Reason #4",
      backText: "Because your existence makes life better.",
      tag: "Soul Comfort"
    },
    {
      id: 5,
      emoji: "🛡️",
      frontText: "Reason #5",
      backText: "Because you have seen my worst moments and stayed.",
      tag: "Real One"
    },
    {
      id: 6,
      emoji: "😂",
      frontText: "Reason #6",
      backText: "Because laughing with you should honestly be considered therapy.",
      tag: "Ab Workout"
    },
    {
      id: 7,
      emoji: "💗",
      frontText: "Reason #7",
      backText: "Because you're YOU. And that's enough.",
      tag: "Perfection"
    },
    {
      id: 8,
      emoji: "👯‍♀️",
      frontText: "Reason #8",
      backText: "Because no matter how much time passes, nothing ever changes between us.",
      tag: "Timeless Bond"
    }
  ] as ReasonItem[],

  // 🎀 SECTION 4: OUR FRIENDSHIP IN NUMBERS
  numbers: [
    { value: "∞", label: "Times we said “I have something to tell you”", sub: "and talked for hours" },
    { value: "1000+", label: "Inside jokes nobody else understands 😂", sub: "one look and we lose it" },
    { value: "365+", label: "Days of choosing each other", sub: "every single day" },
    { value: "∞", label: "Photos that should probably never see the internet 📸", sub: "locked in the vault forever" },
    { value: "500+", label: "“Bro, listen…” conversations", sub: "unfiltered gossip & real talk" },
    { value: "99.9%", label: "Chance we’ll start laughing at the worst possible moment", sub: "uncontrollable giggles" },
    { value: "2", label: "Absolute idiots who somehow became best friends", sub: "sharing one single braincell" },
    { value: "1", label: "Unbreakable friendship 🤍", sub: "through thick and thin" },
    { value: "0", label: "Days I’d trade having you as my best friend for anything.", sub: "not for the entire universe" },
    { value: "∞", label: "Memories still waiting to be made. 🫶🏻", sub: "our story is just beginning" }
  ],

  // 🎁 SECTION 5: CHOOSE A SURPRISE (MYSTERY BOXES)
  surpriseBoxes: [
    {
      id: "happy",
      title: "Open when you're happy",
      emoji: "🌸",
      color: "bg-gradient-to-br from-pink-100 to-rose-50 border-pink-200 text-rose-800",
      ribbonColor: "bg-pink-400",
      message: "Keep this feeling close! You deserve all the sunshine, flowers, and gentle giggles in the world. Dance around your room right now and celebrate being the wonderful human you are! 🌷✨",
      subtext: "Bottle up this glow — you radiate light!"
    },
    {
      id: "miss-me",
      title: "Open when you miss me",
      emoji: "🥺",
      color: "bg-gradient-to-br from-purple-100 to-indigo-50 border-purple-200 text-purple-800",
      ribbonColor: "bg-purple-400",
      message: "If you're reading this because you miss me, congratulations, we're both suffering. Now text me. Immediately. 😭💗 I'm probably also thinking about you and wondering what you're doing!",
      subtext: "Distance means nothing when someone means everything."
    },
    {
      id: "laugh",
      title: "Open when you need a laugh",
      emoji: "😂",
      color: "bg-gradient-to-br from-amber-100 to-orange-50 border-amber-200 text-amber-800",
      ribbonColor: "bg-amber-400",
      message: "Remember all the absolutely questionable decisions we've made together? Yeah... we probably need supervision. 😂 Also, remember that time you tripped over flat ground? Iconic behavior.",
      subtext: "Free therapy coupon (valid for 1 emergency gossip call)"
    },
    {
      id: "reminder",
      title: "Open when you need a reminder",
      emoji: "💌",
      color: "bg-gradient-to-br from-emerald-100 to-teal-50 border-emerald-200 text-emerald-800",
      ribbonColor: "bg-emerald-400",
      message: "In case you forgot: you're loved, you're important, you're capable, and I'm ridiculously proud of you. Stop doubting yourself for even one second. You've got this, always.",
      subtext: "You are stronger and softer than you give yourself credit for."
    }
  ] as SurpriseBox[],

  // 🌷 SECTION 6: THINGS I WANT FOR YOU THIS YEAR
  wishList: [
    { icon: "✨", text: "Endless Happiness", sub: "The kind that makes your cheeks hurt from smiling" },
    { icon: "🌸", text: "Peace of Mind", sub: "Zero overthinking, just gentle calm mornings" },
    { icon: "💗", text: "Pure & Real Love", sub: "Surrounded by people who genuinely adore you" },
    { icon: "🌙", text: "Beautiful Memories", sub: "Trips, late-night dinners, stargazing & laughs" },
    { icon: "🎓", text: "Big Success", sub: "Crushing every goal you set your heart on" },
    { icon: "💰", text: "Money Because Obviously", sub: "Enough to buy whatever we want with zero guilt" },
    { icon: "✈️", text: "Spontaneous Adventures", sub: "New cities, cozy cafes and sunset drives" },
    { icon: "🥹", text: "Lots of Reasons to Smile", sub: "Every single day of your brand new year" }
  ],

  // 👀 SECTION 7: A TINY FRIENDSHIP QUIZ
  quiz: {
    title: "How Well Do You Know Our Friendship? 💗",
    subtitle: "5 questions. 3 choices. One bestie. 👀",
    questions: [
      {
        id: 1,
        question: "01. Where did our friendship really begin? 🏫",
        options: [
          { text: "A. In college", comment: "Nope! Our roots go much deeper than that 🏫" },
          { text: "B. At school 🤍", comment: "YES! The golden school days where this sacred bond started 🤍" },
          { text: "C. Completely by accident", comment: "Maybe destiny, but definitely not by accident! ✨" }
        ]
      },
      {
        id: 2,
        question: "02. What is our most dangerous activity? 😂",
        options: [
          { text: "A. Studying together", comment: "1% actual studying, 99% laughing, snacking & gossiping 😂" },
          { text: "B. Going out for “just 10 minutes”", comment: "5 hours later... still not back home and eating again! 🕒" },
          { text: "C. Saying “let’s not laugh” and immediately laughing", comment: "Literally dying of laughter 0.5 seconds later in the quietest room! 💀" }
        ]
      },
      {
        id: 3,
        question: "03. When one of us says “I have something to tell you…” 👀",
        options: [
          { text: "A. It’s probably nothing", comment: "Absolute lies! It is ALWAYS high-priority breaking news 😂" },
          { text: "B. The conversation is about to be VERY long", comment: "Cancel every single appointment for the next 48 hours! 📞" },
          { text: "C. We should probably get snacks first", comment: "Spilling tea requires maximum high-carb emotional support snacks 🍿" }
        ]
      },
      {
        id: 4,
        question: "04. What describes our friendship best? 🫶🏻",
        options: [
          { text: "A. Calm & mature", comment: "Who are we fooling?! We are definitely NOT calm 😂" },
          { text: "B. Chaotic but unbreakable 😂", comment: "1000% FACTS! Pure chaos, zero drama, unbreakable for life 💕" },
          { text: "C. We have absolutely no idea what we're doing", comment: "Winged every single year together and somehow made it! 🫶🏻" }
        ]
      },
      {
        id: 5,
        question: "05. After all these years, what are we? 🥹",
        options: [
          { text: "A. Old school friends", comment: "Way beyond just school friends now! 🥹" },
          { text: "B. Best friends", comment: "Best friends doesn't even begin to describe it 🌸" },
          { text: "C. Basically family 🤍", comment: "Always and forever. You are my sister for life! 🤍🥹" }
        ]
      }
    ],
    completedBadge: "Friendship Status: UNBREAKABLE 🏆",
    completedMessage: "After all these years, you're not just my bestie — you're basically family. Happy Birthday Sailu! 🤍🥹"
  } as { title: string; subtitle: string; questions: QuizQuestion[]; completedBadge: string; completedMessage: string },

  // 🌷 SECTION 8: REASONS I'M GRATEFUL FOR YOU (TIMELINE)
  timeline: [
    {
      id: 1,
      tag: "Then",
      title: "The day we met",
      description: "Neither of us had any clue that a simple introduction would give me my lifetime partner in crime.",
      emoji: "🌱",
      date: "The beginning"
    },
    {
      id: 2,
      tag: "Then",
      title: "We became friends",
      description: "Small talks turned into long talks, and suddenly you were the first person I wanted to tell everything to.",
      emoji: "🌿",
      date: "Finding each other"
    },
    {
      id: 3,
      tag: "Then",
      title: "We became inseparable",
      description: "People stopped asking where one of us was without expecting the other to be right behind.",
      emoji: "🌸",
      date: "No turning back"
    },
    {
      id: 4,
      tag: "Then",
      title: "Too many memories happened",
      description: "Crying from laughter, surviving heartbreaks, silly road trips, and countless inside jokes that nobody else understands.",
      emoji: "📸",
      date: "The golden era"
    },
    {
      id: 5,
      tag: "Now",
      title: "You're one of my favorite people",
      description: "My safe space, my emergency contact in spirit, and the person who makes life so much softer and brighter.",
      emoji: "✨",
      date: "Today & always"
    },
    {
      id: 6,
      tag: "Forever",
      title: "More memories to come...",
      description: "Future travels, milestones, gray hair, still gossiping and being completely unserious together.",
      emoji: "♾️",
      date: "Forever & ever"
    }
  ] as TimelineMoment[],

  // 💌 SECTION 9: FINAL SURPRISE
  finalSurprise: {
    teaser: "Okay... one last thing.",
    buttonText: "Open the final letter 💗",
    letter: [
      "Happy Birthday, my best friend. 🥹",
      "Thank you for existing.",
      "Thank you for choosing me as your friend.",
      "Thank you for all the memories we've already made.",
      "And most importantly...",
      "This isn't the end of our story.",
      "We still have SO many stupid things to do, so many places to go, so many photos to take, so many things to laugh about, and probably several questionable decisions to make. 😂",
      "Here's to another year of us.",
      "I love you, bestie. Always. 💗"
    ],
    finalPhoto: getPublicAssetUrl("photos/hero.jpg"),
    finalPhotoFallback: sailuHeroImage,
    caption: "Forever us ♡"
  },

  // 🎶 AUDIO CONFIG
  music: {
    title: "Belong Together",
    artist: "Mark Ambor",
    customAudioUrl: getPublicAssetUrl("music/belong-together.mp3?v=full_2m28s"), // Full 2:28 "Belong Together" by Mark Ambor
    synthesizerEnabled: true
  }
};
