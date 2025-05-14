'use client';
import React from 'react';
import "./news.css"

const News = ()=>{
    return(
        <div id={"wrapNews"}>
            <h2 id={"newsTitle"}>NEWS</h2>

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
    );
}

export default News;