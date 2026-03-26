"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { signIn } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    setEmail(emailFromUrl);
  }, [emailFromUrl]);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpDigits = otp.replace(/\D/g, "");
    if (!email || otpDigits.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Call backend directly (avoids NextAuth server→backend issues)
      const res = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otpDigits }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = typeof data.detail === "string" ? data.detail : "Invalid or expired OTP.";
        setError(msg);
        setIsLoading(false);
        return;
      }

      // Verify succeeded — sign in to NextAuth with the tokens (no backend call needed)
      const result = await signIn("credentials", {
        redirect: false,
        email: data.user?.email,
        password: "__verify_tokens__",
        mode: "verify_tokens",
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user_data: JSON.stringify(data.user),
      });

      if (result?.error) {
        setError("Verification succeeded but session failed. Please sign in.");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Network error. Ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    setError(null);
    setResendSuccess(false);

    try {
      const res = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.detail === "string" ? data.detail : "Failed to resend code.");
        return;
      }
      setResendSuccess(true);
    } catch {
      setError("Failed to resend code.");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-500 p-4">
        <div className="text-center">
          <p className="text-jet-black-600 mb-4">No email provided. Please sign up first.</p>
          <Link href="/get-started" className="text-teal hover:underline font-medium">
            Go to sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="flex items-end justify-center gap-1 h-16 mb-4">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-teal to-teal-700 rounded-full"
                  style={{
                    height: "20px",
                    animation: `wave 0.8s ease-in-out infinite`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-white text-lg font-medium">Verifying your email…</p>
          </div>
        </div>
      )}

      {/* Left side - branding */}
      <div
        className={`hidden lg:flex lg:w-[45%] p-12 flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0e7490] text-white"
            : "bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cffafe] text-[#0f172a]"
        }`}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Music"
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-br from-[#0f172a]/90 via-[#1e293b]/85 to-[#0e7490]/90"
                : "bg-gradient-to-br from-white/75 via-white/60 to-teal-200/50"
            }`}
          />
        </div>
        <div className="relative z-10">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 ${isDark ? "text-white" : "text-[#0f172a]"}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                isDark ? "bg-white/20 border-white/30" : "bg-[#0f172a]/15 border-[#0f172a]/30"
              }`}
            >
              <span className={`font-bold text-sm ${isDark ? "text-white" : "text-[#0f172a]"}`}>S</span>
            </div>
            <span className="text-lg font-medium">SargamAI</span>
          </Link>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className={`text-3xl font-semibold mb-4 font-heading ${isDark ? "text-white" : "text-[#0f172a]"}`}>
            Verify your email
          </h1>
          <p className={`text-base leading-relaxed ${isDark ? "text-white/90" : "text-[#1e293b]"}`}>
            We sent a 6-digit code to <strong>{email}</strong>. Enter it below to activate your account.
          </p>
        </div>
        <div className="relative z-10">
          <p className={`text-xs ${isDark ? "text-white/70" : "text-[#64748b]"}`}>© 2024 SargamAI</p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12 bg-neutral-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-jet-black">
              <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-medium">SargamAI</span>
            </Link>
          </div>

          <h2 className="text-2xl font-semibold text-jet-black font-heading mb-2">Enter verification code</h2>
          <p className="text-jet-black-600 text-sm mb-6">
            Check your inbox at {email} for the 6-digit code.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-jet-black mb-2">
                Verification code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 rounded-lg border-2 border-lavender-600 bg-lavender-800/50 text-jet-black text-center text-xl tracking-[0.4em] font-mono placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {resendSuccess && (
              <p className="text-sm text-teal flex items-center gap-2">
                <Check className="w-4 h-4" /> New code sent! Check your inbox.
              </p>
            )}

            <button
              type="submit"
              disabled={otp.length !== 6 || isLoading}
              className="w-full py-3 rounded-lg bg-teal text-white font-semibold hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Verify
            </button>

            <p className="text-center text-sm text-neutral-400">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-teal hover:underline font-medium disabled:opacity-50"
              >
                {resendLoading ? "Sending…" : "Resend code"}
              </button>
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-400">
            <Link href="/get-started" className="text-teal hover:underline">
              Back to sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
