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
  const [photos, setPhotos] = useState<string[]>([]);
  const [mode, setMode] = useState<'SINGLE' | 'STRIP'>('SINGLE');
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  const handleCapture = (capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setCurrentState('EDITOR');
  };

  const handleEditComplete = (image: string) => {
    setFinalImage(image);
    setGallery(prev => [image, ...prev]);
    setCurrentState('SHARE');
  };

  const renderState = () => {
    switch (currentState) {
      case 'HOME':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 z-10 text-foreground bg-white/90 p-16 rounded-[3rem] shadow-2xl backdrop-blur-md border-4 border-gold">
            <div className="text-center relative">
              {/* Simple CSS floral accents */}
              <div className="absolute -top-10 -left-10 text-floral-green opacity-50 text-6xl">✿</div>
              <div className="absolute -bottom-10 -right-10 text-floral-green opacity-50 text-6xl">❀</div>
              
              <h1 className="text-7xl font-serif mb-4 text-gold drop-shadow-sm">Zaara's 17th</h1>
              <p className="text-3xl font-light tracking-widest uppercase text-pink-400">September 20, 2026</p>
            </div>
            
            <div className="flex space-x-8 pt-12">
              <button 
                onClick={() => { setMode('SINGLE'); setCurrentState('CAMERA'); }}
                className="flex flex-col items-center justify-center w-64 h-64 bg-pink-50 rounded-3xl hover:bg-pink-100 transition-all transform hover:scale-105 shadow-md border-2 border-pink-200 group"
              >
                <Camera size={64} className="mb-6 text-pink-400 group-hover:text-gold transition-colors" />
                <span className="text-2xl font-medium text-gray-700">Single Photo</span>
              </button>
              
              <button 
                onClick={() => { setMode('STRIP'); setCurrentState('CAMERA'); }}
                className="flex flex-col items-center justify-center w-64 h-64 bg-pink-50 rounded-3xl hover:bg-pink-100 transition-all transform hover:scale-105 shadow-md border-2 border-pink-200 group"
              >
                <div className="flex flex-col space-y-1.5 mb-6 border-2 border-pink-400 p-1.5 rounded-lg bg-white group-hover:border-gold transition-colors">
                  <div className="w-10 h-8 bg-pink-100 rounded-sm"></div>
                  <div className="w-10 h-8 bg-pink-100 rounded-sm"></div>
                  <div className="w-10 h-8 bg-pink-100 rounded-sm"></div>
                </div>
                <span className="text-2xl font-medium text-gray-700">Photo Strip</span>
              </button>
            </div>

            <button 
              onClick={() => setCurrentState('GALLERY')}
              className="mt-12 flex items-center space-x-2 text-pink-400 hover:text-gold transition-colors text-2xl font-medium"
            >
              <ImageIcon size={32} />
              <span>View Gallery</span>
            </button>
          </div>
        );
      case 'CAMERA':
        return <CameraView mode={mode} onCapture={handleCapture} onCancel={() => setCurrentState('HOME')} />;
      case 'EDITOR':
        return <PhotoEditor photos={photos} mode={mode} onComplete={handleEditComplete} onCancel={() => setCurrentState('CAMERA')} />;
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
