import React, { useRef, useState } from 'react';
import { Camera, X, Check } from 'lucide-react';

interface CameraViewProps {
  mode: 'SINGLE' | 'STRIP';
  onCapture: (photos: string[]) => void;
  onCancel: () => void;
}

export default function CameraView({ mode, onCapture, onCancel }: CameraViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [captured, setCaptured] = useState<string[]>([]);
  const shotsNeeded = mode === 'STRIP' ? 4 : 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Compress the massive iPad camera image
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 600;
            const scale = Math.min(MAX_WIDTH / img.width, 1);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
              
              const newCaptured = [...captured, compressedDataUrl];
              setCaptured(newCaptured);
              
              if (newCaptured.length >= shotsNeeded) {
                onCapture(newCaptured);
              }
            }
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#fdf2f8] z-50">
      <button 
        onClick={onCancel}
        className="absolute top-8 left-8 text-pink-800 z-50 p-4 bg-white rounded-full shadow-md hover:bg-pink-50"
      >
        <X size={32} />
      </button>

      <div className="flex flex-col items-center justify-center space-y-12 bg-white/80 p-16 rounded-[3rem] shadow-xl backdrop-blur-md border border-white/50 text-center max-w-2xl">
        <h2 className="text-5xl font-cursive text-pink-800 drop-shadow-sm">
          {mode === 'STRIP' ? `Photo ${captured.length + 1} of 4` : 'Ready for your close-up?'}
        </h2>
        
        <p className="text-xl font-medium text-pink-600">
          Tap the camera below to open your iPad's built-in camera.
        </p>

        {mode === 'STRIP' && captured.length > 0 && (
          <div className="flex space-x-4">
            {captured.map((_, i) => (
              <div key={i} className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-md">
                <Check size={32} />
              </div>
            ))}
          </div>
        )}

        <input 
          type="file" 
          accept="image/*" 
          capture="user" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
        />

        <button 
          onClick={openCamera}
          className="w-40 h-40 bg-gradient-to-br from-[#d4af37] to-yellow-500 rounded-full border-8 border-white flex items-center justify-center hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(212,175,55,0.4)]"
        >
          <Camera size={64} className="text-white" />
        </button>
      </div>
    </div>
  );
}
