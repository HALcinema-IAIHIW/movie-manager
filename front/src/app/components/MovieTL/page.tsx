'use client';
import React from "react";
import "./MovieTL.css";

export default function MovieTL() {
    return(
        <>
            <div className={"CinemaTL"}>
                <h2>title</h2>
                <div className={"Movie-TL"}>
                    <div className={"Poster bg-gray-500"}>poster</div>
                    <div className={"TLbuttons"}>
                        <button className={"Time"}>
                            スクリーン1<br/>
                            <span>9:30</span><br/>
                            空席◎
                        </button>
                        <button className={"Time"}>
                            スクリーン1<br/>
                            <span>9:30</span><br/>
                            空席◎
                        </button>
                        <button className={"Time"}>
                            スクリーン1<br/>
                            <span>9:30</span><br/>
                            空席◎
                        </button>
                        <button className={"Time"}>
                            スクリーン1<br/>
                            <span>9:30</span><br/>
                            空席◎
                        </button>

                    </div>
                </div>
            </div>

        </>
    )
}
