import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, X } from 'lucide-react';

interface CameraViewProps {
  mode: 'SINGLE' | 'STRIP';
  onCapture: (photos: string[]) => void;
  onCancel: () => void;
}

export default function CameraView({ mode, onCapture, onCancel }: CameraViewProps) {
  const webcamRef = useRef<Webcam>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [captured, setCaptured] = useState<string[]>([]);
  const shotsNeeded = mode === 'STRIP' ? 4 : 1;

  const startCapture = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        const newCaptured = [...captured, imageSrc];
        setCaptured(newCaptured);
        if (newCaptured.length < shotsNeeded) {
          setCountdown(3);
        } else {
          setCountdown(null);
          // Add a small delay before navigating to editor so user sees the last flash
          setTimeout(() => onCapture(newCaptured), 500);
        }
      }
    }
  }, [countdown, captured, shotsNeeded, onCapture]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black z-50">
      <button 
        onClick={onCancel}
        className="absolute top-8 left-8 text-white z-50 p-4 bg-white/20 rounded-full hover:bg-white/40 backdrop-blur-md"
      >
        <X size={32} />
      </button>

      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-gray-900 border-8 border-pink-400">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "user",
            aspectRatio: 4/3
          }}
          className="w-full h-auto transform scale-x-[-1]" /* Mirror the webcam */
        />
        
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <span className="text-[15rem] font-bold text-white drop-shadow-2xl">
              {countdown}
            </span>
          </div>
        )}

        {countdown === 0 && (
          <div className="absolute inset-0 bg-white z-20 opacity-80 duration-100"></div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center">
        <div className="text-white mb-6 text-center text-2xl font-medium tracking-wide">
          {mode === 'STRIP' ? `Shot ${captured.length + 1} of 4` : 'Ready to capture!'}
        </div>
        <button 
          onClick={startCapture}
          disabled={countdown !== null}
          className="w-24 h-24 bg-pink-500 rounded-full border-4 border-white flex items-center justify-center hover:bg-pink-400 disabled:opacity-50 transition-transform active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
        >
          <Camera size={40} className="text-white" />
        </button>
      </div>
    </div>
  );
}
