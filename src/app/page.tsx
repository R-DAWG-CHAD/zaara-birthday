import PhotoboothApp from "@/components/PhotoboothApp";

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#fdf2f8]">
      {/* Decorative floral background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/floral-motif.png')]"></div>
      
      <PhotoboothApp />
    </main>
  );
}
