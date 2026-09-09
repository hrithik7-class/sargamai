"use client";

import { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, BadgeCheck, Sparkles, Crown, Zap, X,
  Loader2, ChevronDown, Star, ArrowRight, Users, Music, Shield,
} from "lucide-react";
import { createLemonSqueezyCheckout, createRazorpayOrder, ApiError } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* ─── types & data ───────────────────────────────────── */

type Plan = {
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  annualMonthly: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
  icon: React.ReactNode;
  planSlug?: "pro" | "studio";
  highlight?: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    priceMonthly: "$0",
    priceAnnual: "$0",
    annualMonthly: "$0",
    period: "forever",
    description: "Perfect for exploring AI songwriting.",
    icon: <Sparkles className="w-5 h-5" />,
    highlight: "Free forever",
    features: [
      "5 lyrics generations / month",
      "10 genres available",
      "Standard generation speed",
      "Export to .txt",
      "Community support",
    ],
    cta: "Start Free",
  },
  {
    name: "Pro",
    priceMonthly: "$12",
    priceAnnual: "$96",
    annualMonthly: "$8",
    period: "month",
    description: "For serious songwriters who create daily.",
    popular: true,
    icon: <Crown className="w-5 h-5" />,
    highlight: "7-day free trial",
    features: [
      "Unlimited generations",
      "All 50+ genres & styles",
      "Priority generation speed",
      "Export PDF, DOC & TXT",
      "Save & organise songs",
      "AI edit & refine",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    planSlug: "pro",
  },
  {
    name: "Studio",
    priceMonthly: "$29",
    priceAnnual: "$232",
    annualMonthly: "$19",
    period: "month",
    description: "For professionals and creative teams.",
    icon: <Zap className="w-5 h-5" />,
    highlight: "Most powerful",
    features: [
      "Everything in Pro",
      "Bulk generation (50 at once)",
      "Full API access",
      "Custom style training",
      "Team collaboration (5 seats)",
      "Advanced analytics",
      "Dedicated account manager",
      "24/7 priority support",
    ],
    cta: "Get Studio",
    planSlug: "studio",
  },
];

const COMPARE = [
  { feature: "Generations / month", starter: "5",         pro: "Unlimited",  studio: "Unlimited"  },
  { feature: "Genres",              starter: "10",        pro: "50+",        studio: "50+"        },
  { feature: "Export formats",      starter: "TXT",       pro: "PDF, DOC, TXT", studio: "All"    },
  { feature: "AI editing",          starter: false,       pro: true,         studio: true         },
  { feature: "Saved songs",         starter: "10",        pro: "Unlimited",  studio: "Unlimited"  },
  { feature: "API access",          starter: false,       pro: false,        studio: true         },
  { feature: "Team seats",          starter: "1",         pro: "1",          studio: "5"          },
  { feature: "Analytics",           starter: false,       pro: "Basic",      studio: "Advanced"   },
  { feature: "Support",             starter: "Community", pro: "Priority",   studio: "Dedicated"  },
];

const QUOTES = [
  {
    text: "Switched to Pro last month and already finished three tracks. The unlimited generations alone are worth every penny.",
    name: "Sarah Johnson",
    role: "Music Producer",
    avatar: "SJ",
    rating: 5,
  },
  {
    text: "The Studio plan's API access let us build it directly into our recording workflow. ROI in the first week.",
    name: "Michael Chen",
    role: "Platinum Artist",
    avatar: "MC",
    rating: 5,
  },
  {
    text: "Started on Starter to test it out, upgraded to Pro within two days. The quality jump is immediately obvious.",
    name: "Priya Sharma",
    role: "Music Director",
    avatar: "PS",
    rating: 5,
  },
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes. Cancel at any time — you keep access until the end of your billing period. No lock-ins." },
  { q: "What payment methods are accepted?", a: "We accept all major credit/debit cards, UPI, PayPal, and Apple Pay. Enterprise teams can pay via invoice." },
  { q: "Is there a free trial on Pro?", a: "Yes — 7 days free on the Pro plan. No credit card required to start." },
  { q: "Can I switch plans?", a: "Absolutely. Upgrade or downgrade at any time. Changes take effect immediately and we'll prorate the difference." },
  { q: "What is the refund policy?", a: "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund you in full — no questions asked." },
];

