"use client";

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { Type, Image as ImageIcon, Wand2, Crown, Flower2, Sparkles, Heart, Star, PartyPopper, Gift } from 'lucide-react';
import { savePhotoLocally } from '../utils/db';

interface PhotoEditorProps {
  photos: string[];
  mode: 'SINGLE' | 'STRIP';
  onComplete: (photoId: string) => void;
  onCancel: () => void;
}

type FilterType = 'none' | 'vintage' | 'bw' | 'vibrant';
type FrameType = 'none' | 'polaroid' | 'minimal-gold' | 'soft-glow' | 'film';
type StickerCategory = 'Glasses' | 'Decor' | 'Party';

const STICKERS: Record<StickerCategory, { id: string, name: string, content: React.ReactNode }[]> = {
  Glasses: [
    { id: 'heart-glasses', name: 'Heart Shades', content: (
      <svg width="200" height="90" viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50,80 Q 20,50 10,30 A 20,20 0 0,1 50,15 A 20,20 0 0,1 90,30 Q 80,50 50,80 Z" fill="rgba(255,20,147,0.4)" stroke="#ff1493" strokeWidth="6" strokeLinejoin="round"/>
        <path d="M 150,80 Q 120,50 110,30 A 20,20 0 0,1 150,15 A 20,20 0 0,1 190,30 Q 180,50 150,80 Z" fill="rgba(255,20,147,0.4)" stroke="#ff1493" strokeWidth="6" strokeLinejoin="round"/>
        <path d="M 90,25 Q 100,15 110,25" fill="none" stroke="#ff1493" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    )},
    { id: 'pink-shades', name: 'Pink Shades', content: (
      <svg width="200" height="70" viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="80" height="50" rx="15" fill="rgba(255,105,180,0.4)" stroke="#ff69b4" strokeWidth="6"/>
        <rect x="110" y="10" width="80" height="50" rx="15" fill="rgba(255,105,180,0.4)" stroke="#ff69b4" strokeWidth="6"/>
        <path d="M 90,30 Q 100,25 110,30" fill="none" stroke="#ff69b4" strokeWidth="6" strokeLinecap="round"/>
        <path d="M 10,30 L 0,30 M 190,30 L 200,30" stroke="#ff69b4" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    )},
    { id: 'dark-shades', name: 'Dark Shades', content: (
      <svg width="200" height="70" viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="80" height="50" rx="10" fill="rgba(0,0,0,0.7)" stroke="#333" strokeWidth="6"/>
        <rect x="110" y="10" width="80" height="50" rx="10" fill="rgba(0,0,0,0.7)" stroke="#333" strokeWidth="6"/>
        <path d="M 90,30 Q 100,25 110,30" fill="none" stroke="#333" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    )}
  ],
  Decor: [
    { id: 'flower', name: 'Flower', content: <Flower2 size={100} strokeWidth={1.5} color="#db2777" fill="#fbcfe8" /> },
    { id: 'sparkles', name: 'Sparkles', content: <Sparkles size={100} strokeWidth={1.5} color="#d4af37" fill="#fef08a" /> },
    { id: 'heart', name: 'Heart', content: <Heart size={100} strokeWidth={1.5} color="#e11d48" fill="#fda4af" /> },
    { id: 'star', name: 'Star', content: <Star size={100} strokeWidth={1.5} color="#d4af37" fill="#fde047" /> }
  ],
  Party: [
    { id: 'crown', name: 'Crown', content: <Crown size={120} strokeWidth={1.5} color="#b8860b" fill="#ffd700" /> },
    { id: 'popper', name: 'Popper', content: <PartyPopper size={100} strokeWidth={1.5} color="#ea580c" fill="#fdba74" /> },
    { id: 'gift', name: 'Gift', content: <Gift size={100} strokeWidth={1.5} color="#4f46e5" fill="#a5b4fc" /> }
  ]
};

