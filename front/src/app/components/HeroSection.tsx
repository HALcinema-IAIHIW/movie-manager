"use client"

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react";
import { useState, useEffect } from "react";
import type { MovieTLResponse } from "@/app/types/movie";

interface Props {
  heroMovies: MovieTLResponse[];
}

export const HeroSection = ({ heroMovies }: Props) => {
  // カルーセルの状態管理
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // スライド操作関数
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 6000)
  }
  const prevSlide = () => {
    pauseAutoPlay()
    setCurrentSlide((prev) => (prev === 0 ? heroMovies.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    pauseAutoPlay()
    setCurrentSlide((prev) => (prev === heroMovies.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    pauseAutoPlay()
    setCurrentSlide(index)
  }

  useEffect(() => {
    if (!isAutoPlaying || heroMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev === heroMovies.length - 1 ? 0 : prev + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroMovies]);

  return (
    <section className="relative h-screen overflow-hidden">

      {/* スライド */}
      {heroMovies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >

          {/* 背景画像 */}
          <div className="absolute inset-0">
            <Image
              src={movie.poster_path || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
              priority={index === 0}
            />

            {/* グラデーションオーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-r from-darkest/90 via-darkest/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-darkest/80 via-transparent to-darkest/40" />
          </div>

          {/* コンテンツ */}
          <div className="relative h-full flex items-center ml-24">
            <div className="container-luxury">
              <div className="max-w-2xl animate-fade-in">
                
                {/* ジャンル */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-gold/20 text-gold text-sm font-medium rounded-full font-shippori">
                    {movie.genre}
                  </span>
                </div>

                {/* タイトル */}
                <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-4 font-jp">{movie.title}</h1>
                
                {/* サブタイトル */}                
                <h2 className="text-xl md:text-2xl text-gold mb-6 font-shippori">{movie.subtitle}</h2>
                
                {/* 説明文 */}
                <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-xl font-shippori">
                  {movie.description}
                </p>
                
                {/* アクションボタン */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/movies/${movie.id}`}
                    className="btn-luxury flex items-center justify-center gap-2 font-shippori"
                  >
                    <Play size={20} />
                    <span className="font-jp">予告編を見る</span>
                  </Link>
                  <Link
                    href={`/tickets/schedule/${movie.id}`}
                    className="btn-outline-luxury flex items-center justify-center gap-2 font-shippori"
                  >
                    <Info size={20} />
                    <span className="font-jp">チケット購入</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ナビエげーションボタン */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 z-10">
        <button
          onClick={prevSlide}
          className="w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="前のスライド"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="次のスライド"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* インジケータ― */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
        {heroMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-gold scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`スライド ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
