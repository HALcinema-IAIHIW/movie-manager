"use client";

import { useState } from "react";
import MovieCard from "./MovieCard";
import type { MovieTLResponse } from "@/app/types/movie";

interface MovieSectionProps {
  nowShowing: MovieTLResponse[];
  comingSoon: MovieTLResponse[];
}

export const MovieSection: React.FC<MovieSectionProps> = ({ nowShowing, comingSoon }) => {
  
  const [activeTab, setActiveTab] = useState<"nowShowing" | "comingSoon">("nowShowing");

  return (
    <section className="py-20 bg-darker">
      <div className="container-luxury">
        
        {/* セクションタイトル */}
        <div className="text-center mb-16">
          <h2 className="section-title mb-4 font-en">MOVIES</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto font-shippori">
            <span className="font-jp">厳選された最高品質の映画作品をお楽しみください</span>
          </p>
        </div>

        {/* タブナビ */}
        <div className="flex justify-center border-b border-accent/20 mb-12">
          <button
            className={`px-8 py-4 text-lg transition-all duration-300 relative font-en ${
              activeTab === "nowShowing" ? "text-gold" : "text-text-muted hover:text-text-secondary"
            }`}
            onClick={() => setActiveTab("nowShowing")}
          >
            NOW SHOWING
            {activeTab === "nowShowing" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
          </button>
          <button
            className={`px-8 py-4 text-lg transition-all duration-300 relative font-en ${
              activeTab === "comingSoon" ? "text-gold" : "text-text-muted hover:text-text-secondary"
            }`}
            onClick={() => setActiveTab("comingSoon")}
          >
            COMING SOON
            {activeTab === "comingSoon" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
          </button>
        </div>

        {/* 映画グリッド */}
        <div className={`transition-all duration-500 ${activeTab === "nowShowing" ? "opacity-100" : "opacity-0 hidden"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {nowShowing.map((movie) => (
              <MovieCard key={movie.id} movie={movie} type="nowShowing" />
            ))}
          </div>
        </div>

        <div className={`transition-all duration-500 ${activeTab === "comingSoon" ? "opacity-100" : "opacity-0 hidden"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {comingSoon.map((movie) => (
              <MovieCard key={movie.id} movie={movie} type="comingSoon" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
