import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-darker py-8 mt-12">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-italiana mb-4">HALCINEMA</h3>
                        <p className="text-gray-400 text-sm font-jp">最高の映画体験をお届けする高級映画館</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-playfair mb-4">リンク</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-accent transition-colors font-jp">
                                    トップ
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies" className="text-gray-400 hover:text-accent transition-colors font-jp">
                                    作品案内
                                </Link>
                            </li>
                            <li>
                                <Link href="/news" className="text-gray-400 hover:text-accent transition-colors font-jp">
                                    インフォメーション
                                </Link>
                            </li>
                            {/*<li>*/}
                            {/*    <Link href="/tickets" className="text-gray-400 hover:text-accent transition-colors font-jp">*/}
                            {/*        チケット案内*/}
                            {/*    </Link>*/}
                            {/*</li>*/}
                            {/*<li>*/}
                            {/*    <Link href="/services" className="text-gray-400 hover:text-accent transition-colors font-jp">*/}
                            {/*        サービス案内*/}
                            {/*    </Link>*/}
                            {/*</li>*/}
                            <li>
                                <Link href="/access" className="text-gray-400 hover:text-accent transition-colors font-jp">
                                    アクセス
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-400 hover:text-accent transition-colors font-jp">
                                    よくある質問
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-playfair mb-4">お問い合わせ</h3>
                        <address className="text-gray-400 text-sm not-italic font-jp">
                            <p>〒450-0002</p>
                            <p>愛知県名古屋市中村区名駅4丁目27-1</p>
                            <p>総合校舎スパイラルタワーズ</p>
                            <p className="mt-2">TEL: 052-123-4567</p>
                        </address>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                    <p className="font-jp">&copy; {new Date().getFullYear()} HALCINEMA All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}
