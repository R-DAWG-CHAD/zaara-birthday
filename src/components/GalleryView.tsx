import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface GalleryViewProps {
  photos: string[];
  onClose: () => void;
}

export default function GalleryView({ photos, onClose }: GalleryViewProps) {
  return (
    <div className="w-full h-full flex flex-col bg-[#fdf2f8] z-50 p-8 overflow-y-auto">
      <div className="flex items-center mb-8">
        <button onClick={onClose} className="p-4 bg-white text-[#4a154b] rounded-full shadow-md hover:bg-pink-50 mr-6 transition-colors border-2 border-[#d4af37]">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-5xl font-serif text-[#d4af37]">Event Gallery</h2>
      </div>

      {photos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-pink-400">
          <div className="text-8xl mb-4 opacity-50">📸</div>
          <p className="text-3xl font-light">No photos taken yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-8 max-w-7xl mx-auto w-full">
          {photos.map((p, i) => (
            <div key={i} className="aspect-auto bg-white rounded-xl shadow-lg border-[12px] border-white overflow-hidden transform hover:scale-105 transition-transform hover:-rotate-1">
              <img src={p} alt={`Gallery ${i}`} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
