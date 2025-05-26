'use client';
import React from 'react';
import './movies.css'
import Link from 'next/link';
//import Header from "@/app/components/header/page";

const Movies = () =>{
        return(
        <>
            {/*<Header></Header>*/}
        <div id={"Movie"}>
            <h2 id={"MovieTitle"}>Movies</h2>

            <div className={"articles"}>
                <div className={"art"}>
            <div className={"artImg mb-3"}>
                <img src="/images/haru.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>
                <Link href="/movies/1">タイトル</Link>
            </p>
            </div>
                <div className={"art"}>
            <div className={"artImg mb-3"}>
                <img src="/images/5cm.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>
                <Link href="/movies/1">タイトル</Link>
            </p>
            </div>
                <div className={"art"}>
            <div className={"artImg mb-3"}>
                <img src="/images/same.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>
                <Link href="/movies/1">タイトル</Link>
            </p>
            </div>
                <div className={"art"}>
            <div className={"artImg mb-3"}>
                <img src="/images/summer.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>
                <Link href="/movies/1">タイトル</Link>
            </p>
            </div>
                <div className={"art"}>
            <div className={"artImg mb-3"}>
                <img src="/images/bee.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>
                <Link href="/movies/1">タイトル</Link>
            </p>
            </div>
                <div className={"art"}>
            <div className={"artImg mb-3"}>
                <img src="/images/konan.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>
                <Link href="/movies/1">タイトル</Link>
            </p>
            </div>
                <div className={"art"}>
            <div className={"artImg mb-3"}>
                <img src="/images/interstellar.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>
                <Link href="/movies/1">タイトル</Link>
            </p>
            </div>
                <div className={"art"}>
            <div className={"artImg mb-3"}>
                <img src="/images/konan2.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>
                <Link href="/movies/1">タイトル</Link>
            </p>
            </div>

            </div>
        </div>
        </>
    );
}

export default Movies;