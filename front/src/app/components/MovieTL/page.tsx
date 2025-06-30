'use client';
import React from "react";
import "./MovieTL.css";


// TODO:もう１段階Component分けしたい

export default function MovieTL({Day, Movie, Showings}) {
    // Day,Movieを元にリスト取得
    // 開始時間がTime型になっていないので導入時比較処理も修正する
    // 登録が必ず時系列順というわけでは無いなら並べ変え処理も入れた方が良いか？

    // filterが不要なようにデータ取得時に絞り込む予定
    // const Dairy = MovieList.filter(MovieList => MovieList.date === Day)
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
    // 仮時間
    // const Now = "1150"
    const Now = NowTime()
    return(
        <>
            <div className={"CinemaTL"}>
                {/*{Day}*/}
                {/*{Now}*/}
                <h2>{Movie}</h2>
                <div className={"Movie-TL"}>
                    <div className={"Poster bg-gray-500"}>poster</div>
                    <div className={"TlButtons"}>
                        {Showings.map((scList)=> (
                            // 販売期間外差分も足す これ数字に一回変換しないとダメか　:でスライスして数字にしてから比較？
                            <div className={"inline"} key={scList.id}>
                                {/*{scList.stTime}*/}

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
