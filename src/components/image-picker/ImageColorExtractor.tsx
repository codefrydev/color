'use client';

import React, { useState, useRef } from 'react';
import { useStudio } from '../../state/StudioContext';
import { extractColorsFromImage, ExtractedColor } from '../../core/color/extractor';
import { Image as ImageIcon, UploadCloud, Sparkles, Check } from 'lucide-react';

export function ImageColorExtractor() {
  const { updateState } = useStudio();
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setLoading(true);
    try {
      const url = URL.createObjectURL(file);
      setPreviewSrc(url);
      const extracted = await extractColorsFromImage(file, 6);
      setColors(extracted);
    } catch (e) {
      console.error('Failed to extract colors', e);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-center pb-3 bd-b">
        <div>
          <h2 className="text-sm font-bold t-primary flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[var(--p-500)]" />
            Image Brand Color Extractor
          </h2>
          <p className="text-xs t-muted">
            Drag and drop logos or images to automatically extract harmonic palette colors.
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[var(--border-default)] hover:border-[var(--border-focus)] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-app/50"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />

        {previewSrc ? (
          <div className="flex items-center gap-4">
            <img
              src={previewSrc}
              alt="Uploaded"
              className="w-16 h-16 object-cover rounded-lg bd shadow-sm"
            />
            <div className="text-left">
              <span className="text-xs font-semibold t-primary block">
                Image Analyzed Successfully
              </span>
              <span className="text-[11px] t-muted block">
                Click or drop another image to re-extract
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <UploadCloud className="w-8 h-8 t-muted" />
            <span className="text-xs font-semibold t-primary">
              Drop an image or click to browse
            </span>
            <span className="text-[11px] t-muted">PNG, JPG, SVG, WebP up to 10MB</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-2 text-xs t-muted animate-pulse">
          Quantizing pixels and deriving palette...
        </div>
      )}

      {colors.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-semibold t-secondary block uppercase tracking-wider">
            Dominant Brand Swatches
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {colors.map((c, i) => (
              <div
                key={i}
                className="card card-tight !p-2 space-y-2 flex flex-col items-center text-center bg-surface"
              >
                <div
                  className="w-full h-12 rounded-md shadow-inner bd"
                  style={{ background: c.hex }}
                />
                <span className="font-mono text-xs font-bold t-primary">
                  {c.hex.toUpperCase()}
                </span>
                <span className="text-[10px] t-muted">
                  {c.percentage.toFixed(0)}% frequency
                </span>

                <div className="flex flex-col gap-1 w-full pt-1">
                  <button
                    onClick={() =>
                      updateState(
                        {
                          h: Math.round(c.hsl.h),
                          s: Math.round(c.hsl.s),
                          l: Math.round(c.hsl.l),
                        },
                        `Extracted Primary → ${c.hex}`
                      )
                    }
                    className="btn btn-primary btn-sm !py-1 text-[10px] w-full"
                  >
                    Set Primary
                  </button>
                  <button
                    onClick={() =>
                      updateState(
                        {
                          accentShift: Math.round(c.hsl.h - 180),
                        },
                        `Extracted Accent → ${c.hex}`
                      )
                    }
                    className="btn btn-secondary btn-sm !py-1 text-[10px] w-full"
                  >
                    Set Accent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
