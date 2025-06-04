import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-darkest border-t border-accent/20 mt-16">
            <div className="container-luxury py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* ブランド情報 */}
                    <div className="lg:col-span-1">
                        <h3 className="text-3xl text-gold mb-4 font-en">HAL cinema</h3>
                        <p className="text-text-muted leading-relaxed mb-6 font-jp">
                            最高級の設備と洗練された空間で、
                            <br />
                            特別な映画体験をお届けいたします。
                        </p>
                        <div className="flex space-x-4">
                            {/* ソーシャルメディアリンク（将来的に追加可能） */}
                            <div
                                className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center
                hover:bg-gold/20 hover:text-gold transition-colors cursor-pointer"
                            >
                                <span className="text-sm font-playfair">f</span>
                            </div>
                            <div
                                className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center
                hover:bg-gold/20 hover:text-gold transition-colors cursor-pointer"
                            >
                                <span className="text-sm font-playfair">t</span>
                            </div>
                            <div
                                className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center
                hover:bg-gold/20 hover:text-gold transition-colors cursor-pointer"
                            >
                                <span className="text-sm font-playfair">i</span>
                            </div>
                        </div>
                    </div>

                    {/* ナビゲーションリンク */}
                    <div>
                        <h4 className="text-xl text-text-primary mb-6 font-jp">サイトマップ</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/"
                                    className="text-text-muted hover:text-gold transition-colors duration-300
                    flex items-center group font-shippori font-jp"
                                >
                  <span
                      className="w-2 h-2 bg-gold rounded-full mr-3 opacity-0
                    group-hover:opacity-100 transition-opacity"
                  />
                                    トップページ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/movies"
                                    className="text-text-muted hover:text-gold transition-colors duration-300
                    flex items-center group font-shippori font-jp"
                                >
                  <span
                      className="w-2 h-2 bg-gold rounded-full mr-3 opacity-0
                    group-hover:opacity-100 transition-opacity"
                  />
                                    作品案内
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/news"
                                    className="text-text-muted hover:text-gold transition-colors duration-300
                    flex items-center group font-shippori font-jp"
                                >
                  <span
                      className="w-2 h-2 bg-gold rounded-full mr-3 opacity-0
                    group-hover:opacity-100 transition-opacity"
                  />
                                    インフォメーション
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/access"
                                    className="text-text-muted hover:text-gold transition-colors duration-300
                    flex items-center group font-shippori font-jp"
                                >
                  <span
                      className="w-2 h-2 bg-gold rounded-full mr-3 opacity-0
                    group-hover:opacity-100 transition-opacity"
                  />
                                    アクセス
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-text-muted hover:text-gold transition-colors duration-300
                    flex items-center group font-shippori font-jp"
                                >
                  <span
                      className="w-2 h-2 bg-gold rounded-full mr-3 opacity-0
                    group-hover:opacity-100 transition-opacity"
                  />
                                    よくある質問
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 営業時間・サービス情報 */}
                    <div>
                        <h4 className="text-xl text-text-primary mb-6 font-jp">営業案内</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Clock size={18} className="text-gold mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-text-secondary font-medium font-shippori font-jp">営業時間</p>
                                    <p className="text-text-muted text-sm font-shippori font-jp">
                                        平日: 10:00 - 23:00
                                        <br />
                                        土日祝: 9:00 - 24:00
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail size={18} className="text-gold mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-text-secondary font-medium font-shippori font-jp">サービス</p>
                                    <p className="text-text-muted text-sm font-shippori font-jp">
                                        プレミアムシート
                                        <br />
                                        コンシェルジュサービス
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 連絡先情報 */}
                    <div>
                        <h4 className="text-xl text-text-primary mb-6 font-jp">お問い合わせ</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gold mt-1 flex-shrink-0" />
                                <address className="text-text-muted text-sm not-italic font-shippori font-jp">
                                    〒450-0002
                                    <br />
                                    愛知県名古屋市中村区名駅4丁目27-1
                                    <br />
                                    総合校舎スパイラルタワーズ
                                </address>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-gold flex-shrink-0" />
                                <a
                                    href="tel:052-123-4567"
                                    className="text-text-muted hover:text-gold transition-colors font-shippori font-jp"
                                >
                                    052-123-4567
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-gold flex-shrink-0" />
                                <a
                                    href="mailto:info@halcinema.com"
                                    className="text-text-muted hover:text-gold transition-colors font-shippori font-jp"
                                >
                                    info@halcinema.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 区切り線 */}
                <div className="border-t border-accent/20 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-text-muted text-sm font-jp">
                            &copy; {new Date().getFullYear()} HAL cinema. All Rights Reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/privacy" className="text-text-muted hover:text-gold transition-colors font-shippori font-jp">
                                プライバシーポリシー
                            </Link>
                            <Link href="/terms" className="text-text-muted hover:text-gold transition-colors font-shippori font-jp">
                                利用規約
                            </Link>
                            <Link href="/sitemap" className="text-text-muted hover:text-gold transition-colors font-shippori font-jp">
                                サイトマップ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
