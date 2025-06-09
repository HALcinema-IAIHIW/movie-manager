"use client"
import React, { useEffect, useState } from 'react';
import styles from './id.module.css';
import { MovieData } from '@/app/components/allMovies/AllMovies';
import { use } from "react";

type Movie = {
  id: number;
  name: string;
  moviePicture: string;
  summary: string;
  cast: string[];
  releaseDate: string;
  duration: string;
  director: string;
};

const DetailMovie = ({ params }: { params: Promise <{ id: string }> }) => {
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const movieParams = use(params);

  useEffect(() => {
    const found = MovieData.find((m) => m.id === Number(movieParams.id));
    setMovie(found);
  }, [movieParams.id]);

  return (
    <div className={styles.container}>
      

      {movie ? (
        <div className={styles.row}>
    <img
        className={styles.img} src={movie.moviePicture} alt={`Movie ${movie.name}`}/>

      <div className={styles.textWrapper}>
        <p className={styles.infoRow}>
          <span className={styles.label}>タイトル：</span>
          <span className={styles.textContent}>{movie.name}</span>
        </p>
        <p className={styles.infoRow}>
          <span className={styles.label}>あらすじ：</span>
          <span className={styles.textContent}>{movie.summary}</span>
        </p>
        <p className={styles.infoRow}>
          <span className={styles.label}>キャスト：</span>
          <span className={styles.textContent}>{movie.cast.join('、')}</span>
        </p>
        <p className={styles.infoRow}>
          <span className={styles.label}>公開日：</span>
          <span className={styles.textContent}>{movie.releaseDate}</span>
        </p>
        <p className={styles.infoRow}>
          <span className={styles.label}>上映時間：</span>
          <span className={styles.textContent}>{movie.duration}</span>
        </p>
        <p className={styles.infoRow}>
          <span className={styles.label}>監督：</span>
          <span className={styles.textContent}>{movie.director}</span>
        </p>
      </div>
    </div>   
    
       )  : (
        <p>映画が見つかりません</p>
      )}

      <button className={styles.backButton} onClick={() => window.history.back()}>
        戻る
      </button>
    </div>
  );
};

export default DetailMovie;
