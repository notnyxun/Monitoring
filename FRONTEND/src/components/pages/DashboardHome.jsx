import { useState, useEffect } from 'react';
import { useLantai } from '../../hooks/useLantai';

export const DashboardHome = ({ onSelectFloor }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const { lantai } = useLantai();
  const itemsPerView = 2;

  const handlePrevious = () => {
    setCarouselIndex((prev) => (prev === 0 ? Math.max(0, lantai.length - itemsPerView) : prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + itemsPerView < lantai.length ? prev + 1 : prev));
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Topologi Sistem</h2>
        <p className="text-sm text-gray-500 mt-1">Pilih lantai untuk memantau status Access Point.</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Tombol Kiri */}
        <button
          onClick={handlePrevious}
          disabled={carouselIndex === 0}
          className="px-4 py-2 bg-[#1565c0] text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2 text-sm"
        >
          <span>←</span> Sebelumnya
        </button>

        {/* Carousel Container */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          <div 
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(${-carouselIndex * 50}%)`
            }}
          >
            {lantai.map((floor) => (
              <div
                key={floor.id_lantai}
                onClick={() => onSelectFloor(floor.id_lantai)}
                className="min-w-[50%] h-[350px] bg-[#1a233a] rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#253250] transition-all duration-300 border-2 border-transparent hover:border-blue-400"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">{floor.nama_lantai.toUpperCase()}</h3>
                <p className="text-sm text-blue-200 mt-2">{floor.total} Access Points</p>
                <p className="text-xs mt-1">
                  <span className="text-green-400">{floor.online} online</span>
                  {' · '}
                  <span className="text-red-400">{floor.offline} offline</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tombol Kanan */}
        <button
          onClick={handleNext}
          disabled={carouselIndex + itemsPerView >= lantai.length}
          className="px-4 py-2 bg-[#1565c0] text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2 text-sm"
        >
          Selanjutnya <span>→</span>
        </button>
      </div>

      {/* Indikator Halaman */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: Math.ceil(lantai.length / itemsPerView) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCarouselIndex(i * itemsPerView)}
            className={`w-2 h-2 rounded-full transition-colors ${i === Math.floor(carouselIndex / itemsPerView) ? 'bg-[#1565c0]' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};
