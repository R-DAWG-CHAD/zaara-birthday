"use client";

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { Type, Image as ImageIcon, Wand2 } from 'lucide-react';
import { savePhotoLocally } from '../utils/db';

interface PhotoEditorProps {
  photos: string[];
  mode: 'SINGLE' | 'STRIP';
  onComplete: (photoId: string) => void;
  onCancel: () => void;
}

type FilterType = 'none' | 'vintage' | 'bw' | 'vibrant';
type FrameType = 'none' | 'polaroid' | 'elegant-floral' | 'royal-gold' | 'film';

const STICKERS = [
  { id: 'heart-glasses', name: 'Heart Shades', content: (
    <svg width="180" height="70" viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Frames */}
      <path d="M45 5C20 5 10 20 10 35C10 50 25 65 45 65C65 65 80 50 90 35C100 50 115 65 135 65C155 65 170 50 170 35C170 20 160 5 135 5C120 5 105 15 90 25C75 15 60 5 45 5Z" fill="rgba(255,105,180,0.3)" stroke="#ff1493" strokeWidth="5"/>
      {/* Lenses */}
      <path d="M45 10C25 10 15 22 15 35C15 48 28 60 45 60C62 60 75 48 85 35C75 22 62 10 45 10Z" fill="rgba(255,20,147,0.5)"/>
      <path d="M135 10C118 10 105 22 95 35C105 48 118 60 135 60C152 60 165 48 165 35C165 22 155 10 135 10Z" fill="rgba(255,20,147,0.5)"/>
      {/* Bridge & Arms */}
      <path d="M85 35C85 35 90 30 95 35" stroke="#ff1493" strokeWidth="5" strokeLinecap="round"/>
      <path d="M10 35L0 35" stroke="#ff1493" strokeWidth="5" strokeLinecap="round"/>
      <path d="M170 35L180 35" stroke="#ff1493" strokeWidth="5" strokeLinecap="round"/>
      {/* Glare */}
      <path d="M25 25L40 15" stroke="rgba(255,255,255,0.8)" strokeWidth="4" strokeLinecap="round"/>
      <path d="M115 25L130 15" stroke="rgba(255,255,255,0.8)" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  )},
  { id: 'glasses', name: 'Pink Shades', content: (
    <svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20C10 5 30 0 50 0C70 0 80 15 90 20C100 15 110 0 130 0C150 0 170 5 170 20C170 40 140 50 130 50C110 50 95 35 90 30C85 35 70 50 50 50C30 50 10 40 10 20Z" fill="rgba(255,182,193,0.3)" stroke="#ff69b4" strokeWidth="4"/>
      <path d="M15 20C15 10 30 5 50 5C65 5 75 15 80 20C80 30 70 45 50 45C30 45 15 35 15 20Z" fill="rgba(255,105,180,0.5)"/>
      <path d="M100 20C100 15 110 5 130 5C150 5 165 10 165 20C165 35 150 45 130 45C110 45 100 30 100 20Z" fill="rgba(255,105,180,0.5)"/>
      <path d="M25 15L45 5" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M115 15L135 5" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )},
  { id: 'crown-detailed', name: 'Royal Crown', content: (
    <svg width="160" height="110" viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Highly detailed Crown */}
      <path d="M15 90L20 40C20 30 30 25 40 35L55 60L75 15C80 5 90 15 85 25L80 60L105 35C115 25 125 30 125 40L135 90H15Z" fill="url(#crownGold)" stroke="#b8860b" strokeWidth="3"/>
      {/* Base */}
      <rect x="10" y="90" width="130" height="15" rx="5" fill="url(#crownGold)" stroke="#b8860b" strokeWidth="2"/>
      <circle cx="80" cy="10" r="8" fill="#ff1493" stroke="#ffd700" strokeWidth="2"/>
      <circle cx="20" cy="30" r="6" fill="#ff1493" stroke="#ffd700" strokeWidth="2"/>
      <circle cx="130" cy="30" r="6" fill="#ff1493" stroke="#ffd700" strokeWidth="2"/>
      <circle cx="50" cy="80" r="5" fill="#ff1493"/>
      <circle cx="80" cy="80" r="7" fill="#ff1493"/>
      <circle cx="110" cy="80" r="5" fill="#ff1493"/>
      {/* Engravings */}
      <path d="M30 65C40 75 50 65 60 75C70 65 80 75 90 65" stroke="#b8860b" strokeWidth="2" fill="none"/>
      <defs>
        <linearGradient id="crownGold" x1="0" y1="0" x2="160" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe066"/>
          <stop offset="0.5" stopColor="#d4af37"/>
          <stop offset="1" stopColor="#996515"/>
        </linearGradient>
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
      const canvas = await html2canvas(captureRef.current, {
        scale: 1.5, // Better quality since we save locally now
        backgroundColor: '#ffffff',
      });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // High quality local save
      
      const photoId = await savePhotoLocally(dataUrl);
      onComplete(photoId);
    } catch (err) {
      console.error("Save Error:", err);
      setIsProcessing(false);
      alert("Failed to save photo locally.");
    }
  };

  const getFilterStyle = () => {
    switch (filter) {
      case 'vintage': return 'sepia(0.6) contrast(1.1) brightness(0.9)';
      case 'bw': return 'grayscale(1) contrast(1.2)';
      case 'vibrant': return 'saturate(1.4) contrast(1.1)';
      default: return 'none';
    }
  };

  return (
    <div className="w-full h-full flex flex-row bg-[#fdf2f8] z-50 relative">
      <div className="w-80 bg-white/90 backdrop-blur-md shadow-2xl p-6 overflow-y-auto border-r border-pink-100 relative z-50">
        <h2 className="text-4xl font-cursive text-pink-800 mb-8 border-b border-pink-100 pb-4">Customize</h2>
        
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-medium text-gray-700 mb-4"><Wand2 size={20} className="mr-2 text-pink-500" /> Filters</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['none', 'vintage', 'bw', 'vibrant'] as FilterType[]).map(f => (
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
            {(['none', 'polaroid', 'elegant-floral', 'royal-gold', 'film'] as FrameType[]).map(f => (
              <button key={f} onClick={() => setFrame(f)}
                className={`p-3 rounded-2xl capitalize font-medium transition-colors ${frame === f ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
              >
                {f.replace('-', ' ')}
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
          <div className="w-full overflow-hidden flex flex-col relative pointer-events-none" style={{ filter: getFilterStyle(), gap: mode === 'STRIP' ? '12px' : '0' }}>
            {photos.map((p, i) => (
              <img key={i} src={p} className={`w-full object-cover ${mode === 'STRIP' ? 'aspect-[4/3] rounded-sm' : 'aspect-[4/3]'}`} alt={`Shot ${i}`} />
            ))}
          </div>

          {frame === 'elegant-floral' && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <svg className="absolute top-0 left-0 w-48 h-48" viewBox="0 0 200 200">
                <path d="M0,0 L200,0 L0,200 Z" fill="#fff" opacity="0.8"/>
                <path d="M20,20 C50,0 80,40 40,80 C0,50 0,20 20,20Z" fill="#ffb6c1"/>
                <path d="M60,10 C80,0 100,20 80,50 C60,20 40,20 60,10Z" fill="#ff69b4"/>
                <path d="M10,60 C0,80 20,100 50,80 C20,60 20,40 10,60Z" fill="#ff69b4"/>
                <path d="M30,30 C60,-10 100,50 30,30Z" fill="none" stroke="#d4af37" strokeWidth="2"/>
                <circle cx="45" cy="45" r="8" fill="#d4af37"/>
              </svg>
              <svg className="absolute bottom-0 right-0 w-48 h-48 transform rotate-180" viewBox="0 0 200 200">
                <path d="M0,0 L200,0 L0,200 Z" fill="#fff" opacity="0.8"/>
                <path d="M20,20 C50,0 80,40 40,80 C0,50 0,20 20,20Z" fill="#ffb6c1"/>
                <path d="M60,10 C80,0 100,20 80,50 C60,20 40,20 60,10Z" fill="#ff69b4"/>
                <path d="M10,60 C0,80 20,100 50,80 C20,60 20,40 10,60Z" fill="#ff69b4"/>
                <path d="M30,30 C60,-10 100,50 30,30Z" fill="none" stroke="#d4af37" strokeWidth="2"/>
                <circle cx="45" cy="45" r="8" fill="#d4af37"/>
              </svg>
            </div>
          )}

          {frame === 'royal-gold' && (
            <div className="absolute inset-4 z-10 pointer-events-none border-4 border-[#d4af37]">
              <div className="absolute inset-2 border border-[#d4af37]"></div>
              <svg className="absolute -top-3 -left-3 w-8 h-8" viewBox="0 0 40 40">
                <rect width="40" height="40" fill="#fff"/>
                <circle cx="20" cy="20" r="10" fill="none" stroke="#d4af37" strokeWidth="4"/>
                <circle cx="20" cy="20" r="4" fill="#d4af37"/>
              </svg>
              <svg className="absolute -top-3 -right-3 w-8 h-8" viewBox="0 0 40 40">
                <rect width="40" height="40" fill="#fff"/>
                <circle cx="20" cy="20" r="10" fill="none" stroke="#d4af37" strokeWidth="4"/>
                <circle cx="20" cy="20" r="4" fill="#d4af37"/>
              </svg>
              <svg className="absolute -bottom-3 -left-3 w-8 h-8" viewBox="0 0 40 40">
                <rect width="40" height="40" fill="#fff"/>
                <circle cx="20" cy="20" r="10" fill="none" stroke="#d4af37" strokeWidth="4"/>
                <circle cx="20" cy="20" r="4" fill="#d4af37"/>
              </svg>
              <svg className="absolute -bottom-3 -right-3 w-8 h-8" viewBox="0 0 40 40">
                <rect width="40" height="40" fill="#fff"/>
                <circle cx="20" cy="20" r="10" fill="none" stroke="#d4af37" strokeWidth="4"/>
                <circle cx="20" cy="20" r="4" fill="#d4af37"/>
              </svg>
            </div>
          )}

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

          <div className={`absolute bottom-4 w-full text-center z-10 pointer-events-none left-0 ${frame === 'polaroid' ? 'bottom-10' : 'bottom-6'}`}>
            <h1 className="text-5xl font-cursive text-[#d4af37] drop-shadow-md font-bold bg-white/70 inline-block px-8 py-2 rounded-full backdrop-blur-sm">Zaara's 17th Birthday</h1>
            <p className="text-xs font-bold tracking-[0.2em] text-[#4a154b] mt-2 bg-white/40 inline-block px-4 py-1 rounded-full backdrop-blur-sm">SEPTEMBER 20, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
