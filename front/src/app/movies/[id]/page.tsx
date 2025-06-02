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
        <>
          <img
            className={styles.img}
            src={movie.moviePicture}
            alt={`Movie ${movie.name}`}
          />
          <p className={styles.p}>
            <span className={styles['summary-title']}>タイトル : {movie.name}</span> 
          </p>
          <p className={styles.p}>
            <span className={styles['summary-title']}>あらすじ : </span>
            <span className={styles['summary-content']}> {movie.summary}</span>
          </p>
          <p className={styles.p}>
            <span className={styles['summary-title']}>キャスト : </span>
            <span className={styles['summary-content']}>  {movie.cast.join("、")}</span>
          </p>
        </>
      ) : (
        <p>映画が見つかりません</p>
      )}

      <button className={styles.backButton} onClick={() => window.history.back()}>
        戻る
      </button>
    </div>
  );
};

export default DetailMovie;
