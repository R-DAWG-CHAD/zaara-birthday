"use client";

import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { Type, Image as ImageIcon, Wand2, Star, Sparkles } from 'lucide-react';
import { savePhotoLocally } from '../utils/db';

interface PhotoEditorProps {
  photos: string[];
  mode: 'SINGLE' | 'STRIP';
  onComplete: (dataUrl: string) => void;
  onCancel: () => void;
}

type FilterType = 'none' | 'vintage' | 'bw' | 'vibrant';
type FrameType = 'none' | 'polaroid' | 'minimal-gold' | 'soft-glow' | 'film';
type EditorTab = 'FILTERS' | 'FRAMES' | 'STICKERS';
type StickerCategory = 'Glasses' | 'Party' | 'Nature' | 'Vibes';

const TWEMOJI_BASE = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/";

const heartGlassesSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 50,80 Q 20,50 10,30 A 20,20 0 0,1 50,15 A 20,20 0 0,1 90,30 Q 80,50 50,80 Z" fill="rgba(255,20,147,0.4)" stroke="#ff1493" stroke-width="6" stroke-linejoin="round"/><path d="M 150,80 Q 120,50 110,30 A 20,20 0 0,1 150,15 A 20,20 0 0,1 190,30 Q 180,50 150,80 Z" fill="rgba(255,20,147,0.4)" stroke="#ff1493" stroke-width="6" stroke-linejoin="round"/><path d="M 90,25 Q 100,15 110,25" fill="none" stroke="#ff1493" stroke-width="6" stroke-linecap="round"/></svg>')}`;
const pinkShadesSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="50" rx="15" fill="rgba(255,105,180,0.4)" stroke="#ff69b4" stroke-width="6"/><rect x="110" y="10" width="80" height="50" rx="15" fill="rgba(255,105,180,0.4)" stroke="#ff69b4" stroke-width="6"/><path d="M 90,30 Q 100,25 110,30" fill="none" stroke="#ff69b4" stroke-width="6" stroke-linecap="round"/><path d="M 10,30 L 0,30 M 190,30 L 200,30" stroke="#ff69b4" stroke-width="6" stroke-linecap="round"/></svg>')}`;

type StickerDef = { id: string, name: string, width: number, height: number, src: string };

const STICKERS: Record<StickerCategory, StickerDef[]> = {
  Glasses: [
    { id: 'heart-glasses', name: 'Heart Shades', width: 200, height: 90, src: heartGlassesSvg },
    { id: 'pink-shades', name: 'Pink Shades', width: 200, height: 70, src: pinkShadesSvg },
    { id: 'dark-shades', name: 'Dark Shades', width: 200, height: 70, src: `${TWEMOJI_BASE}1f576.svg` }
  ],
  Party: [
    { id: 'crown', name: 'Crown', width: 120, height: 120, src: `${TWEMOJI_BASE}1f451.svg` },
    { id: 'popper', name: 'Popper', width: 120, height: 120, src: `${TWEMOJI_BASE}1f389.svg` },
    { id: 'cake', name: 'Cake', width: 120, height: 120, src: `${TWEMOJI_BASE}1f382.svg` },
    { id: 'balloon', name: 'Balloon', width: 100, height: 120, src: `${TWEMOJI_BASE}1f388.svg` },
    { id: 'confetti', name: 'Confetti', width: 120, height: 120, src: `${TWEMOJI_BASE}1f38a.svg` },
    { id: 'gift', name: 'Gift', width: 100, height: 100, src: `${TWEMOJI_BASE}1f381.svg` },
    { id: 'disco', name: 'Disco Ball', width: 120, height: 120, src: `${TWEMOJI_BASE}1faa9.svg` }
  ],
  Nature: [
    { id: 'rose', name: 'Rose', width: 100, height: 100, src: `${TWEMOJI_BASE}1f339.svg` },
    { id: 'hibiscus', name: 'Hibiscus', width: 100, height: 100, src: `${TWEMOJI_BASE}1f33a.svg` },
    { id: 'blossom', name: 'Blossom', width: 100, height: 100, src: `${TWEMOJI_BASE}1f338.svg` },
    { id: 'sunflower', name: 'Sunflower', width: 100, height: 100, src: `${TWEMOJI_BASE}1f33b.svg` },
    { id: 'butterfly', name: 'Butterfly', width: 100, height: 100, src: `${TWEMOJI_BASE}1f98b.svg` }
  ],
  Vibes: [
    { id: 'sparkles', name: 'Sparkles', width: 100, height: 100, src: `${TWEMOJI_BASE}2728.svg` },
    { id: 'sparkling-heart', name: 'Pink Heart', width: 100, height: 100, src: `${TWEMOJI_BASE}1f496.svg` },
    { id: 'red-heart', name: 'Red Heart', width: 100, height: 100, src: `${TWEMOJI_BASE}2764.svg` },
    { id: 'star', name: 'Star', width: 100, height: 100, src: `${TWEMOJI_BASE}1f31f.svg` },
    { id: 'magic-wand', name: 'Magic Wand', width: 120, height: 120, src: `${TWEMOJI_BASE}1fa84.svg` },
    { id: 'kiss', name: 'Kiss', width: 100, height: 80, src: `${TWEMOJI_BASE}1f48b.svg` },
    { id: 'diamond', name: 'Diamond', width: 100, height: 100, src: `${TWEMOJI_BASE}1f48e.svg` }
  ]
};

