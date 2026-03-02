import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import InputForm from './components/InputForm';
import StoryCard from './components/StoryCard';
import MatchList from './components/MatchList';
import SwipeView from './components/SwipeView';
import ChatWindow from './components/ChatWindow';
import Settings from './components/Settings';
import Filters from './components/Filters';
import MatchCelebration from './components/MatchCelebration';
import LoadingOverlay from './components/LoadingOverlay';
import type { UserProfile, PredictionResponse } from './types';
import api, { predictCompatibility, getCurrentUser, type UserResponse, API_URL } from './api';
import { Sparkles, Settings as SettingsIcon, Filter } from 'lucide-react';

type View = 'login' | 'input' | 'prediction' | 'matches' | 'chat' | 'swipe' | 'bots';

interface Match {
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [matchToCelebrate, setMatchToCelebrate] = useState<Match | null>(null);

  // Restore Session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser()
        .then((user: UserResponse) => {
          setUserData(user);
          setIsLoggedIn(true);
          loadMatches(user);
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

  const handleLogout = () => {
    console.log("👋 Logging out, clearing session...");
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    setMatches([]);
    setCurrentView('login');
  };

  // Load matches when needed
  const loadMatches = async (userOverride?: UserProfile | null) => {
    const user = userOverride || userData;
    try {
      const params = {
        min_age: user?.min_age_pref,
        max_age: user?.max_age_pref,
        min_compatibility: user?.min_compatibility,
        required_love_language: user?.required_love_language,
        min_openness: user?.min_openness,
        min_extroversion: user?.min_extroversion,
        min_agreeableness: user?.min_agreeableness,
        min_neuroticism: user?.min_neuroticism,
        min_conscientiousness: user?.min_conscientiousness
      };
      const response = await api.get('/matches', { params });
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
    const matched = matches.find(m => m.id === matchId);
    if (matched && Math.random() > 0.3) {
      setMatchToCelebrate(matched);
    }
  };

  const handleSwipeLeft = (matchId: string) => {
    console.log("Passed:", matchId);
  };

  const activeMatch = matches.find((m: Match) => m.id === activeMatchId);
  const regularMatches = matches.filter(m => !m.is_bot);
  const botMatches = matches.find(m => m.is_bot) ? matches.filter(m => m.is_bot) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-white dark:from-gray-900 dark:to-gray-800 font-sans text-gray-900 dark:text-white transition-colors duration-300">

      {/* Action Buttons - fixed top-right */}
      {isLoggedIn && currentView !== 'swipe' && currentView !== 'chat' && (
        <div className="fixed top-6 right-6 z-[60] flex gap-4">
          <button
            onClick={() => setFiltersOpen(true)}
            className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200 dark:border-gray-700 pointer-events-auto"
            title="Discovery Filters"
          >
            <Filter className="text-gray-700 dark:text-gray-300" size={24} />
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200 dark:border-gray-700 pointer-events-auto"
            title="Settings"
          >
            <SettingsIcon className="text-gray-700 dark:text-gray-300" size={24} />
          </button>
        </div>
      )}

      <AnimatePresence>
        {loading && <LoadingOverlay message="Syncing Souls..." />}
      </AnimatePresence>

      {currentView === 'login' && <Login onLogin={handleLogin} />}

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
        </div>
      )}

      {currentView === 'prediction' && prediction && userData && (
        <StoryCard
          userData={userData}
          prediction={prediction}
          onReset={handleReset}
          onStartMatching={handleViewMatches}
        />
      )}

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

      {currentView === 'swipe' && (
        <SwipeView
          matches={regularMatches}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onViewDetail={(match) => {
            setActiveMatchId(match.id);
            setCurrentView('prediction');
          }}
          onClose={() => setCurrentView('matches')}
        />
      )}

      {currentView === 'chat' && activeMatch && (
        <ChatWindow
          matchId={activeMatch.id}
          matchName={activeMatch.name}
          onBack={handleBackFromChat}
          isBot={activeMatch.is_bot}
        />
      )}

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
      <AnimatePresence mode="wait">
        {settingsOpen && (
          <Settings
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            onLogout={handleLogout}
            onUpdate={(updatedUser) => setUserData(updatedUser)}
          />
        )}
        {filtersOpen && (
          <Filters
            isOpen={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            onUpdate={(updatedUser) => {
              setUserData(updatedUser);
              loadMatches(updatedUser); // Reload matches with new filter preferences
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
