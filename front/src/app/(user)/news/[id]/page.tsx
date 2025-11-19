"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowLeft } from "lucide-react"

// ニュース詳細データ（実際のアプリケーションではAPIから取得）
const newsDetailData: { [key: string]: any } = {
    "1": {
        id: 1,
        title: "新プレミアムシート導入のお知らせ",
        content: `
      <p>この度、HALCINEMAでは、お客様により快適な映画鑑賞体験をお楽しみいただくため、最新のプレミアムシートを全スクリーンに導入いたします。</p>
      
      <h3>新プレミアムシートの特徴</h3>
      <ul>
        <li>電動リクライニング機能（最大160度まで調整可能）</li>
        <li>USB充電ポート完備</li>
        <li>専用ドリンクホルダー・サイドテーブル</li>
        <li>高級レザー仕様</li>
        <li>足元スペース30%拡大</li>
      </ul>
      
      <h3>導入スケジュール</h3>
      <p>2024年3月1日より、スクリーン1〜3にて先行導入を開始いたします。その後、4月末までに全8スクリーンへの導入を完了予定です。</p>
      
      <h3>料金について</h3>
      <p>プレミアムシートは追加料金500円でご利用いただけます。メンバーシップ会員の方は追加料金300円の特別価格でご提供いたします。</p>
      
      <p>皆様のご来場を心よりお待ちしております。</p>
    `,
        date: "2024.02.15",
        image: "/images/premium-seat.jpg",
    },
    "2": {
        id: 2,
        title: "春の特別上映会開催決定",
        content: `
      <p>HALCINEMAでは、春の訪れを記念して特別上映会を開催いたします。名作映画を大スクリーンでお楽しみいただける貴重な機会です。</p>
      
      <h3>上映作品</h3>
      <ul>
        <li>「七人の侍」（黒澤明監督）</li>
        <li>「東京物語」（小津安二郎監督）</li>
        <li>「雨に唄えば」（ジーン・ケリー主演）</li>
        <li>「カサブランカ」（ハンフリー・ボガート主演）</li>
      </ul>
      
      <h3>開催期間</h3>
      <p>2024年3月20日（水・祝）〜 3月31日（日）</p>
      
      <h3>特典</h3>
      <p>期間中にご来場いただいたお客様には、オリジナルポストカードセットをプレゼントいたします。また、4作品すべてをご鑑賞いただいた方には、特製トートバッグを差し上げます。</p>
      
      <p>チケットは2月20日より販売開始予定です。詳細は後日発表いたします。</p>
    `,
        date: "2024.02.10",
        image: "/images/special-screening.jpg",
    },
}

interface NewsDetailProps {
    params: {
        id: string
    }
}

export default function NewsDetail({ params }: NewsDetailProps) {
    const news = newsDetailData[params.id]

    if (!news) {
        notFound()
    }

    return (
        <div className="min-h-screen pt-24">
            {/* 記事ヘッダー */}
            <section className="py-12 pb-16">
                <div className="container-luxury">
                    <div className="max-w-4xl mx-auto">
                        {/* 戻るボタン */}
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 text-gold hover:text-gold-light
                transition-colors mb-8 font-jp"
                        >
                            <ArrowLeft size={20} />
                            ニュース一覧に戻る
                        </Link>

                        {/* 日付 */}
                        <div className="flex items-center gap-1 text-text-muted text-sm mb-6">
                            <Calendar size={16} />
                            <time className="font-playfair">{news.date}</time>
                        </div>

                        {/* タイトル */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-8 font-jp">{news.title}</h1>

                        {/* メイン画像 */}
                        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden shadow-luxury">
                            <Image src={news.image || "/placeholder.svg"} alt={news.title} fill className="object-cover" priority />
                        </div>

                        {/* 記事コンテンツ */}
                        <article className="prose prose-invert prose-lg max-w-none">
                            <div
                                className="text-text-secondary leading-relaxed font-jp"
                                dangerouslySetInnerHTML={{ __html: news.content }}
                                style={{
                                    fontFamily: "var(--font-shippori), serif",
                                }}
                            />
                        </article>
                    </div>
                </div>
            </section>
        </div>
    )
}
