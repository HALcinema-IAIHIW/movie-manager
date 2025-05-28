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
            <Link href="/movies/haru" className="block">
                <div className={"artImg mb-3"}>
                <img src="/images/haru.jpg" className="w-full h-full object-cover" />
                </div>
                <p className={"artTitle"}>四月は君の嘘</p>
            </Link>
            </div>


                <div className={"art"}>
            <Link href="/movies/byosoku" className='block'>
                <div className={"artImg mb-3"}>
                <img src="/images/5cm.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>秒速5センチメートル</p>
            </Link>
            </div>
            
            
                <div className={"art"}>
            <Link href="/movies/same" className='block'>
            <div className={"artImg mb-3"}>
                <img src="/images/same.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>MANEATER
            </p>
            </Link>
            </div>
            
                <div className={"art"}>
             <Link href="/movies/summer" className='block'>
            <div className={"artImg mb-3"}>
                <img src="/images/summer.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>サマーウォーズ</p>
            </Link>
            </div>
            
                <div className={"art"}>
            <Link href="/movies/bee" className='block'>
            <div className={"artImg mb-3"}>
                <img src="/images/bee.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>BEETLW JUICE</p>
            </Link>
            </div>
            
                <div className={"art"}>
            <Link href="/movies/konan" className='block'>
            <div className={"artImg mb-3"}>
                <img src="/images/konan.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>名探偵コナン</p>
            </Link>
            </div>
            
                <div className={"art"}>
            <Link href="/movies/interstellar" className='block'>
            <div className={"artImg mb-3"}>
                <img src="/images/interstellar.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>インターステラー</p>
            </Link>
            </div>
            
                <div className={"art"}>
            <Link href="/movies/konan2" className='block'>
            <div className={"artImg mb-3"}>
                <img src="/images/konan2.jpg" className="w-full h-full object-cover" />
            </div>
            <p className={"artTitle"}>名探偵コナン</p>
            </Link>
            </div>

            </div>
        </div>
        </>
    );
}

export default Movies;