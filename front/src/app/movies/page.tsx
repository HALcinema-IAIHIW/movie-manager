"use client"

import Image from "next/image"
import AllMovies from "@/app/components/AllMovies"

const Movies = () => {
    return (
        <div className="min-h-screen pt-24">
            {/* ヒーローセクション */}
            <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                {/* 背景画像 */}
                <div className="absolute inset-0">
                    <Image src="/images/theater-interior.jpg" alt="映画館内観" fill className="object-cover" priority />
                    {/* グラデーションオーバーレイ */}
                    <div className="absolute inset-0 bg-gradient-to-r from-darkest/90 via-darkest/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-darkest/80 via-transparent to-darkest/40" />
                </div>

                {/* コンテンツ */}
                <div className="relative h-full flex items-center">
                    <div className="container-luxury">
                        <div className="max-w-2xl animate-fade-in">
                            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-4 font-en">MOVIES</h1>
                            <p className="text-xl md:text-2xl text-gold mb-6 font-jp">上映作品一覧</p>
                            <p className="text-lg text-text-secondary leading-relaxed max-w-xl font-jp">
                                厳選された最高品質の映画作品をお楽しみください。
                                <br />
                                感動と興奮に満ちた特別な映画体験をお届けします。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 映画一覧セクション */}
            <section className="py-16 bg-darker">
                <div className="container-luxury">
                    {/* セクションタイトル */}
                    <div className="text-center mb-16">
                        <h2 className="section-title mb-4 font-en">NOW SHOWING</h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto font-jp">現在上映中の作品をご覧ください</p>
                    </div>

                    {/* 映画一覧コンポーネント */}
                    <AllMovies />
                </div>
            </section>
        </div>
    )
}

export default Movies
