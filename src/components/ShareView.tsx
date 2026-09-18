import React, { useEffect, useState } from 'react';
import { Share, Home } from 'lucide-react';
import { getPhotoLocally } from '../utils/db';

interface ShareViewProps {
  photoId: string;
  onHome: () => void;
}

export default function ShareView({ photoId, onHome }: ShareViewProps) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    getPhotoLocally(photoId).then(dataUrl => {
      if (dataUrl) setImage(dataUrl);
    });
  }, [photoId]);

  const handleShare = async () => {
    if (!image) return;
    try {
      const res = await fetch(image);
      const blob = await res.blob();
      const file = new File([blob], 'zaara-birthday.jpg', { type: 'image/jpeg' });
      
      if (navigator.share) {
        await navigator.share({
          title: 'Zaara\'s 17th Birthday',
          files: [file]
        });
      } else {
        alert("Sharing not supported on this browser.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#fdf2f8] z-50">
      <div className="bg-white/70 backdrop-blur-md p-16 shadow-[0_20px_60px_-15px_rgba(212,175,55,0.2)] max-w-5xl w-full flex flex-row items-center space-x-16 border border-white/50 organic-shape-2 relative">
        <div className="flex-1">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transform -rotate-2">
            {image ? <img src={image} alt="Final" className="w-full h-auto rounded-sm" /> : <div className="w-full h-96 bg-gray-100 animate-pulse"></div>}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-7xl font-cursive text-[#d4af37] mb-8 text-center drop-shadow-md tracking-wide">Share it!</h2>
          
          <button 
            onClick={handleShare}
            className="w-full py-8 bg-pink-500 text-white rounded-3xl font-bold shadow-xl hover:bg-pink-600 text-3xl flex items-center justify-center transition-transform active:scale-95"
          >
            <Share size={36} className="mr-4" />
            AirDrop / Share
          </button>
          
          <p className="mt-8 text-[#4a154b] text-center text-xl font-light">
            Tap the button above to instantly AirDrop or Message this photo to your phone!
          </p>
          
          <button 
            onClick={onHome} 
            className="mt-12 px-10 py-5 bg-[#d4af37] text-white rounded-full font-bold shadow-xl hover:bg-yellow-500 text-2xl w-full flex items-center justify-center transition-transform active:scale-95"
          >
            <Home size={28} className="mr-3" />
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
