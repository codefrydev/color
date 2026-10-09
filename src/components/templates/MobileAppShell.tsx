'use client';

import React, { useState } from 'react';
import {
  Home,
  Compass,
  PlusSquare,
  Heart,
  User,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Wifi,
  Battery,
  Sparkles,
} from 'lucide-react';

export function MobileAppShell() {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(1420);
  const [saved, setSaved] = useState(false);

  const toggleLike = () => {
    if (liked) {
      setLikesCount((p) => p - 1);
      setLiked(false);
    } else {
      setLikesCount((p) => p + 1);
      setLiked(true);
    }
  };

  const stories = [
    { name: 'Your Story', unread: false, avatar: '✦' },
    { name: 'Elena R.', unread: true, avatar: 'E' },
    { name: 'Marcus K.', unread: true, avatar: 'M' },
    { name: 'Sophia W.', unread: true, avatar: 'S' },
    { name: 'David T.', unread: false, avatar: 'D' },
  ];

  return (
    <div className="w-full h-full min-h-[720px] flex flex-col bg-surface relative select-none">
      {/* Device Status Bar */}
      <div className="h-10 px-6 flex justify-between items-center text-xs font-semibold t-primary flex-shrink-0 z-30">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* In-App Header */}
      <div className="h-14 px-4 flex items-center justify-between bd-b bg-surface/95 backdrop-blur-md flex-shrink-0 sticky top-10 z-20">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-xs"
            style={{ background: 'var(--p-500)' }}
          >
            ✦
          </span>
          <span className="font-extrabold text-base tracking-tight t-primary">
            FeedStream
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm h-8 w-8 !p-0">
            <Heart className="w-5 h-5 t-secondary" />
          </button>
          <button className="btn btn-ghost btn-sm h-8 w-8 !p-0 relative">
            <MessageCircle className="w-5 h-5 t-secondary" />
            <span
              className="w-2 h-2 rounded-full absolute top-1.5 right-1.5"
              style={{ background: 'var(--p-500)' }}
            />
          </button>
        </div>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-20 no-scrollbar">
        {/* Stories Horizontal Row */}
        <div className="py-3 px-3 flex items-center gap-3 overflow-x-auto no-scrollbar bd-b bg-app/30">
          {stories.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-full p-0.5 flex items-center justify-center ${
                  s.unread ? 'shadow-xs' : 'opacity-70'
                }`}
                style={{
                  background: s.unread
                    ? 'linear-gradient(135deg, var(--p-500), var(--a-500))'
                    : 'var(--border-default)',
                }}
              >
                <div className="w-full h-full rounded-full bg-surface p-0.5 flex items-center justify-center">
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: s.unread ? 'var(--p-600)' : 'var(--n-600)',
                    }}
                  >
                    {s.avatar}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-medium t-secondary truncate max-w-[56px]">
                {s.name}
              </span>
            </div>
          ))}
        </div>

        {/* Post 1 Card */}
        <div className="space-y-3 pb-4 bd-b">
          {/* Post Header */}
          <div className="px-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs"
                style={{ background: 'var(--a-500)' }}
              >
                ER
              </div>
              <div>
                <span className="text-xs font-bold t-primary block leading-none">
                  Elena Rostova
                </span>
                <span className="text-[10px] t-muted">Kyoto, Japan</span>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm h-6 w-6 !p-0">
              <MoreHorizontal className="w-4 h-4 t-muted" />
            </button>
          </div>

          {/* Post Media Display */}
          <div
            className="h-64 w-full flex items-center justify-center p-8 relative overflow-hidden select-none cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, var(--p-500), var(--a-600))',
            }}
            onDoubleClick={toggleLike}
          >
            <div className="w-36 h-36 rounded-3xl bg-white/20 backdrop-blur-md flex flex-col items-center justify-center text-white text-center p-4 shadow-xl border border-white/30">
              <Sparkles className="w-6 h-6 mb-1 text-white/90" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Chromatic
              </span>
              <span className="text-xl font-extrabold mt-0.5">2026</span>
              <span className="text-[9px] font-mono opacity-80 mt-1">
                Wide Gamut P3
              </span>
            </div>
          </div>

          {/* Post Actions & Likes */}
          <div className="px-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleLike}
                  className="hover:scale-110 active:scale-95 transition-transform"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      liked ? 'fill-red-500 text-red-500' : 't-secondary'
                    }`}
                  />
                </button>
                <button className="hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 t-secondary" />
                </button>
                <button className="hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5 t-secondary" />
                </button>
              </div>
              <button
                onClick={() => setSaved(!saved)}
                className="hover:scale-110 transition-transform"
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    saved
                      ? 'fill-[var(--p-500)] text-[var(--p-500)]'
                      : 't-secondary'
                  }`}
                />
              </button>
            </div>

            <div className="text-xs font-bold t-primary">
              {likesCount.toLocaleString()} likes
            </div>

            <div className="text-xs text-secondary leading-relaxed">
              <span className="font-bold t-primary mr-1">Elena Rostova</span>
              Exploring mathematical color harmonies in high-density visual displays. The semantic contrast ratio is razor sharp!
            </div>

            <span className="text-[10px] t-muted block uppercase tracking-wider">
              2 hours ago
            </span>
          </div>
        </div>

        {/* Post 2: Micro Card */}
        <div className="px-4 py-2">
          <div className="p-4 rounded-2xl bg-app bd space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="badge b-info text-[10px]">Upcoming Event</span>
              <span className="text-[10px] font-mono t-muted">Oct 14</span>
            </div>
            <h4 className="text-xs font-bold t-primary">
              Global Design Systems Keynote
            </h4>
            <p className="text-[11px] t-muted leading-relaxed">
              Live streaming from San Francisco with live color token compilation.
            </p>
            <button className="btn btn-primary btn-sm w-full text-xs">
              RSVP Free
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="h-14 px-6 bg-surface/95 backdrop-blur-md bd-t flex items-center justify-between absolute bottom-0 inset-x-0 z-20">
        <button className="btn btn-ghost btn-sm h-8 w-8 !p-0 text-[var(--p-500)]">
          <Home className="w-5 h-5" />
        </button>
        <button className="btn btn-ghost btn-sm h-8 w-8 !p-0 t-muted hover:t-primary">
          <Compass className="w-5 h-5" />
        </button>
        <button className="btn btn-ghost btn-sm h-8 w-8 !p-0 t-muted hover:t-primary">
          <PlusSquare className="w-5 h-5" />
        </button>
        <button className="btn btn-ghost btn-sm h-8 w-8 !p-0 t-muted hover:t-primary">
          <Heart className="w-5 h-5" />
        </button>
        <button className="btn btn-ghost btn-sm h-8 w-8 !p-0 t-muted hover:t-primary">
          <User className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
