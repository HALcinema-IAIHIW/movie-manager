import React from 'react';
import Link from "next/link";
import Image from "next/image";
import styles from "./allMovie.module.css"

// vsCodeではrafce , webStormではrsc
export const MovieData = [
    {id: 1, name: "四月は君の嘘", moviePicture: "/images/haru.jpg",summary: "2014年にノイタミナでアニメ化もされた新川直司の人気漫画「四月は君の嘘」を、「海街diary」「ちはやふる」の広瀬すずと「ヒロイン失格」「orange オレンジ」の山崎賢人の共演で実写映画化。母の死をきっかけにピアノが弾けなくなってしまった天才ピアニストの少年・有馬公生は、天真爛漫なバイオリニストの宮園かをりに惹かれていく。かをりとの出会いをきっかけに、ピアノと母との思い出とに向き合っていく公生だったが、かをりもまた、ある秘密を抱えていた。かをり役を広瀬、公生役を山崎が演じ、公生の幼なじみの椿に石井杏奈、かをりが恋する渡に中川大志が扮した。監督は「僕の初恋をキミに捧ぐ」「潔く柔く　きよくやわく」の新城毅彦。" , cast: ["広瀬すず","山崎賢人","石井杏奈"], releaseDate: "2016-09-10", duration: "122分", director: "新城毅彦"},
    {id: 2, name: "秒速5センチメートル", moviePicture: "/images/5cm.jpg",summary: "「言の葉の庭」の新海誠による2007年公開の劇場作品で、ひかれあっていた男女の時間と距離による変化を全3話の短編で描いた連作アニメーション。互いに思いあっていた貴樹と明里は、小学校卒業と同時に明里の引越しで離ればなれになってしまう。中学生になり、明里からの手紙が届いたことをきっかけに、貴樹は明里に会いにいくことを決意する（第1話「桜花抄」）。やがて貴樹も中学の半ばで東京から引越し、遠く離れた鹿児島の離島で高校生生活を送っていた。同級生の花苗は、ほかの人とはどこか違う貴樹をずっと思い続けていたが……（第2話「コスモナウト」）。社会人になり、東京でSEとして働く貴樹。付き合った女性とも心を通わせることができず別れてしまい、やがて会社も辞めてしまう。季節がめぐり春が訪れると、貴樹は道端である女性に気づく。", cast:["水橋研二","近藤好美","尾上綾華","花村怜美"]},
    {id: 3, name: "MANEATER", moviePicture: "/images/same.jpg",summary: "人喰いザメの恐怖を描いたモンスターホラー。婚約を破棄され失意の中にいるジェシーは、せっかくのハネムーンを楽しもうと友人たちに説得され、楽園のように美しい島でバカンスを過ごしていた。そんな彼女たちに、巨大な人喰いザメのマンイーターの恐怖が水面下から忍び寄る。", cast:["ニッキーウィーラン","トレイス・アドキンス","ジェフ・フェイヒー"]},
    {id: 4, name: "サマーウォーズ", moviePicture: "/images/summer.jpg",summary: "", cast:[""]},
    {id: 5, name: "BEETLE JUICE", moviePicture: "/images/bee.jpg",summary: "", cast:[""]},
    {id: 6, name: "名探偵コナン", moviePicture: "/images/konan.jpg",summary: "", cast:[""]},
    {id: 7, name: "インターステラー", moviePicture: "/images/interstellar.jpg",summary: "", cast:[""]},
    {id: 8, name: "名探偵コナン", moviePicture: "/images/konan2.jpg",summary: "", cast:[""]},
]

const AllMovies = () => {
    return (
        <div className={styles.articles}>
            {MovieData.map((item, index) => (
                
                    <div key={index} className={styles.art}>
                        <Link href={`/movies/${item.id}`}>
                            <div className={styles.artImg}>
                                <Image src={item.moviePicture} width={200} height={300} alt={"映画のサムネイル"}/>
                            </div>
                            <p className={styles.artTitle}>
                                {item.name}
                            </p>
                        </Link>
                    </div>
            
            ))}
        </div>
    );
};

export default AllMovies;