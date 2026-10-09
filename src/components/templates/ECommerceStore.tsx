'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Star,
  Search,
  Heart,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

export function ECommerceStore() {
  const [cartCount, setCartCount] = useState(2);

  const products = [
    {
      id: 1,
      title: 'Aura Pro Studio Wireless Headphones',
      category: 'Audio Equipment',
      price: '$349.00',
      oldPrice: '$420.00',
      rating: 4.9,
      reviews: 148,
      badge: 'Best Seller',
      color: 'var(--p-500)',
    },
    {
      id: 2,
      title: 'Mechanical Tactile Keyboard RGB',
      category: 'Peripherals',
      price: '$189.00',
      oldPrice: null,
      rating: 4.8,
      reviews: 92,
      badge: 'New Arrival',
      color: 'var(--a-500)',
    },
    {
      id: 3,
      title: 'Precision Ergonomic Optical Mouse',
      category: 'Peripherals',
      price: '$99.00',
      oldPrice: '$129.00',
      rating: 4.7,
      reviews: 215,
      badge: '23% Off',
      color: 'var(--s-500)',
    },
    {
      id: 4,
      title: 'Aluminum Magnetic Laptop Stand',
      category: 'Workspace',
      price: '$79.00',
      oldPrice: null,
      rating: 4.9,
      reviews: 340,
      badge: null,
      color: 'var(--p-600)',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-app">
      {/* Top Banner */}
      <div
        className="py-1.5 px-4 text-center text-xs font-semibold"
        style={{
          background: 'var(--accent-bg)',
          color: 'var(--accent-text)',
        }}
      >
        ✨ Autumn Design Collection: Free Express Global Shipping on orders over $150
      </div>

      {/* Navigation */}
      <header className="h-16 px-6 bg-surface bd-b flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-base t-primary">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs"
              style={{ background: 'var(--p-500)' }}
            >
              K
            </span>
            <span>KROMA Studio</span>
          </div>

          <nav className="hidden md:flex items-center gap-4 text-xs font-medium t-secondary">
            <a href="#featured" className="t-primary font-bold">Featured</a>
            <a href="#audio" className="hover:t-primary">Audio</a>
            <a href="#workspace" className="hover:t-primary">Workspace</a>
            <a href="#peripherals" className="hover:t-primary">Peripherals</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-48 hidden sm:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 t-muted" />
            <input
              type="text"
              placeholder="Search gear..."
              className="input !pl-8 !py-1 text-xs"
            />
          </div>

          <button
            onClick={() => setCartCount((prev) => prev + 1)}
            className="btn btn-secondary btn-sm relative"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white absolute -top-1.5 -right-1.5 shadow-sm"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Promotion Banner */}
      <div className="px-6 py-8 max-w-7xl w-full mx-auto">
        <div
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col items-start justify-center shadow-lg"
          style={{
            background: `linear-gradient(135deg, var(--p-600), var(--p-900))`,
            color: '#ffffff',
          }}
        >
          <div className="max-w-md space-y-4 z-10">
            <span className="badge b-info text-[11px] !bg-white/20 !text-white !border-white/30 backdrop-blur-md">
              Next-Gen Precision Audio
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Acoustic Harmony Meets Pure Form
            </h1>
            <p className="text-sm opacity-90 leading-relaxed">
              Engineered with planar magnetic drivers and active ambient neutralization. Designed for architects of sound.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                className="btn btn-primary !bg-white !text-slate-900 hover:!bg-slate-100 font-bold px-6 shadow-md"
              >
                <span>Shop the Drop</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <button className="btn btn-ghost text-white border border-white/30 hover:bg-white/10">
                View Specs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="px-6 pb-12 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex justify-between items-center pb-2 bd-b">
          <div>
            <h2 className="text-lg font-bold t-primary">Featured Gear & Essentials</h2>
            <p className="text-xs t-muted">Hand-calibrated hardware built to last a lifetime.</p>
          </div>
          <button className="btn btn-secondary btn-sm">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="card !p-0 overflow-hidden flex flex-col group hover:shadow-lg transition-shadow"
            >
              {/* Product Visual Mockup */}
              <div
                className="h-48 relative flex items-center justify-center p-6 transition-transform group-hover:scale-102"
                style={{
                  background: `radial-gradient(circle, var(--p-100) 0%, var(--bg-surface) 100%)`,
                }}
              >
                {p.badge && (
                  <span
                    className="absolute top-3 left-3 badge text-[10px] shadow-xs"
                    style={{
                      background: 'var(--accent-bg)',
                      color: 'var(--accent-text)',
                    }}
                  >
                    {p.badge}
                  </span>
                )}
                <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-black/40 hover:scale-110 transition-transform t-secondary">
                  <Heart className="w-3.5 h-3.5" />
                </button>

                {/* Abstract hardware geometric artwork */}
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}, var(--s-600))`,
                  }}
                >
                  <ShoppingBag className="w-10 h-10 text-white opacity-80" />
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-surface">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider t-muted">
                    {p.category}
                  </span>
                  <h3 className="font-semibold text-xs t-primary line-clamp-1 mt-0.5">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-[11px] t-secondary">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{p.rating}</span>
                    <span className="t-muted">({p.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 bd-t">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-sm font-mono t-primary">
                      {p.price}
                    </span>
                    {p.oldPrice && (
                      <span className="text-[10px] font-mono t-muted line-through">
                        {p.oldPrice}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setCartCount((prev) => prev + 1)}
                    className="btn btn-primary btn-sm !py-1 text-xs"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 bd-t">
          <div className="p-4 rounded-xl bg-surface bd flex items-center gap-3">
            <Truck className="w-6 h-6 text-[var(--p-500)] flex-shrink-0" />
            <div>
              <span className="text-xs font-bold t-primary block">Carbon-Neutral Shipping</span>
              <span className="text-[11px] t-muted block">Delivered in 100% recycled paper packaging</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface bd flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[var(--success-text)] flex-shrink-0" />
            <div>
              <span className="text-xs font-bold t-primary block">3-Year Manufacturer Warranty</span>
              <span className="text-[11px] t-muted block">Direct modular component replacements</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface bd flex items-center gap-3">
            <RotateCcw className="w-6 h-6 text-[var(--a-500)] flex-shrink-0" />
            <div>
              <span className="text-xs font-bold t-primary block">30-Day Risk-Free Trial</span>
              <span className="text-[11px] t-muted block">Hassle-free instant returns and refunds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
