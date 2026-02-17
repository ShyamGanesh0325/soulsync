import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import InputForm from './components/InputForm';
import StoryCard from './components/StoryCard';
import MatchList from './components/MatchList';
import SwipeView from './components/SwipeView';
import ChatWindow from './components/ChatWindow';
import Settings from './components/Settings';
import MatchCelebration from './components/MatchCelebration';
import LoadingOverlay from './components/LoadingOverlay';
import type { UserProfile, PredictionResponse } from './types';
import { predictCompatibility, getCurrentUser, type UserResponse, API_URL } from './api';
import { Sparkles, Settings as SettingsIcon } from 'lucide-react';
import axios from 'axios';

type View = 'login' | 'input' | 'prediction' | 'matches' | 'chat' | 'swipe' | 'bots';

interface Match {
  // ... (matches interface remains same)
  id: string;
  name: string;
  age: number;
  bio: string;
  compatibility_score: number;
  interests: string[];
  location: string;
  verified: boolean;
  photos?: string[];
  is_bot?: boolean;
  jobTitle?: string;
  school?: string;
  height?: number;
  aura?: string;
  lifestyle?: {
    smoking?: string;
    drinking?: string;
    fitness?: string;
  };
}

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [matchToCelebrate, setMatchToCelebrate] = useState<Match | null>(null);

  // Restore Session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser()
        .then((user: UserResponse) => {
          setUserData(user);
          setIsLoggedIn(true);
          loadMatches();
          setCurrentView('input');
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setCurrentView('login');
        });
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('input');
  };

  // Load matches when needed
  const loadMatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/matches`);
      setMatches(response.data.matches || []);
    } catch (err) {
      console.error('Error loading matches:', err);
    }
  };

  const handlePredict = async (profile: UserProfile) => {
    setLoading(true);
    setUserData(profile);
    try {
      await new Promise(r => setTimeout(r, 1500));
      const result = await predictCompatibility(profile);
      setPrediction(result);
      setCurrentView('prediction');
    } catch {
      alert("Failed to get prediction. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatches = () => {
    loadMatches();
    setCurrentView('swipe');
  };

  const handleSelectMatch = (matchId: string) => {
    setActiveMatchId(matchId);
    setCurrentView('chat');
  };

  const handleBackFromChat = () => {
    // Return to the previous list view (matches or bots) based on the active match
    const isBot = matches.find(m => m.id === activeMatchId)?.is_bot;
    setCurrentView(isBot ? 'bots' : 'matches');
    setActiveMatchId(null);
  };

  const handleReset = () => {
    setPrediction(null);
    setUserData(null);
    setCurrentView('input');
  };

  const handleSwipeRight = (matchId: string) => {
    console.log("Liked:", matchId);
    // Simulate a match discovery for "Souls Synchronized!"
    const matched = matches.find(m => m.id === matchId);
    if (matched && Math.random() > 0.3) { // 70% chance to "match" in this simulation
      setMatchToCelebrate(matched);
    }
  };

  const handleSwipeLeft = (matchId: string) => {
    console.log("Passed:", matchId);
  };

  // Get active match data
  const activeMatch = matches.find((m: Match) => m.id === activeMatchId);

  // Filter matches
  const regularMatches = matches.filter(m => !m.is_bot);
  const botMatches = matches.find(m => m.is_bot) ? matches.filter(m => m.is_bot) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-white dark:from-gray-900 dark:to-gray-800 font-sans text-gray-900 dark:text-white transition-colors duration-300">

      {/* Floating Settings Button - only show if logged in and not in swipe/chat */}
      {isLoggedIn && currentView !== 'swipe' && currentView !== 'chat' && (
        <button
          onClick={() => setSettingsOpen(true)}
          className="fixed top-6 right-6 z-40 bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200 dark:border-gray-700"
          title="Settings"
        >
          <SettingsIcon className="text-gray-700 dark:text-gray-300" size={24} />
        </button>
      )}

      {/* Settings Modal */}
      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {loading && <LoadingOverlay message="Syncing Souls..." />}
      </AnimatePresence>

      {/* Login Screen */}
      {currentView === 'login' && <Login onLogin={handleLogin} />}

      {/* Input Screen */}
      {currentView === 'input' && (
        <div className="container mx-auto px-4 py-12 flex flex-col items-center">
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm mb-4 border border-gray-100 dark:border-gray-700">
              <Sparkles className="text-primary" size={20} />
              <span className="text-[10px] sm:text-sm font-medium text-primary uppercase tracking-wider">AI Matchmaking</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Soul<span className="text-primary">Sync</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Discover your compatibility with the world using generic ML algorithms and pure vibez.
            </p>
          </header>

          <InputForm onSubmit={handlePredict} isLoading={loading} initialValues={userData} />

          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-3 text-sm font-medium">Want to warm up first?</p>
            <button
              onClick={() => {
                loadMatches();
                setCurrentView('bots');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-bold rounded-xl shadow-sm hover:shadow-md transition-all border border-purple-100 dark:border-gray-700 hover:scale-105"
            >
              <span>🤖</span>
              Practice with AI Mentors
            </button>
          </div>

          <footer className="mt-16 text-gray-400 dark:text-gray-500 text-sm focus:outline-none">
            Built with React + FastAPI + CatBoost
          </footer>
        </div>
      )}

      {/* Prediction Story Card */}
      {currentView === 'prediction' && prediction && userData && (
        <StoryCard
          userData={userData}
          prediction={prediction}
          onReset={handleReset}
          onStartMatching={handleViewMatches}
        />
      )}

      {/* Add "View Matches" button to Story Card */}

      {/* Match List View (Grid) */}
      {currentView === 'matches' && (
        <MatchList
          matches={regularMatches}
          onSelectMatch={handleSelectMatch}
          title="Your Alignments"
          subtitle="Souls that synchronize with your frequency ✨"
          onToggleView={() => setCurrentView('bots')}
          toggleLabel="Practice with AI →"
        />
      )}

      {/* Bots List View */}
      {currentView === 'bots' && (
        <MatchList
          matches={botMatches}
          onSelectMatch={handleSelectMatch}
          title="Practice Mode"
          subtitle="Hone your social skills with our AI mentors 🤖"
          onToggleView={() => prediction ? setCurrentView('matches') : setCurrentView('input')}
          toggleLabel={prediction ? "← Back to Matches" : "← Back to Home"}
        />
      )}

      {/* Swipe View (Discovery) */}
      {currentView === 'swipe' && (
        <SwipeView
          matches={regularMatches}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onViewDetail={(match) => {
            setActiveMatchId(match.id);
            setCurrentView('prediction'); // Reuse StoryCard for details
          }}
          onClose={() => setCurrentView('matches')}
        />
      )}

      {/* Chat Window */}
      {currentView === 'chat' && activeMatch && (
        <ChatWindow
          matchId={activeMatch.id}
          matchName={activeMatch.name}
          onBack={handleBackFromChat}
          isBot={activeMatch.is_bot}
        />
      )}

      {/* Match Celebration Overlay */}
      <AnimatePresence>
        {matchToCelebrate && (
          <MatchCelebration
            userName={userData?.name || "You"}
            matchName={matchToCelebrate.name}
            userPhoto={userData?.photos?.[0]}
            matchPhoto={matchToCelebrate.photos?.[0]}
            onClose={() => setMatchToCelebrate(null)}
            onChat={() => {
              setActiveMatchId(matchToCelebrate.id);
              setCurrentView('chat');
              setMatchToCelebrate(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
