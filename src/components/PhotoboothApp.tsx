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
  const [finalImage, setFinalImage] = useState<string | null>(null);

  const handleCapture = (photos: string[]) => {
    setCapturedPhotos(photos);
    setCurrentState('EDITOR');
  };

  const handleEditorComplete = (dataUrl: string) => {
    setFinalImage(dataUrl);
    setCurrentState('SHARE');
  };

  const renderState = () => {
    switch (currentState) {
      case 'HOME':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 md:space-y-12 z-10 text-foreground bg-white/60 p-8 md:p-20 backdrop-blur-xl border border-white/50 md:organic-shape-1 shadow-[0_20px_60px_-15px_rgba(212,175,55,0.2)] rounded-3xl md:rounded-none w-[90%] md:w-auto">
            <div className="text-center relative z-10">
              <h1 className="text-5xl md:text-8xl font-cursive mb-2 text-pink-800 drop-shadow-md tracking-wide">Zaara's 17th</h1>
              <p className="text-lg md:text-2xl font-medium tracking-[0.2em] md:tracking-[0.3em] uppercase text-gold drop-shadow-sm">September 20, 2026</p>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12 pt-4 md:pt-8 z-10">
              <button 
                onClick={() => { setMode('SINGLE'); setCurrentState('CAMERA'); }}
                className="flex flex-col items-center justify-center w-full md:w-64 h-48 md:h-64 bg-gradient-to-br from-pink-50 to-white hover:from-white hover:to-pink-100 transition-all transform hover:-translate-y-2 shadow-xl border border-pink-100 rounded-3xl md:rounded-none md:organic-shape-2 group"
              >
                <Camera size={64} className="mb-4 md:mb-6 text-pink-400 group-hover:text-gold transition-colors duration-500" strokeWidth={1.5} />
                <span className="text-xl md:text-2xl font-cursive text-pink-800 tracking-wide">Single Photo</span>
              </button>
              
              <button 
                onClick={() => { setMode('STRIP'); setCurrentState('CAMERA'); }}
                className="flex flex-col items-center justify-center w-full md:w-64 h-48 md:h-64 bg-gradient-to-br from-pink-50 to-white hover:from-white hover:to-pink-100 transition-all transform hover:-translate-y-2 shadow-xl border border-pink-100 rounded-3xl md:rounded-none md:organic-shape-3 group"
              >
                <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 mb-4 md:mb-6 border border-pink-300 p-2 rounded-lg bg-white/50 group-hover:border-gold transition-colors duration-500 transform -rotate-6">
                  <div className="w-8 h-10 md:w-10 md:h-8 bg-pink-200/60 rounded-sm"></div>
                  <div className="w-8 h-10 md:w-10 md:h-8 bg-pink-200/60 rounded-sm"></div>
                  <div className="w-8 h-10 md:w-10 md:h-8 bg-pink-200/60 rounded-sm"></div>
                </div>
                <span className="text-xl md:text-2xl font-cursive text-pink-800 tracking-wide">Photo Strip</span>
              </button>
            </div>

            <button 
              onClick={() => setCurrentState('GALLERY')}
              className="mt-4 md:mt-8 flex items-center space-x-3 text-pink-600 hover:text-gold transition-colors text-xl md:text-2xl font-cursive z-10 hover:scale-105 transform duration-300"
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
        return <ShareView image={finalImage!} onHome={() => setCurrentState('HOME')} />;
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
