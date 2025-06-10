import React from 'react';
import Link from "next/link";
import Image from "next/image";
import styles from "./allMovie.module.css"

// vsCodeではrafce , webStormではrsc
export const MovieData = [
    {id: 1, name: "movie1", moviePicture: "/images/haru.jpg"},
    {id: 2, name: "movie2", moviePicture: "/images/5cm.jpg"},
    {id: 3, name: "movie3", moviePicture: "/images/same.jpg"},
    {id: 4, name: "movie4", moviePicture: "/images/summer.jpg"},
    {id: 5, name: "movie5", moviePicture: "/images/bee.jpg"},
    {id: 6, name: "movie6", moviePicture: "/images/konan.jpg"},
    {id: 7, name: "movie7", moviePicture: "/images/interstellar.jpg"},
    {id: 8, name: "movie8", moviePicture: "/images/konan2.jpg"},
]

const AllMovies = () => {
    return (
        <div className={styles.articles}>
            {MovieData.map((item, index) => (
                <>
                    <div key={index} className={styles.art}>
                        <Link href={`/movies/${item.id}`}>
                            <div className={styles.artImg}>
                                <Image src={item.moviePicture} width={200} height={300} alt={"映画のサムネイル"}/>
                            </div>
                            <p className={styles.artTitle}>
                                {item.name}
                            </p>
                        </Link>
                    </div>
                </>
            ))}
        </div>
    );
};

export default AllMovies;