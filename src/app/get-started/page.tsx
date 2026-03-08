"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Mail, Lock, User, Check, Eye, EyeOff
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export default function GetStartedPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      login();
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Loading Overlay with Musical Wave */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center">
            {/* Musical Wave Animation */}
            <div className="flex items-end justify-center gap-1 h-16 mb-4">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-teal to-teal-700 rounded-full"
                  style={{
                    height: '20px',
                    animation: `wave 0.8s ease-in-out infinite`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-white text-lg font-medium">Creating your account...</p>
            <p className="text-teal-800 text-sm mt-2">Preparing your musical experience</p>
          </div>
        </div>
      )}

      {/* LEFT SIDE - Info with palette + Man listening to music */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-jet-black via-jet-black-400 to-teal text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Person listening to music"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-jet-black/90 via-jet-black-400/85 to-teal/90" />
        </div>

        {/* Gradient orbs for extra depth */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-700/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal/10 rounded-full blur-[80px]" />

        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center border border-white/30">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-medium">Sargam</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-3xl font-semibold leading-tight mb-4 font-heading">
            Create music with the power of AI
          </h1>
          <p className="text-pale-sky-600 text-base leading-relaxed mb-8">
            Join 10,000+ musicians who use Sargam to compose, arrange, and produce music faster than ever before.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex -space-x-2">
              {[{ name: 'Arjun', color: 'bg-red-500' }, { name: 'Priya', color: 'bg-green-500' }, { name: 'Kumar', color: 'bg-yellow-500' }, { name: 'Sarah', color: 'bg-purple-500' }].map((person, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${person.color} border-2 border-jet-black flex items-center justify-center text-white text-xs font-medium`}>
                  {person.name.charAt(0)}
                </div>
              ))}
            </div>
            <span className="text-sm text-pale-sky-500">Trusted by musicians worldwide</span>
          </div>

          {/* Benefits */}
          <ul className="space-y-3">
            {[
              "Generate melodies in seconds",
              "Professional arrangements", 
              "Export to any format",
              "Free to get started"
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 text-pale-sky-600 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-xs text-pale-sky-600/60">
            © 2024 Sargam. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12 bg-neutral-500">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-medium text-jet-black">Sargam</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold text-jet-black mb-2 font-heading">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-neutral-300 text-sm">
              {isLogin ? "Sign in to continue to your dashboard" : "Start creating music today"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex gap-1 p-1 bg-pale-sky-700 rounded-lg mb-6 w-fit">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                isLogin 
                  ? "bg-neutral-500 text-teal shadow-sm" 
                  : "text-teal hover:text-teal-600"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                !isLogin 
                  ? "bg-neutral-500 text-teal shadow-sm" 
                  : "text-teal hover:text-teal-600"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-jet-black mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-lg border border-lavender-500 focus:border-teal focus:ring-1 focus:ring-teal outline-none transition-colors text-jet-black placeholder-neutral-300"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-lavender-500 focus:border-teal focus:ring-1 focus:ring-teal outline-none transition-colors text-jet-black placeholder-neutral-300"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-jet-black">Password</label>
                {isLogin && (
                  <a href="#" className="text-sm text-teal hover:text-teal-600">
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-lavender-500 focus:border-teal focus:ring-1 focus:ring-teal outline-none transition-colors text-jet-black placeholder-neutral-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-jet-black transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-teal text-white font-medium hover:bg-teal-600 transition-all"
            >
              {isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-lavender-500"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-neutral-500 text-neutral-300">or continue with</span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-lavender-500 hover:bg-lavender-700 hover:border-teal-800 transition-colors text-sm font-medium text-jet-black">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-lavender-500 hover:bg-lavender-700 hover:border-teal-800 transition-colors text-sm font-medium text-jet-black">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-neutral-300">
            By continuing, you agree to our{" "}
            <a href="#" className="text-teal underline">Terms</a>
            {" "}and{" "}
            <a href="#" className="text-teal underline">Privacy</a>
          </p>

          {/* Demo Link */}
          <p className="mt-4 text-center text-sm text-jet-black-600">
            Just want to explore?{" "}
            <Link href="/logic" className="text-teal font-medium hover:underline">
              Try the demo
            </Link>
          </p>
        </div>
      </div>

      {/* Add wave animation keyframes */}
      <style jsx global>{`
        @keyframes wave {
          0%, 100% {
            height: 20px;
          }
          50% {
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
}
