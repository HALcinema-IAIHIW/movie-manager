"use client"
import Image from "next/image"
import { MapPin, Clock, Phone, Info } from "lucide-react"
import Link from "next/link"

const Access = () => {
    return (
        <div className="min-h-screen pt-24">
            {/* ヒーローセクション */}
            <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
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
                            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-4 font-en">ACCESS</h1>
                            <p className="text-xl md:text-2xl text-gold mb-6 font-jp">施設案内・アクセス</p>
                            <p className="text-lg text-text-secondary leading-relaxed max-w-xl font-jp">
                                最高級の設備と洗練された空間で、特別な映画体験をお届けします。
                                <br />
                                アクセス方法や施設情報をご案内いたします。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* アクセス情報セクション */}
            <section className="py-16 bg-darker">
                <div className="container-luxury">
                    {/* セクションタイトル */}
                    <div className="text-center mb-16">
                        <h2 className="section-title mb-4 font-en">LOCATION</h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto font-jp">
                            便利なロケーションで、映画の感動をお届けします
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* 地図 */}
                        <div className="card-luxury p-0 overflow-hidden rounded-lg shadow-luxury">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1625.4570230765555!2d136.88595501725968!3d35.16793213217278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600376de6175c84f%3A0x8705b08abf7309d6!2z44CSNDUwLTAwMDIg5oSb55-l55yM5ZCN5Y-k5bGL5biC5Lit5p2R5Yy65ZCN6aeF77yU5LiB55uu77yS77yX4oiS77yRIOODouODvOODieWtpuWckuOCueODkeOCpOODqeODq-OCv-ODr-ODvOOCuiBCMUY!5e0!3m2!1sja!2sjp!4v1747624112284!5m2!1sja!2sjp"
                                width="100%"
                                height="450"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full border-0"
                                title="HALCINEMAの地図"
                            ></iframe>
                        </div>

                        {/* アクセス情報 */}
                        <div className="space-y-8">
                            <div className="card-luxury p-8">
                                <h3 className="text-2xl font-jp text-gold mb-6">アクセス情報</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <MapPin size={24} className="text-gold flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="text-lg font-medium text-text-primary mb-2 font-jp">所在地</h4>
                                            <address className="text-text-secondary not-italic font-jp">
                                                〒450-0002
                                                <br />
                                                愛知県名古屋市中村区名駅4丁目27-1
                                                <br />
                                                総合校舎スパイラルタワーズ
                                            </address>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Info size={24} className="text-gold flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="text-lg font-medium text-text-primary mb-2 font-jp">交通アクセス</h4>
                                            <ul className="text-text-secondary space-y-2 font-jp">
                                                <li>• JR名古屋駅から徒歩5分</li>
                                                <li>• 地下鉄名城線「名古屋」駅から徒歩7分</li>
                                                <li>• 名鉄「名古屋」駅から徒歩6分</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Clock size={24} className="text-gold flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="text-lg font-medium text-text-primary mb-2 font-jp">営業時間</h4>
                                            <p className="text-text-secondary font-jp">
                                                平日: 10:00 - 23:00
                                                <br />
                                                土日祝: 9:00 - 24:00
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Phone size={24} className="text-gold flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="text-lg font-medium text-text-primary mb-2 font-jp">お問い合わせ</h4>
                                            <p className="text-text-secondary font-jp">
                                                TEL:{" "}
                                                <a href="tel:052-123-4567" className="text-gold hover:text-gold-light">
                                                    052-123-4567
                                                </a>
                                                <br />
                                                MAIL:{" "}
                                                <a href="mailto:info@halcinema.com" className="text-gold hover:text-gold-light">
                                                    info@halcinema.com
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 劇場設備セクション */}
            <section className="py-16">
                <div className="container-luxury">
                    {/* セクションタイトル */}
                    <div className="text-center mb-16">
                        <h2 className="section-title mb-4 font-en">THEATER FACILITIES</h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto font-jp">最高の映画体験のための充実した設備</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* 大スクリーン */}
                        <div className="card-luxury p-0 overflow-hidden hover-lift">
                            <div className="relative aspect-video">
                                <Image src="/images/theater-interior-1.png" alt="大スクリーン" fill className="object-cover" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-medium text-gold mb-2 font-jp">大スクリーン 200席</h3>
                                <ul className="text-text-secondary space-y-1 font-jp">
                                    <li>• スクリーン1</li>
                                    <li>• スクリーン2</li>
                                    <li>• スクリーン3</li>
                                </ul>
                                <p className="mt-4 text-sm text-text-muted font-jp">
                                    最新の音響システムと大型スクリーンで、迫力ある映像体験をお楽しみいただけます。
                                </p>
                            </div>
                        </div>

                        {/* 中スクリーン */}
                        <div className="card-luxury p-0 overflow-hidden hover-lift">
                            <div className="relative aspect-video">
                                <Image src="/images/theater-interior-1.png" alt="中スクリーン" fill className="object-cover" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-medium text-gold mb-2 font-jp">中スクリーン 120席</h3>
                                <ul className="text-text-secondary space-y-1 font-jp">
                                    <li>• スクリーン4</li>
                                    <li>• スクリーン5</li>
                                </ul>
                                <p className="mt-4 text-sm text-text-muted font-jp">
                                    快適な座席と適度な距離感で、没入感のある映画鑑賞をお楽しみいただけます。
                                </p>
                            </div>
                        </div>

                        {/* 小スクリーン */}
                        <div className="card-luxury p-0 overflow-hidden hover-lift">
                            <div className="relative aspect-video">
                                <Image src="/images/theater-interior-1.png" alt="小スクリーン" fill className="object-cover" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-medium text-gold mb-2 font-jp">小スクリーン 70席</h3>
                                <ul className="text-text-secondary space-y-1 font-jp">
                                    <li>• スクリーン6</li>
                                    <li>• スクリーン7</li>
                                    <li>• スクリーン8</li>
                                </ul>
                                <p className="mt-4 text-sm text-text-muted font-jp">
                                    アットホームな空間で、より親密な映画体験をお楽しみいただけます。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* チケット料金セクション */}
            <section className="py-16 bg-darker">
                <div className="container-luxury">
                    {/* セクションタイトル */}
                    <div className="text-center mb-16">
                        <h2 className="section-title mb-4 font-en">TICKET PRICES</h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto font-jp">リーズナブルな価格で最高の映画体験を</p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="card-luxury p-8">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-accent/30">
                                        <th className="py-4 px-6 text-left text-lg font-jp">区分</th>
                                        <th className="py-4 px-6 text-right text-lg font-jp">料金</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-accent/20">
                                    <tr className="hover:bg-accent/5 transition-colors">
                                        <td className="py-4 px-6 font-jp">一般</td>
                                        <td className="py-4 px-6 text-right font-en text-gold">¥1,800</td>
                                    </tr>
                                    <tr className="hover:bg-accent/5 transition-colors">
                                        <td className="py-4 px-6 font-jp">大学生等</td>
                                        <td className="py-4 px-6 text-right font-en text-gold">¥1,600</td>
                                    </tr>
                                    <tr className="hover:bg-accent/5 transition-colors">
                                        <td className="py-4 px-6 font-jp">中学・高校</td>
                                        <td className="py-4 px-6 text-right font-en text-gold">¥1,400</td>
                                    </tr>
                                    <tr className="hover:bg-accent/5 transition-colors">
                                        <td className="py-4 px-6 font-jp">小学生以下</td>
                                        <td className="py-4 px-6 text-right font-en text-gold">¥1,000</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 text-center">
                                <Link href="/tickets" className="btn-outline-luxury inline-block font-jp">
                                    チケット予約はこちら
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Access
