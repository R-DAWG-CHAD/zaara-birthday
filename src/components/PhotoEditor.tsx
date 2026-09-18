"use client";

import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import Draggable from 'react-draggable';
import { Type, Image as ImageIcon, Wand2, Plus } from 'lucide-react';

interface PhotoEditorProps {
  photos: string[];
  mode: 'SINGLE' | 'STRIP';
  onComplete: (finalImage: string) => void;
  onCancel: () => void;
}

type FilterType = 'none' | 'vintage' | 'bw' | 'vibrant';
type FrameType = 'none' | 'polaroid' | 'floral';

const STICKERS = [
  { id: 'glasses-1', emoji: '👓', name: 'Glasses' },
  { id: 'glasses-2', emoji: '🕶️', name: 'Tinted' },
  { id: 'flower-1', emoji: '🌸', name: 'Flower' },
  { id: 'cake-1', emoji: '🎂', name: 'Cake' },
  { id: 'sparkle-1', emoji: '✨', name: 'Sparkle' },
  { id: 'crown-1', emoji: '👑', name: 'Crown' },
];

export default function PhotoEditor({ photos, mode, onComplete, onCancel }: PhotoEditorProps) {
  const [filter, setFilter] = useState<FilterType>('none');
  const [frame, setFrame] = useState<FrameType>('none');
  const [activeStickers, setActiveStickers] = useState<{id: string, emoji: string, key: number}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const [stickerCounter, setStickerCounter] = useState(0);

  const addSticker = (emoji: string) => {
    setActiveStickers([...activeStickers, { id: `sticker-${stickerCounter}`, emoji, key: stickerCounter }]);
    setStickerCounter(stickerCounter + 1);
  };

  const handleComplete = async () => {
    if (!captureRef.current) return;
    setIsProcessing(true);
    try {
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Upload to Vercel Blob
      const { uploadPhoto } = await import('../app/actions');
      const blobUrl = await uploadPhoto(dataUrl);
      
      onComplete(blobUrl);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert("Failed to save photo. Please try again.");
    }
  };

  const getFilterStyle = () => {
    switch (filter) {
      case 'vintage': return 'sepia(0.5) contrast(1.1) brightness(0.9)';
      case 'bw': return 'grayscale(1) contrast(1.2)';
      case 'vibrant': return 'saturate(1.5) contrast(1.1)';
      default: return 'none';
    }
  };

  return (
    <div className="w-full h-full flex flex-row bg-[#fdf2f8] z-50">
      {/* Sidebar Toolbars */}
      <div className="w-80 bg-white shadow-2xl p-6 overflow-y-auto border-r-4 border-[#d4af37]">
        <h2 className="text-3xl font-serif text-pink-800 mb-8 border-b-2 border-pink-100 pb-4">Customize</h2>
        
        {/* Filters */}
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-medium text-gray-700 mb-4"><Wand2 size={20} className="mr-2" /> Filters</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['none', 'vintage', 'bw', 'vibrant'] as FilterType[]).map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`p-3 rounded-xl capitalize font-medium transition-colors ${filter === f ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
              >
                {f === 'bw' ? 'B&W' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Frames */}
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-medium text-gray-700 mb-4"><ImageIcon size={20} className="mr-2" /> Frames</h3>
          <div className="grid grid-cols-1 gap-2">
            {(['none', 'polaroid', 'floral'] as FrameType[]).map(f => (
              <button 
                key={f} 
                onClick={() => setFrame(f)}
                className={`p-3 rounded-xl capitalize font-medium transition-colors ${frame === f ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
              >
                {f} Frame
              </button>
            ))}
          </div>
        </div>

        {/* Stickers */}
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-medium text-gray-700 mb-4"><Type size={20} className="mr-2" /> Stickers</h3>
          <div className="grid grid-cols-3 gap-2">
            {STICKERS.map(s => (
              <button 
                key={s.id} 
                onClick={() => addSticker(s.emoji)}
                className="text-4xl p-2 bg-pink-50 rounded-xl hover:bg-pink-100 flex items-center justify-center transform hover:scale-110 transition-transform"
                title={s.name}
              >
                {s.emoji}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">Tap to add, drag to move!</p>
        </div>

        <div className="pt-4 border-t-2 border-pink-100 flex flex-col gap-4">
          <button onClick={onCancel} className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200">
            Retake Photo
          </button>
          <button onClick={handleComplete} disabled={isProcessing} className="w-full py-4 bg-[#d4af37] text-white rounded-2xl font-bold shadow-lg hover:bg-yellow-500 text-lg flex items-center justify-center">
            {isProcessing ? 'Processing...' : 'Looks Good!'}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/floral-motif.png')]">
        
        {/* The Snapshot Target */}
        <div 
          ref={captureRef}
          className={`relative bg-white shadow-2xl transition-all duration-300 ${
            frame === 'polaroid' ? 'p-8 pb-32' : 
            frame === 'floral' ? 'p-8 border-[24px] border-[#fdf2f8] outline outline-8 outline-[#8fbc8f]' : 
            'p-0'
          }`}
          style={{ width: mode === 'SINGLE' ? '640px' : '400px' }}
        >
          {/* Inner Photo Container */}
          <div 
            className="w-full overflow-hidden flex flex-col relative"
            style={{ 
              filter: getFilterStyle(),
              gap: mode === 'STRIP' ? '12px' : '0' 
            }}
          >
            {photos.map((p, i) => (
              <img 
                key={i} 
                src={p} 
                className={`w-full object-cover transform scale-x-[-1] ${mode === 'STRIP' ? 'aspect-[4/3] rounded-md' : 'aspect-[4/3]'}`} 
                alt={`Shot ${i}`} 
              />
            ))}
          </div>

          {/* Draggable Stickers Overlay */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {activeStickers.map(sticker => (
              <Draggable key={sticker.key} bounds="parent">
                <div className="absolute inline-block pointer-events-auto cursor-grab active:cursor-grabbing">
                  <div className="text-6xl filter drop-shadow-md">{sticker.emoji}</div>
                </div>
              </Draggable>
            ))}
          </div>

          {/* Footer Text */}
          <div className={`absolute bottom-4 left-0 w-full text-center z-10 ${frame === 'polaroid' ? 'bottom-12' : 'bottom-6'}`}>
            <h1 className="text-3xl font-serif text-[#d4af37] drop-shadow-sm font-bold bg-white/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm">Zaara's 17th Birthday</h1>
            <p className="text-sm font-medium tracking-widest text-[#4a154b] mt-1">SEPTEMBER 20, 2026</p>
          </div>
        </div>

      </div>
    </div>
  );
}
