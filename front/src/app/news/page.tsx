"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"

// ニュースデータ
const newsData = [
    {
        id: 1,
        title: "新プレミアムシート導入のお知らせ",
        excerpt:
            "より快適な映画鑑賞体験のため、最新のプレミアムシートを導入いたします。リクライニング機能とドリンクホルダーを完備。",
        date: "2024.02.15",
        image: "/images/premium-seat.jpg",
        featured: true,
    },
    {
        id: 2,
        title: "春の特別上映会開催決定",
        excerpt: "名作映画の特別上映会を開催。限定グッズの販売も予定しております。詳細は後日発表いたします。",
        date: "2024.02.10",
        image: "/images/special-screening.jpg",
        featured: true,
    },
    {
        id: 3,
        title: "メンバーシップ制度リニューアル",
        excerpt: "より充実した特典をご用意した新しいメンバーシップ制度がスタートします。ポイント還元率もアップ。",
        date: "2024.02.05",
        image: "/images/membership.jpg",
        featured: false,
    },
    {
        id: 4,
        title: "バレンタインデー特別企画",
        excerpt: "恋人同士でお楽しみいただける特別な映画上映とカップルシートをご用意いたします。",
        date: "2024.01.30",
        image: "/images/valentine.jpg",
        featured: false,
    },
    {
        id: 5,
        title: "新作映画先行上映会のご案内",
        excerpt: "話題の新作映画を一般公開前に特別上映いたします。限定50名様のプレミアムイベントです。",
        date: "2024.01.25",
        image: "/images/preview-screening.jpg",
        featured: false,
    },
    {
        id: 6,
        title: "年末年始営業時間のお知らせ",
        excerpt: "年末年始の営業時間変更についてお知らせいたします。ご来場の際はご確認ください。",
        date: "2024.01.20",
        image: "/images/holiday-hours.jpg",
        featured: false,
    },
    {
        id: 7,
        title: "音響システムアップグレード完了",
        excerpt:
            "全スクリーンの音響システムを最新のDolby Atmosに対応いたしました。より臨場感あふれる音響体験をお楽しみください。",
        date: "2024.01.15",
        image: "/images/sound-system.jpg",
        featured: false,
    },
    {
        id: 8,
        title: "学生割引キャンペーン開始",
        excerpt: "学生の皆様を対象とした特別割引キャンペーンを開始いたします。学生証の提示で通常料金から300円割引。",
        date: "2024.01.10",
        image: "/images/student-discount.jpg",
        featured: false,
    },
]

export default function News() {
    // 注目ニュースとその他のニュース
    const featuredNews = newsData.filter((news) => news.featured)
    const regularNews = newsData.filter((news) => !news.featured)

    return (
        <div className="min-h-screen pt-24">
            {/* ヒーローセクション */}
            <section className="relative h-[30vh] md:h-[40vh] overflow-hidden">
                {/* 背景画像 */}
                <div className="absolute inset-0">
                    <Image src="/images/theater-interior-1.png" alt="劇場内観" fill className="object-cover" priority />
                    {/* グラデーションオーバーレイ */}
                    <div className="absolute inset-0 bg-gradient-to-r from-darkest/90 via-darkest/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-darkest/80 via-transparent to-darkest/40" />
                </div>

                {/* コンテンツ */}
                <div className="relative h-full flex items-center">
                    <div className="container-luxury">
                        <div className="max-w-2xl animate-fade-in">
                            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-4 font-en">NEWS</h1>
                            <p className="text-xl md:text-2xl text-gold mb-6 font-jp">ニュース・お知らせ</p>
                            <p className="text-lg text-text-secondary leading-relaxed max-w-xl font-jp">
                                HALCINEMAの最新情報やイベント、
                                <br />
                                施設に関するお知らせをお届けします。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 注目ニュースセクション */}
            {featuredNews.length > 0 && (
                <section className="py-16">
                    <div className="container-luxury">
                        <h2 className="text-3xl font-bold text-gold mb-8 font-jp">注目のニュース</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {featuredNews.map((news) => (
                                <Link key={news.id} href={`/news/${news.id}`} className="group">
                                    <article className="card-luxury p-0 overflow-hidden">
                                        <div className="relative aspect-video">
                                            <Image src={news.image || "/placeholder.svg"} alt={news.title} fill className="object-cover" />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-text-muted text-sm mb-3">
                                                <Calendar size={16} />
                                                <time className="font-playfair">{news.date}</time>
                                            </div>
                                            <h3 className="text-xl font-medium text-text-primary mb-3 group-hover:text-gold transition-colors font-jp">
                                                {news.title}
                                            </h3>
                                            <p className="text-text-secondary mb-4 font-jp">{news.excerpt}</p>
                                            <div className="flex items-center text-gold text-sm font-medium font-jp">
                                                詳細を見る
                                                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 全ニュースセクション */}
            <section className="py-16 bg-darker">
                <div className="container-luxury">
                    <h2 className="text-3xl font-bold text-text-primary mb-8 font-jp">すべてのニュース</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularNews.map((news) => (
                            <Link key={news.id} href={`/news/${news.id}`} className="group">
                                <article className="card-luxury p-0 overflow-hidden">
                                    <div className="relative aspect-video">
                                        <Image src={news.image || "/placeholder.svg"} alt={news.title} fill className="object-cover" />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-text-muted text-sm mb-3">
                                            <Calendar size={14} />
                                            <time className="font-playfair">{news.date}</time>
                                        </div>
                                        <h3 className="text-lg font-medium text-text-primary mb-3 group-hover:text-gold transition-colors font-jp">
                                            {news.title}
                                        </h3>
                                        <p className="text-text-secondary text-sm mb-4 line-clamp-3 font-jp">{news.excerpt}</p>
                                        <div className="flex items-center text-gold text-sm font-medium font-jp">
                                            詳細を見る
                                            <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
