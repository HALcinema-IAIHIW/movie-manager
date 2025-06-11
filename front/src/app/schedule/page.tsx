'use client';
import React from "react";
// Swiper導入
import {Swiper,SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import "swiper/css"
import "swiper/css/navigation"

// CSS
import "./schedule.css"

// コンポーネント
import MovieTL from "@/app/components/MovieTL/page";

const ViewDate = [
    {
        id:1,
        date:"0615"
    },{
        id:2,
        date:"0616"
    },{
        id:3,
        date:"0617"
    },{
        id:4,
        date:"0618"
    },{
        id:5,
        date:"0619"
    },{
        id:6,
        date:"0620"
    },{
        id:7,
        date:"0621"
    },
]

const MovieList = [
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
            {/*　日付　*/}
            <div id={"dateSlider"}>
                <button className={"dateSlide"} id={"left"}>&lt;</button>
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl:"#left",
                        nextEl:"#right",
                    }}
                    spaceBetween={0}
                    breakpoints={{
                        0:{slidesPerView:1},
                        350:{slidesPerView:2},
                        550:{slidesPerView:3},
                        750:{slidesPerView:4},
                        980:{slidesPerView:5},
                        1200:{slidesPerView:6},
                        1500:{slidesPerView:7}

                    }}
                >
                    {ViewDate.map((day) => (
                        <SwiperSlide key={day.id}>

                            <button className={"scDate"}>
                                {day.date}
                            </button>
                        </SwiperSlide>
                    ))
                    }

                </Swiper>
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