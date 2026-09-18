import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getGalleryPhotos } from '../app/actions';

interface GalleryViewProps {
  onClose: () => void;
}

export default function GalleryView({ onClose }: GalleryViewProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGalleryPhotos().then(urls => {
      setPhotos(urls);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-[#fdf2f8] z-50 p-8 overflow-y-auto">
      <div className="flex items-center mb-8">
        <button onClick={onClose} className="p-4 bg-white/60 text-[#4a154b] rounded-full shadow-md hover:bg-pink-100 mr-6 transition-colors border border-white/50 backdrop-blur-md">
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-7xl font-cursive text-[#d4af37] drop-shadow-md">Event Gallery</h2>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-pink-400">
          <Loader2 size={64} className="animate-spin mb-4 text-[#d4af37]" />
          <p className="text-2xl font-light">Loading gallery...</p>
        </div>
      ) : photos.length === 0 ? (
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
