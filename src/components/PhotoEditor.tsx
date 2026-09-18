"use client";

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { Type, Image as ImageIcon, Wand2 } from 'lucide-react';

interface PhotoEditorProps {
  photos: string[];
  mode: 'SINGLE' | 'STRIP';
  onComplete: (finalImage: string) => void;
  onCancel: () => void;
}

type FilterType = 'none' | 'vintage' | 'bw' | 'vibrant' | 'warm';
type FrameType = 'none' | 'polaroid' | 'floral' | 'gold' | 'film';

const STICKERS = [
  { id: 'glasses', name: 'Pink Shades', content: (
    <svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Frames */}
      <path d="M10 20C10 5 30 0 50 0C70 0 80 15 90 20C100 15 110 0 130 0C150 0 170 5 170 20C170 40 140 50 130 50C110 50 95 35 90 30C85 35 70 50 50 50C30 50 10 40 10 20Z" fill="rgba(255,182,193,0.3)" stroke="#ff69b4" strokeWidth="4"/>
      {/* Lenses - True translucent pink */}
      <path d="M15 20C15 10 30 5 50 5C65 5 75 15 80 20C80 30 70 45 50 45C30 45 15 35 15 20Z" fill="rgba(255,105,180,0.5)"/>
      <path d="M100 20C100 15 110 5 130 5C150 5 165 10 165 20C165 35 150 45 130 45C110 45 100 30 100 20Z" fill="rgba(255,105,180,0.5)"/>
      {/* Glare/Reflection */}
      <path d="M25 15L45 5" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M115 15L135 5" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )},
  { id: 'crown', name: 'Gold Crown', content: (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main Crown Base */}
      <path d="M10 80L20 20L45 50L70 10L95 50L120 20L130 80H10Z" fill="url(#goldGradient)" stroke="#b8860b" strokeWidth="2"/>
      {/* Jewels */}
      <circle cx="20" cy="15" r="8" fill="#ff1493"/>
      <circle cx="70" cy="5" r="10" fill="#ff1493"/>
      <circle cx="120" cy="15" r="8" fill="#ff1493"/>
      {/* Base details */}
      <path d="M10 85H130" stroke="#ff1493" strokeWidth="4"/>
      <circle cx="30" cy="70" r="4" fill="#ff1493"/>
      <circle cx="70" cy="70" r="5" fill="#ff1493"/>
      <circle cx="110" cy="70" r="4" fill="#ff1493"/>
      <defs>
        <linearGradient id="goldGradient" x1="0" y1="0" x2="140" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffd700"/>
          <stop offset="0.5" stopColor="#ffaa00"/>
          <stop offset="1" stopColor="#d4af37"/>
        </linearGradient>
      </defs>
    </svg>
  )},
  { id: 'flower', name: 'Pink Lily', content: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Leaves */}
      <path d="M60 60C40 100 0 90 20 50C40 80 60 60 60 60Z" fill="#8fbc8f"/>
      <path d="M60 60C100 80 120 40 80 30C90 60 60 60 60 60Z" fill="#8fbc8f"/>
      {/* Petals */}
      <path d="M60 60C40 20 20 0 60 10C100 0 80 20 60 60Z" fill="url(#pinkGradient)"/>
      <path d="M60 60C20 40 0 20 10 60C0 100 20 80 60 60Z" fill="url(#pinkGradient)"/>
      <path d="M60 60C100 40 120 20 110 60C120 100 100 80 60 60Z" fill="url(#pinkGradient)"/>
      <path d="M60 60C40 100 20 120 60 110C100 120 80 100 60 60Z" fill="url(#pinkGradient)"/>
      {/* Center */}
      <circle cx="60" cy="60" r="10" fill="#ffd700"/>
      <circle cx="60" cy="60" r="6" fill="#d4af37"/>
      <defs>
        <radialGradient id="pinkGradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
          <stop stopColor="#ffb6c1"/>
          <stop offset="1" stopColor="#ff69b4"/>
        </radialGradient>
      </defs>
    </svg>
  )}
];

