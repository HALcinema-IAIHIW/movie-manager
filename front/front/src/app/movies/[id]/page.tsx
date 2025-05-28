'use client';
import React from 'react';
import { useParams,useRouter } from 'next/navigation';
import styles from "./id.module.css"

const moviesData = {
  haru: {
    title: "四月は君の嘘",
    image: "/images/haru.jpg",
    description: `<strong style="font-size: 2em;">あらすじ：</strong><br /><br />
2014年にノイタミナでアニメ化もされた新川直司の人気漫画「四月は君の嘘」を、「海街diary」「ちはやふる」の広瀬すずと「ヒロイン失格」「orange オレンジ」の山崎賢人の共演で実写映画化。母の死をきっかけにピアノが弾けなくなってしまった天才ピアニストの少年・有馬公生は、天真爛漫なバイオリニストの宮園かをりに惹かれていく。かをりとの出会いをきっかけに、ピアノと母との思い出とに向き合っていく公生だったが、かをりもまた、ある秘密を抱えていた。かをり役を広瀬、公生役を山崎が演じ、公生の幼なじみの椿に石井杏奈、かをりが恋する渡に中川大志が扮した。監督は「僕の初恋をキミに捧ぐ」「潔く柔く　きよくやわく」の新城毅彦。<br /><br />
2016年製作／122分／G／日本配給：東宝　劇場公開日：2016年9月10日<br /><br /><br/>
<strong style="font-size: 1.5em;">出演者・キャスト一覧：</strong><br /><br />
広瀬すず:宮園かをり役/
山崎賢人:
有馬公生役 <br />
石井杏奈:
澤部椿役/
中川大志:
渡亮太役<br />
甲本雅裕:
（出演）/
本田博太郎:
（出演）<br />
板谷由夏:
瀬戸紘子役/
檀れい:
有馬早希役<br />`
  },
  byosoku: {
    title: "秒速5センチメートル",
    image: "/images/5cm.jpg",
    description: `<strong style="font-size: 2em;">あらすじ：</strong><br /><br />小学生のタカキとアカリは、特別な想いを抱きあう中。しかし卒業と同時に、アカリの引越しにより離れ離れになってしまう。中学生になり文通を重ねる2人だが、今度はタカキも鹿児島への転校が決まる。引っ越す前にアカリに会おうと、大雪の中タカキはアカリの元へ向かうが…。時は過ぎ、種子島で高校３年生になったタカキは、同じクラスのカナエに好意を寄せられながらも、ずっと遠くを見つめていた。カナエにとってタカキは、一番身近で、遠い憧れだった。やがて東京で社会人になったタカキは、仕事に追われ日々輝きを失っていく街並みを前に、忘れかけたあの頃の記憶に想いを巡らせる。<br /><br /><br/>
    <strong style="font-size: 1.5em;">キャスト一覧：</strong><br/><br/>
    遠野貴樹：水橋研二<br/> 
    篠原明里（第一話『桜花抄』）：近藤好美<br/>
    篠原明里（第三話『秒速5センチメートル』）：尾上綾華<br/>
    澄田花苗：花村怜美<br/><br/>
    `
  },
  same: {
    title: "MANEATER",
    image: "/images/same.jpg",
    description: `<strong style="font-size: 2em;">あらすじ：</strong><br /><br />「アバター」（2009）のサム・ワーシントンと「アリス・イン・ワンダーランド」（10）のミア・ワシコウスカの共演で、06年に製作されたパニックアドベンチャー。大自然に囲まれたオーストラリアの世界遺産・カカドゥ国立公園で、観光客を乗せたリバークルーズ船が水中から現れた巨大な何かに攻撃され沈没。川に浮かぶ小島にたどり着いた乗客たちは対岸を目指して脱出を図るが、水中の巨大な影が再びうごめき……。ワーシントン、ワシコウスカのほか、巨大生物と対峙する旅行ジャーナリスト役でマイケル・バルタン、現地ガイド役でラダ・ミッチェルらが共演。<br/><br/>

2006年製作／92分／G／アメリカ・オーストラリア合作<br/>
原題または英題：Rogue
配給：フェイス・トゥ・フェイス、ポニーキャニオン<br/>
劇場公開日：2012年4月14日<br/><br/>
<strong style="font-size: 1.5em;">キャスト一覧：</strong><br/><br/>
ケイト・ライアン（ツアーガイド）/ラダ・ミッチェル<br/>
ピート（アメリカ人旅行ライター）/マイケル・ヴァルタン<br/>
ニール（ケイトの知り合い）/サム・ワーシントン<br/>
コリン（ケイトの知り合い）/	ダミアン・リチャードソン<br/>	
マーヴ/バリー・オットー<br/>
メアリー（観光客）/	キャロライン・ブレイジャー	<br/>
エヴェレット（メアリーの夫）/	ロバート・テイラー	<br/>
エリザベス（観光客）/	ヘザー・ミッチェル	<br/>
アレン（エリザベスの夫）/	ジェフ・モレル	<br/>
シェリー（エリザベスの娘）/	ミア・ワシコウスカ	<br/>
サイモン（観光客）	/スティーヴン・カリー	<br/>
ラッセル（観光客）	/ジョン・ジャラット	<br/>
グウェン（観光客）	/セリア・アイルランド	<br/>

`
  },
  summer: {
    title: "サマーウォーズ",
    image: "/images/summer.jpg",
    description: "家族の絆を描いたアニメ"
  },
  bee: {
    title: "BEETLEJUICE",
    image: "/images/bee.jpg",
    description: "コメディホラー"
  },
  konan: {
    title: "名探偵コナン",
    image: "/images/konan.jpg",
    description: "推理アニメ"
  },
  interstellar: {
    title: "インターステラー",
    image: "/images/interstellar.jpg",
    description: "SF映画の傑作"
  },
  konan2: {
    title: "名探偵コナン",
    image: "/images/konan2.jpg",
    description: "人気推理アニメ続編"
  },
};

export default function MovieDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const movie = moviesData[id];

  if (!movie) {
    return <div>映画が見つかりません</div>;
  }

return (
  <div className={styles.container}>
    <h1 className={styles.h1}>{movie.title}</h1>
    <img src={movie.image} alt={movie.title} className={styles.img} />
    <p 
      className={styles.p} 
      dangerouslySetInnerHTML={{ __html: movie.description }} 
    />
    <button 
      onClick={() => router.push('/movies')} 
      className={styles.backButton}
    >
      &lt; 戻る
    </button>
  </div>
);
}