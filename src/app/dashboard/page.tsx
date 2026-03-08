/**
 * Sargam Dashboard - AI-Powered Music Lyrics Generator
 * SaaS-style dashboard with clean layout and custom color palette
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Copy,
  Download,
  RefreshCw,
  Loader2,
  Sparkles,
  Wand2,
  ChevronRight,
  FileText,
  Music,
  Menu,
  X,
  Disc3,
  Lightbulb,
  TrendingUp,
  Clock,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

type Genre = {
  id: string;
  name: string;
  icon: string;
  gradient: string;
};

type SongIdea = {
  id: string;
  title: string;
  description: string;
  emoji: string;
};

// ============================================================================
// STATIC DATA
// ============================================================================

const genres: Genre[] = [
  { id: "pop", name: "Pop", icon: "🎤", gradient: "from-pink-500 to-rose-500" },
  { id: "rock", name: "Rock", icon: "🎸", gradient: "from-red-500 to-orange-500" },
  { id: "hiphop", name: "Hip-Hop", icon: "🎧", gradient: "from-purple-500 to-indigo-500" },
  { id: "country", name: "Country", icon: "🤠", gradient: "from-amber-500 to-yellow-500" },
  { id: "rnb", name: "R&B", icon: "🎵", gradient: "from-violet-500 to-purple-500" },
  { id: "jazz", name: "Jazz", icon: "🎷", gradient: "from-slate-500 to-zinc-500" },
  { id: "electronic", name: "Electronic", icon: "🎹", gradient: "from-cyan-500 to-blue-500" },
  { id: "folk", name: "Folk", icon: "🪕", gradient: "from-emerald-500 to-teal-500" },
];

const sampleLyrics: Record<string, string> = {
  pop: `🎵 Verse 1:
Dancing through the city lights
Every moment feels so right
With you beside me, we can fly
Underneath the starlit sky

Pre-Chorus:
Hearts beating fast, we own the night
Together we're a beautiful sight

🎶 Chorus:
We're shining bright like diamonds gleam
Living out our wildest dream
In your arms, I found my home
With you, I'll never be alone`,
  rock: `🎸 Verse 1:
Broken guitars and midnight dreams
Chasing shadows, chasing schemes
The city burns beneath our feet
Nothing's gonna make us complete

Pre-Chorus:
Screaming loud into the void
Our voices join, we're never alone

🎶 Chorus:
We are the fire, we are the flame
Together we'll rise, we'll break the chain
Born to run, born to fight
We'll keep burning through the night`,
  hiphop: `🎧 Verse 1:
Yeah, started from the bottom now we're here
Breaking barriers, crushing all my fears
Words flow like water, sharp like steel
Every beat I spit, that's real

Pre-Chorus:
Mic in my hand, yeah I'm about to spit
Turning negative to positive, that's it

🎶 Chorus:
Rise up, hands up, never give up
We elevation, breaking all the obstacles
This my story, yeah I wrote it loud
Standing on top of the crowd`,
  default: `Your generated lyrics will appear here...
Start by describing your idea and selecting a genre!`,
};

const songIdeas: SongIdea[] = [
  { id: "1", title: "Midnight Drive", description: "A late night drive through the city", emoji: "🌙" },
  { id: "2", title: "Heartbreak", description: "Moving on after a breakup", emoji: "💔" },
  { id: "3", title: "Summer Love", description: "Falling in love in summer", emoji: "☀️" },
  { id: "4", title: "Chase Dreams", description: "Overcoming obstacles to achieve dreams", emoji: "🚀" },
  { id: "5", title: "Best Friends", description: "Celebrating friendship", emoji: "🎉" },
  { id: "6", title: "First Love", description: "The butterflies of first love", emoji: "💕" },
];

const navItems = [
  { id: "create", icon: Wand2, label: "Create", active: true },
  { id: "songs", icon: Music, label: "My Songs", badge: 24 },
  { id: "drafts", icon: FileText, label: "Drafts", badge: 4 },
  { id: "library", icon: Disc3, label: "Library" },
];

const statsCards = [
  { label: "Songs Created", value: "24", icon: Music, trend: "+12%" },
  { label: "This Week", value: "8", icon: TrendingUp, trend: "+3" },
  { label: "Drafts", value: "4", icon: FileText, trend: "" },
];

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("pop");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLyrics, setGeneratedLyrics] = useState("");
  const [showIdeas, setShowIdeas] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const lyrics = sampleLyrics[selectedGenre] || sampleLyrics.default;
    setGeneratedLyrics(lyrics);
    setIsGenerating(false);
    setHasGenerated(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLyrics);
  };

  const handleIdeaClick = (idea: SongIdea) => {
    setPrompt(`${idea.title} - ${idea.description}`);
    setShowIdeas(false);
  };

  const selectedGenreData = genres.find((g) => g.id === selectedGenre);

  return (
    <div className="min-h-screen bg-pale-sky-900">
      {/* ========================================================================
          SIDEBAR
      ======================================================================== */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 72 }}
        className="fixed left-0 top-16 bottom-0 bg-neutral-500 border-r border-lavender-600 z-40 flex flex-col shadow-sm"
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-teal rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform z-10"
        >
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
          />
        </button>

        <div className="p-4 border-b border-lavender-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
                <span className="text-jet-black font-semibold text-sm block truncate font-heading">Sargam</span>
                <span className="text-neutral-300 text-xs">AI Music Studio</span>
              </motion.div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                item.active
                  ? "bg-teal text-white shadow-sm"
                  : "text-jet-black hover:bg-lavender-700 hover:text-jet-black"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="font-medium flex-1 text-left truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        item.active ? "bg-white/20" : "bg-lavender-600 text-jet-black"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-lavender-600">
          <div className="flex items-center gap-3 p-2.5 bg-lavender-700 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white font-semibold text-xs shrink-0">
              U
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-jet-black text-sm font-medium truncate">User</p>
                <p className="text-teal text-xs font-medium flex items-center gap-1">
                  <span className="text-teal-700">★</span> Pro
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-20 right-4 z-50 p-2.5 bg-neutral-500 rounded-lg shadow-md border border-lavender-600"
      >
        {mobileMenuOpen ? <X className="w-5 h-5 text-jet-black" /> : <Menu className="w-5 h-5 text-jet-black" />}
      </button>

      {/* ========================================================================
          MAIN CONTENT
      ======================================================================== */}
      <div
        className={`transition-all duration-300 pt-16 min-h-screen flex flex-col ${
          sidebarOpen ? "lg:ml-[240px]" : "lg:ml-[72px]"
        }`}
      >
        {/* Stats Cards Row */}
        <div className="px-6 py-5 border-b border-lavender-600 bg-neutral-500">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statsCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-neutral-500 rounded-xl border border-lavender-600 p-4 hover:border-teal-800 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-jet-black-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-jet-black mt-0.5">{stat.value}</p>
                    {stat.trend && (
                      <p className="text-teal text-xs font-medium mt-1">{stat.trend}</p>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-pale-sky-700 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-teal" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 pb-44 overflow-y-auto">
          {!hasGenerated ? (
            <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal flex items-center justify-center mb-5 shadow-lg">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-jet-black mb-2 font-heading">How can I help you create today?</h2>
              <p className="text-jet-black-600 text-sm max-w-md mb-8">
                Describe your song idea below — love, heartbreak, celebration, or any emotion you want to express.
              </p>
              <div className="flex items-center gap-2 text-neutral-300 text-sm">
                <Clock className="w-4 h-4" />
                <span>Typically responds in seconds</span>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto bg-neutral-500 rounded-xl border border-lavender-600 shadow-sm overflow-hidden"
            >
              <div className="px-5 py-4 flex items-center justify-between border-b border-lavender-600 bg-pale-sky-900/50">
                <h3 className="font-semibold text-jet-black flex items-center gap-2 text-sm font-heading">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  Generated Lyrics
                  {selectedGenreData && (
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-medium bg-gradient-to-r ${selectedGenreData.gradient} text-white`}
                    >
                      {selectedGenreData.name}
                    </span>
                  )}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg text-jet-black hover:text-teal hover:bg-pale-sky-700 transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg text-jet-black hover:text-teal hover:bg-pale-sky-700 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="p-2 rounded-lg text-jet-black hover:text-teal hover:bg-pale-sky-700 transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <pre className="text-jet-black-600 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {generatedLyrics}
                </pre>
              </div>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-8"
            >
              <div className="flex items-center gap-3 bg-neutral-500 px-5 py-3 rounded-xl border border-lavender-600 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-teal" />
                <span className="text-jet-black text-sm font-medium">Generating your lyrics...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* ========================================================================
            BOTTOM INPUT BAR
        ======================================================================== */}
        <div
          className={`fixed bottom-0 left-0 right-0 lg:left-auto p-4 bg-neutral-500 border-t border-lavender-600 z-30 ${
            sidebarOpen ? "lg:left-[240px]" : "lg:left-[72px]"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="relative">
                <button
                  onClick={() => setShowIdeas(!showIdeas)}
                  className="flex items-center gap-2 px-3 py-2 bg-pale-sky-700 hover:bg-pale-sky-600 border border-pale-sky-400 rounded-lg text-teal text-sm font-medium transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  Need ideas?
                </button>
                <AnimatePresence>
                  {showIdeas && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      className="absolute bottom-full left-0 mb-2 w-64 bg-neutral-500 border border-lavender-500 rounded-xl shadow-lg overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-lavender-600">
                        <h3 className="text-jet-black font-semibold text-sm flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-teal-700" />
                          Song Ideas
                        </h3>
                      </div>
                      <div className="p-2 max-h-56 overflow-y-auto">
                        {songIdeas.map((idea) => (
                          <button
                            key={idea.id}
                            onClick={() => handleIdeaClick(idea)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-lavender-700 transition-colors text-left"
                          >
                            <span className="text-xl">{idea.emoji}</span>
                            <div className="min-w-0">
                              <p className="text-jet-black text-sm font-medium truncate">{idea.title}</p>
                              <p className="text-neutral-300 text-xs truncate">{idea.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedGenreData
                      ? `bg-gradient-to-r ${selectedGenreData.gradient} text-white`
                      : "bg-lavender-600 hover:bg-lavender-500 text-jet-black"
                  }`}
                >
                  {selectedGenreData && <span>{selectedGenreData.icon}</span>}
                  {selectedGenreData?.name || "Select Genre"}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${showGenreDropdown ? "rotate-90" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {showGenreDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      className="absolute bottom-full right-0 mb-2 w-44 bg-neutral-500 border border-lavender-500 rounded-xl shadow-lg overflow-hidden z-50"
                    >
                      <div className="p-2">
                        {genres.map((genre) => (
                          <button
                            key={genre.id}
                            onClick={() => {
                              setSelectedGenre(genre.id);
                              setShowGenreDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                              selectedGenre === genre.id ? "bg-pale-sky-700 text-teal font-medium" : "hover:bg-lavender-700 text-jet-black"
                            }`}
                          >
                            <span className="text-base">{genre.icon}</span>
                            {genre.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  placeholder="Describe your song idea... e.g., A heartbreak ballad about moving on"
                  className="w-full h-14 px-4 py-3 rounded-xl bg-pale-sky-900 border border-lavender-500 focus:border-teal focus:ring-2 focus:ring-pale-sky-700 outline-none resize-none text-sm text-jet-black placeholder-neutral-300 transition-all"
                />
              </div>
              <motion.button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-14 px-6 rounded-xl bg-teal text-white font-semibold text-sm shadow-md hover:shadow-lg hover:bg-teal-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate
                  </>
                )}
              </motion.button>
            </div>
            <p className="text-neutral-300 text-xs mt-2 text-center">
              Press Enter to generate • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
