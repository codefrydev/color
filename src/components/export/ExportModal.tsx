'use client';

import React, { useState } from 'react';
import { useStudio } from '../../state/StudioContext';
import { exportCss } from '../../core/exporters/css';
import { exportTailwindV4, exportTailwindV3 } from '../../core/exporters/tailwind';
import { exportShadcn } from '../../core/exporters/shadcn';
import { exportTokensJson } from '../../core/exporters/tokensJson';
import { exportSwift, exportKotlin } from '../../core/exporters/mobile';
import { X, Copy, Check, Download, FileCode } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportTab =
  | 'css'
  | 'tw4'
  | 'tw3'
  | 'shadcn'
  | 'json'
  | 'swift'
  | 'kotlin';

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { state } = useStudio();
  const [activeTab, setActiveTab] = useState<ExportTab>('css');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  let code = '';
  let filename = 'design-tokens';
  let ext = 'css';

  switch (activeTab) {
    case 'css':
      code = exportCss(state);
      filename = 'tokens';
      ext = 'css';
      break;
    case 'tw4':
      code = exportTailwindV4(state);
      filename = 'theme-v4';
      ext = 'css';
      break;
    case 'tw3':
      code = exportTailwindV3(state);
      filename = 'tailwind.config';
      ext = 'js';
      break;
    case 'shadcn':
      code = exportShadcn(state);
      filename = 'shadcn-theme';
      ext = 'css';
      break;
    case 'json':
      code = exportTokensJson(state);
      filename = 'tokens';
      ext = 'json';
      break;
    case 'swift':
      code = exportSwift(state);
      filename = 'ColorStudioTokens';
      ext = 'swift';
      break;
    case 'kotlin':
      code = exportKotlin(state);
      filename = 'ColorStudioTokens';
      ext = 'kt';
      break;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: ExportTab; label: string }[] = [
    { id: 'css', label: 'CSS Variables' },
    { id: 'tw4', label: 'Tailwind v4' },
    { id: 'tw3', label: 'Tailwind v3' },
    { id: 'shadcn', label: 'Shadcn UI' },
    { id: 'json', label: 'W3C DTCG JSON' },
    { id: 'swift', label: 'SwiftUI' },
    { id: 'kotlin', label: 'Compose' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 bd-b bg-surface">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[var(--p-500)]" />
            <h2 className="text-base font-bold t-primary">Export Design System Tokens</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-hover)] t-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 bd-b bg-app overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${
                activeTab === tab.id ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-slate-950 font-mono text-xs text-slate-100 select-text">
          <pre className="whitespace-pre">{code}</pre>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center px-6 py-4 bd-t bg-surface">
          <span className="text-xs t-muted">
            Format: {ext.toUpperCase()} | Ready for production drop-in
          </span>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="btn btn-secondary">
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
            <button onClick={handleCopy} className="btn btn-primary min-w-[120px]">
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
