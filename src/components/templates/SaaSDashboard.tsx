'use client';

import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  UserCheck,
  Zap,
} from 'lucide-react';

export function SaaSDashboard() {
  const transactions = [
    { id: '#INV-8041', name: 'Acme Corporation', email: 'billing@acme.com', amount: '$4,850.00', status: 'Paid', date: 'Just now' },
    { id: '#INV-8040', name: 'Stark Industries', email: 'tony@stark.io', amount: '$12,400.00', status: 'Paid', date: '25m ago' },
    { id: '#INV-8039', name: 'Cyberdyne Systems', email: 'ops@cyberdyne.ai', amount: '$2,190.00', status: 'Pending', date: '1h ago' },
    { id: '#INV-8038', name: 'Wayne Enterprises', email: 'bruce@wayne.corp', amount: '$8,900.00', status: 'Paid', date: '3h ago' },
    { id: '#INV-8037', name: 'Hooli Media', email: 'gavin@hooli.xyz', amount: '$940.00', status: 'Overdue', date: '1d ago' },
  ];

  return (
    <div className="min-h-screen flex bg-app">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface bd-r hidden md:flex flex-col justify-between p-4">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'var(--p-500)' }}
            >
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm t-primary block leading-none">
                Nexus Cloud
              </span>
              <span className="text-[10px] t-muted">Enterprise Console</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            <a
              href="#dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold"
              style={{
                background: 'var(--nav-active-bg)',
                color: 'var(--nav-active-text)',
              }}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </a>
            <a
              href="#analytics"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium t-secondary hover:bg-[var(--bg-surface-hover)]"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </a>
            <a
              href="#customers"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium t-secondary hover:bg-[var(--bg-surface-hover)]"
            >
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </a>
            <a
              href="#billing"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium t-secondary hover:bg-[var(--bg-surface-hover)]"
            >
              <CreditCard className="w-4 h-4" />
              <span>Billing & Subscriptions</span>
            </a>
            <a
              href="#settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium t-secondary hover:bg-[var(--bg-surface-hover)]"
            >
              <Settings className="w-4 h-4" />
              <span>Workspace Settings</span>
            </a>
          </nav>
        </div>

        {/* User Card */}
        <div className="p-3 rounded-xl bg-app bd flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'var(--a-500)' }}
          >
            AD
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold t-primary block truncate">
              Alex Davis
            </span>
            <span className="text-[10px] t-muted block truncate">
              Lead Architect
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Top Navbar */}
        <header className="h-16 px-6 bg-surface bd-b flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="relative w-72 hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-2.5 t-muted" />
            <input
              type="text"
              placeholder="Search metrics, invoices, customers..."
              className="input !pl-9 !py-1.5 text-xs"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="btn btn-ghost btn-sm h-8 w-8 !p-0 relative">
              <Bell className="w-4 h-4" />
              <span
                className="w-2 h-2 rounded-full absolute top-1.5 right-1.5"
                style={{ background: 'var(--danger-text)' }}
              />
            </button>
            <button className="btn btn-primary btn-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Generate Report</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold t-primary tracking-tight">
                Executive Revenue & Performance
              </h1>
              <p className="text-xs t-muted">
                Live performance data synced across global infrastructure clusters.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge b-info">Q3 Live Cycle</span>
              <span className="badge b-success">99.98% SLA</span>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card card-tight space-y-3">
              <div className="flex justify-between items-center text-xs t-muted">
                <span>Total MRR</span>
                <span className="badge b-success text-[10px]">
                  <ArrowUpRight className="w-3 h-3" /> +18.4%
                </span>
              </div>
              <div className="text-2xl font-bold font-mono t-primary">
                $184,240
              </div>
              <p className="text-[11px] t-muted">+$24,190 from previous month</p>
            </div>

            <div className="card card-tight space-y-3">
              <div className="flex justify-between items-center text-xs t-muted">
                <span>Active Subscriptions</span>
                <span className="badge b-success text-[10px]">
                  <ArrowUpRight className="w-3 h-3" /> +8.1%
                </span>
              </div>
              <div className="text-2xl font-bold font-mono t-primary">
                4,219
              </div>
              <p className="text-[11px] t-muted">98 Enterprise tier licenses</p>
            </div>

            <div className="card card-tight space-y-3">
              <div className="flex justify-between items-center text-xs t-muted">
                <span>Average Churn Rate</span>
                <span className="badge b-info text-[10px]">
                  <ArrowDownRight className="w-3 h-3" /> -0.4%
                </span>
              </div>
              <div className="text-2xl font-bold font-mono t-primary">
                1.12%
              </div>
              <p className="text-[11px] t-muted">Well below 2.0% industry goal</p>
            </div>

            <div className="card card-tight space-y-3">
              <div className="flex justify-between items-center text-xs t-muted">
                <span>Infrastructure Cost</span>
                <span className="badge b-warning text-[10px]">
                  Optimal
                </span>
              </div>
              <div className="text-2xl font-bold font-mono t-primary">
                $14,810
              </div>
              <p className="text-[11px] t-muted">8.0% of gross operating MRR</p>
            </div>
          </div>

          {/* Main Visual Chart Card */}
          <div className="card space-y-4">
            <div className="flex justify-between items-center pb-3 bd-b">
              <div>
                <h2 className="text-sm font-bold t-primary">
                  Gross Annual ARR Progression
                </h2>
                <p className="text-xs t-muted">
                  Cumulative contract value vs. operational overhead
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs t-secondary">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--p-500)' }} />
                  Actual MRR
                </span>
                <span className="flex items-center gap-1.5 text-xs t-secondary">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--a-500)' }} />
                  Projected
                </span>
              </div>
            </div>

            {/* SVG Area Chart */}
            <div className="w-full h-52">
              <svg viewBox="0 0 600 180" className="w-full h-full">
                <defs>
                  <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--p-500)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--p-500)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,170 50,150 100,140 150,110 200,120 250,90 300,95 350,65 400,70 450,45 500,40 550,20 600,10 600,180 0,180"
                  fill="url(#pGrad)"
                />
                <polyline
                  points="0,170 50,150 100,140 150,110 200,120 250,90 300,95 350,65 400,70 450,45 500,40 550,20 600,10"
                  fill="none"
                  stroke="var(--p-500)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="0,175 100,160 200,145 300,130 400,105 500,85 600,60"
                  fill="none"
                  stroke="var(--a-500)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Transactions Data Table */}
          <div className="card space-y-4">
            <div className="flex justify-between items-center pb-3 bd-b">
              <div>
                <h2 className="text-sm font-bold t-primary">Recent Invoices & Contracts</h2>
                <p className="text-xs t-muted">Processed through Stripe Enterprise Gateway</p>
              </div>
              <button className="btn btn-secondary btn-sm">Export CSV</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="t-muted bd-b">
                    <th className="pb-2 font-medium">Invoice</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[var(--bg-surface-hover)]">
                      <td className="py-3 font-mono font-medium t-secondary">
                        {tx.id}
                      </td>
                      <td className="py-3">
                        <span className="font-semibold t-primary block">
                          {tx.name}
                        </span>
                        <span className="text-[10px] t-muted block">
                          {tx.email}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold t-primary">
                        {tx.amount}
                      </td>
                      <td className="py-3">
                        <span
                          className={`badge ${
                            tx.status === 'Paid'
                              ? 'b-success'
                              : tx.status === 'Pending'
                              ? 'b-warning'
                              : 'b-danger'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 text-right t-muted font-mono text-[11px]">
                        {tx.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
