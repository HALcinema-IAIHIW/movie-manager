'use client'
import React, {useEffect, useState} from 'react';
import './movies.css'
import AllMovies from "@/app/components/allMovies/AllMovies";
//import Header from "@/app/components/header/page";

const Movies = () => {
    const MovieData = [
        {id : 1, name: "movie2", moviePicture: "/images/haru.jpg"},
        {id : 2, name: "movie1", moviePicture: "/images/5cm.jpg"},
        {id : 3, name: "movie3", moviePicture: "/images/same.jpg"},
        {id : 4, name: "movie4", moviePicture: "/images/summer.jpg"},
        {id : 5, name: "movie5", moviePicture: "/images/bee.jpg"},
        {id : 6, name: "movie6", moviePicture: "/images/konan.jpg"},
        {id : 7, name: "movie7", moviePicture: "/images/interstellar.jpg"},
        {id : 8, name: "movie8", moviePicture: "/images/konan2.jpg"},
    ]

    return (
        <>


            {/*<Header></Header>*/}
            <div id={"Movie"}>
                <h2 id={"MovieTitle"}>Movies</h2>

                    <AllMovies/>
                {/*<div className={"articles"}>*/}
                {/*    <div className={"art"}>*/}
                {/*        <div className={"artImg mb-3"}>*/}
                {/*            <img src="/images/haru.jpg" className="w-full h-full object-cover"/>*/}
                {/*        </div>*/}
                {/*        <p className={"artTitle"}>*/}
                {/*            <Link href="/movies/1">タイトル</Link>*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className={"art"}>*/}
                {/*        <div className={"artImg mb-3"}>*/}
                {/*            <img src="/images/5cm.jpg" className="w-full h-full object-cover"/>*/}
                {/*        </div>*/}
                {/*        <p className={"artTitle"}>*/}
                {/*            <Link href="/movies/1">タイトル</Link>*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className={"art"}>*/}
                {/*        <div className={"artImg mb-3"}>*/}
                {/*            <img src="/images/same.jpg" className="w-full h-full object-cover"/>*/}
                {/*        </div>*/}
                {/*        <p className={"artTitle"}>*/}
                {/*            <Link href="/movies/1">タイトル</Link>*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className={"art"}>*/}
                {/*        <div className={"artImg mb-3"}>*/}
                {/*            <img src="/images/summer.jpg" className="w-full h-full object-cover"/>*/}
                {/*        </div>*/}
                {/*        <p className={"artTitle"}>*/}
                {/*            <Link href="/movies/1">タイトル</Link>*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className={"art"}>*/}
                {/*        <div className={"artImg mb-3"}>*/}
                {/*            <img src="/images/bee.jpg" className="w-full h-full object-cover"/>*/}
                {/*        </div>*/}
                {/*        <p className={"artTitle"}>*/}
                {/*            <Link href="/movies/1">タイトル</Link>*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className={"art"}>*/}
                {/*        <div className={"artImg mb-3"}>*/}
                {/*            <img src="/images/konan.jpg" className="w-full h-full object-cover"/>*/}
                {/*        </div>*/}
                {/*        <p className={"artTitle"}>*/}
                {/*            <Link href="/movies/1">タイトル</Link>*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className={"art"}>*/}
                {/*        <div className={"artImg mb-3"}>*/}
                {/*            <img src="/images/interstellar.jpg" className="w-full h-full object-cover"/>*/}
                {/*        </div>*/}
                {/*        <p className={"artTitle"}>*/}
                {/*            <Link href="/movies/1">タイトル</Link>*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className={"art"}>*/}
                {/*        <div className={"artImg mb-3"}>*/}
                {/*            <img src="/images/konan2.jpg" className="w-full h-full object-cover"/>*/}
                {/*        </div>*/}
                {/*        <p className={"artTitle"}>*/}
                {/*            <Link href="/movies/1">タイトル</Link>*/}
                {/*        </p>*/}
                {/*    </div>*/}

                {/*</div>*/}
            </div>
        </>
    )
        ;
}

export default Movies;