export default function PhotoEditor({ photos, mode, onComplete, onCancel }: PhotoEditorProps) {
  const [filter, setFilter] = useState<FilterType>('none');
  const [frame, setFrame] = useState<FrameType>('none');
  const [activeStickers, setActiveStickers] = useState<{id: string, content: React.ReactNode, key: number}[]>([]);
  const [activeCategory, setActiveCategory] = useState<StickerCategory>('Glasses');
  const [isProcessing, setIsProcessing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const [stickerCounter, setStickerCounter] = useState(0);

  const addSticker = (sticker: typeof STICKERS[StickerCategory][0]) => {
    setActiveStickers([...activeStickers, { id: sticker.id, content: sticker.content, key: stickerCounter }]);
    setStickerCounter(stickerCounter + 1);
  };

  const handleComplete = async () => {
    if (!captureRef.current) return;
    setIsProcessing(true);
    try {
      const canvas = await html2canvas(captureRef.current, {
        scale: 1.5,
        backgroundColor: '#ffffff',
      });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
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
      <div className="w-96 bg-white/90 backdrop-blur-md shadow-2xl p-6 overflow-y-auto border-r border-pink-100 relative z-50 flex flex-col">
        <h2 className="text-4xl font-cursive text-pink-800 mb-6 border-b border-pink-100 pb-4">Customize</h2>
        
        <div className="mb-6">
          <h3 className="flex items-center text-lg font-medium text-gray-700 mb-3"><Wand2 size={18} className="mr-2 text-pink-500" /> Filters</h3>
          <div className="flex flex-wrap gap-2">
            {(['none', 'vintage', 'bw', 'vibrant'] as FilterType[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-pink-500 text-white shadow-md' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
              >
                {f === 'bw' ? 'B&W' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="flex items-center text-lg font-medium text-gray-700 mb-3"><ImageIcon size={18} className="mr-2 text-pink-500" /> Frames</h3>
          <div className="flex flex-wrap gap-2">
            {(['none', 'polaroid', 'minimal-gold', 'soft-glow', 'film'] as FrameType[]).map(f => (
              <button key={f} onClick={() => setFrame(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${frame === f ? 'bg-pink-500 text-white shadow-md' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <h3 className="flex items-center text-lg font-medium text-gray-700 mb-3"><Type size={18} className="mr-2 text-pink-500" /> Stickers</h3>
          
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {(Object.keys(STICKERS) as StickerCategory[]).map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === cat ? 'bg-pink-100 text-pink-800 ring-2 ring-pink-400' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 pb-4 flex-1">
            {STICKERS[activeCategory].map(s => (
              <button key={s.id} onClick={() => addSticker(s)}
                className="p-3 bg-white border border-pink-100 rounded-xl hover:border-pink-300 hover:shadow-md flex flex-col items-center justify-center transition-all"
              >
                <div className="h-16 w-full flex items-center justify-center transform scale-50 origin-center">{s.content}</div>
                <span className="text-xs text-gray-600 font-medium mt-1">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-auto border-t border-pink-100 flex flex-col gap-3">
          <button onClick={onCancel} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">
            Retake Photo
          </button>
          <button onClick={handleComplete} disabled={isProcessing} className="w-full py-4 bg-gradient-to-r from-pink-500 to-[#d4af37] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg">
            {isProcessing ? 'Saving...' : 'Finish!'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
        <div 
          ref={captureRef}
          className={`relative bg-white shadow-2xl flex flex-col transition-all duration-300 ${
            frame === 'polaroid' ? 'p-6 pb-28 border border-gray-100 rounded-sm' : 
            frame === 'minimal-gold' ? 'p-3 border-[6px] border-[#d4af37] bg-white' : 
            frame === 'soft-glow' ? 'p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(255,182,193,0.8)]' : 
            frame === 'film' ? 'p-6 bg-black border-x-[24px] border-x-gray-900' : 
            'p-0'
          }`}
          style={{ width: mode === 'SINGLE' ? '640px' : '400px' }}
        >
          {frame === 'film' && (
            <div className="absolute inset-y-0 left-[-20px] w-4 flex flex-col justify-around py-4 opacity-50">
              {[...Array(10)].map((_, i) => <div key={`l-${i}`} className="w-full h-6 bg-white rounded-sm"></div>)}
            </div>
          )}
          {frame === 'film' && (
            <div className="absolute inset-y-0 right-[-20px] w-4 flex flex-col justify-around py-4 opacity-50">
              {[...Array(10)].map((_, i) => <div key={`r-${i}`} className="w-full h-6 bg-white rounded-sm"></div>)}
            </div>
          )}

          <div className={`w-full overflow-hidden flex flex-col relative pointer-events-none ${frame === 'soft-glow' ? 'rounded-2xl' : ''}`} style={{ filter: getFilterStyle(), gap: mode === 'STRIP' ? '12px' : '0' }}>
            {photos.map((p, i) => (
              <img key={i} src={p} className={`w-full object-cover ${mode === 'STRIP' ? 'aspect-[4/3] rounded-sm' : 'aspect-[4/3]'}`} alt={`Shot ${i}`} />
            ))}
          </div>

          <div className="absolute inset-0 z-20 pointer-events-none overflow-visible">
            {activeStickers.map(sticker => (
              <motion.div 
                key={sticker.key} 
                drag 
                dragMomentum={false}
                className="absolute inline-block cursor-grab active:cursor-grabbing pointer-events-auto filter drop-shadow-lg" 
                style={{ top: '40%', left: '40%', touchAction: 'none' }}
              >
                {sticker.content}
              </motion.div>
            ))}
          </div>

          {(frame === 'polaroid' || frame === 'minimal-gold' || frame === 'soft-glow') && (
            <div className={`absolute w-full text-center z-10 pointer-events-none left-0 ${frame === 'polaroid' ? 'bottom-8' : 'bottom-6'}`}>
              <h1 className="text-4xl font-cursive text-[#d4af37] drop-shadow-sm font-bold bg-white/80 inline-block px-6 py-2 rounded-full backdrop-blur-sm">Zaara's 17th Birthday</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
