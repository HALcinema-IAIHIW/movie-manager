'use client';
import React from "react";
import "./schedule.css"
import MovieTL from "@/app/components/MovieTL/page";

const MovieSchedule = [
    {
        id:1,
        date:"0615",
        moive:"Movie01",
    },{
        id:2,
        date:"0615",
        moive:"Movie02",
    },{
        id:3,
        date:"0615",
        moive:"Movie03",
    },{
        id:4,
        date:"0616",
        moive:"Movie01",
    },{
        id:5,
        date:"0616",
        moive:"Movie02",
    },{
        id:6,
        date:"0616",
        moive:"Movie03",
    }
]

// 条件付きレンダーでtimeListの中身を切り替える

const Schedule = () =>{
    return(
        <div id={"scheduleBody"}>
            <h1 id={"scheduleTitle"} className={"mb-5"}>上映スケジュール</h1>
            <div id={"dateSlider"}>
                <button className={"dateSlide"} id={"left"}>&lt;</button>
                <div id={"dateList"}>
                    <button className={"scDate"}>
                        6/15
                    </button>
                    <button className={"scDate"}>
                        6/16
                    </button>
                    <button className={"scDate"}>
                        6/17
                    </button>
                    <button className={"scDate"}>
                        6/18
                    </button>
                    <button className={"scDate"} >
                        6/19
                    </button>
                    <button className={"scDate"} >
                        6/20
                    </button>
                </div>

                <button className={"dateSlide"} id={"right"}>&gt;</button>
            </div>
            <hr/>
            <div id={"timeList"}>
                <div className={"CinemaTL"}>
                    <h2>Movie01</h2>
                    <div className={"Movie-TL"}>
                        <div className={"Poster bg-gray-500"}>ここにポスター</div>
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
                <hr/>
                <div className={"CinemaTL"}>
                    <h2>Movie02</h2>
                    <div className={"Movie-TL"}>
                        <div className={"Poster bg-gray-500"}>ここにポスター</div>
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
                <hr/>
                <MovieTL/>

            </div>


        </div>
    );
}

export default Schedule;