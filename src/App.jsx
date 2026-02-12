// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './App.css';

const App = () => {
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
  const [nicknames] = useState(['Love', 'Baby', 'Sweetheart', 'Gorgeous', 'My World', 'Sunshine', 'Darling', 'Angel']);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState([]);
  
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const { scrollYProgress } = useScroll();
  
  // Your surname - CHANGE THIS
  const YOUR_SURNAME = 'Smith';
  
  // Anniversary date - CHANGE THIS
  const ANNIVERSARY_DATE = new Date('2023-01-15');
  
  // Reasons I love you
  const reasons = [
    "The way your eyes light up when you talk about something you're passionate about",
    "How you always remember the little details I mention in passing",
    "Your laugh that makes everyone around you smile",
    "The way you crinkle your nose when you're confused",
    "How you sing in the car even when you don't know the words",
    "Your stubbornness that drives me crazy but I secretly love",
    "The way you care for people without expecting anything back",
    "How you always know when I need a hug",
    "Your terrible puns that make me groan but secretly laugh",
    "The way you look when you first wake up",
    "How you talk to animals like they're people",
    "Your dedication to everything you do",
    "The way you make ordinary moments feel special",
    "How you always believe in me, even when I don't believe in myself",
    "Your smile that could light up the darkest room",
    "The way you dance when you think no one is watching",
    "How you remember everyone's birthday",
    "Your curiosity and love for learning new things",
    "The way you hold my hand in crowded places",
    "How you're still amazed by simple things like sunsets",
    "Your kindness to strangers",
    "The way you crinkle your nose when you're concentrating",
    "How you always find the best memes to send me",
    "Your passion for justice and equality",
    "The way you look at me like I'm the only person in the world"
  ];

  // Compliments for generator
  const compliments = [
    "You have the most beautiful smile I've ever seen",
    "You're smarter than you give yourself credit for",
    "Your presence makes any room brighter",
    "You have impeccable taste in music",
    "You're an amazing listener",
    "Your creativity inspires me every day",
    "You're stronger than you know",
    "You make ordinary moments feel magical",
    "Your laugh is my favorite sound",
    "You have a heart of gold",
    "You're absolutely gorgeous, inside and out",
    "You make me want to be a better person",
    "Your hugs are the best medicine",
    "You're my favorite notification",
    "You have the best sense of humor",
    "You're incredibly talented at everything you do",
    "Your kindness changes people's lives",
    "You're my greatest adventure",
    "You have the most amazing eyes",
    "You're perfectly imperfect in all the right ways"
  ];

  // Bucket list items
  const initialBucketList = [
    { id: 1, text: "Visit Japan during cherry blossom season", completed: false },
    { id: 2, text: "Take a cooking class together", completed: false },
    { id: 3, text: "Go stargazing in the desert", completed: false },
    { id: 4, text: "Learn to dance salsa", completed: false },
    { id: 5, text: "Road trip along the coast", completed: false },
    { id: 6, text: "See the Northern Lights", completed: false },
    { id: 7, text: "Have a picnic in Central Park", completed: false },
    { id: 8, text: "Go to a music festival", completed: false },
    { id: 9, text: "Take a hot air balloon ride", completed: false },
    { id: 10, text: "Write a book together", completed: false }
  ];

  // Memories timeline
  const memories = [
    { 
      id: 1, 
      date: "January 15, 2023", 
      title: "The Day We Met", 
      description: "I still remember what you were wearing. I didn't know then that I was meeting the love of my life.",
      icon: "💕"
    },
    { 
      id: 2, 
      date: "February 14, 2023", 
      title: "Our First Valentine's", 
      description: "We barely knew each other but I already knew you were special.",
      icon: "🌹"
    },
    { 
      id: 3, 
      date: "March 20, 2023", 
      title: "First Trip Together", 
      description: "Getting lost in that little beach town is still one of my favorite memories.",
      icon: "✈️"
    },
    { 
      id: 4, 
      date: "June 5, 2023", 
      title: "The Day You Became Mine", 
      description: "When you said yes, my heart grew three sizes.",
      icon: "💍"
    },
    { 
      id: 5, 
      date: "September 10, 2023", 
      title: "Our First Concert", 
      description: "You sang every word and I sang watching you.",
      icon: "🎵"
    },
    { 
      id: 6, 
      date: "December 25, 2023", 
      title: "First Christmas Together", 
      description: "Matching pajamas and too much hot chocolate.",
      icon: "🎄"
    }
  ];

  // Favorites gallery
  const favorites = [
    { category: "Movie", item: "Eternal Sunshine of the Spotless Mind", emoji: "🎬" },
    { category: "Song", item: "Lover - Taylor Swift", emoji: "🎵" },
    { category: "Food", item: "Sushi and Ramen", emoji: "🍜" },
    { category: "Coffee Order", item: "Vanilla Latte with Oat Milk", emoji: "☕" },
    { category: "Book", item: "The Seven Husbands of Evelyn Hugo", emoji: "📚" },
    { category: "Season", item: "Autumn", emoji: "🍂" },
    { category: "Animal", item: "Elephants", emoji: "🐘" },
    { category: "Place", item: "The beach at sunset", emoji: "🌅" }
  ];

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Konami code sequence
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [showConfetti]);

  useEffect(() => {
    const diffTime = Math.abs(new Date() - ANNIVERSARY_DATE);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    setTimeTogether(`${years} years, ${months} months, ${days} days`);
  }, []);

  useEffect(() => {
    setBucketList(initialBucketList);
  }, []);

  // Custom cursor effect
  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      setCursorTrail(prev => [...prev.slice(-15), { x: e.clientX, y: e.clientY, id: Date.now() }]);
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

  // Scratch card initialization
  useEffect(() => {
    if (canvasRef.current && !isAuthenticated) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = 400;
      canvas.height = 200;
      
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#a0a0a0';
      for (let i = 0; i < 1000; i++) {
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          2,
          2
        );
      }
      
      ctx.font = 'bold 24px Poppins';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SCRATCH HERE', canvas.width/2, canvas.height/2);
    }
  }, [isAuthenticated]);

  // Name entry handlers
  const handleNameSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('fullName');
    
    if (name.toLowerCase().includes(YOUR_SURNAME.toLowerCase())) {
      setHerName(name);
      setIsAuthenticated(true);
      setShowConfetti(true);
    } else {
      alert(`Only ${YOUR_SURNAME}s allowed here ❤️`);
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
    ctx.arc(x, y, 20, 0, Math.PI * 2);
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
    if (percentage > 30 && !isScratched) setIsScratched(true);
  };

  const resetCard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#a0a0a0';
    for (let i = 0; i < 1000; i++) {
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
    
    ctx.font = 'bold 24px Poppins';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', canvas.width/2, canvas.height/2);
    
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
    <div className="app">
      {/* Custom Cursor */}
      <div 
        className="custom-cursor"
        style={{ 
          left: cursorPosition.x - 10, 
          top: cursorPosition.y - 10,
          position: 'fixed',
          width: '20px',
          height: '20px',
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23ff6b6b\'%3E%3Cpath d=\'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\'/%3E%3C/svg%3E")',
          backgroundSize: 'contain',
          pointerEvents: 'none',
          zIndex: 99999
        }}
      />
      
      {/* Cursor Trail */}
      {cursorTrail.map((pos, i) => (
        <div
          key={pos.id}
          className="cursor-trail"
          style={{
            left: pos.x - 5,
            top: pos.y - 5,
            position: 'fixed',
            width: '10px',
            height: '10px',
            background: 'rgba(255, 107, 107, ' + (0.3 - i * 0.02) + ')',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 99998
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* NAME ENTRY SCREEN */
          <motion.div 
            key="name-entry"
            className="name-entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Floating hearts background */}
            <div className="floating-hearts">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="heart-bg"
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: 0.5 + Math.random() * 1.5,
                    opacity: 0.6
                  }}
                  animate={{ 
                    y: -300,
                    opacity: [0.6, 0.4, 0.2, 0]
                  }}
                  transition={{
                    duration: 10 + Math.random() * 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  ❤️
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="entry-container"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", duration: 1 }}
            >
              <motion.h1
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255,107,107,0.3)",
                    "0 0 40px rgba(255,107,107,0.6)",
                    "0 0 20px rgba(255,107,107,0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                For My Valentine
              </motion.h1>
              
              <p className="subtitle">Enter your full name to enter...</p>
              
              <form onSubmit={handleNameSubmit}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your Full Name"
                  className="name-input"
                  autoFocus
                />
                
                <motion.button
                  type="submit"
                  className="enter-button"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,107,107,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Open Your Valentine's Gift
                  <span className="button-heart">❤️</span>
                </motion.button>
              </form>
              
              <motion.p 
                className="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1 }}
              >
                Hint: You'll need my surname 💕
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          /* MAIN WEBSITE */
          <motion.div
            key="main-site"
            className="main-site"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti */}
            {showConfetti && (
              <div className="confetti-container">
                {[...Array(100)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="confetti"
                    initial={{ 
                      y: -100, 
                      x: Math.random() * window.innerWidth,
                      rotate: 0 
                    }}
                    animate={{ 
                      y: window.innerHeight + 100,
                      rotate: 360 * 5
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 2,
                      ease: "linear",
                      delay: Math.random() * 2
                    }}
                    style={{
                      background: `hsl(${Math.random() * 360}, 100%, 70%)`,
                      left: Math.random() * 100 + "%"
                    }}
                  />
                ))}
              </div>
            )}

            {/* Secret Easter Egg */}
            {showSecret && (
              <motion.div 
                className="secret-easter-egg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <div className="secret-content">
                  <span className="secret-icon">🥚</span>
                  <h3>✨ Secret Unlocked! ✨</h3>
                  <p>You found the Konami code! You're officially a legend.</p>
                  <p className="secret-message">I love you more than video games... almost 😉</p>
                </div>
              </motion.div>
            )}

            {/* Floating Nicknames */}
            <div className="floating-nicknames">
              {nicknames.map((nickname, i) => (
                <motion.div
                  key={i}
                  className="nickname-bubble"
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: 0
                  }}
                  animate={{ 
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: 0.8 + Math.random() * 0.5
                  }}
                  transition={{
                    duration: 20 + Math.random() * 10,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  {nickname}
                </motion.div>
              ))}
            </div>

            {/* LANDING SECTION */}
            <section className="landing-section">
              <motion.div className="parallax-layer layer-1" style={{ y: y1 }} />
              <motion.div className="parallax-layer layer-2" style={{ y: y2 }} />
              
              <div className="landing-content">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 1.5 }}
                  className="hero-image"
                >
                  <div className="photo-frame">
                    <div className="placeholder-photo">
                      <span>📸</span>
                      <p className="photo-caption">Our photo here</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.h1
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  style={{ opacity }}
                >
                  Happy Valentine's Day,{' '}
                  <motion.span
                    animate={{ 
                      color: ['#ff6b6b', '#ff8e8e', '#ffb3b3', '#ff6b6b']
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {herName.split(' ')[0]}
                  </motion.span>
                </motion.h1>
                
                <motion.p
                  className="time-together"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <span className="label">Time since we became us:</span>
                  <span className="time">{timeTogether}</span>
                </motion.p>
                
                <motion.div
                  className="scroll-indicator"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                >
                  <span>Scroll down for more love</span>
                  <div className="arrow">↓</div>
                </motion.div>
              </div>
            </section>

            {/* MEMORY TIMELINE */}
            <section className="timeline-section">
              <motion.h2 
                className="section-title"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Our Journey Together
              </motion.h2>
              
              <div className="timeline">
                {memories.map((memory, index) => (
                  <motion.div 
                    key={memory.id}
                    className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="timeline-content">
                      <div className="timeline-icon">{memory.icon}</div>
                      <div className="timeline-date">{memory.date}</div>
                      <h3>{memory.title}</h3>
                      <p>{memory.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* REASON JAR */}
            <section className="reason-jar-section">
              <motion.h2 
                className="section-title"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Reasons I Love You
              </motion.h2>
              
              <div className="jar-container">
                <motion.div 
                  className="jar"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", duration: 1 }}
                >
                  <div className="jar-lid">
                    <motion.div 
                      className="lid-handle"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </div>
                  <div className="jar-body">
                    <div className="jar-content">
                      <AnimatePresence mode="wait">
                        {selectedReason ? (
                          <motion.div
                            key={selectedReason}
                            className="reason-paper"
                            initial={{ scale: 0, rotate: 180, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: -180, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.6 }}
                          >
                            <p>{selectedReason}</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            className="jar-placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <span>❤️</span>
                            <p>Click the lid to pull out a reason</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="floating-heart-jar"
                        initial={{ 
                          x: Math.random() * 100 - 50,
                          y: Math.random() * 200,
                          opacity: 0.3,
                          scale: 0.5 + Math.random()
                        }}
                        animate={{ 
                          y: [-20, -40, -20],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      >
                        ❤️
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.button
                  className="pull-reason"
                  onClick={getRandomReason}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="pull-icon">🎯</span>
                  Pull a New Reason
                </motion.button>
                
                <motion.p className="reason-counter">
                  {usedReasons.length} / {reasons.length} reasons discovered
                </motion.p>
              </div>
            </section>

            {/* SCRATCH CARD */}
            <section className="scratch-card-section">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Scratch to Reveal Your Gift
              </motion.h2>
              
              <div className="scratch-container">
                <div className="scratch-card-wrapper">
                  <div className="prize-reveal">
                    <AnimatePresence mode="wait">
                      {isScratched ? (
                        <motion.div
                          key="prize"
                          className="prize-content"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", duration: 0.6 }}
                        >
                          <div className="prize-icon">🎁</div>
                          <h3>One Lifetime Supply of Love</h3>
                          <p>Plus:</p>
                          <ul>
                            <li>✨ Unlimited hugs</li>
                            <li>🍳 Breakfast in bed</li>
                            <li>🎬 Movie night of your choice</li>
                            <li>💆‍♀️ Shoulder massage whenever you want</li>
                            <li>☕ Morning coffee made just for you</li>
                            <li>📚 Unlimited bedtime stories</li>
                          </ul>
                          <motion.button
                            className="reset-button"
                            onClick={resetCard}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Scratch Again
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="scratch"
                          className="scratch-area"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
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
                          <div className="scratch-progress">
                            <div 
                              className="progress-bar"
                              style={{ width: `${Math.min(scratchPercentage, 100)}%` }}
                            />
                            <span>{Math.min(Math.round(scratchPercentage), 100)}% scratched</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>

            {/* WORD CLOUD */}
            <section className="word-cloud-section">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                When I Think of You
              </motion.h2>
              
              <div className="word-cloud">
                {['Beautiful', 'Smart', 'Funny', 'Kind', 'Strong', 'Creative', 'Passionate', 'Sweet', 'Caring', 'Amazing', 'Perfect', 'Mine'].map((word, i) => (
                  <motion.span
                    key={word}
                    className="cloud-word"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.3, color: '#ff6b6b' }}
                    style={{
                      fontSize: `${Math.random() * 30 + 20}px`,
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 80 + 10}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      rotate: `${Math.random() * 30 - 15}deg`
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </section>

            {/* FAVORITES GALLERY */}
            <section className="favorites-section">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Things You Love
              </motion.h2>
              
              <div className="favorites-grid">
                {favorites.map((fav, index) => (
                  <motion.div
                    key={fav.category}
                    className="favorite-card"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.1,
                      boxShadow: "0 0 30px rgba(255,107,107,0.3)",
                      rotate: [0, -2, 2, 0]
                    }}
                  >
                    <div className="favorite-emoji">{fav.emoji}</div>
                    <h3>{fav.category}</h3>
                    <p>{fav.item}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FUTURE BUCKET LIST */}
            <section className="bucket-list-section">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Our Future Adventures
              </motion.h2>
              
              <div className="bucket-list">
                {bucketList.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={`bucket-item ${item.completed ? 'completed' : ''}`}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div 
                      className="bucket-check"
                      onClick={() => toggleBucketItem(item.id)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {item.completed ? '✅' : '⬜'}
                    </motion.div>
                    <span className="bucket-text">{item.text}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.p 
                className="bucket-note"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Click the boxes to check off our adventures! 💕
              </motion.p>
            </section>

            {/* LOVE LETTER */}
            <section className="love-letter-section">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                A Letter For You
              </motion.h2>
              
              <motion.div 
                className="love-letter-container"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="love-letter"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(255,107,107,0.4)" }}
                >
                  <div className="letter-header">
                    <span className="letter-date">February 14, 2026</span>
                    <span className="letter-salutation">My Dearest {herName.split(' ')[0]},</span>
                  </div>
                  
                  <div className="letter-body">
                    <p>
                      I've tried to write this letter a hundred times in my head, but words always feel too small 
                      to capture what I feel when I think of you. So instead of trying to find the perfect words, 
                      I just want you to know this:
                    </p>
                    
                    <p>
                      Before you, I didn't know what it felt like to be truly seen. You don't just look at me - 
                      you <span className="highlight" onClick={() => setShowLetter(!showLetter)}>see me</span>. 
                      Every quirk, every flaw, every weird habit - and somehow, you love me more because of them.
                    </p>
                    
                    <AnimatePresence>
                      {showLetter && (
                        <motion.div 
                          className="letter-popup"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <span className="popup-icon">👀</span>
                          <p>The way you see the best in me even when I don't see it myself. That's your superpower.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <p>
                      You've made me a believer in love stories. Not the fairy tale kind, but the real kind - 
                      the kind that's messy and beautiful and chooses each other every single day.
                    </p>
                    
                    <p>
                      This website is just a small glimpse of how much you mean to me. Every memory, every reason, 
                      every little detail - they're all threads in the tapestry of us. And I can't wait to see 
                      what we weave next.
                    </p>
                    
                    <p className="letter-signature">
                      Forever yours,<br />
                      [Your Name] ❤️
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </section>

            {/* COMPLIMENT GENERATOR */}
            <section className="compliment-section">
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Need a Pick-Me-Up?
              </motion.h2>
              
              <motion.div 
                className="compliment-container"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="compliment-machine"
                  animate={{ 
                    boxShadow: compliment ? [
                      "0 0 30px rgba(255,107,107,0.3)",
                      "0 0 60px rgba(255,107,107,0.6)",
                      "0 0 30px rgba(255,107,107,0.3)"
                    ] : "0 0 30px rgba(255,107,107,0.2)"
                  }}
                  transition={{ duration: 1.5, repeat: compliment ? Infinity : 0 }}
                >
                  <AnimatePresence mode="wait">
                    {compliment ? (
                      <motion.div
                        key={compliment}
                        className="compliment-display"
                        initial={{ scale: 0, rotateX: 90 }}
                        animate={{ scale: 1, rotateX: 0 }}
                        exit={{ scale: 0, rotateX: -90 }}
                        transition={{ type: "spring" }}
                      >
                        <span className="compliment-quote">"</span>
                        <p>{compliment}</p>
                        <span className="compliment-quote">"</span>
                      </motion.div>
                    ) : (
                      <motion.p className="compliment-placeholder">
                        Press the button for a compliment 💝
                      </motion.p>
                    )}
                  </AnimatePresence>
                  
                  <motion.button
                    className="compliment-button"
                    onClick={generateCompliment}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="button-icon">✨</span>
                    Give Me Love
                    <span className="button-icon">✨</span>
                  </motion.button>
                  
                  {compliment && (
                    <motion.p 
                      className="compliment-counter"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                    >
                      One of {compliments.length} reasons you're amazing
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            </section>

            {/* GIFT REVEAL */}
            <section className="gift-reveal-section">
              <motion.div className="gift-container">
                <motion.h2
                  className="section-title"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  One More Surprise...
                </motion.h2>
                
                <motion.div 
                  className="gift-box"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    rotate: [0, -5, 5, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <div className="gift-lid">
                    <motion.div 
                      className="gift-ribbon"
                      animate={{ 
                        y: [0, -3, 0],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                  <div className="gift-body">
                    <div className="gift-bow" />
                    <div className="gift-tag">
                      <span>To: {herName.split(' ')[0]}</span>
                      <span>From: Your Valentine</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="gift-message"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <h3>Your real gift is waiting...</h3>
                  <p className="gift-hint">Check under your pillow 💝</p>
                  <div className="gift-voucher">
                    <h4>🎀 One Special Date Night 🎀</h4>
                    <p>Redeemable anytime, anywhere of your choosing</p>
                    <p className="voucher-details">Includes: Dinner, movie, and unlimited hand-holding</p>
                  </div>
                </motion.div>
              </motion.div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <p>Made with 💕 just for you, {herName.split(' ')[0]}</p>
                <p className="footer-date">Valentine's Day 2026</p>
                <div className="footer-hearts">
                  ❤️ ❤️ ❤️
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
