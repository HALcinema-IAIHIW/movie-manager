'use client';
import React from "react";
import "./MovieTL.css";
import { MovieTLProps } from "@/app/types/schedule";




// TODO:もう１段階Component分けしたい

export default function MovieTL({ title, screen_id, date,showings }: MovieTLProps) {
    // Day,Movieを元にリスト取得
    // 開始時間がTime型になっていないので導入時比較処理も修正する
    // 登録が必ず時系列順というわけでは無いなら並べ変え処理も入れた方が良いか？

    // filterが不要なようにデータ取得時に絞り込む予定
    // const Dairy = MovieList.filter(MovieList => MovieList.date === Day)
    // 現在時刻取得
    const getNowTime = () =>{
        // const today = new Date();
        // const hour =  ('0' + (today.getHours())).slice(-2)
        // const min = ('0'+today.getMinutes()).slice(-2);
        const now = new Date();
        // 日本時間にする
        const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        const hour = String(jst.getHours()).padStart(2, '0');
        const min = String(jst.getMinutes()).padStart(2, '0');
        // return hour+":"+sec;
        return hour+min;
    };

    const Now = getNowTime();

    console.log(`showings[0].date(screeningsID)->${showings[0].screening_id}`)

    //日本時間じゃないので調整必要
    // オート更新も付ける
    // 仮時間
    // const Now = "1150"
    // const Now = NowTime()
    return (
    <div className="CinemaTL">
      <h2>{title}</h2>
      {showings.map((s) => (
        <p key={s.screening_id}>screenigID: {s.screening_id}</p>
      ))}
      <div className="Movie-TL">
        <div className="Poster bg-gray-500">poster</div>
        <div className="TlButtons">
          {showings?.map((s) => (
            <div className="inline" key={s.screening_id}>
              <button className="Time">
                スクリーン{screen_id}
                <br />
                <span>{s.start_time}</span>
                <br />
                {Number(s.start_time.replace(":", "")) <= Number(Now) ? (
                  <p>販売時間外</p>
                ) : (
                  <p>販売中</p>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}