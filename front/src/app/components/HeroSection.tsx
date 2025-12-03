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
          // 【修正1】アクティブでないスライドはクリック判定を無効化 (pointer-events-none)
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide
              ? "opacity-100 scale-100 z-10 pointer-events-auto"
              : "opacity-0 scale-105 z-0 pointer-events-none"
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
                    // 【確認】ここは z-index 等の影響を受けないようになります
                    className="btn-luxury flex items-center justify-center gap-2 font-shippori"
                  >
                    <Play size={20} />
                    <span className="font-jp">予告編を見る</span>
                  </Link>
                  <Link
                    href={`/tickets/schedule/`}
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

      {/* ナビゲーションボタン */}
      {/* 【修正2】z-20に上げて最前面にしつつ、pointer-events-none で枠自体のクリック判定を消す */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 z-20 pointer-events-none">
        <button
          onClick={prevSlide}
          // 【修正3】ボタン自体はクリックできるように pointer-events-auto を指定
          className="w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto"
          aria-label="前のスライド"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          // 【修正3】ボタン自体はクリックできるように pointer-events-auto を指定
          className="w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto"
          aria-label="次のスライド"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* インジケーター */}
      {/* 【修正2】同様に z-20 かつ pointer-events-none で誤クリック防止 */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20 pointer-events-none">
        {heroMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            // 【修正3】ドットボタン自体はクリックできるように pointer-events-auto
            className={`w-3 h-3 rounded-full transition-all duration-300 pointer-events-auto ${
              index === currentSlide ? "bg-gold scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`スライド ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};