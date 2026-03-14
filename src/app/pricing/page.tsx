"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, BadgeCheck, Sparkles, Crown, Zap, Plus, Minus, X, Loader2 } from "lucide-react";
import { createLemonSqueezyCheckout, createRazorpayOrder, ApiError } from "@/lib/api";

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
  gradient: string;
  icon: React.ReactNode;
  planSlug?: "pro" | "studio";
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out SargamAI",
    gradient: "from-jet-black-400 to-jet-black-500",
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      "5 lyrics generations per month",
      "Basic genre selection (10 genres)",
      "Standard generation speed",
      "Export to text file",
      "Community support",
    ],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$12",
    period: "month",
    description: "For serious songwriters & creators",
    popular: true,
    gradient: "from-teal to-teal-700",
    icon: <Crown className="w-6 h-6" />,
    features: [
      "Unlimited lyrics generations",
      "All 50+ genres & styles",
      "Priority generation speed",
      "Export to multiple formats (PDF, DOC, TXT)",
      "Save & organize unlimited songs",
      "Edit & refine lyrics with AI",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    planSlug: "pro",
  },
  {
    name: "Studio",
    price: "$29",
    period: "month",
    description: "For professional music creators",
    gradient: "from-teal-600 to-teal",
    icon: <Zap className="w-6 h-6" />,
    features: [
      "Everything in Pro",
      "Bulk generation (up to 50 at once)",
      "API access included",
      "Custom style training",
      "Team collaboration (up to 5 members)",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "24/7 priority support",
    ],
    cta: "Select Plan",
    planSlug: "studio",
  },
];

const offers = [
  { text: "7-day free trial on Pro", discount: "No credit card required" },
  { text: "Save 20% with annual billing", discount: "Use code: SARGRAM20" },
  { text: "30-day money-back guarantee", discount: "Risk-free" },
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and Apple Pay. Enterprise customers can also pay via invoice." },
  { q: "Is there a free trial?", a: "Yes! The Pro plan comes with a 7-day free trial. No credit card required to start." },
  { q: "Can I upgrade or downgrade?", a: "Absolutely! You can change your plan at any time. Changes take effect immediately, and we'll prorate the difference." },
];

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
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => resolve();
  });
}

