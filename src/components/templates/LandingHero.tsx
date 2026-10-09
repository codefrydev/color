'use client';

import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  Zap,
  Sparkles,
  Shield,
  Rocket,
  Star,
} from 'lucide-react';

export function LandingHero() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      price: annual ? '$15' : '$19',
      period: '/month',
      desc: 'Ideal for independent developers and solo founders launching MVPs.',
      popular: false,
      features: [
        'Up to 5 design systems',
        'CSS and Tailwind v3/v4 export',
        'WCAG 2.2 contrast validation',
        'Community Discord access',
      ],
    },
    {
      name: 'Professional',
      price: annual ? '$39' : '$49',
      period: '/month',
      desc: 'For growing product teams demanding design-engineering parity.',
      popular: true,
      features: [
        'Unlimited design systems',
        'OKLCH & Display P3 wide gamut',
        'Shadcn UI & Figma Tokens sync',
        'APCA contrast rating engine',
        'Priority Slack & API support',
      ],
    },
    {
      name: 'Enterprise',
      price: annual ? '$119' : '$149',
      period: '/month',
      desc: 'Dedicated infrastructure, custom token compilers, and SSO.',
      popular: false,
      features: [
        'Multi-brand system governance',
        'Custom CI/CD design token pipelines',
        'Dedicated SLA & private hosting',
        'Native iOS & Android generators',
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-app flex flex-col">
      {/* Landing Header */}
      <header className="h-16 px-6 max-w-7xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-bold text-base t-primary">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shadow-xs"
            style={{ background: 'var(--p-500)' }}
          >
            ✦
          </span>
          <span>Aura Design Engine</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm">Sign In</button>
          <button className="btn btn-primary btn-sm shadow-xs">
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent-soft-bg)] text-[var(--accent-soft-text)] shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[var(--p-500)]" />
          <span>Announcing Aura 3.0: OKLCH Perceptual Harmonization</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold t-primary tracking-tight leading-tight">
          Design systems that feel <br className="hidden sm:inline" />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--p-500), var(--a-500))',
            }}
          >
            mathematically effortless.
          </span>
        </h1>

        <p className="text-base sm:text-lg t-secondary max-w-2xl mx-auto leading-relaxed">
          Transform a single brand hue into an end-to-end, accessible design system. Complete with 50-950 scales, contrast-verified semantic roles, and instant token exports.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button className="btn btn-primary px-6 py-3 text-sm font-semibold shadow-md">
            Start Free Trial
          </button>
          <button className="btn btn-secondary px-6 py-3 text-sm font-semibold">
            Explore Documentation
          </button>
        </div>

        {/* Social Proof */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs t-muted">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span>Trusted by 14,000+ engineers at scale-ups & studios</span>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card space-y-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ background: 'var(--p-500)' }}
            >
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold t-primary">
              Perceptual Uniformity
            </h3>
            <p className="text-xs t-secondary leading-relaxed">
              Eliminate muddy mid-tones and blinding yellows with cutting-edge OKLCH lightness calibration.
            </p>
          </div>

          <div className="card space-y-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ background: 'var(--a-500)' }}
            >
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold t-primary">
              WCAG 2.2 & APCA Verified
            </h3>
            <p className="text-xs t-secondary leading-relaxed">
              Every semantic role is automatically checked against the background surface for guaranteed compliance.
            </p>
          </div>

          <div className="card space-y-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ background: 'var(--s-500)' }}
            >
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold t-primary">
              Multi-Format Pipeline
            </h3>
            <p className="text-xs t-secondary leading-relaxed">
              Export straight to Tailwind CSS v4, Shadcn/UI, W3C DTCG tokens.json, SwiftUI, and Jetpack Compose.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Tier Pricing Table */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold t-primary">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xs sm:text-sm t-muted">
            Choose the perfect plan for your product team. Cancel anytime.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-surface bd mt-4 shadow-2xs">
            <button
              onClick={() => setAnnual(false)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                !annual
                  ? 'bg-app t-primary shadow-xs'
                  : 't-muted hover:t-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                annual
                  ? 'bg-app t-primary shadow-xs'
                  : 't-muted hover:t-primary'
              }`}
            >
              <span>Annual</span>
              <span className="badge b-success text-[10px] !py-0 !px-1.5 font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`card flex flex-col justify-between relative transition-transform hover:-translate-y-1 duration-200 ${
                p.popular
                  ? 'ring-2 ring-[var(--p-500)] shadow-xl'
                  : ''
              }`}
            >
              {p.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 badge text-[10px] font-bold shadow-md"
                  style={{
                    background: 'var(--p-500)',
                    color: '#fff',
                  }}
                >
                  MOST POPULAR
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold t-primary">{p.name}</h3>
                  <p className="text-xs t-muted mt-1">{p.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono t-primary">
                    {p.price}
                  </span>
                  <span className="text-xs t-muted">
                    {p.period} {annual ? '(billed annually)' : ''}
                  </span>
                </div>

                <ul className="space-y-2.5 pt-4 bd-t text-xs t-secondary">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  className={`w-full btn ${
                    p.popular ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Get Started with {p.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
