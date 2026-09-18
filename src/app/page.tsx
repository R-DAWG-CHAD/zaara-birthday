import PhotoboothApp from "@/components/PhotoboothApp";

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#fdf2f8]">
      {/* Organic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#fce7f3] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-[#fbcfe8] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-[#fae8ff] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Stylized Abstract Flowing Vine/Flowers */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" preserveAspectRatio="none">
        {/* Flowing vines */}
        <path d="M-100,500 C150,400 350,700 600,300 C850,-100 1200,400 1500,200 C1800,0 2000,500 2200,300" 
              fill="none" stroke="#d4af37" strokeWidth="1.5" className="opacity-50" />
        <path d="M-100,800 C200,900 400,600 700,850 C1000,1100 1300,750 1600,900 C1900,1050 2100,700 2400,950" 
              fill="none" stroke="#8fbc8f" strokeWidth="2" className="opacity-40" />
        <path d="M200,-100 C100,200 400,400 300,700 C200,1000 600,1200 500,1500" 
              fill="none" stroke="#8fbc8f" strokeWidth="1" className="opacity-30" />
        
        {/* Abstract Flowers (Layered soft circles scattered along vines) */}
        <g transform="translate(350, 500)">
          <circle cx="0" cy="0" r="25" fill="#fbcfe8" opacity="0.6" className="animate-blob" />
          <circle cx="5" cy="-5" r="15" fill="#f9a8d4" opacity="0.8" />
          <circle cx="-5" cy="5" r="8" fill="#d4af37" opacity="0.9" />
        </g>

        <g transform="translate(850, 150)">
          <circle cx="0" cy="0" r="35" fill="#fbcfe8" opacity="0.5" className="animate-blob animation-delay-2000" />
          <circle cx="-8" cy="8" r="20" fill="#f9a8d4" opacity="0.7" />
          <circle cx="5" cy="-5" r="10" fill="#d4af37" opacity="0.8" />
        </g>

        <g transform="translate(1400, 300)">
          <circle cx="0" cy="0" r="30" fill="#fbcfe8" opacity="0.6" className="animate-blob animation-delay-4000" />
          <circle cx="8" cy="-8" r="18" fill="#f9a8d4" opacity="0.8" />
          <circle cx="-5" cy="5" r="10" fill="#d4af37" opacity="0.9" />
        </g>

        <g transform="translate(700, 850)">
          <circle cx="0" cy="0" r="40" fill="#fbcfe8" opacity="0.5" className="animate-blob" />
          <circle cx="-10" cy="-10" r="25" fill="#f9a8d4" opacity="0.7" />
          <circle cx="8" cy="8" r="12" fill="#d4af37" opacity="0.8" />
        </g>
        
        <g transform="translate(1700, 800)">
          <circle cx="0" cy="0" r="28" fill="#fbcfe8" opacity="0.6" className="animate-blob animation-delay-2000" />
          <circle cx="5" cy="5" r="16" fill="#f9a8d4" opacity="0.8" />
          <circle cx="-3" cy="-3" r="8" fill="#d4af37" opacity="0.9" />
        </g>
      </svg>
      
      <div className="z-10 w-full h-full">
        <PhotoboothApp />
      </div>
    </main>
  );
}