export default function PhotoEditor({ photos, mode, onComplete, onCancel }: PhotoEditorProps) {
  const [editorTab, setEditorTab] = useState<EditorTab>('STICKERS');
  const [filter, setFilter] = useState<FilterType>('none');
  const [frame, setFrame] = useState<FrameType>('none');
  const [activeStickers, setActiveStickers] = useState<{id: string, s: StickerDef, key: number, x: number, y: number, r: number, w: number, h: number}[]>([]);
  const [activeCategory, setActiveCategory] = useState<StickerCategory>('Party');
  const [isProcessing, setIsProcessing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const [stickerCounter, setStickerCounter] = useState(0);

  const addSticker = (sticker: StickerDef) => {
    const scrollArea = document.getElementById('editor-scroll-area');
    const scrollTop = scrollArea ? scrollArea.scrollTop : 0;
    
    const spawnX = mode === 'SINGLE' ? 100 + (stickerCounter % 5) * 20 : 50 + (stickerCounter % 3) * 20;
    const spawnY = mode === 'SINGLE' ? 100 + (stickerCounter % 5) * 20 : Math.max(50, scrollTop + 150) + (stickerCounter % 5) * 20;

    setActiveStickers([...activeStickers, { id: sticker.id, s: sticker, key: stickerCounter, x: spawnX, y: spawnY, r: 0, w: sticker.width, h: sticker.height }]);
    setStickerCounter(stickerCounter + 1);
  };

  const removeSticker = (key: number) => {
    setActiveStickers(activeStickers.filter(s => s.key !== key));
  };

  const setStickerRotation = (key: number, r: number) => {
    setActiveStickers(prev => prev.map(s => s.key === key ? { ...s, r } : s));
  };

  const updateStickerTransform = (key: number, x: number, y: number, w: number, h: number) => {
    setActiveStickers(prev => prev.map(s => s.key === key ? { ...s, x, y, w, h } : s));
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    
    try {
      const isSingle = mode === 'SINGLE';
      const width = isSingle ? 640 : 400;

      // 1. Frame padding logic mapping
      let pTop = 0, pRight = 0, pBottom = 0, pLeft = 0;
      if (frame === 'polaroid') { pTop = 24; pRight = 24; pLeft = 24; pBottom = 112; }
      else if (frame === 'minimal-gold') { pTop = 12; pRight = 12; pLeft = 12; pBottom = 12; }
      else if (frame === 'soft-glow') { pTop = 16; pRight = 16; pLeft = 16; pBottom = 16; }
      else if (frame === 'film') { pTop = 24; pRight = 48; pLeft = 48; pBottom = 24; }

      const photoWidth = width - pLeft - pRight;
      const photoHeight = photoWidth * 0.75; // 4/3
      const gap = isSingle ? 0 : 12;
      const contentHeight = (photoHeight * photos.length) + (gap * (photos.length - 1));
      const height = contentHeight + pTop + pBottom;

      const canvas = document.createElement('canvas');
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No 2d context');
      
      ctx.scale(2, 2); // High DPI

      // 2. Draw Background & Frame
      if (frame === 'film') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < (isSingle ? 4 : 10); i++) {
          const y = (height / (isSingle ? 4 : 10)) * i + 10;
          ctx.fillRect(10, y, 16, 24);
          ctx.fillRect(width - 26, y, 16, 24);
        }
      } else if (frame === 'minimal-gold') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, width - 6, height - 6);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Draw Photos
      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = photos[i];
        });
        
        const py = pTop + (i * (photoHeight + gap));

        if (filter !== 'none') {
          // Off-screen canvas to apply manual pixel manipulation
          const tempCanvas = document.createElement('canvas');
          const tw = photoWidth * 2;
          const th = photoHeight * 2;
          tempCanvas.width = tw;
          tempCanvas.height = th;
          const tCtx = tempCanvas.getContext('2d');
          
          if (tCtx) {
            tCtx.drawImage(img, 0, 0, tw, th);
            const imgData = tCtx.getImageData(0, 0, tw, th);
            const d = imgData.data;
            
            for (let j = 0; j < d.length; j += 4) {
              let r = d[j], g = d[j+1], b = d[j+2];
              
              if (filter === 'bw') {
                let v = r * 0.299 + g * 0.587 + b * 0.114;
                v = ((v / 255 - 0.5) * 1.2 + 0.5) * 255;
                d[j] = d[j+1] = d[j+2] = Math.max(0, Math.min(255, v));
              } 
              else if (filter === 'vintage') {
                let tr = (r * 0.393) + (g * 0.769) + (b * 0.189);
                let tg = (r * 0.349) + (g * 0.686) + (b * 0.168);
                let tb = (r * 0.272) + (g * 0.534) + (b * 0.131);
                r = r * 0.4 + tr * 0.6;
                g = g * 0.4 + tg * 0.6;
                b = b * 0.4 + tb * 0.6;
                r = ((r / 255 - 0.5) * 1.1 + 0.5) * 255 * 0.9;
                g = ((g / 255 - 0.5) * 1.1 + 0.5) * 255 * 0.9;
                b = ((b / 255 - 0.5) * 1.1 + 0.5) * 255 * 0.9;
                d[j] = Math.max(0, Math.min(255, r));
                d[j+1] = Math.max(0, Math.min(255, g));
                d[j+2] = Math.max(0, Math.min(255, b));
              } 
              else if (filter === 'vibrant') {
                let lum = r * 0.299 + g * 0.587 + b * 0.114;
                r = lum + 1.4 * (r - lum);
                g = lum + 1.4 * (g - lum);
                b = lum + 1.4 * (b - lum);
                r = ((r / 255 - 0.5) * 1.1 + 0.5) * 255;
                g = ((g / 255 - 0.5) * 1.1 + 0.5) * 255;
                b = ((b / 255 - 0.5) * 1.1 + 0.5) * 255;
                d[j] = Math.max(0, Math.min(255, r));
                d[j+1] = Math.max(0, Math.min(255, g));
                d[j+2] = Math.max(0, Math.min(255, b));
              }
            }
            tCtx.putImageData(imgData, 0, 0);
            ctx.drawImage(tempCanvas, pLeft, py, photoWidth, photoHeight);
          }
        } else {
          ctx.drawImage(img, pLeft, py, photoWidth, photoHeight);
        }
      }

      // 4. Draw Stickers (Native Canvas handles rotation beautifully)
      for (let s of activeStickers) {
        if (!s.s.src) continue;
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = () => resolve(null);
          // If twemoji, bust cache. If data URI, don't bust.
          img.src = s.s.src.startsWith('data:') ? s.s.src : s.s.src + "?v=pb1";
        });
        
        const cx = s.x + (s.w / 2);
        const cy = s.y + (s.h / 2);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((s.r || 0) * Math.PI / 180);
        ctx.drawImage(img, -s.w / 2, -s.h / 2, s.w, s.h);
        ctx.restore();
      }

      // 5. Draw Text
      if (frame === 'polaroid' || frame === 'minimal-gold' || frame === 'soft-glow') {
         ctx.font = 'bold 36px "Brush Script MT", cursive';
         ctx.fillStyle = '#d4af37';
         ctx.textAlign = 'center';
         const textY = frame === 'polaroid' ? height - 35 : height - 20;
         
         ctx.fillStyle = 'rgba(255,255,255,0.9)';
         const textWidth = 360;
         ctx.fillRect((width/2) - (textWidth/2), textY - 32, textWidth, 42); // pill background
         
         ctx.fillStyle = '#d4af37';
         ctx.fillText("Zaara's 17th Birthday", width / 2, textY);
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      savePhotoLocally(dataUrl).catch(e => console.warn("Failed to save to local DB:", e));
      onComplete(dataUrl);

    } catch (err) {
      console.error("Manual Canvas Render Error:", err);
      setIsProcessing(false);
      alert("Failed to render photo.");
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
      <div className="w-96 bg-white/95 backdrop-blur-md shadow-[20px_0_40px_-15px_rgba(255,182,193,0.3)] border-r border-pink-100 flex flex-col z-50 overflow-hidden">
        
        {/* Editor Tab Navigation */}
        <div className="flex border-b border-pink-100 bg-pink-50/50 p-2 gap-2">
          <button onClick={() => setEditorTab('STICKERS')} className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all flex flex-col items-center gap-1 ${editorTab === 'STICKERS' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}>
            <Star size={18} /> Stickers
          </button>
          <button onClick={() => setEditorTab('FILTERS')} className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all flex flex-col items-center gap-1 ${editorTab === 'FILTERS' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}>
            <Wand2 size={18} /> Filters
          </button>
          <button onClick={() => setEditorTab('FRAMES')} className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all flex flex-col items-center gap-1 ${editorTab === 'FRAMES' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}>
            <ImageIcon size={18} /> Frames
          </button>
        </div>

        {/* Dynamic Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {editorTab === 'FILTERS' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-cursive text-pink-800 mb-4">Choose a Filter</h3>
              <div className="grid grid-cols-2 gap-3">
                {(['none', 'vintage', 'bw', 'vibrant'] as FilterType[]).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`p-4 rounded-2xl capitalize font-medium transition-all ${filter === f ? 'bg-pink-500 text-white shadow-md scale-105' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
                  >
                    {f === 'bw' ? 'B&W' : f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {editorTab === 'FRAMES' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-cursive text-pink-800 mb-4">Choose a Frame</h3>
              <div className="grid grid-cols-2 gap-3">
                {(['none', 'polaroid', 'minimal-gold', 'soft-glow', 'film'] as FrameType[]).map((f) => (
                  <button key={f} onClick={() => setFrame(f)}
                    className={`p-4 rounded-2xl capitalize font-medium transition-all ${frame === f ? 'bg-pink-500 text-white shadow-md scale-105' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
                  >
                    {f.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {editorTab === 'STICKERS' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 flex flex-col h-full">
              <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {(Object.keys(STICKERS) as StickerCategory[]).map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {STICKERS[activeCategory].map(s => (
                  <button key={s.id} onClick={() => addSticker(s)}
                    className="aspect-square bg-white border border-gray-100 rounded-2xl hover:border-pink-300 hover:shadow-md hover:bg-pink-50 flex flex-col items-center justify-center transition-all p-2 group"
                  >
                    <div className="flex-1 w-full flex items-center justify-center pointer-events-none transform group-hover:scale-110 transition-transform">
                      <img src={s.src} className="w-12 h-12 object-contain" alt={s.name} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-pink-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          {editorTab === 'STICKERS' && (
             <p className="text-xs text-center text-pink-400 mb-3 font-medium flex items-center justify-center"><Sparkles size={12} className="mr-1"/> Drag corners to resize!</p>
          )}
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors">
              Retake
            </button>
            <button onClick={handleComplete} disabled={isProcessing} className="flex-[2] py-4 bg-gradient-to-r from-pink-500 to-[#d4af37] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg">
              {isProcessing ? 'Saving...' : 'Finish!'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas / Editor Area */}
      <div id="editor-scroll-area" className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col items-center justify-center p-8">
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

          <div className="absolute inset-0 z-20 overflow-visible pointer-events-none">
            {activeStickers.map(sticker => (
              <Rnd
                key={sticker.key}
                default={{
                  x: sticker.x,
                  y: sticker.y,
                  width: sticker.w,
                  height: sticker.h
                }}
                onDragStop={(e, d) => updateStickerTransform(sticker.key, d.x, d.y, sticker.w, sticker.h)}
                onResizeStop={(e, direction, ref, delta, position) => {
                  updateStickerTransform(sticker.key, position.x, position.y, parseInt(ref.style.width, 10), parseInt(ref.style.height, 10));
                }}
                bounds="parent"
                className={`pointer-events-auto group rnd-${sticker.key}`}
                cancel=".sticker-controls"
                lockAspectRatio
                enable={{ bottomRight: true, bottomLeft: false, topRight: false, topLeft: false, right: false, left: false, top: false, bottom: false }}
                resizeHandleStyles={{
                  bottomRight: { width: '26px', height: '26px', background: '#ff1493', border: '3px solid white', borderRadius: '50%', right: '-13px', bottom: '-13px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }
                }}
              >
                <div className="w-full h-full relative">
                  
                  {/* Rotation handle */}
                  <div 
                    className="sticker-controls absolute -top-12 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-md border-2 border-pink-300 z-50 flex items-center justify-center cursor-grab pointer-events-auto hover:bg-pink-50"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      const rndEl = document.querySelector(`.rnd-${sticker.key}`);
                      if (!rndEl) return;
                      const rect = rndEl.getBoundingClientRect();
                      const centerX = rect.left + rect.width / 2;
                      const centerY = rect.top + rect.height / 2;

                      const onMove = (moveEv: PointerEvent) => {
                        const angle = Math.atan2(moveEv.clientY - centerY, moveEv.clientX - centerX);
                        const degrees = (angle * 180) / Math.PI + 90; 
                        setStickerRotation(sticker.key, degrees);
                      };

                      const onUp = () => {
                        window.removeEventListener('pointermove', onMove);
                        window.removeEventListener('pointerup', onUp);
                      };

                      window.addEventListener('pointermove', onMove);
                      window.addEventListener('pointerup', onUp);
                    }}
                  >
                    <span className="text-pink-500 font-bold text-lg mb-1 pointer-events-none">↻</span>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onPointerDown={(e) => { e.stopPropagation(); removeSticker(sticker.key); }}
                    className="sticker-controls absolute -top-5 -right-5 w-10 h-10 bg-white text-red-500 rounded-full shadow-md border border-red-100 flex items-center justify-center z-50 font-bold text-2xl leading-none pointer-events-auto hover:bg-red-50"
                  >
                    ×
                  </button>
                  
                  {/* Content (This rotates) */}
                  <div className="w-full h-full flex items-center justify-center pointer-events-none" style={{ transform: `rotate(${sticker.r || 0}deg)` }}>
                    <img src={sticker.s.src} crossOrigin="anonymous" className="w-full h-full object-contain pointer-events-none" alt={sticker.s.name} /> 
                  </div>
                </div>
              </Rnd>
            ))}
          </div>

          {(frame === 'polaroid' || frame === 'minimal-gold' || frame === 'soft-glow') && (
            <div className={`absolute w-full text-center z-10 pointer-events-none left-0 ${frame === 'polaroid' ? 'bottom-8' : 'bottom-6'}`}>
              <h1 className="text-4xl font-cursive text-[#d4af37] font-bold bg-white/90 inline-block px-6 py-2 rounded-full">Zaara's 17th Birthday</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
