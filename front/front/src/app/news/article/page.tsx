'use client';
import React from "react";
import "./article.css"
import Image from "next/image";
import Link from "next/link";

const Article = () =>{
    return(
    <div className={"infoArt"}>
        <h1 id={"infoPageTitle"} className={"mb-5"}>Information</h1>
        <Image id={"infoArtImg"} src={"/images/provimg.jpg"} alt={"Screen01"} width={600} height={400}></Image>


        <p id={"infoArtDate"}>2025/06/01</p>
        <h2 id={"infoArtTitle"} className={"mb-5"}>入場者プレゼントに関するお知らせ</h2>
        <p id={"infoArtMain"}>
            ここに本文が入ります。<br/>
            ここに本文が入ります。
        </p>
        <p id={"toNews"}><Link href={"/news"} >戻る</Link></p>
    </div>
    );
}

export default Article;