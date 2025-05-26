'use client';
import React from 'react';
import "./news.css"
// import Header from "@/app/components/header/page";

const News = ()=>{
    return(
        <div>
            {/*<Header></Header>*/}
        <div id={"wrapNews"}>
            <h2 id={"newsTitle"}>Information</h2>

            <div className={"articles"}>
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