import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Home } from 'lucide-react';

interface ShareViewProps {
  image: string;
  onHome: () => void;
}

export default function ShareView({ image, onHome }: ShareViewProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#fdf2f8] z-50">
      <div className="bg-white/70 backdrop-blur-md p-16 shadow-[0_20px_60px_-15px_rgba(212,175,55,0.2)] max-w-5xl w-full flex flex-row items-center space-x-16 border border-white/50 organic-shape-2 relative">
        <div className="absolute -top-6 -left-6 text-[#8fbc8f] opacity-50 text-6xl">✿</div>
        
        <div className="flex-1">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transform -rotate-2">
            <img src={image} alt="Final" className="w-full h-auto rounded-sm" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-7xl font-cursive text-[#d4af37] mb-8 text-center drop-shadow-md tracking-wide">Scan to Save!</h2>
          
          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-pink-100">
            <QRCodeSVG value={image} size={280} fgColor="#4a154b" />
          </div>
          
          <p className="mt-8 text-[#4a154b] text-center text-xl font-light">
            Point your phone's camera at the code to download your photo.
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
