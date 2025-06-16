'use client';
import React from 'react';
import "./news.css"
import Link from "next/link";
import Image from "next/image";
// import Header from "@/app/components/header/page";

const News = ()=>{
    return(
        <div>

        <div id={"wrapNews"} className={"mb-10"}>
            <h2 id={"newsTitle"}>Information</h2>

            <div className={"articles"}>

                <Link href={"news/article"}>
                    <div className={"art"}>
                        <div className={"artImg mb-3  bg-amber-300"}>
                            <Image  src={"/images/provimg.jpg"} alt={"prov"} width={240} height={168}></Image>
                        </div>
                        <p className={"artTitle"}>タイトル</p>
                    </div>
                </Link>
                <Link href={"news/article"}>
                    <div className={"art"}>
                        <div className={"artImg mb-3  bg-pink-300"}>
                            <Image  src={"/images/provimg.jpg"} alt={"prov"} width={240} height={168}></Image>
                        </div>
                        <p className={"artTitle"}>タイトル</p>
                    </div>
                </Link>

                <div className={"art"}>
                    <div className={"artImg mb-3  bg-green-300"}></div>
                    <p className={"artTitle"}>タイトル</p>
                </div>
                <div className={"art"}>
                    <div className={"artImg mb-3 bg-cyan-300"}></div>
                    <p className={"artTitle"}>タイトル</p>
                </div>
                <div className={"art"}>
                    <div className={"artImg mb-3  bg-amber-300"}></div>
                    <p className={"artTitle"}>タイトル</p>
                </div>
                <div className={"art"}>
                    <div className={"artImg mb-3  bg-pink-300"}></div>
                    <p className={"artTitle"}>タイトル</p>
                </div>
                <div className={"art"}>
                    <div className={"artImg mb-3  bg-green-300"}></div>
                    <p className={"artTitle"}>タイトル</p>
                </div>
                <div className={"art"}>
                    <div className={"artImg mb-3 bg-cyan-300"}></div>
                    <p className={"artTitle"}>タイトル</p>
                </div>

            </div>
        </div>
        </div>
    );
}

export default News;