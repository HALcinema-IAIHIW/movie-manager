'use client';
import React, { useEffect } from "react";
import {useState, useMemo} from "react";
// Swiper導入
import {Swiper,SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import "swiper/css"
import "swiper/css/navigation"

// CSS
import "./schedule.css"

// コンポーネント
import MovieTL from "@/app/components/MovieTL/page";

// fetch
import { fetchScreeningsByDate } from "../libs/api/api";


// TODO: 今日の日付から7日間の映画上映情報取得
// TODO: その日付を使ってエンドポイントに投げる



// 日付取得して初期値を設定
const getNow = () =>{
    const today = new Date();

    const month =  ('0' + (today.getMonth() + 1)).slice(-2)
    const day = ('0'+today.getDate()).slice(-2);
    return month+day;
}

// 表示できる日付のリスト
const getViewDates = () => {
    const today = new Date();
    const result = [];

    for (let i = 0; i < 7; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);

        const month = ('0' + (targetDate.getMonth() + 1)).slice(-2);
        const day = ('0' + targetDate.getDate()).slice(-2);
        const mmdd = month + day;

        result.push({ id: i + 1, date: mmdd });
    }

    return result;
}


const Schedule = () =>{
    const ViewDate = useMemo(() => getViewDates(), []);
    // 当日の日付
    const Today = getNow()
    // 今表示している日付
    const [ShowDate, changeDate] = useState(Today);
    // 選択された日付に対応する映画ごとの上映スケジュール一覧を格納するステート
    const [MovieListPerDay, setMovieListPerDay] = useState([]);


useEffect(() => {
    const fetchDate = async () => {
        try{
            const data = await fetchScreeningsByDate(ShowDate);
            setMovieListPerDay(data);
        } catch (err) {
            console.log("取得エラー:", err);
        }
    };

    fetchDate();
}, [ShowDate])

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
                                Number(day.date)<Number(ShowDate)?(
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
                {MovieListPerDay.map((m) =>(
                    <div key={m.movie}>
                        <MovieTL  Movie={m.movie} Day={ShowDate} Showings={m.showings}/>
                        <hr/>
                    </div>
                ))}
            </div>


        </div>
    );
}

export default Schedule;