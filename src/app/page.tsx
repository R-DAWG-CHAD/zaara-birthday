import PhotoboothApp from "@/components/PhotoboothApp";

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#fdf2f8]">
      {/* Detailed Floral Background */}
      <div className="absolute inset-0 z-0 bg-detailed-floral opacity-80 mix-blend-multiply"></div>
      
      {/* Soft gradient overlay to blend */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-pink-100/50 via-transparent to-pink-200/50 pointer-events-none"></div>

      <div className="z-10 w-full h-full flex items-center justify-center">
        <PhotoboothApp />
      </div>
    </main>
  );
}
