'use client';
import React from "react";
import {useState} from "react";
// Swiper導入
import {Swiper,SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import "swiper/css"
import "swiper/css/navigation"

// CSS
import "./schedule.css"

// コンポーネント
import MovieTL from "@/app/components/MovieTL/page";


// 表示できる日付のリスト
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

//日付と映画の組み合わせリスト
const DayMovieList = [
    {id:1, date:"0615",movie:"Movie01"},
    {id:2, date:"0615",movie:"Movie02"},
    {id:3, date:"0615",movie:"Movie03"},
    {id:4, date:"0616",movie:"Movie01"},
    {id:5, date:"0616",movie:"Movie02"},
    {id:6, date:"0616",movie:"Movie03"},
    {id:7, date:"0617",movie:"Movie01"},
    {id:8, date:"0618",movie:"Movie02"},
]

// 日付取得して初期値を設定
const getNow = () =>{
    const today = new Date();

    const month =  ('0' + (today.getMonth() + 1)).slice(-2)
    const day = ('0'+today.getDate()).slice(-2);
    return month+day;
}



const Schedule = () =>{
    // 当日の日付
    // const Today = getNow()
    // 今表示している日付
    // const [ShowDate, changeDate] = useState(Today());
    // 仮日付
    const TestToday = "0616"
    // 仮日付を初期値にした表示している日付
    const [ShowDate, changeDate] = useState(TestToday);
    // 日付でmapする用の配列
    const MoviePerDay = DayMovieList.filter(DayMovieList => DayMovieList.date === ShowDate);


    return(
        <div id={"scheduleBody"}>
            {/*{ShowDate}*/}
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
                            {
                                Number(day.date)<Number(TestToday)?(
                                    <button className={"scDate disableDate"}>
                                        {day.date}
                                    </button>
                                ): (
                                    <button className={"scDate"} onClick={(e) =>
                                        changeDate(day.date)}>
                                        {day.date}
                                    </button>
                                )
                            }

                        </SwiperSlide>
                    ))
                    }

                </Swiper>
                <button className={"dateSlide"} id={"right"}>&gt;</button>

            </div>

            <hr/>

            <div id={"timeList"}>

                {MoviePerDay.map((MPD) =>(
                    <div key={MPD.id}>
                    <MovieTL  Movie={MPD.movie} Day={ShowDate}/>
                    <hr/>
                    </div>
                ))}
                {/*<MovieTL Movie={"Movie01"} Day={ShowDate}/>*/}
                {/*<hr/>*/}
                {/*<MovieTL Movie={"Movie02"} Day={ShowDate}/>*/}
                {/*<hr/>*/}
                {/*<MovieTL Movie={"Movie03"} Day={ShowDate} />*/}

            </div>


        </div>
    );
}

export default Schedule;