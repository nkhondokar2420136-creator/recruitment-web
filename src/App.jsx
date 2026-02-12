// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  Gift, 
  Coffee, 
  Film, 
  Music, 
  Book, 
  Plane, 
  Star, 
  Moon, 
  Sun, 
  Camera, 
  MapPin, 
  Calendar, 
  Clock, 
  Send, 
  Volume2, 
  VolumeX,
  Cherry,
  Gem,
  Crown,
  Infinity,
  Feather,
  Compass
} from 'lucide-react';
import './App.css';

const App = () => {
  // IMPORTANT: Start with isAuthenticated = false to show login screen
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [herName, setHerName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [usedReasons, setUsedReasons] = useState([]);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [timeTogether, setTimeTogether] = useState('');
  const [compliment, setCompliment] = useState('');
  const [showLetter, setShowLetter] = useState(false);
  const [bucketList, setBucketList] = useState([]);
  const [konamiCode, setKonamiCode] = useState([]);
  const [showSecret, setShowSecret] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState([]);
  
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const { scrollYProgress } = useScroll();
  const containerRef = useRef(null);
  
  // Your surname - only for login
  const YOUR_SURNAME = 'Al-Hussain';
  
  // Her first name
  const HER_FIRST_NAME = 'Iqra';
  
  // Anniversary date
  const ANNIVERSARY_DATE = new Date('2024-11-28');
  
  // Beautiful Bengali-inspired nicknames
  const nicknames = [
    { name: 'জান', meaning: 'Jaan - Life', icon: '💝' },
    { name: 'মন', meaning: 'Mon - Heart', icon: '💗' },
    { name: 'আলো', meaning: 'Alo - Light', icon: '✨' },
    { name: 'চাঁদ', meaning: 'Chand - Moon', icon: '🌙' },
    { name: 'তারা', meaning: 'Tara - Star', icon: '⭐' },
    { name: 'সোনা', meaning: 'Shona - Gold', icon: '🌟' },
    { name: 'ময়না', meaning: 'Moyna - Songbird', icon: '🕊️' },
    { name: 'পাখি', meaning: 'Pakhi - Bird', icon: '🦋' }
  ];

  // Reasons I love you
  const reasons = [
    "The way your eyes crinkle when you smile, like the universe winking at me",
    "How you say my name, like it's the most important word in any language",
    "Your laugh that sounds like wind chimes on a summer afternoon",
    "The way you talk in your sleep, sharing secrets only I get to hear",
    "How you remember the smallest details about everyone you meet",
    "Your habit of collecting pretty leaves and pressing them in books",
    "The way you dance when you think no one is watching",
    "How you hum while cooking, creating music with every stir",
    "Your stubbornness that frustrates me but also inspires me",
    "The way you look at the stars and dream of infinite possibilities",
    "How you cry at happy endings because you believe in love that much",
    "Your handwriting that looks like poetry even when it's just a grocery list",
    "The way you gently correct my Bengali with so much patience",
    "How you light up when talking about your dreams for our future",
    "Your habit of saving the last bite of something delicious for me",
    "The way you scrunch your nose when you're concentrating",
    "How you sing Taylor Swift in the shower at full volume",
    "Your kindness that doesn't seek recognition or reward",
    "The way you make ordinary moments feel like celebrations",
    "How you believe in me even when I don't believe in myself"
  ];

  // Poetic compliments
  const compliments = [
    "You are the poetry I didn't know how to write",
    "Your smile is the sunrise of my every morning",
    "In a world of trends, you are a timeless classic",
    "You have a heart that deserves to be written about in novels",
    "Your presence is my favorite kind of peace",
    "You are the kind of beautiful that makes artists cry",
    "Your soul has the warmth of a thousand suns",
    "Loving you is like breathing - I don't think about it, I just do it",
    "You are the plot twist in my story I never saw coming",
    "Your voice is the melody my heart has been waiting for",
    "You are made of stardust and gentle dreams",
    "Your existence is proof that magic is real",
    "You have a way of making silence feel like conversation",
    "Your heart is the home my soul has been searching for",
    "You are the answer to prayers I never knew how to say"
  ];

  // Bucket list items
  const initialBucketList = [
    { id: 1, text: "Watch the cherry blossoms bloom in Japan", completed: false, icon: Cherry },
    { id: 2, text: "Get lost in the streets of Venice together", completed: false, icon: Compass },
    { id: 3, text: "Write our names in the sand on a secluded beach", completed: false, icon: Heart },
    { id: 4, text: "Read poetry to each other under the northern lights", completed: false, icon: Moon },
    { id: 5, text: "Take a train ride through the Swiss Alps", completed: false, icon: Plane },
    { id: 6, text: "Have a picnic under the cherry moon", completed: false, icon: Star },
    { id: 7, text: "Learn to cook each other's favorite childhood dishes", completed: false, icon: Coffee },
    { id: 8, text: "Star gaze in the Sahara desert", completed: false, icon: Star },
    { id: 9, text: "Visit a library and pick out books for each other", completed: false, icon: Book },
    { id: 10, text: "Watch the sunrise from a mountaintop", completed: false, icon: Sun }
  ];

  // Memories timeline
  const memories = [
    { 
      id: 1, 
      date: "November 28, 2024", 
      title: "The Day Our Stories Merged", 
      description: "I still remember exactly what you were wearing. I didn't know it then, but my life had just begun.",
      icon: "💕",
      color: "#ff6b6b"
    },
    { 
      id: 2, 
      date: "December 15, 2024", 
      title: "First 'I Love You'", 
      description: "Three words that changed everything. You said it softly, like a secret you were finally ready to share.",
      icon: "💗",
      color: "#ff8e8e"
    },
    { 
      id: 3, 
      date: "January 1, 2025", 
      title: "New Year, New Us", 
      description: "We watched fireworks and you leaned on my shoulder. I made a silent wish that every year would start with you.",
      icon: "✨",
      color: "#ffb3b3"
    },
    { 
      id: 4, 
      date: "February 14, 2025", 
      title: "Our First Valentine's", 
      description: "You said you didn't expect anything. The look on your face when you saw what I made will live in my heart forever.",
      icon: "🌹",
      color: "#ff9494"
    },
    { 
      id: 5, 
      date: "March 20, 2025", 
      title: "Spring Together", 
      description: "We planted flowers that somehow survived despite my terrible gardening. Like us, they grew anyway.",
      icon: "🌸",
      color: "#ffa07a"
    },
    { 
      id: 6, 
      date: "June 10, 2025", 
      title: "The Beach Day", 
      description: "You collected seashells in your dress pockets. I collected memories of you laughing at the waves.",
      icon: "🌊",
      color: "#87ceeb"
    }
  ];

  // Favorites gallery
  const favorites = [
    { category: "Movie", item: "Eternal Sunshine of the Spotless Mind", emoji: "🎬", icon: Film, color: "#ff6b6b" },
    { category: "Song", item: "Lover - Taylor Swift", emoji: "🎵", icon: Music, color: "#ff8e8e" },
    { category: "Food", item: "Sushi & Ramen", emoji: "🍜", icon: Coffee, color: "#ffb3b3" },
    { category: "Coffee", item: "Vanilla Latte with Oat Milk", emoji: "☕", icon: Coffee, color: "#8b4513" },
    { category: "Book", item: "The Seven Husbands of Evelyn Hugo", emoji: "📚", icon: Book, color: "#6b5b95" },
    { category: "Season", item: "Autumn - When the leaves change", emoji: "🍂", icon: Calendar, color: "#d2691e" },
    { category: "Animal", item: "Elephants - Gentle giants", emoji: "🐘", icon: Heart, color: "#708090" },
    { category: "Place", item: "The beach at sunset", emoji: "🌅", icon: MapPin, color: "#ff7f50" }
  ];

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Konami code sequence
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  // Initialize bucket list
  useEffect(() => {
    setBucketList(initialBucketList);
  }, []);

  // Calculate time together
  useEffect(() => {
    const diffTime = Math.abs(new Date() - ANNIVERSARY_DATE);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    setTimeTogether(`${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}, ${days} ${days === 1 ? 'day' : 'days'}`);
  }, []);

  // Custom cursor effect
  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      setCursorTrail(prev => [...prev.slice(-8), { x: e.clientX, y: e.clientY, id: Date.now() }]);
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKonamiCode(prev => {
        const newCode = [...prev, e.key];
        if (newCode.length > konamiSequence.length) {
          newCode.shift();
        }
        
        if (JSON.stringify(newCode) === JSON.stringify(konamiSequence)) {
          setShowSecret(true);
          setTimeout(() => setShowSecret(false), 5000);
        }
        
        return newCode;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scratch card initialization - ONLY when not authenticated
  useEffect(() => {
    if (canvasRef.current && !isAuthenticated) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = 400;
      canvas.height = 200;
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#ff6b6b');
      gradient.addColorStop(1, '#ff8e8e');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Gold sparkles
      ctx.fillStyle = '#ffd700';
      for (let i = 0; i < 200; i++) {
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          2,
          2
        );
      }
      
      ctx.font = 'bold 28px "Playfair Display", serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ SCRATCH HERE ✨', canvas.width/2, canvas.height/2);
    }
  }, [isAuthenticated]);

  // Track active section for animations - only when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sections.forEach((section, index) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        
        if (scrollPosition > top && scrollPosition < bottom) {
          setActiveSection(index);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated]);

  // Confetti timeout
  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [showConfetti]);

  // Name entry handler
  const handleNameSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('fullName');
    
    if (name.toLowerCase().includes(YOUR_SURNAME.toLowerCase())) {
      setHerName(name);
      setIsAuthenticated(true);
      setShowConfetti(true);
    } else {
      alert(`Only ${YOUR_SURNAME}s are allowed in this heart ❤️`);
    }
  };

  // Reason jar handler
  const getRandomReason = () => {
    const availableReasons = reasons.filter(r => !usedReasons.includes(r));
    if (availableReasons.length === 0) {
      setUsedReasons([]);
      const newReason = reasons[Math.floor(Math.random() * reasons.length)];
      setSelectedReason(newReason);
      setUsedReasons([newReason]);
    } else {
      const newReason = availableReasons[Math.floor(Math.random() * availableReasons.length)];
      setSelectedReason(newReason);
      setUsedReasons([...usedReasons, newReason]);
    }
  };

  // Scratch card handlers
  const startDrawing = (e) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    let scratchedPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) scratchedPixels++;
    }
    
    const percentage = (scratchedPixels / (canvas.width * canvas.height)) * 100;
    setScratchPercentage(percentage);
    if (percentage > 40 && !isScratched) setIsScratched(true);
  };

  const resetCard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#ff8e8e');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffd700';
    for (let i = 0; i < 200; i++) {
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }
    
    ctx.font = 'bold 28px "Playfair Display", serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH HERE ✨', canvas.width/2, canvas.height/2);
    
    setIsScratched(false);
    setScratchPercentage(0);
  };

  // Compliment generator
  const generateCompliment = () => {
    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    setCompliment(randomCompliment);
  };

  // Bucket list toggle
  const toggleBucketItem = (id) => {
    setBucketList(bucketList.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="app" ref={containerRef}>
      {/* Custom Cursor - Only show when authenticated */}
      {isAuthenticated && (
        <>
          <motion.div 
            className="custom-cursor"
            style={{ 
              left: cursorPosition.x - 15, 
              top: cursorPosition.y - 15,
              position: 'fixed',
              width: '30px',
              height: '30px',
              pointerEvents: 'none',
              zIndex: 99999
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            <Heart size={30} fill="#ff6b6b" color="#ff6b6b" />
          </motion.div>
          
          {/* Cursor Trail */}
          {cursorTrail.map((pos, i) => (
            <motion.div
              key={pos.id}
              className="cursor-trail"
              style={{
                left: pos.x - 8,
                top: pos.y - 8,
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 99998
              }}
              initial={{ opacity: 0.5, scale: 0.5 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.8 }}
            >
              <Heart size={16} fill={`rgba(255, 107, 107, ${0.3 - i * 0.03})`} color="transparent" />
            </motion.div>
          ))}
        </>
      )}

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* LOGIN SCREEN - This will show first because isAuthenticated starts as false */
          <motion.div 
            key="name-entry"
            className="name-entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated background gradient */}
            <div className="entry-gradient" />
            
            {/* Floating hearts */}
            <div className="floating-hearts">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="heart-bg"
                  initial={{ 
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                    rotate: Math.random() * 360,
                    scale: 0
                  }}
                  animate={{ 
                    y: -100,
                    rotate: 360,
                    scale: [0, 1, 0],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 8 + Math.random() * 8,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <Heart size={24 + i * 4} fill="rgba(255, 107, 107, 0.1)" color="#ff6b6b" />
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="entry-container"
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: 0.8 
              }}
            >
              <motion.div 
                className="entry-icon"
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1, 1.2, 1]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Gem size={80} color="#ff6b6b" strokeWidth={1.5} />
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                For My Valentine
              </motion.h1>
              
              <motion.p 
                className="subtitle"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Enter with your full name, beloved
              </motion.p>
              
              <form onSubmit={handleNameSubmit}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your Full Name"
                    className="name-input"
                    autoFocus
                  />
                </motion.div>
                
                <motion.button
                  type="submit"
                  className="enter-button"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={20} fill="white" color="white" />
                  <span>Open Your Heart</span>
                  <Sparkles size={20} color="white" />
                </motion.button>
              </form>
              
              <motion.p 
                className="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.8 }}
              >
                Just add my surname, my love 💕
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          /* MAIN WEBSITE - Only shows after successful login */
          <motion.div
            key="main-site"
            className="main-site"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Confetti Celebration */}
            {showConfetti && (
              <div className="confetti-container">
                {[...Array(80)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="confetti"
                    initial={{ 
                      y: -50, 
                      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                      rotate: 0,
                      scale: 0
                    }}
                    animate={{ 
                      y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
                      rotate: 720,
                      scale: [0, 1, 0.8, 1, 0]
                    }}
                    transition={{ 
                      duration: 4 + Math.random() * 2,
                      ease: "easeOut",
                      delay: Math.random() * 2
                    }}
                  >
                    {i % 3 === 0 ? (
                      <Heart size={20 + Math.random() * 10} fill={`hsl(${Math.random() * 60 + 320}, 80%, 70%)`} color="transparent" />
                    ) : i % 3 === 1 ? (
                      <Star size={20 + Math.random() * 10} fill={`hsl(${Math.random() * 60 + 40}, 80%, 70%)`} color="transparent" />
                    ) : (
                      <Sparkles size={20 + Math.random() * 10} color={`hsl(${Math.random() * 60 + 280}, 80%, 70%)`} />
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Secret Easter Egg */}
            {showSecret && (
              <motion.div 
                className="secret-easter-egg"
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <div className="secret-content">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Crown size={60} color="#ffd700" />
                  </motion.div>
                  <h3>✨ Secret Unlocked! ✨</h3>
                  <p>You found the Konami code, my little gamer</p>
                  <motion.div 
                    className="secret-message"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart size={24} fill="#ff6b6b" color="#ff6b6b" />
                    <span>I love you more than video games</span>
                    <Heart size={24} fill="#ff6b6b" color="#ff6b6b" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Floating Nicknames - Constellation */}
            <div className="nickname-constellation">
              {nicknames.map((nickname, i) => {
                const angle = (i / nicknames.length) * Math.PI * 2;
                const radius = 200 + i * 30;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={i}
                    className="nickname-star"
                    initial={{ 
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{ 
                      x: [0, x, x * 0.8, x],
                      y: [0, y, y * 0.8, y],
                      scale: 1,
                      opacity: 1
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 1.3,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="nickname-glow" />
                    <div className="nickname-icon">{nickname.icon}</div>
                    <div className="nickname-tooltip">
                      <span className="nickname-name">{nickname.name}</span>
                      <span className="nickname-meaning">{nickname.meaning}</span>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Constellation lines */}
              <svg className="constellation-lines" width="100%" height="100%">
                {nicknames.map((_, i) => {
                  const angle1 = (i / nicknames.length) * Math.PI * 2;
                  const radius1 = 200 + i * 30;
                  const x1 = Math.cos(angle1) * radius1 + (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
                  const y1 = Math.sin(angle1) * radius1 + (typeof window !== 'undefined' ? window.innerHeight / 2 : 500);
                  
                  const nextI = (i + 1) % nicknames.length;
                  const angle2 = (nextI / nicknames.length) * Math.PI * 2;
                  const radius2 = 200 + nextI * 30;
                  const x2 = Math.cos(angle2) * radius2 + (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
                  const y2 = Math.sin(angle2) * radius2 + (typeof window !== 'undefined' ? window.innerHeight / 2 : 500);
                  
                  return (
                    <motion.line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(255, 107, 107, 0.2)"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + i * 0.1 }}
                    />
                  );
                })}
              </svg>
            </div>

            {/* LANDING SECTION */}
            <section className="landing-section">
              <motion.div className="parallax-layer layer-1" style={{ y: y1 }} />
              <motion.div className="parallax-layer layer-2" style={{ y: y2 }} />
              <motion.div className="parallax-layer layer-3" style={{ y: y3 }} />
              
              <div className="landing-content">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, duration: 1.2 }}
                  className="hero-image-wrapper"
                >
                  <div className="hero-image-glow" />
                  <div className="hero-image-frame">
                    <div className="hero-image">
                      <div className="placeholder-photo">
                        <Camera size={60} color="#ff6b6b" />
                        <p className="photo-caption">Our story begins here</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Happy Valentine's Day,
                  <motion.span 
                    className="name-highlight"
                    animate={{ 
                      color: ['#ff6b6b', '#ff8e8e', '#ffb3b3', '#ff6b6b'],
                      textShadow: [
                        '0 0 20px rgba(255,107,107,0.3)',
                        '0 0 40px rgba(255,107,107,0.5)',
                        '0 0 20px rgba(255,107,107,0.3)'
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {' '}{HER_FIRST_NAME}
                  </motion.span>
                </motion.h1>
                
                <motion.div
                  className="time-container"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <div className="time-icon">
                    <Clock size={24} color="#ff8e8e" />
                  </div>
                  <div className="time-content">
                    <span className="time-label">Time since we became us:</span>
                    <span className="time-value">{timeTogether}</span>
                  </div>
                </motion.div>
                
                <motion.div
                  className="scroll-indicator"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ 
                    delay: 1.2, 
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <span>Discover our story</span>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart size={20} color="#ff8e8e" />
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* MEMORY TIMELINE */}
            <section className="timeline-section">
              <motion.h2 
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <span className="title-icon">
                  <Feather size={40} color="#ff8e8e" />
                </span>
                Our Journey Together
              </motion.h2>
              
              <div className="timeline-modern">
                {memories.map((memory, index) => {
                  return (
                    <motion.div 
                      key={memory.id}
                      className={`timeline-card ${index % 2 === 0 ? 'left' : 'right'}`}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 30 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: index * 0.15, type: "spring", damping: 15 }}
                    >
                      <div className="timeline-card-content" style={{ borderColor: memory.color }}>
                        <div className="timeline-card-icon" style={{ background: `linear-gradient(135deg, ${memory.color}, ${memory.color}dd)` }}>
                          <span className="timeline-emoji">{memory.icon}</span>
                        </div>
                        <div className="timeline-card-date">
                          <Calendar size={14} color={memory.color} />
                          <span>{memory.date}</span>
                        </div>
                        <h3>{memory.title}</h3>
                        <p>{memory.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* REASON JAR */}
            <section className="reason-jar-section">
              <motion.h2 
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="title-icon">
                  <Gem size={40} color="#ff8e8e" />
                </span>
                Reasons I Love You
              </motion.h2>
              
              <div className="jar-container-modern">
                <motion.div 
                  className="jar-modern"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  <div className="jar-glow" />
                  <div className="jar-lid-modern">
                    <motion.div 
                      className="lid-crystal"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        y: [0, -2, 2, 0]
                      }}
                      transition={{ duration: 6, repeat: Infinity }}
                    >
                      <Crown size={32} color="#ffd700" />
                    </motion.div>
                  </div>
                  <div className="jar-body-modern">
                    <div className="jar-glass" />
                    <div className="jar-content-modern">
                      <AnimatePresence mode="wait">
                        {selectedReason ? (
                          <motion.div
                            key={selectedReason}
                            className="reason-card"
                            initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                            exit={{ scale: 0, rotateY: -180, opacity: 0 }}
                            transition={{ type: "spring", damping: 20 }}
                          >
                            <div className="reason-card-inner">
                              <Heart size={24} fill="#ff6b6b" color="#ff6b6b" className="reason-icon" />
                              <p>{selectedReason}</p>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            className="jar-placeholder-modern"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="placeholder-stars">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 180, 360]
                                  }}
                                  transition={{ 
                                    duration: 3,
                                    delay: i * 0.2,
                                    repeat: Infinity 
                                  }}
                                >
                                  <Star size={24 + i * 4} fill="#ffd700" color="#ffd700" opacity={0.3} />
                                </motion.div>
                              ))}
                            </div>
                            <p>Gently touch the crystal to reveal a reason</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Floating hearts */}
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="floating-heart-modern"
                        initial={{ 
                          x: Math.random() * 300 - 150,
                          y: Math.random() * 400,
                          scale: 0,
                          opacity: 0
                        }}
                        animate={{ 
                          y: [-30, -60, -30],
                          scale: [0, 0.8, 0],
                          opacity: [0, 0.4, 0]
                        }}
                        transition={{
                          duration: 4 + Math.random() * 3,
                          repeat: Infinity,
                          delay: Math.random() * 5,
                          ease: "easeInOut"
                        }}
                      >
                        <Heart size={12 + Math.random() * 12} fill={`rgba(255, ${107 + Math.random() * 50}, ${107 + Math.random() * 50}, 0.2)`} color="transparent" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.button
                  className="pull-reason-modern"
                  onClick={getRandomReason}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Sparkles size={20} />
                  <span>Pull a New Reason</span>
                  <Heart size={20} />
                </motion.button>
                
                <motion.div 
                  className="reason-progress"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="progress-text">
                    <span>{usedReasons.length} reasons discovered</span>
                    <span>{reasons.length} total</span>
                  </div>
                  <div className="progress-bar-modern">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(usedReasons.length / reasons.length) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              </div>
            </section>

            {/* SCRATCH CARD */}
            <section className="scratch-card-section-modern">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="title-icon">
                  <Gift size={40} color="#ff8e8e" />
                </span>
                Scratch to Reveal Your Gift
              </motion.h2>
              
              <div className="scratch-container-modern">
                <div className="scratch-card-modern">
                  <AnimatePresence mode="wait">
                    {isScratched ? (
                      <motion.div
                        key="prize"
                        className="prize-content-modern"
                        initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        exit={{ scale: 0.8, opacity: 0, rotateY: -180 }}
                        transition={{ type: "spring", damping: 15 }}
                      >
                        <div className="prize-decoration">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            <Infinity size={80} color="#ffd700" opacity={0.2} />
                          </motion.div>
                        </div>
                        <div className="prize-icon-modern">
                          <Crown size={60} color="#ffd700" />
                        </div>
                        <h3>One Lifetime Supply of Love</h3>
                        <div className="prize-list">
                          <motion.div 
                            className="prize-item"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Heart size={18} fill="#ff6b6b" color="#ff6b6b" />
                            <span>Unlimited hugs</span>
                          </motion.div>
                          <motion.div 
                            className="prize-item"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Coffee size={18} color="#ff8e8e" />
                            <span>Breakfast in bed</span>
                          </motion.div>
                          <motion.div 
                            className="prize-item"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Film size={18} color="#ffb3b3" />
                            <span>Movie night of your choice</span>
                          </motion.div>
                          <motion.div 
                            className="prize-item"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Moon size={18} color="#87ceeb" />
                            <span>Bedtime stories forever</span>
                          </motion.div>
                        </div>
                        <motion.button
                          className="reset-button-modern"
                          onClick={resetCard}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Sparkles size={18} />
                          <span>Scratch Another Gift</span>
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="scratch"
                        className="scratch-area-modern"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="canvas-wrapper">
                          <canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                          />
                          <div className="canvas-overlay">
                            <Sparkles size={24} color="#ffffff" />
                            <span>Scratch Here</span>
                          </div>
                        </div>
                        <div className="scratch-progress-modern">
                          <div className="progress-info">
                            <span>{Math.min(Math.round(scratchPercentage), 100)}% revealed</span>
                          </div>
                          <div className="progress-track">
                            <motion.div 
                              className="progress-fill-modern"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(scratchPercentage, 100)}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* WORD CLOUD */}
            <section className="word-cloud-section-modern">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="title-icon">
                  <Star size={40} color="#ff8e8e" />
                </span>
                When I Think of You
              </motion.h2>
              
              <div className="word-cloud-artistic">
                {[
                  { word: 'Beautiful', size: 48, color: '#ff6b6b' },
                  { word: 'Smart', size: 42, color: '#ff8e8e' },
                  { word: 'Kind', size: 46, color: '#ffb3b3' },
                  { word: 'Strong', size: 40, color: '#ff9494' },
                  { word: 'Creative', size: 38, color: '#ffa07a' },
                  { word: 'Passionate', size: 44, color: '#ff7f50' },
                  { word: 'Sweet', size: 36, color: '#ff69b4' },
                  { word: 'Caring', size: 41, color: '#ff85a2' },
                  { word: 'Amazing', size: 50, color: '#ff6b8b' },
                  { word: 'Perfect', size: 39, color: '#ff8c8c' },
                  { word: 'Mine', size: 52, color: '#ff6b6b' },
                  { word: 'Dreamer', size: 37, color: '#ffa07a' },
                  { word: 'Gentle', size: 35, color: '#ffb6c1' },
                  { word: 'Radiant', size: 43, color: '#ffaa8a' }
                ].map((item, i) => {
                  const angle = (i / 14) * Math.PI * 2;
                  const radius = 200 + (i % 3) * 50;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <motion.div
                      key={item.word}
                      className="cloud-word-artistic"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ 
                        opacity: 1, 
                        scale: 1,
                        x: x,
                        y: y
                      }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: i * 0.05,
                        type: "spring",
                        damping: 15
                      }}
                      whileHover={{ 
                        scale: 1.3,
                        zIndex: 100,
                        transition: { duration: 0.2 }
                      }}
                      style={{
                        fontSize: `${item.size}px`,
                        color: item.color,
                        textShadow: `0 0 20px ${item.color}40`,
                        left: '50%',
                        top: '50%',
                        position: 'absolute',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {item.word}
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* FAVORITES GALLERY */}
            <section className="favorites-section-modern">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="title-icon">
                  <Compass size={40} color="#ff8e8e" />
                </span>
                Things You Love
              </motion.h2>
              
              <div className="favorites-grid-modern">
                {favorites.map((fav, index) => {
                  const IconComponent = fav.icon;
                  
                  return (
                    <motion.div
                      key={fav.category}
                      className="favorite-card-modern"
                      initial={{ opacity: 0, y: 30, rotateX: -15 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08, type: "spring", damping: 15 }}
                      whileHover={{ 
                        y: -10,
                        scale: 1.05,
                        boxShadow: `0 20px 40px ${fav.color}40`
                      }}
                      style={{ borderColor: fav.color }}
                    >
                      <div className="favorite-card-header" style={{ background: `linear-gradient(135deg, ${fav.color}20, transparent)` }}>
                        <div className="favorite-icon-wrapper" style={{ color: fav.color }}>
                          <IconComponent size={32} />
                        </div>
                        <span className="favorite-emoji">{fav.emoji}</span>
                      </div>
                      <div className="favorite-card-body">
                        <h3 style={{ color: fav.color }}>{fav.category}</h3>
                        <p>{fav.item}</p>
                      </div>
                      <div className="favorite-card-footer">
                        <Heart size={16} color={fav.color} fill={fav.color} opacity={0.3} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* FUTURE BUCKET LIST */}
            <section className="bucket-list-section-modern">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="title-icon">
                  <Compass size={40} color="#ff8e8e" />
                </span>
                Our Future Adventures
              </motion.h2>
              
              <div className="bucket-list-modern">
                {bucketList.map((item, index) => {
                  const IconComponent = item.icon;
                  
                  return (
                    <motion.div
                      key={item.id}
                      className={`bucket-item-modern ${item.completed ? 'completed' : ''}`}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: index * 0.05, type: "spring", damping: 18 }}
                      whileHover={{ x: 10 }}
                    >
                      <div className="bucket-item-content">
                        <div className="bucket-icon">
                          <IconComponent size={24} color={item.completed ? '#4caf50' : '#ff8e8e'} />
                        </div>
                        <span className="bucket-text">{item.text}</span>
                      </div>
                      <motion.button
                        className="bucket-check-modern"
                        onClick={() => toggleBucketItem(item.id)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {item.completed ? (
                          <Heart size={24} fill="#4caf50" color="#4caf50" />
                        ) : (
                          <Heart size={24} fill="transparent" color="#ff8e8e" />
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
              
              <motion.p 
                className="bucket-note-modern"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Every adventure begins with us, side by side
              </motion.p>
            </section>

            {/* LOVE LETTER */}
            <section className="love-letter-section-modern">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="title-icon">
                  <Feather size={40} color="#ff8e8e" />
                </span>
                A Letter For You
              </motion.h2>
              
              <motion.div 
                className="love-letter-container-modern"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="letter-paper">
                  <div className="letter-paper-texture" />
                  
                  <div className="letter-header-modern">
                    <span className="letter-date">February 14, 2026</span>
                    <motion.div 
                      className="letter-seal"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <Heart size={32} fill="#ff6b6b" color="#ff6b6b" />
                    </motion.div>
                  </div>
                  
                  <div className="letter-body-modern">
                    <h3 className="letter-salutation">My Dearest {HER_FIRST_NAME},</h3>
                    
                    <p>
                      I've written this letter a thousand times in my mind, but words still feel 
                      inadequate to capture what you mean to me. You are not just a chapter in my story - 
                      you have become the entire book.
                    </p>
                    
                    <p>
                      Before you, I thought I understood love. But you showed me that love isn't just 
                      about grand gestures or perfect moments. It's in the way you <motion.span 
                        className="highlight-text"
                        onClick={() => setShowLetter(!showLetter)}
                        whileHover={{ scale: 1.05 }}
                        style={{ cursor: 'pointer' }}
                      >
                        hold my hand
                      </motion.span> when I'm anxious. It's in the songs you hum while making tea. 
                      It's in the way you say my name like it's the most precious word you know.
                    </p>
                    
                    <AnimatePresence>
                      {showLetter && (
                        <motion.div 
                          className="letter-memory"
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ type: "spring", damping: 15 }}
                        >
                          <div className="memory-icon">
                            <Star size={24} fill="#ffd700" color="#ffd700" />
                          </div>
                          <p>Remember our first sunset together? You said the sky looked like it was painted just for us. Every sunset since, I think of you.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <p>
                      You have made me a believer in forever. Not in some abstract, distant future, 
                      but in the small eternities we create together - a shared glance across a crowded 
                      room, a quiet Sunday morning, a laugh that echoes into the night.
                    </p>
                    
                    <p>
                      This website is just a glimpse of the infinite ways I love you. Every line of code, 
                      every animation, every word - they're all whispers of a much louder truth: 
                      you are my home, my heart, my everything.
                    </p>
                    
                    <div className="letter-signature-modern">
                      <div className="signature-line">
                        <Feather size={20} color="#ff8e8e" />
                        <span>Forever yours</span>
                        <Feather size={20} color="#ff8e8e" />
                      </div>
                      <div className="signature-name">
                        [Your Name]
                        <Heart size={16} fill="#ff6b6b" color="#ff6b6b" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="letter-decoration">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="decoration-heart"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.5,
                          repeat: Infinity
                        }}
                      >
                        <Heart size={16 + i * 4} fill="#ff6b6b" color="transparent" opacity={0.1} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* COMPLIMENT GENERATOR */}
            <section className="compliment-section-modern">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="title-icon">
                  <Sparkles size={40} color="#ff8e8e" />
                </span>
                Need a Little Magic?
              </motion.h2>
              
              <motion.div 
                className="compliment-machine-modern"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", damping: 15 }}
              >
                <div className="machine-glow" />
                
                <div className="machine-content">
                  <AnimatePresence mode="wait">
                    {compliment ? (
                      <motion.div
                        key={compliment}
                        className="compliment-display-modern"
                        initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                        exit={{ scale: 0, rotateY: -180, opacity: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                      >
                        <div className="compliment-quote-mark">"</div>
                        <p>{compliment}</p>
                        <div className="compliment-quote-mark closing">"</div>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="compliment-placeholder-modern"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="placeholder-icon">
                          <motion.div
                            animate={{ 
                              rotate: [0, 180, 360],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ 
                              duration: 6,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            <Star size={48} fill="#ffd700" color="#ffd700" opacity={0.3} />
                          </motion.div>
                        </div>
                        <p>Press the button for a little magic</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <motion.button
                  className="compliment-button-modern"
                  onClick={generateCompliment}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles size={20} />
                  <span>Give Me Magic</span>
                  <Heart size={20} fill="white" color="white" />
                </motion.button>
                
                {compliment && (
                  <motion.div 
                    className="compliment-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span>{compliments.length} reasons you're extraordinary</span>
                  </motion.div>
                )}
              </motion.div>
            </section>

            {/* GIFT REVEAL */}
            <section className="gift-reveal-section-modern">
              <motion.div className="gift-container-modern">
                <motion.h2
                  className="section-title"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="title-icon">
                    <Gift size={40} color="#ff8e8e" />
                  </span>
                  One More Surprise...
                </motion.h2>
                
                <div className="gift-showcase">
                  <motion.div 
                    className="gift-box-modern"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", damping: 12 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="gift-lid-modern">
                      <motion.div 
                        className="gift-ribbon-modern"
                        animate={{ 
                          y: [0, -5, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <Crown size={32} color="#ffd700" />
                      </motion.div>
                    </div>
                    
                    <div className="gift-body-modern">
                      <div className="gift-pattern">
                        {[...Array(6)].map((_, i) => (
                          <Heart key={i} size={24} fill="#ffd700" color="transparent" opacity={0.2} />
                        ))}
                      </div>
                      
                      <div className="gift-bow-modern">
                        <div className="bow-left" />
                        <div className="bow-right" />
                        <div className="bow-center" />
                      </div>
                      
                      <motion.div 
                        className="gift-tag-modern"
                        animate={{ 
                          rotate: [-2, 2, -2],
                          x: [0, 3, -3, 0]
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                      >
                        <div className="tag-content">
                          <span className="tag-to">To: {HER_FIRST_NAME}</span>
                          <Heart size={12} fill="#ff6b6b" color="#ff6b6b" />
                          <span className="tag-from">From: Your Valentine</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="gift-message-modern"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="message-card">
                      <h3>Your real gift awaits...</h3>
                      
                      <div className="gift-hint-modern">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Heart size={32} fill="#ff6b6b" color="#ff6b6b" />
                        </motion.div>
                        <p className="hint-text">Check under your pillow</p>
                      </div>
                      
                      <div className="voucher-card">
                        <div className="voucher-decoration">
                          <Sparkles size={20} color="#ffd700" />
                          <Star size={16} fill="#ffd700" color="#ffd700" />
                          <Sparkles size={20} color="#ffd700" />
                        </div>
                        
                        <h4>One Special Date Night</h4>
                        <p className="voucher-description">Redeemable anytime, anywhere of your choosing</p>
                        
                        <div className="voucher-details">
                          <div className="detail-item">
                            <Film size={16} color="#ff8e8e" />
                            <span>Movie of your choice</span>
                          </div>
                          <div className="detail-item">
                            <Coffee size={16} color="#ff8e8e" />
                            <span>Dinner anywhere</span>
                          </div>
                          <div className="detail-item">
                            <Heart size={16} fill="#ff8e8e" color="#ff8e8e" />
                            <span>Unlimited hand-holding</span>
                          </div>
                        </div>
                        
                        <div className="voucher-validity">
                          <Infinity size={16} color="#ffd700" />
                          <span>Valid forever and always</span>
                          <Infinity size={16} color="#ffd700" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </section>

            {/* FOOTER */}
            <footer className="footer-modern">
              <motion.div
                className="footer-content"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="footer-hearts">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity
                      }}
                    >
                      <Heart size={24 + i * 4} fill="#ff6b6b" color="#ff6b6b" opacity={0.6 - i * 0.1} />
                    </motion.div>
                  ))}
                </div>
                
                <p className="footer-message">
                  Made with infinite love, just for you, {HER_FIRST_NAME}
                </p>
                
                <div className="footer-divider">
                  <Feather size={16} color="#ff8e8e" />
                  <span>✦</span>
                  <Feather size={16} color="#ff8e8e" />
                </div>
                
                <p className="footer-date">
                  Valentine's Day 2026 • Our first of many
                </p>
                
                <div className="footer-constellation">
                  {nicknames.slice(0, 3).map((nickname, i) => (
                    <span key={i} className="footer-nickname">
                      {nickname.icon} {nickname.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
