"use client";

import React, { useState } from 'react';
import CameraView from './CameraView';
import PhotoEditor from './PhotoEditor';
import ShareView from './ShareView';
import GalleryView from './GalleryView';
import { Camera, Image as ImageIcon } from 'lucide-react';

type AppState = 'HOME' | 'CAMERA' | 'EDITOR' | 'SHARE' | 'GALLERY';

export default function PhotoboothApp() {
  const [currentState, setCurrentState] = useState<AppState>('HOME');
  const [mode, setMode] = useState<'SINGLE' | 'STRIP'>('SINGLE');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [finalImageId, setFinalImageId] = useState<string | null>(null);

  const handleCapture = (photos: string[]) => {
    setCapturedPhotos(photos);
    setCurrentState('EDITOR');
  };

  const handleEditorComplete = (photoId: string) => {
    setFinalImageId(photoId);
    setCurrentState('SHARE');
  };

  const renderState = () => {
    switch (currentState) {
      case 'HOME':
        return (
          <div className="flex flex-col items-center justify-center space-y-12 z-10 text-foreground bg-white/60 p-20 backdrop-blur-xl border border-white/50 organic-shape-1 shadow-[0_20px_60px_-15px_rgba(212,175,55,0.2)]">
            <div className="text-center relative z-10">
              <h1 className="text-8xl font-cursive mb-2 text-pink-800 drop-shadow-md tracking-wide">Zaara's 17th</h1>
              <p className="text-2xl font-medium tracking-[0.3em] uppercase text-gold drop-shadow-sm">September 20, 2026</p>
            </div>
            
            <div className="flex space-x-12 pt-8 z-10">
              <button 
                onClick={() => { setMode('SINGLE'); setCurrentState('CAMERA'); }}
                className="flex flex-col items-center justify-center w-64 h-64 bg-gradient-to-br from-pink-50 to-white hover:from-white hover:to-pink-100 transition-all transform hover:-translate-y-2 shadow-xl border border-pink-100 organic-shape-2 group"
              >
                <Camera size={64} className="mb-6 text-pink-400 group-hover:text-gold transition-colors duration-500" strokeWidth={1.5} />
                <span className="text-2xl font-cursive text-pink-800 tracking-wide">Single Photo</span>
              </button>
              
              <button 
                onClick={() => { setMode('STRIP'); setCurrentState('CAMERA'); }}
                className="flex flex-col items-center justify-center w-64 h-64 bg-gradient-to-br from-pink-50 to-white hover:from-white hover:to-pink-100 transition-all transform hover:-translate-y-2 shadow-xl border border-pink-100 organic-shape-3 group"
              >
                <div className="flex flex-col space-y-2 mb-6 border border-pink-300 p-2 rounded-lg bg-white/50 group-hover:border-gold transition-colors duration-500 transform -rotate-6">
                  <div className="w-10 h-8 bg-pink-200/60 rounded-sm"></div>
                  <div className="w-10 h-8 bg-pink-200/60 rounded-sm"></div>
                  <div className="w-10 h-8 bg-pink-200/60 rounded-sm"></div>
                </div>
                <span className="text-2xl font-cursive text-pink-800 tracking-wide">Photo Strip</span>
              </button>
            </div>

            <button 
              onClick={() => setCurrentState('GALLERY')}
              className="mt-8 flex items-center space-x-3 text-pink-600 hover:text-gold transition-colors text-2xl font-cursive z-10 hover:scale-105 transform duration-300"
            >
              <ImageIcon size={28} strokeWidth={1.5} />
              <span>View the Gallery</span>
            </button>
          </div>
        );
      case 'CAMERA':
        return <CameraView mode={mode} onCapture={handleCapture} onCancel={() => setCurrentState('HOME')} />;
      case 'EDITOR':
        return <PhotoEditor photos={capturedPhotos} mode={mode} onComplete={handleEditorComplete} onCancel={() => setCurrentState('CAMERA')} />;
      case 'SHARE':
        return <ShareView photoId={finalImageId!} onHome={() => setCurrentState('HOME')} />;
      case 'GALLERY':
        return <GalleryView onClose={() => setCurrentState('HOME')} />;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {renderState()}
    </div>
  );
}
