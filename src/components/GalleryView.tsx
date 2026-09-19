import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { getAllPhotosLocally, deletePhotoLocally } from '../utils/db';

interface GalleryViewProps {
  onClose: () => void;
}

type PhotoRecord = { id: string, dataUrl: string, createdAt: number };

export default function GalleryView({ onClose }: GalleryViewProps) {
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPhotosLocally().then(data => {
      setPhotos(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      await deletePhotoLocally(id);
      setPhotos(photos.filter(p => p.id !== id));
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#fdf2f8] z-50 p-4 md:p-8 overflow-y-auto">
      <div className="flex items-center mb-6 md:mb-8">
        <button onClick={onClose} className="p-3 md:p-4 bg-white/60 text-[#4a154b] rounded-full shadow-md hover:bg-pink-100 mr-4 md:mr-6 transition-colors border border-white/50 backdrop-blur-md">
          <ArrowLeft size={24} className="md:w-7 md:h-7" />
        </button>
        <h2 className="text-4xl md:text-7xl font-cursive text-[#d4af37] drop-shadow-md">Event Gallery</h2>
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
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid bg-white p-3 rounded-2xl shadow-lg border border-pink-100 relative group">
              <img src={photo.dataUrl} alt="Gallery" className="w-full h-auto rounded-lg" />
              <button 
                onClick={() => handleDelete(photo.id)}
                className="absolute top-6 right-6 p-3 bg-white/95 text-red-500 rounded-full shadow-lg border border-red-100 z-10 font-bold active:scale-95 transition-transform"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
