"use client"

import Link from "next/link"

const newsData = [
  {
    id: 1,
    title: "新プレミアムシート導入のお知らせ",
    date: "2024.02.15",
    excerpt: "より快適な映画鑑賞体験のため、最新のプレミアムシートを導入いたします。",
  },
  {
    id: 2,
    title: "春の特別上映会開催決定",
    date: "2024.02.10",
    excerpt: "名作映画の特別上映会を開催。限定グッズの販売も予定しております。",
  },
  {
    id: 3,
    title: "メンバーシップ制度リニューアル",
    date: "2024.02.05",
    excerpt: "より充実した特典をご用意した新しいメンバーシップ制度がスタートします。",
  },
]

export function NewsSection() {
  return (
    <div>
      <h3 className="text-2xl font-playfair text-text-primary mb-8 font-jp">最新ニュース</h3>
      <div className="space-y-6">
        {newsData.map((news) => (
          <Link key={news.id} href={`/news/${news.id}`} className="block card-luxury p-6 hover-glow">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-text-primary mb-2 group-hover:text-gold transition-colors font-shippori font-jp">
                  {news.title}
                </h4>
                <p className="text-text-muted text-sm mb-3 line-clamp-2 font-shippori font-jp">
                  {news.excerpt}
                </p>
                <time className="text-text-subtle text-xs font-playfair">{news.date}</time>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/news" className="btn-outline-luxury font-shippori font-jp">
          すべてのニュースを見る
        </Link>
      </div>
    </div>
  )
}