export default function PhotoEditor({ photos, mode, onComplete, onCancel }: PhotoEditorProps) {
  const [filter, setFilter] = useState<FilterType>('none');
  const [frame, setFrame] = useState<FrameType>('none');
  const [activeStickers, setActiveStickers] = useState<{id: string, content: React.ReactNode, key: number}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const [stickerCounter, setStickerCounter] = useState(0);

  const addSticker = (sticker: typeof STICKERS[0]) => {
    setActiveStickers([...activeStickers, { id: sticker.id, content: sticker.content, key: stickerCounter }]);
    setStickerCounter(stickerCounter + 1);
  };

  const handleComplete = async () => {
    if (!captureRef.current) return;
    setIsProcessing(true);
    try {
      // Massive compression to guarantee it saves: scale 0.8, quality 0.5
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        scale: 0.8, 
        backgroundColor: '#ffffff',
      });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
      
      const { uploadPhoto } = await import('../app/actions');
      const blobUrl = await uploadPhoto(dataUrl);
      
      onComplete(blobUrl);
    } catch (err) {
      console.error("HTML2Canvas or Upload Error:", err);
      setIsProcessing(false);
      alert("Failed to save photo. Ensure your internet connection is stable and try again.");
    }
  };

  const getFilterStyle = () => {
    switch (filter) {
      case 'vintage': return 'sepia(0.6) contrast(1.1) brightness(0.9)';
      case 'bw': return 'grayscale(1) contrast(1.2)';
      case 'vibrant': return 'saturate(1.4) contrast(1.1)';
      case 'warm': return 'sepia(0.3) saturate(1.2) hue-rotate(-10deg)';
      default: return 'none';
    }
  };

  return (
    <div className="w-full h-full flex flex-row bg-[#fdf2f8] z-50 relative">
      {/* Editor Menu */}
      <div className="w-80 bg-white/90 backdrop-blur-md shadow-2xl p-6 overflow-y-auto border-r border-pink-100 relative z-50">
        <h2 className="text-4xl font-cursive text-pink-800 mb-8 border-b border-pink-100 pb-4">Customize</h2>
        
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-medium text-gray-700 mb-4"><Wand2 size={20} className="mr-2 text-pink-500" /> Filters</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['none', 'vintage', 'bw', 'vibrant', 'warm'] as FilterType[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`p-3 rounded-2xl capitalize font-medium transition-colors ${filter === f ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
              >
                {f === 'bw' ? 'B&W' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="flex items-center text-lg font-medium text-gray-700 mb-4"><ImageIcon size={20} className="mr-2 text-pink-500" /> Frames</h3>
          <div className="grid grid-cols-1 gap-2">
            {(['none', 'polaroid', 'floral', 'gold', 'film'] as FrameType[]).map(f => (
              <button key={f} onClick={() => setFrame(f)}
                className={`p-3 rounded-2xl capitalize font-medium transition-colors ${frame === f ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="flex items-center text-lg font-medium text-gray-700 mb-4"><Type size={20} className="mr-2 text-pink-500" /> Stickers</h3>
          <div className="grid grid-cols-1 gap-4">
            {STICKERS.map(s => (
              <button key={s.id} onClick={() => addSticker(s)}
                className="p-4 bg-white border-2 border-pink-100 rounded-2xl hover:border-pink-300 flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-sm"
              >
                <div className="h-16 flex items-center justify-center scale-50 transform origin-center">{s.content}</div>
                <span className="text-sm text-pink-800 font-medium mt-2">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <button onClick={onCancel} className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200">
            Retake Photo
          </button>
          <button onClick={handleComplete} disabled={isProcessing} className="w-full py-4 bg-[#d4af37] text-white rounded-2xl font-bold shadow-lg hover:bg-yellow-500 text-lg">
            {isProcessing ? 'Saving...' : 'Finish!'}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-white/20 relative">
        <div 
          ref={captureRef}
          className={`relative bg-white shadow-2xl flex flex-col ${
            frame === 'polaroid' ? 'p-6 pb-32 border border-gray-100' : 
            frame === 'film' ? 'p-6 bg-black border-x-[30px] border-x-gray-900 border-dashed' : 
            'p-0'
          }`}
          style={{ width: mode === 'SINGLE' ? '640px' : '400px' }}
        >
          {/* Photos Container */}
          <div className="w-full overflow-hidden flex flex-col relative pointer-events-none" style={{ filter: getFilterStyle(), gap: mode === 'STRIP' ? '12px' : '0' }}>
            {photos.map((p, i) => (
              <img key={i} src={p} className={`w-full object-cover ${mode === 'STRIP' ? 'aspect-[4/3] rounded-sm' : 'aspect-[4/3]'}`} alt={`Shot ${i}`} />
            ))}
          </div>

          {/* High Quality Overlay Frames */}
          {frame === 'floral' && (
            <div className="absolute inset-0 z-10 pointer-events-none border-[16px] border-pink-100">
              <svg className="absolute -top-4 -left-4 w-32 h-32" viewBox="0 0 100 100"><path d="M50 50C20 0 80 0 50 50C100 20 100 80 50 50Z" fill="#ffb6c1"/></svg>
              <svg className="absolute -top-4 -right-4 w-32 h-32 transform rotate-90" viewBox="0 0 100 100"><path d="M50 50C20 0 80 0 50 50C100 20 100 80 50 50Z" fill="#ffb6c1"/></svg>
              <svg className="absolute -bottom-4 -left-4 w-32 h-32 transform -rotate-90" viewBox="0 0 100 100"><path d="M50 50C20 0 80 0 50 50C100 20 100 80 50 50Z" fill="#ffb6c1"/></svg>
              <svg className="absolute -bottom-4 -right-4 w-32 h-32 transform rotate-180" viewBox="0 0 100 100"><path d="M50 50C20 0 80 0 50 50C100 20 100 80 50 50Z" fill="#ffb6c1"/></svg>
            </div>
          )}

          {frame === 'gold' && (
            <div className="absolute inset-4 z-10 pointer-events-none border-[4px] border-double border-[#d4af37]">
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]"></div>
            </div>
          )}

          {/* Stickers */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {activeStickers.map(sticker => (
              <motion.div 
                key={sticker.key} 
                drag 
                dragMomentum={false}
                className="absolute inline-block cursor-grab active:cursor-grabbing pointer-events-auto filter drop-shadow-md" 
                style={{ top: '30%', left: '30%', touchAction: 'none' }}
              >
                {sticker.content}
              </motion.div>
            ))}
          </div>

          {/* Watermark */}
          <div className={`absolute bottom-4 w-full text-center z-10 pointer-events-none left-0 ${frame === 'polaroid' ? 'bottom-10' : 'bottom-6'}`}>
            <h1 className="text-5xl font-cursive text-[#d4af37] drop-shadow-md font-bold bg-white/70 inline-block px-8 py-2 rounded-full backdrop-blur-sm">Zaara's 17th Birthday</h1>
            <p className="text-xs font-bold tracking-[0.2em] text-[#4a154b] mt-2 bg-white/40 inline-block px-4 py-1 rounded-full backdrop-blur-sm">SEPTEMBER 20, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
