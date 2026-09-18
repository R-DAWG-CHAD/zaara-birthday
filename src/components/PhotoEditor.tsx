"use client";

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import Draggable from 'react-draggable';
import { Type, Image as ImageIcon, Wand2 } from 'lucide-react';

interface PhotoEditorProps {
  photos: string[];
  mode: 'SINGLE' | 'STRIP';
  onComplete: (finalImage: string) => void;
  onCancel: () => void;
}

type FilterType = 'none' | 'vintage' | 'bw' | 'vibrant' | 'warm';
type FrameType = 'none' | 'polaroid' | 'floral-border' | 'gold-minimal' | 'film';

const STICKERS = [
  { id: 'glasses', name: 'Pink Shades', content: (
    <svg width="140" height="50" viewBox="0 0 120 40" fill="none">
      <path d="M10 20C10 10 20 5 35 5C50 5 55 15 60 20C65 15 70 5 85 5C100 5 110 10 110 20C110 35 90 40 85 40C80 40 65 30 60 25C55 30 40 40 35 40C30 40 10 35 10 20Z" fill="rgba(255,105,180,0.6)" stroke="#fff" strokeWidth="2" />
      <path d="M0 10 L15 10 M105 10 L120 10 M55 15 L65 15" stroke="#fff" strokeWidth="4" />
    </svg>
  )},
  { id: 'glasses-dark', name: 'Dark Shades', content: (
    <svg width="140" height="50" viewBox="0 0 120 40" fill="none">
      <path d="M10 20C10 10 20 5 35 5C50 5 55 15 60 20C65 15 70 5 85 5C100 5 110 10 110 20C110 35 90 40 85 40C80 40 65 30 60 25C55 30 40 40 35 40C30 40 10 35 10 20Z" fill="rgba(0,0,0,0.7)" stroke="#333" strokeWidth="2" />
      <path d="M0 10 L15 10 M105 10 L120 10 M55 15 L65 15" stroke="#333" strokeWidth="4" />
    </svg>
  )},
  { id: 'crown', name: 'Gold Crown', content: (
    <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
      <path d="M10 70 L20 30 L40 50 L50 10 L60 50 L80 30 L90 70 Z" fill="rgba(212,175,55,0.9)" stroke="#fff" strokeWidth="2" />
      <circle cx="20" cy="25" r="5" fill="#fff" />
      <circle cx="50" cy="5" r="6" fill="#fff" />
      <circle cx="80" cy="25" r="5" fill="#fff" />
    </svg>
  )},
  { id: 'flower', name: 'Lily', content: (
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
      <path d="M50 50 C20 0 80 0 50 50 C100 20 100 80 50 50 C80 100 20 100 50 50 C0 80 0 20 50 50 Z" fill="rgba(252,165,165,0.8)" stroke="#fff" strokeWidth="2" />
      <circle cx="50" cy="50" r="8" fill="#d4af37" />
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
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      const { uploadPhoto } = await import('../app/actions');
      const blobUrl = await uploadPhoto(dataUrl);
      
      onComplete(blobUrl);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert("Failed to save photo.");
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
    <div className="w-full h-full flex flex-row bg-[#fdf2f8] z-50">
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
            {(['none', 'polaroid', 'floral-border', 'gold-minimal', 'film'] as FrameType[]).map(f => (
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
          <div className="grid grid-cols-2 gap-4">
            {STICKERS.map(s => (
              <button key={s.id} onClick={() => addSticker(s)}
                className="p-2 bg-pink-50 rounded-2xl hover:bg-pink-100 flex flex-col items-center justify-center transition-transform hover:scale-105"
              >
                <div className="h-16 flex items-center justify-center scale-50 transform origin-center">{s.content}</div>
                <span className="text-xs text-pink-800 font-medium">{s.name}</span>
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

      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-detailed-floral">
        <div 
          ref={captureRef}
          className={`relative bg-white shadow-2xl transition-all duration-300 flex flex-col ${
            frame === 'polaroid' ? 'p-8 pb-32 border border-gray-200' : 
            frame === 'floral-border' ? 'p-8 border-[20px] border-transparent border-image-floral' : 
            frame === 'gold-minimal' ? 'p-4 border-4 border-[#d4af37]' : 
            frame === 'film' ? 'p-6 bg-black border-x-[20px] border-x-gray-900 border-dashed' : 
            'p-0'
          }`}
          style={{ width: mode === 'SINGLE' ? '640px' : '400px' }}
        >
          <div className="w-full overflow-hidden flex flex-col relative pointer-events-none" style={{ filter: getFilterStyle(), gap: mode === 'STRIP' ? '12px' : '0' }}>
            {photos.map((p, i) => (
              <img key={i} src={p} className={`w-full object-cover transform scale-x-[-1] ${mode === 'STRIP' ? 'aspect-[4/3] rounded-sm' : 'aspect-[4/3]'}`} alt={`Shot ${i}`} />
            ))}
          </div>

          <div className="absolute inset-0 z-20 pointer-events-auto">
            {activeStickers.map(sticker => (
              <Draggable key={sticker.key} bounds="parent" defaultPosition={{x: 150, y: 150}}>
                <div className="absolute inline-block cursor-grab active:cursor-grabbing hover:scale-105 transition-transform" style={{touchAction: 'none'}}>
                  <div className="filter drop-shadow-lg">{sticker.content}</div>
                </div>
              </Draggable>
            ))}
          </div>

          <div className={`absolute bottom-4 w-full text-center z-10 pointer-events-none left-0 ${frame === 'polaroid' ? 'bottom-12' : 'bottom-6'}`}>
            <h1 className="text-5xl font-cursive text-[#d4af37] drop-shadow-md font-bold bg-white/70 inline-block px-8 py-2 rounded-full backdrop-blur-sm">Zaara's 17th Birthday</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
