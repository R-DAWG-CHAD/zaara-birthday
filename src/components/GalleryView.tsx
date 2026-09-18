import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { getAllPhotosLocally } from '../utils/db';

interface GalleryViewProps {
  onClose: () => void;
}

export default function GalleryView({ onClose }: GalleryViewProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPhotosLocally().then(data => {
      setPhotos(data);
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
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-2xl text-pink-400 font-medium">
          No photos taken yet! Be the first!
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 pb-20">
          {photos.map((url, i) => (
            <div key={i} className="break-inside-avoid bg-white p-3 rounded-2xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow transform hover:-translate-y-1">
              <img src={url} alt={`Gallery ${i}`} className="w-full h-auto rounded-lg" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
