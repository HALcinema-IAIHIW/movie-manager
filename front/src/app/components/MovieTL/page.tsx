'use client';
import React from "react";
import "./MovieTL.css";


export default function MovieTL({Day, Movie}) {
    // Day,Movieを基にリストを編集
    const MovieList = [
        {
            id: 1,
            date: "0615",
            moive: "Movie01",
            stTime: "9:30",
            screen:"スクリーン1",
            restSeat:60

        }, {
            id: 2,
            date:"0615",
            moive:"Movie02",
            stTime:"10:50",
            screen: "スクリーン3",
            restSeat: 5
        },{
            id:3,
            date:"0615",
            moive:"Movie03",
            stTime:"9:20",
            screen:"スクリーン2",
            restSeat:80
        },{
            id:4,
            date:"0616",
            moive:"Movie01",
            stTime:"12:00",
            screen: "スクリーン5",
            restSeat:80
        },{
            id:5,
            date:"0616",
            moive:"Movie02",
            stTime:"12:40",
            screen: "スクリーン7",
            restSeat:0
        },{
            id:6,
            date:"0616",
            moive:"Movie03",
            stTime:"11:50",
            screen: "スクリーン3",
            restSeat:80
        }
    ]

    return(
        <>
            <div className={"CinemaTL"}>
                {/*{Day}*/}
                <h2>{Movie}</h2>
                <div className={"Movie-TL"}>
                    <div className={"Poster bg-gray-500"}>poster</div>
                    <div className={"TlButtons"}>
                        {MovieList.map((scList)=> (
                            // グレー差分作る奴どっか行ったふざけんなよボケが
                            <div className={"inline"} key={scList.id}>

                                {scList.restSeat === 0 ?(
                                    <button className={"Time"} id={"soldout"}>
                                        {scList.screen}<br/>
                                        <span>{scList.stTime}</span><br/>
                                        <p>売り切れ</p>
                                    </button>
                                ):(
                                    <button className={"Time"}>
                                        {scList.screen}<br/>
                                        <span>{scList.stTime}</span><br/>
                                        {scList.restSeat <= 50 ?(
                                            <p>空席△</p>
                                        ):(
                                            <p>空席◎</p>
                                        )}
                                    </button>
                                )}
                            </div>

                        ))
                        }

                    </div>
                </div>
            </div>

        </>
    )
}