export default function PricingPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [banner, setBanner] = useState<"success" | "cancelled" | null>(null);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const accessToken = (session as { accessToken?: string } | null)?.accessToken ?? null;

  useEffect(() => {
    const success = searchParams.get("success");
    const cancelled = searchParams.get("cancelled");
    if (success) setBanner("success");
    else if (cancelled) setBanner("cancelled");
  }, [searchParams]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const openCheckoutModal = useCallback((plan: Plan) => {
    if (!plan.planSlug) return;
    setCheckoutPlan(plan);
    setCheckoutError(null);
  }, []);

  const closeCheckoutModal = useCallback(() => {
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
  }, [checkoutPlan?.planSlug, accessToken]);

  const handleRazorpay = useCallback(async () => {
    if (!checkoutPlan?.planSlug || !accessToken) return;
    setCheckoutLoading("razorpay");
    setCheckoutError(null);
    try {
      const order = await createRazorpayOrder(checkoutPlan.planSlug, accessToken);
      await loadRazorpayScript();
      const Razorpay = window.Razorpay;
      if (!Razorpay) {
        setCheckoutError("Payment script failed to load");
        setCheckoutLoading(null);
        return;
      }
      const frontendUrl = typeof window !== "undefined" ? window.location.origin : "";
      const rzp = new Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "SargamAI",
        description: `${checkoutPlan.name} plan`,
        handler: () => {
          window.location.href = `${frontendUrl}/pricing?success=razorpay`;
        },
      });
      rzp.on("payment.failed", () => {
        setCheckoutError("Payment failed or was cancelled");
        setCheckoutLoading(null);
      });
      rzp.open();
      setCheckoutLoading(null);
    } catch (e) {
      setCheckoutLoading(null);
      setCheckoutError(e instanceof ApiError ? e.message : "Failed to create order");
    }
  }, [checkoutPlan, accessToken]);

  return (
    <div className="min-h-screen relative pt-24 pb-12 bg-gradient-to-b from-neutral-500 via-lavender-800 to-neutral-500">
      {/* Success / Cancelled banner */}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
          >
            <div
              className={`rounded-lg px-4 py-3 shadow-lg flex items-center gap-3 ${
                banner === "success"
                  ? "bg-teal/20 text-teal border border-teal/40"
                  : "bg-jet-black-700 text-white border border-jet-black-500"
              }`}
            >
              <span>
                {banner === "success" ? "Payment successful. Thank you!" : "Checkout cancelled."}
              </span>
              <button
                type="button"
                onClick={() => {
                  setBanner(null);
                  if (typeof window !== "undefined") {
                    const u = new URL(window.location.href);
                    u.searchParams.delete("success");
                    u.searchParams.delete("cancelled");
                    window.history.replaceState({}, "", u.pathname + u.search);
                  }
                }}
                className="p-1 hover:opacity-80"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout modal */}
      <AnimatePresence>
        {checkoutPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={closeCheckoutModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-jet-black-800 border border-jet-black-600 rounded-xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Subscribe to {checkoutPlan.name}
                </h3>
                <button
                  type="button"
                  onClick={closeCheckoutModal}
                  className="p-1 hover:opacity-80"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {status === "unauthenticated" || !accessToken ? (
                <p className="text-jet-black-300 mb-4">
                  Sign in to subscribe to {checkoutPlan.name}.
                </p>
              ) : (
                <>
                  {checkoutError && (
                    <p className="text-red-400 text-sm mb-4">{checkoutError}</p>
                  )}
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handleLemonSqueezy}
                      disabled={!!checkoutLoading}
                      className="w-full py-3 px-4 rounded-lg bg-teal text-white font-medium hover:bg-teal-600 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {checkoutLoading === "lemonsqueezy" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : null}
                      Pay with Lemon Squeezy
                    </button>
                    <button
                      type="button"
                      onClick={handleRazorpay}
                      disabled={!!checkoutLoading}
                      className="w-full py-3 px-4 rounded-lg bg-jet-black-600 hover:bg-jet-black-500 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {checkoutLoading === "razorpay" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : null}
                      Pay with Razorpay
                    </button>
                  </div>
                </>
              )}
              {status === "unauthenticated" && (
                <Link
                  href="/get-started?redirect=/pricing"
                  className="mt-4 inline-block text-teal hover:underline"
                >
                  Sign in to subscribe →
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-800/30 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/20 border border-teal-600 text-teal text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-jet-black font-heading">
            Choose Your Perfect Plan
          </h1>
          <p className="text-jet-black-600 text-lg max-w-2xl mx-auto">
            Start free and upgrade when you&apos;re ready. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Offers Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {offers.map((offer, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 bg-neutral-500 px-4 py-2 rounded-full shadow-sm border border-lavender-600"
            >
              <span className="w-2 h-2 rounded-full bg-teal"></span>
              <span className="text-sm font-medium text-jet-black">
                {index === 1 ? (
                  <>
                    <span className="text-teal font-semibold">Save 20%</span>
                    <span> with annual billing</span>
                  </>
                ) : (
                  offer.text
                )}
              </span>
              <span className="text-xs text-neutral-300">• {offer.discount}</span>
            </div>
          ))}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${plan.popular ? 'md:-mt-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-teal text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`h-full bg-neutral-500 rounded-3xl shadow-xl overflow-hidden ${plan.popular ? 'ring-2 ring-teal' : 'border border-lavender-600'}`}>
                {/* Card Header */}
                <div className={`p-8 bg-gradient-to-br ${plan.popular ? 'from-teal-400/30 to-teal-600/20' : 'from-lavender-700 to-neutral-500'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center text-white`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-jet-black">{plan.name}</h3>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-jet-black">{plan.price}</span>
                    <span className="text-neutral-300">/{plan.period}</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-gradient-to-r ${plan.popular ? 'from-teal to-teal-700' : 'from-neutral-300 to-neutral-400'}`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-jet-black-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.planSlug ? (
                    <button
                      type="button"
                      onClick={() => openCheckoutModal(plan)}
                      className={`block w-full py-4 rounded-2xl text-center font-semibold transition-all duration-300 ${
                        plan.popular
                          ? "bg-teal text-white shadow-lg shadow-teal-800/30 hover:bg-teal-600 hover:shadow-xl hover:shadow-teal-800/30"
                          : "bg-lavender-600 text-jet-black hover:bg-lavender-500"
                      }`}
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <Link
                      href="/get-started"
                      className={`block w-full py-4 rounded-2xl text-center font-semibold transition-all duration-300 ${
                        plan.popular
                          ? "bg-teal text-white shadow-lg shadow-teal-800/30 hover:bg-teal-600 hover:shadow-xl hover:shadow-teal-800/30"
                          : "bg-lavender-600 text-jet-black hover:bg-lavender-500"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section with Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-jet-black font-heading">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-neutral-500 rounded-2xl shadow-sm border border-lavender-600 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-lavender-700"
                >
                  <h3 className="font-semibold text-jet-black pr-4">{faq.q}</h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openIndex === index ? 'bg-teal rotate-180' : 'bg-lavender-600'}`}>
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-jet-black-600" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <p className="text-jet-black-600">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-teal/20 rounded-2xl px-8 py-6 shadow-sm border border-teal-600">
            <BadgeCheck className="w-10 h-10 text-teal" />
            <div className="text-left">
              <p className="font-bold text-jet-black">30-Day Money-Back Guarantee</p>
              <p className="text-sm text-neutral-300">Not satisfied? Get a full refund within 30 days, no questions asked.</p>
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center pb-8"
        >
          <p className="text-neutral-300 mb-4 font-medium">Need a custom plan for your team or enterprise?</p>
          <Link
            href="/get-started"
            className="inline-block px-8 py-4 rounded-2xl border-2 border-lavender-500 text-jet-black font-semibold hover:border-teal hover:text-teal transition-all"
          >
            Contact Sales
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