/* ─── helpers ────────────────────────────────────────── */

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

/* ─── sub-components ─────────────────────────────────── */

function CellVal({ val }: { val: string | boolean }) {
  if (val === true) return <Check className="w-4 h-4 text-teal mx-auto" strokeWidth={2.5} />;
  if (val === false) return <X className="w-4 h-4 text-lavender-600/60 mx-auto" strokeWidth={2} />;
  return <span className="text-jet-black-600 text-sm">{val}</span>;
}

/* ─── main content ───────────────────────────────────── */

function PricingContent() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [banner, setBanner] = useState<"success" | "cancelled" | null>(() => {
    if (searchParams.get("success")) return "success";
    if (searchParams.get("cancelled")) return "cancelled";
    return null;
  });
  const { data: session, status } = useSession();
  const accessToken = (session as { accessToken?: string } | null)?.accessToken ?? null;

  const openCheckout = useCallback((plan: Plan) => {
    if (!plan.planSlug) return;
    setCheckoutPlan(plan);
    setCheckoutError(null);
  }, []);

  const closeCheckout = useCallback(() => {
    setCheckoutPlan(null);
    setCheckoutLoading(null);
    setCheckoutError(null);
  }, []);

  const handleLemonSqueezy = useCallback(async () => {
    if (!checkoutPlan?.planSlug || !accessToken) return;
    setCheckoutLoading("lemonsqueezy");
    setCheckoutError(null);
    try {
      const { checkout_url } = await createLemonSqueezyCheckout(checkoutPlan.planSlug, accessToken);
      window.location.href = checkout_url;
    } catch (e) {
      setCheckoutLoading(null);
      setCheckoutError(e instanceof ApiError ? e.message : "Failed to create checkout");
    }
  }, [checkoutPlan, accessToken]);

  const handleRazorpay = useCallback(async () => {
    if (!checkoutPlan?.planSlug || !accessToken) return;
    setCheckoutLoading("razorpay");
    setCheckoutError(null);
    try {
      const order = await createRazorpayOrder(checkoutPlan.planSlug, accessToken);
      await loadRazorpayScript();
      if (!window.Razorpay) { setCheckoutError("Payment script failed to load"); setCheckoutLoading(null); return; }
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const rzp = new window.Razorpay({
        key: order.key_id, amount: order.amount, currency: order.currency,
        order_id: order.order_id, name: "SargamAI",
        description: `${checkoutPlan.name} plan`,
        handler: () => { window.location.href = `${origin}/pricing?success=razorpay`; },
      });
      rzp.on("payment.failed", () => { setCheckoutError("Payment failed or was cancelled"); setCheckoutLoading(null); });
      rzp.open();
      setCheckoutLoading(null);
    } catch (e) {
      setCheckoutLoading(null);
      setCheckoutError(e instanceof ApiError ? e.message : "Failed to create order");
    }
  }, [checkoutPlan, accessToken]);

  return (
    <div className="relative min-h-screen pt-24 pb-20 overflow-x-hidden">

      {/* ── background ── */}
      <div className="absolute inset-0 bg-[var(--page-bg)]" />
      <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-teal) 1px, transparent 0)", backgroundSize: "28px 28px" }} aria-hidden />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px] -translate-y-1/2 pointer-events-none" style={{ background: "rgba(0,212,255,0.06)" }} aria-hidden />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] translate-x-1/3 translate-y-1/3 pointer-events-none" style={{ background: "rgba(0,212,255,0.04)" }} aria-hidden />

      {/* ── banner ── */}
      <AnimatePresence>
        {banner && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
            <div className={`rounded-xl px-5 py-3 shadow-xl flex items-center gap-3 backdrop-blur-md border ${banner === "success" ? "bg-teal/15 text-teal border-teal/30" : "bg-lavender-700/80 text-jet-black border-lavender-600/50"}`}>
              {banner === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span className="text-sm font-medium">{banner === "success" ? "Payment successful — welcome aboard!" : "Checkout cancelled."}</span>
              <button type="button" onClick={() => { setBanner(null); const u = new URL(window.location.href); u.searchParams.delete("success"); u.searchParams.delete("cancelled"); window.history.replaceState({}, "", u.pathname + u.search); }} className="ml-2 p-1 hover:opacity-70" aria-label="Dismiss"><X className="w-3.5 h-3.5" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── checkout modal ── */}
      <AnimatePresence>
        {checkoutPlan && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeCheckout}>
            <motion.div initial={{ scale: 0.94, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-lavender-800 border border-lavender-600/50 rounded-2xl p-7 w-full max-w-md shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-jet-black font-heading">Subscribe to {checkoutPlan.name}</h3>
                  <p className="text-jet-black-600 text-sm mt-1">{checkoutPlan.description}</p>
                </div>
                <button type="button" onClick={closeCheckout} className="p-1.5 rounded-lg hover:bg-lavender-600/30 text-jet-black-600 transition-colors" aria-label="Close"><X className="w-4 h-4" /></button>
              </div>
              <Separator className="bg-lavender-600/30 mb-6" />
              {status === "unauthenticated" || !accessToken ? (
                <div className="text-center">
                  <p className="text-jet-black-600 mb-5 text-sm">Sign in to subscribe to {checkoutPlan.name}.</p>
                  <Link href="/get-started?redirect=/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal text-lavender-900 font-semibold text-sm hover:bg-teal-600 transition-colors">
                    Sign in <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <>
                  {checkoutError && <p className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/20">{checkoutError}</p>}
                  <div className="flex flex-col gap-3">
                    <button type="button" onClick={handleLemonSqueezy} disabled={!!checkoutLoading}
                      className="w-full py-3.5 px-5 rounded-xl bg-teal text-lavender-900 font-semibold hover:bg-teal-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                      {checkoutLoading === "lemonsqueezy" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Pay with Lemon Squeezy
                    </button>
                    <button type="button" onClick={handleRazorpay} disabled={!!checkoutLoading}
                      className="w-full py-3.5 px-5 rounded-xl bg-lavender-700 border border-lavender-600/40 text-jet-black font-semibold hover:bg-lavender-600/50 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                      {checkoutLoading === "razorpay" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Pay with Razorpay
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══════════ HEADER ══════════ */}
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 sm:mb-20">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-semibold uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            Pricing
          </motion.span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-jet-black leading-[1.1] tracking-tight mb-5">
            One price.<br />
            <span className="text-teal">Unlimited creativity.</span>
          </h1>
          <p className="text-jet-black-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Start free, upgrade when you&apos;re ready. No hidden fees, no lock-ins.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3">
            <div className="relative flex rounded-full border border-lavender-600/40 bg-lavender-800 p-1">
              {["Monthly", "Annual"].map((label, i) => (
                <button key={label} type="button"
                  onClick={() => setIsAnnual(i === 1)}
                  className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${(i === 1) === isAnnual ? "text-lavender-900" : "text-jet-black-600 hover:text-jet-black"}`}>
                  {label}
                </button>
              ))}
              <motion.div layout className="absolute top-1 bottom-1 rounded-full bg-teal" initial={false}
                animate={{ left: isAnnual ? "calc(50% + 2px)" : "4px", width: "calc(50% - 6px)" }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }} />
            </div>
            <AnimatePresence>
              {isAnnual && (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  className="text-xs font-semibold text-teal bg-teal/10 border border-teal/20 px-2.5 py-1 rounded-full">
                  Save 33%
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ══════════ PRICING CARDS ══════════ */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto mb-20">
          {plans.map((plan, i) => {
            const price = plan.period === "forever" ? plan.priceMonthly : (isAnnual ? plan.annualMonthly : plan.priceMonthly);
            const period = plan.period === "forever" ? "forever" : "/ month";
            const isFeatured = !!plan.popular;

            return (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col rounded-2xl sm:rounded-3xl border overflow-hidden
                  ${isFeatured
                    ? "border-teal/40 shadow-[0_0_80px_rgba(0,212,255,0.14)] md:-mt-4 md:mb-0 z-10"
                    : "border-lavender-600/30"
                  }
                  bg-gradient-to-br from-lavender-800 to-lavender-700`}
              >
                {/* Top accent line on Pro */}
                {isFeatured && (
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal to-transparent" />
                )}

                {/* Most Popular badge */}
                {isFeatured && (
                  <div className="absolute top-5 right-5">
                    <Badge className="bg-teal text-lavender-900 border-0 font-semibold text-[11px] px-2.5 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="p-7 sm:p-8 flex flex-col flex-1">
                  {/* Plan identity */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isFeatured ? "bg-teal/20 text-teal border border-teal/30" : "bg-teal/10 text-teal border border-teal/15"}`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-lg font-bold font-heading text-jet-black">{plan.name}</h3>
                  </div>
                  <p className="text-jet-black-600 text-sm mb-6 leading-relaxed">{plan.description}</p>

                  {/* Highlight chip */}
                  {plan.highlight && (
                    <span className={`inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-4 ${isFeatured ? "bg-teal/15 text-teal border border-teal/25" : "bg-lavender-600/30 text-jet-black-600 border border-lavender-600/20"}`}>
                      <span className={`w-1 h-1 rounded-full ${isFeatured ? "bg-teal" : "bg-jet-black-600"}`} />
                      {plan.highlight}
                    </span>
                  )}

                  {/* Price */}
                  <div className="flex items-end gap-1.5 mb-2">
                    <span className={`text-5xl font-bold font-heading leading-none ${isFeatured ? "text-teal" : "text-jet-black"}`}>
                      {price}
                    </span>
                    <span className="text-jet-black-600 text-sm pb-1.5">{period}</span>
                  </div>
                  {isAnnual && plan.period !== "forever" && (
                    <p className="text-xs text-jet-black-600 mb-6">
                      Billed as {plan.priceAnnual}/year
                    </p>
                  )}
                  {(!isAnnual || plan.period === "forever") && <div className="mb-6" />}

                  <Separator className="bg-lavender-600/25 mb-6" />

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isFeatured ? "bg-teal/20" : "bg-teal/10"}`}>
                          <Check className="w-2.5 h-2.5 text-teal" strokeWidth={3} />
                        </div>
                        <span className="text-sm text-jet-black-600 leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.planSlug ? (
                    <motion.button type="button" onClick={() => openCheckout(plan)}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200
                        ${isFeatured
                          ? "bg-teal text-lavender-900 hover:bg-teal-600 shadow-[0_0_30px_rgba(0,212,255,0.25)]"
                          : "bg-lavender-600/40 text-jet-black border border-lavender-600/30 hover:border-teal/30 hover:text-teal"
                        }`}>
                      {plan.cta} <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <Link href="/get-started">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-lavender-600/40 text-jet-black border border-lavender-600/30 hover:border-teal/30 hover:text-teal transition-all cursor-pointer">
                        {plan.cta} <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ══════════ COMPARISON TABLE ══════════ */}
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-20">

          <div className="text-center mb-10">
            <motion.span initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              Compare plans
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-jet-black leading-tight">
              Everything side by side
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-lavender-600/30">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="bg-lavender-800/80">
                  <th className="text-left px-6 py-4 text-jet-black-600 text-sm font-medium w-1/2">Feature</th>
                  {plans.map((p) => (
                    <th key={p.name} className={`px-6 py-4 text-sm font-semibold text-center ${p.popular ? "text-teal" : "text-jet-black"}`}>
                      {p.name}
                      {p.popular && <span className="ml-2 text-[10px] bg-teal/10 text-teal border border-teal/20 px-1.5 py-0.5 rounded-full font-medium">★</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={row.feature} className={`border-t border-lavender-600/20 ${i % 2 === 0 ? "bg-lavender-800/30" : "bg-lavender-700/20"}`}>
                    <td className="px-6 py-3.5 text-sm text-jet-black-600">{row.feature}</td>
                    <td className="px-6 py-3.5 text-center"><CellVal val={row.starter} /></td>
                    <td className="px-6 py-3.5 text-center bg-teal/[0.03]"><CellVal val={row.pro} /></td>
                    <td className="px-6 py-3.5 text-center"><CellVal val={row.studio} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ══════════ SOCIAL PROOF ══════════ */}
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-20">

          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-jet-black leading-tight mb-3">
              Creators love SargamAI
            </h2>
            <p className="text-jet-black-600 text-base">Join 50,000+ songwriters already creating.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {QUOTES.map((q, i) => (
              <motion.div key={q.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl border border-lavender-600/30 bg-gradient-to-br from-lavender-800 to-lavender-700 p-6 flex flex-col gap-4 hover:border-teal/20 hover:shadow-[0_0_40px_rgba(0,212,255,0.06)] transition-all duration-400">
                <div className="absolute top-4 right-5 text-6xl font-serif text-teal/8 leading-none select-none pointer-events-none group-hover:text-teal/12 transition-colors">&ldquo;</div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: q.rating }).map((_, s) => <Star key={s} className="w-3.5 h-3.5 fill-teal text-teal" strokeWidth={0} />)}
                </div>
                <p className="text-jet-black-600 text-sm leading-relaxed flex-1">{q.text}</p>
                <div className="flex items-center gap-3 pt-3 border-t border-lavender-600/25">
                  <div className="w-9 h-9 rounded-full bg-teal/15 border border-teal/20 flex items-center justify-center shrink-0">
                    <span className="text-teal text-xs font-bold">{q.avatar}</span>
                  </div>
                  <div>
                    <p className="text-jet-black text-sm font-semibold">{q.name}</p>
                    <p className="text-jet-black-600 text-xs">{q.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════ FAQ ══════════ */}
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl mx-auto mb-20">

          <div className="text-center mb-10">
            <motion.span initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              FAQs
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-jet-black">Common questions</h2>
          </div>

          <div className="rounded-2xl border border-lavender-600/30 overflow-hidden divide-y divide-lavender-600/20">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-lavender-600/10 transition-colors">
                  <span className="font-medium text-jet-black text-sm sm:text-base pr-6">{faq.q}</span>
                  <motion.div animate={{ rotate: openFAQ === i ? 180 : 0 }} transition={{ duration: 0.22 }}>
                    <ChevronDown className="w-4 h-4 text-jet-black-600 shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFAQ === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm text-jet-black-600 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ══════════ BOTTOM CTA STRIP ══════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid sm:grid-cols-3 gap-4 mb-12">

          {[
            { icon: BadgeCheck, title: "30-day guarantee", desc: "Full refund if you're not satisfied. No questions asked." },
            { icon: Shield,     title: "Bank-grade security", desc: "All transactions encrypted with 256-bit SSL protection." },
            { icon: Users,      title: "50K+ creators",      desc: "Trusted by artists, producers, and teams worldwide." },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-4 p-5 rounded-2xl border border-lavender-600/30 bg-gradient-to-br from-lavender-800 to-lavender-700">
              <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/15 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-teal" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-jet-black text-sm mb-1">{title}</p>
                <p className="text-jet-black-600 text-xs leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ══════════ ENTERPRISE CTA ══════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative rounded-2xl sm:rounded-3xl border border-teal/20 bg-gradient-to-br from-lavender-800 to-lavender-700 overflow-hidden p-8 sm:p-12 text-center">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-teal) 1px, transparent 0)", backgroundSize: "24px 24px" }} aria-hidden />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(0,212,255,0.07)" }} aria-hidden />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-semibold uppercase tracking-widest mb-5">
              <Music className="w-3 h-3" strokeWidth={1.5} />
              Enterprise
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-jet-black mb-4">Need a custom plan?</h2>
            <p className="text-jet-black-600 text-base max-w-lg mx-auto leading-relaxed mb-8">
              Volume discounts, white-labelling, SLA guarantees, and custom onboarding for teams of 10+.
            </p>
            <Link href="/get-started">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-teal text-lavender-900 font-semibold hover:bg-teal-600 transition-colors cursor-pointer">
                Contact Sales <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
        <div className="w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
