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
import Movies from "@/app/movies/page";

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

// 日付取得して過ぎた日付を消す
var Now = Date();

// 今表示している日付　この値を元に表示切替
var ShowDate = "0615"

// timeListの中身をどうにか切り替える
function changeDate(newDate:string){
    console.log(newDate);
}
const Schedule = () =>{

    return(
        <div id={"scheduleBody"}>
            <h1 id={"scheduleTitle"} className={"mb-5"}>上映スケジュール</h1>
            {/*　日付　更新日から一週間　*/}
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
            {/*<p>{Now}</p>*/}
            {/*　　*/}
            <div id={"timeList"}>
                <MovieTL Movie={"Movie01"} Day={ShowDate}/>
                <hr/>
                <MovieTL Movie={"Movie02"} Day={ShowDate}/>
                <hr/>
                <MovieTL Movie={"Movie03"} Day={ShowDate} />

            </div>


        </div>
    );
}

export default Schedule;