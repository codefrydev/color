'use client';

import React, { useState, useEffect } from 'react';
import { useStudio } from '../../state/StudioContext';
import { ExternalLink, TrendingUp, Users, Cpu, Activity, ArrowUpRight } from 'lucide-react';

export function MiniDashboardPreview() {
  const { derived, state } = useStudio();
  const [revenue, setRevenue] = useState(48250);
  const [usersCount, setUsersCount] = useState(12480);
  const [load, setLoad] = useState(42);

  // Live data walk
  useEffect(() => {
    const timer = setInterval(() => {
      setRevenue((prev) => prev + Math.floor(Math.random() * 120));
      setUsersCount((prev) => prev + Math.floor(Math.random() * 8));
      setLoad((prev) => Math.min(95, Math.max(15, prev + (Math.random() * 10 - 5))));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const openPreviewTab = (template = 'dashboard') => {
    if (typeof window === 'undefined') return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    window.open(`${base}/preview/?template=${template}${window.location.hash}`, '_blank');
  };

  const sparklinePts = '0,28 30,22 60,25 90,14 120,18 150,8 180,12 210,4';

  return (
    <div className="card space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 bd-b">
        <div>
          <h2 className="text-sm font-bold t-primary flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--p-500)]" />
            Design System Live Preview
          </h2>
          <p className="text-xs t-muted">
            Interactive UI components running on dynamic CSS tokens.
          </p>
        </div>

        {/* Primary Call to Action: Open in New Tab */}
        <button
          onClick={() => openPreviewTab('dashboard')}
          className="btn btn-primary shadow-md hover:scale-105 transition-transform"
        >
          <span>Preview in New Tab</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Mini KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-app bd space-y-2">
          <div className="flex justify-between items-center text-xs t-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              Monthly Revenue
            </span>
            <span className="badge b-success text-[10px]">+14.2%</span>
          </div>
          <div className="text-xl font-bold font-mono t-primary">
            ${revenue.toLocaleString()}
          </div>
          <svg viewBox="0 0 210 32" className="w-full h-8 overflow-visible">
            <polyline
              points={sparklinePts}
              fill="none"
              stroke="var(--p-500)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="p-4 rounded-xl bg-app bd space-y-2">
          <div className="flex justify-between items-center text-xs t-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5" />
              Active Users
            </span>
            <span className="badge b-info text-[10px]">Real-time</span>
          </div>
          <div className="text-xl font-bold font-mono t-primary">
            {usersCount.toLocaleString()}
          </div>
          <div className="w-full bg-[var(--border-subtle)] h-2 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-[var(--a-500)] transition-all duration-500 rounded-full"
              style={{ width: '68%' }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-app bd space-y-2">
          <div className="flex justify-between items-center text-xs t-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <Cpu className="w-3.5 h-3.5" />
              Cluster Load
            </span>
            <span
              className={`badge text-[10px] ${
                load > 80 ? 'b-danger' : load > 60 ? 'b-warning' : 'b-success'
              }`}
            >
              {Math.round(load)}%
            </span>
          </div>
          <div className="text-xl font-bold font-mono t-primary">
            {Math.round(load)}% Capacity
          </div>
          <div className="w-full bg-[var(--border-subtle)] h-2 rounded-full overflow-hidden mt-3">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${load}%`,
                background:
                  load > 80
                    ? 'var(--danger-text)'
                    : load > 60
                    ? 'var(--warning-text)'
                    : 'var(--success-text)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Controls Demo Row */}
      <div className="p-4 rounded-xl bg-surface bd flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="btn btn-primary btn-sm">Primary Button</button>
          <button className="btn btn-secondary btn-sm">Secondary</button>
          <button className="btn btn-ghost btn-sm">Ghost Action</button>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge b-success">Paid</span>
          <span className="badge b-warning">Pending</span>
          <span className="badge b-danger">Overdue</span>
          <span className="badge b-info">Review</span>
        </div>
      </div>

      {/* Banner advertising full templates */}
      <div className="p-4 rounded-xl bg-[var(--accent-soft-bg)] text-[var(--accent-soft-text)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold block">
            Explore 5 Production-Grade Real-World Templates
          </span>
          <span className="text-[11px] opacity-90 block">
            SaaS Analytics, E-Commerce Store, Developer Docs, Marketing Landing Page, and Mobile Shell.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openPreviewTab('ecommerce')}
            className="btn btn-secondary btn-sm !bg-surface text-xs"
          >
            E-Commerce
          </button>
          <button
            onClick={() => openPreviewTab('landing')}
            className="btn btn-secondary btn-sm !bg-surface text-xs"
          >
            Landing
          </button>
          <button
            onClick={() => openPreviewTab('dashboard')}
            className="btn btn-primary btn-sm text-xs"
          >
            Launch All <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
