"use client"
import type { MovieTLProps } from "@/app/types/schedule"
import Link from "next/link"
import Image from "next/image";
import { Clock, MapPin } from "lucide-react"

// TODO:もう１段階Component分けしたい

export default function MovieTL({ title, screen_id, date, showings,poster_path,target }: MovieTLProps) {
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
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gold font-jp">{title}</h2>
                <div className="flex items-center gap-2 text-text-muted">
                    <MapPin size={16} className="text-gold" />
                    <span className="font-jp">スクリーン{screen_id}</span>
                </div>
            </div>

            {/*{showings.map((s) => (*/}
            {/*    <p key={s.screening_id} className="text-text-muted text-sm font-jp">screenigID: {s.screening_id}</p>*/}
            {/*))}*/}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* ポスター */}
                <div className="flex-shrink-0">
                    <div className="relative w-32 h-44 bg-accent/20 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-text-muted font-jp">
                            poster
                            {poster_path ? (
                              <Image
                                src={poster_path}
                                alt={title}
                                fill
                                className="object-cover rounded-lg shadow-lg"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-500 flex items-center justify-center text-white">
                                No Image
                              </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 上映時間ボタン */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {showings?.map((s) => (
                            <div key={s.screening_id}>
                                {/* seatsに情報持って遷移 */}
                                {/*<Link href={{pathname:"/tickets/seats",query:{scId:s.screening_id}}}>*/}
                                    <Link href={{pathname:target,query:{scId:s.screening_id}}}>
                                    {/*  <Link href={`/tickets/seats/}`}>*/}
                                    <button
                                        className="w-full p-4 rounded-lg border transition-all duration-300 text-center
           bg-gold/10 border-gold/30 text-gold
           hover:bg-gold/20 hover:border-gold/50 hover:shadow-gold-glow"
                                    >
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            <Clock size={14} />
                                            <span className="text-lg font-bold font-playfair">{s.start_time}</span>
                                        </div>
                                        <div className="text-xs font-jp">
                                            {/* {Number(s.start_time.replace(":", "")) <= Number(Now) ? (
                                                <span>販売時間外</span>
                                            ) : ( */}
                                                <span>販売中</span>
                                            {/* )} */}
                                        </div>
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
