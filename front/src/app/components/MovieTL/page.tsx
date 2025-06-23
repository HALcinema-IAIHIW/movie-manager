'use client';
import React from "react";
import "./MovieTL.css";



export default function MovieTL({Day, Movie}) {
    // Day,Movieを元にリスト取得　今回は日付をfilterでやってますが対象のデータだけ取得する
    // 開始時間がTime型になっていないので導入時注意
    const MovieList = [
        {
            id: 1,
            date: "0615",
            moive: "Movie01",
            stTime: "930",
            screen:"スクリーン1",
            restSeat:60

        }, {
            id: 2,
            date:"0615",
            moive:"Movie02",
            stTime:"1050",
            screen: "スクリーン3",
            restSeat: 5
        },{
            id:3,
            date:"0615",
            moive:"Movie03",
            stTime:"920",
            screen:"スクリーン2",
            restSeat:80
        },{
            id:4,
            date:"0616",
            moive:"Movie01",
            stTime:"1200",
            screen: "スクリーン5",
            restSeat:80
        },{
            id:5,
            date:"0616",
            moive:"Movie02",
            stTime:"1240",
            screen: "スクリーン7",
            restSeat:0
        },{
            id:6,
            date:"0616",
            moive:"Movie03",
            stTime:"1150",
            screen: "スクリーン3",
            restSeat:80
        },{
            id:7,
            date:"0617",
            moive:"Movie01",
            stTime:"1150",
            screen: "スクリーン5",
            restSeat:80
        },{
            id:8,
            date:"0618",
            moive:"Movie02",
            stTime:"1150",
            screen: "スクリーン3",
            restSeat:80
        },{
            id:9,
            date:"0616",
            moive:"Movie02",
            stTime:"1150",
            screen: "スクリーン6",
            restSeat:80
        }
    ]
    // のでここは実際にデータ入ってるときは要らなくなる
    const Dairy = MovieList.filter(MovieList => MovieList.date === Day)
    // 現在時刻取得
    const NowTime = () =>{
        const today = new Date();

        const hour =  ('0' + (today.getHours())).slice(-2)
        const min = ('0'+today.getMinutes()).slice(-2);
        // return hour+":"+sec;
        return hour+min;
    }

    //日本時間じゃないので調整必要
    // オート更新も付ける
    const Now = "1100"
    // const Now = NowTime()
    return(
        <>
            <div className={"CinemaTL"}>
                {/*{Day}*/}
                {Now}
                <h2>{Movie}</h2>
                <div className={"Movie-TL"}>
                    <div className={"Poster bg-gray-500"}>poster</div>
                    <div className={"TlButtons"}>
                        {Dairy.map((scList)=> (
                            // 販売期間外差分も足す これ数字に一回変換しないとダメか　:でスライスして数字にしてから比較？
                            <div className={"inline"} key={scList.id}>
                                {scList.stTime}

                                {
                                    scList.restSeat === 0 ?(
                                    <button className={"Time"} id={"soldout"}>
                                        {scList.screen}<br/>
                                        <span>{scList.stTime}</span><br/>
                                        <p>売り切れ</p>
                                    </button>
                                ):Number(scList.stTime) <= Number(Now)?(
                                    <button className={"Time"} id={"soldout"}>
                                        {scList.screen}<br/>
                                        <span>{scList.stTime}</span><br/>

                                        <p>販売時間外</p>
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
