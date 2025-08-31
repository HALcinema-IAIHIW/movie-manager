"use client"
import type { MovieTLProps } from "@/app/types/schedule"
import Link from "next/link"
import { Clock, MapPin } from "lucide-react"

// TODO:もう１段階Component分けしたい

export default function MovieTL({ title, screen_id, date, showings }: MovieTLProps) {
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
                        </div>
                    </div>
                </div>

                {/* 上映時間ボタン */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {showings?.map((s) => (
                            <div key={s.screening_id}>
                                {/* seatsに情報持って遷移 */}
                                <Link href={{pathname:"/tickets/seats",query:{scId:s.screening_id}}}>
                                    {/*  <Link href={`/tickets/seats/}`}>*/}
                                    <button
                                        className={`w-full p-4 rounded-lg border transition-all duration-300 text-center ${
                                            Number(s.start_time.replace(":", "")) <= Number(Now)
                                                ? "bg-accent/20 border-accent/30 text-text-muted cursor-not-allowed"
                                                : "bg-gold/10 border-gold/30 text-gold hover:bg-gold/20 hover:border-gold/50 hover:shadow-gold-glow"
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            <Clock size={14} />
                                            <span className="text-lg font-bold font-playfair">{s.start_time}</span>
                                        </div>
                                        <div className="text-xs font-jp">
                                            {Number(s.start_time.replace(":", "")) <= Number(Now) ? (
                                                <span>販売時間外</span>
                                            ) : (
                                                <span>販売中</span>
                                            )}
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


// "use client"
// import Image from "next/image"
// import { Clock, Users, MapPin } from "lucide-react"
//
// export default function MovieTL({ Day, Movie, onTimeSlotClick }) {
//     // Day,Movieを元にリスト取得　今回は日付をfilterでやってますが対象のデータだけ取得する
//     const MovieList = [
//         {
//             id: 1,
//             date: "0615",
//             moive: "Movie01",
//             stTime: "9:30",
//             screen: "スクリーン1",
//             restSeat: 60,
//         },
//         {
//             id: 2,
//             date: "0615",
//             moive: "Movie02",
//             stTime: "10:50",
//             screen: "スクリーン3",
//             restSeat: 5,
//         },
//         {
//             id: 3,
//             date: "0615",
//             moive: "Movie03",
//             stTime: "9:20",
//             screen: "スクリーン2",
//             restSeat: 80,
//         },
//         {
//             id: 4,
//             date: "0616",
//             moive: "Movie01",
//             stTime: "12:00",
//             screen: "スクリーン5",
//             restSeat: 80,
//         },
//         {
//             id: 5,
//             date: "0616",
//             moive: "Movie02",
//             stTime: "12:40",
//             screen: "スクリーン7",
//             restSeat: 0,
//         },
//         {
//             id: 6,
//             date: "0616",
//             moive: "Movie03",
//             stTime: "11:50",
//             screen: "スクリーン3",
//             restSeat: 80,
//         },
//         {
//             id: 7,
//             date: "0617",
//             moive: "Movie01",
//             stTime: "11:50",
//             screen: "スクリーン5",
//             restSeat: 80,
//         },
//         {
//             id: 8,
//             date: "0618",
//             moive: "Movie02",
//             stTime: "11:50",
//             screen: "スクリーン3",
//             restSeat: 80,
//         },
//         {
//             id: 9,
//             date: "0616",
//             moive: "Movie02",
//             stTime: "11:50",
//             screen: "スクリーン6",
//             restSeat: 80,
//         },
//     ]
//
//     // のでここは実際にデータ入ってるときは要らなくなる
//     const Dairy = MovieList.filter((MovieList) => MovieList.date === Day)
//
//     // 現在時刻取得
//     const NowTime = () => {
//         const today = new Date()
//         const hour = ("0" + (today.getHours() + 1)).slice(-2)
//         const sec = ("0" + today.getSeconds()).slice(-2)
//         return hour + ":" + sec
//     }
//
//     //日本時間じゃないので調整必要
//     // オート更新も付ける
//     const Now = NowTime()
//
//     // 時間枠クリック時の処理
//     const handleTimeClick = (scList) => {
//         if (scList.restSeat === 0) return // 売り切れの場合は何もしない
//
//         // 映画IDをマッピング（実際のアプリでは適切なIDを使用）
//         const movieIdMap = {
//             Movie01: "1",
//             Movie02: "2",
//             Movie03: "3",
//         }
//
//         const movieId = movieIdMap[Movie] || "1"
//         onTimeSlotClick(movieId, scList.stTime, scList.screen)
//     }
//
//     return (
//         <div className="p-8">
//             {/* 映画タイトルと現在時刻 */}
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gold font-jp">{Movie}</h2>
//                 <div className="flex items-center gap-2 text-text-muted text-sm">
//                     <Clock size={16} />
//                     <span className="font-playfair">現在時刻: {Now}</span>
//                 </div>
//             </div>
//
//             <div className="flex flex-col lg:flex-row gap-8">
//                 {/* ポスター */}
//                 <div className="flex-shrink-0">
//                     <div className="w-32 h-44 bg-accent/20 rounded-lg flex items-center justify-center text-text-muted font-jp">
//                         <Image
//                             src="/images/movie-poster-1.jpg"
//                             alt={Movie}
//                             width={128}
//                             height={176}
//                             className="w-full h-full object-cover rounded-lg"
//                         />
//                     </div>
//                 </div>
//
//                 {/* 上映時間ボタン */}
//                 <div className="flex-1">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//                         {Dairy.map((scList) => (
//                             <div key={scList.id}>
//                                 {scList.restSeat === 0 ? (
//                                     <button
//                                         className="w-full p-4 bg-red-900/30 border border-red-800/50 rounded-lg
//                                         text-red-300 cursor-not-allowed transition-all duration-300"
//                                         disabled
//                                     >
//                                         <div className="flex items-center gap-2 mb-2">
//                                             <MapPin size={14} />
//                                             <span className="text-sm font-jp">{scList.screen}</span>
//                                         </div>
//                                         <div className="text-lg font-bold font-playfair mb-1">{scList.stTime}</div>
//                                         <div className="flex items-center justify-center gap-1 text-xs">
//                                             <Users size={12} />
//                                             <span className="font-jp">売り切れ</span>
//                                         </div>
//                                     </button>
//                                 ) : (
//                                     <button
//                                         className="w-full p-4 bg-gold/10 hover:bg-gold/20 border border-gold/30
//                                         hover:border-gold/50 rounded-lg text-text-primary hover:text-gold
//                                         transition-all duration-300 hover:scale-105"
//                                         onClick={() => handleTimeClick(scList)}
//                                     >
//                                         <div className="flex items-center gap-2 mb-2">
//                                             <MapPin size={14} className="text-gold" />
//                                             <span className="text-sm font-jp">{scList.screen}</span>
//                                         </div>
//                                         <div className="text-lg font-bold font-playfair mb-1 text-gold">{scList.stTime}</div>
//                                         <div className="flex items-center justify-center gap-1 text-xs">
//                                             <Users size={12} />
//                                             <span className="font-jp">{scList.restSeat <= 50 ? "空席△" : "空席◎"}</span>
//                                         </div>
//                                     </button>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
