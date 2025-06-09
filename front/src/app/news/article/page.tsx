'use client';
import React from "react";
import "./article.css"
import Image from "next/image";

const Article = () =>{
    return(
    <div className={"infoArt"}>
        <h1 id={"infoPageTitle"} className={"mb-5"}>Information</h1>
        <Image id={"infoArtImg"} src={"/images/theater-interior-1.png"} alt={"Screen01"} width={600} height={400}></Image>

        <p id={"infoArtDate"}>2025/06/01</p>
        <h2 id={"infoArtTitle"} className={"mb-5"}>入場者プレゼントに関するお知らせ</h2>
        <p id={"infoArtMain"}>
            ここに本文が入ります。<br/>
            <br/>

        </p>
    </div>
    );
}

export default Article;