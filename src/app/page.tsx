import PhotoboothApp from "@/components/PhotoboothApp";

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#fdf2f8]">
      {/* Dynamic Flowing Abstract Floral Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70" preserveAspectRatio="xMidYMid slice">
        {/* Abstract Flowing Vines */}
        <path d="M-100,600 C200,400 400,800 700,500 C1000,200 1300,700 1600,400 C1900,100 2200,600 2500,400" 
              fill="none" stroke="url(#goldGradient)" strokeWidth="3" className="animate-float-1" />
        <path d="M-100,800 C300,1000 500,600 800,900 C1100,1200 1400,800 1700,1000 C2000,1200 2300,800 2600,1100" 
              fill="none" stroke="url(#greenGradient)" strokeWidth="4" className="animate-float-2 opacity-50" />
        <path d="M200,-100 C100,300 500,500 400,900 C300,1300 700,1500 600,1900" 
              fill="none" stroke="url(#greenGradient)" strokeWidth="2" className="animate-float-1 animation-delay-2000 opacity-40" />

        {/* Intricate Leaf and Petal Accents Scattered Along Vines */}
        <g className="animate-float-2">
          {/* Top left cluster */}
          <path d="M300,500 C310,480 330,480 340,500 C330,520 310,520 300,500Z" fill="#8fbc8f" opacity="0.6" />
          <circle cx="345" cy="490" r="25" fill="#fbcfe8" opacity="0.4" />
          <circle cx="355" cy="485" r="15" fill="#f9a8d4" opacity="0.6" />
          <circle cx="360" cy="480" r="5" fill="#d4af37" opacity="0.8" />
        </g>

        <g className="animate-float-1 animation-delay-2000">
          {/* Top right cluster */}
          <path d="M1400,300 C1415,270 1445,270 1460,300 C1445,330 1415,330 1400,300Z" fill="#8fbc8f" opacity="0.5" />
          <circle cx="1450" cy="280" r="35" fill="#fbcfe8" opacity="0.4" />
          <circle cx="1430" cy="300" r="20" fill="#f9a8d4" opacity="0.5" />
          <circle cx="1420" cy="310" r="8" fill="#d4af37" opacity="0.8" />
        </g>

        <g className="animate-float-2 animation-delay-4000">
          {/* Bottom left cluster */}
          <path d="M800,900 C815,870 845,870 860,900 C845,930 815,930 800,900Z" fill="#8fbc8f" opacity="0.6" />
          <circle cx="780" cy="920" r="40" fill="#fbcfe8" opacity="0.4" />
          <circle cx="820" cy="880" r="25" fill="#f9a8d4" opacity="0.6" />
          <circle cx="830" cy="870" r="10" fill="#d4af37" opacity="0.9" />
        </g>

        <g className="animate-float-1 animation-delay-4000">
          {/* Bottom right cluster */}
          <path d="M1800,800 C1810,780 1830,780 1840,800 C1830,820 1810,820 1800,800Z" fill="#8fbc8f" opacity="0.5" />
          <circle cx="1850" cy="790" r="30" fill="#fbcfe8" opacity="0.4" />
          <circle cx="1830" cy="810" r="15" fill="#f9a8d4" opacity="0.7" />
          <circle cx="1820" cy="820" r="6" fill="#d4af37" opacity="0.8" />
        </g>

        {/* Soft Background Blobs (behind everything) */}
        <circle cx="20%" cy="20%" r="300" fill="#fce7f3" className="opacity-40 animate-float-1" />
        <circle cx="80%" cy="80%" r="400" fill="#fbcfe8" className="opacity-30 animate-float-2" />
        <circle cx="80%" cy="20%" r="250" fill="#fae8ff" className="opacity-40 animate-float-1 animation-delay-4000" />

        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#f5d76e" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8fbc8f" />
            <stop offset="100%" stopColor="#a3d3a3" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="z-10 w-full h-full">
        <PhotoboothApp />
      </div>
    </main>
  );
}
