"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { Check, BadgeCheck, Sparkles, Crown, Zap, Plus, Minus } from "lucide-react";

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
    cta: "Contact Sales",
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

export default function PricingPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen relative pt-24 pb-12 bg-gradient-to-b from-neutral-500 via-pale-sky-900 to-neutral-500">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pale-sky-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-800/30 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pale-sky-700 border border-pale-sky-400 text-teal text-sm font-semibold mb-6">
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
              <span className="w-2 h-2 rounded-full bg-teal-700"></span>
              <span className="text-sm font-medium text-jet-black">{offer.text}</span>
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
                <div className={`p-8 bg-gradient-to-br ${plan.popular ? 'from-pale-sky-700 to-pale-sky-600' : 'from-lavender-700 to-neutral-500'}`}>
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
          <div className="inline-flex items-center gap-3 bg-pale-sky-700 rounded-2xl px-8 py-6 shadow-sm border border-pale-sky-400">
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
