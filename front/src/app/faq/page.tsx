"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp, Send, AlertCircle } from "lucide-react"
import Image from "next/image"

// FAQデータ
const faqData = [
    {
        question: "チケットの購入方法は？",
        answer:
            "オンラインまたは劇場窓口で購入可能です。オンラインではクレジットカードが使用できます。会員登録をしていただくと、より便利にチケットをご購入いただけます。",
    },
    {
        question: "上映時間はどこで確認できますか？",
        answer:
            "映画館のトップページ、または各映画の詳細ページで確認できます。また、公式SNSでも最新の上映スケジュールをお知らせしています。",
    },
    {
        question: "座席の指定はできますか？",
        answer: "はい、オンライン予約の際に座席を選択できます。特に人気作品は早めのご予約をおすすめします。",
    },
    {
        question: "飲食物の持ち込みは可能ですか？",
        answer:
            "基本的に外部からの飲食物の持ち込みは禁止されています。劇場売店をご利用ください。アレルギーなどの特別な事情がある場合は、スタッフにご相談ください。",
    },
    {
        question: "車椅子で利用はできますか？",
        answer:
            "当劇場では各シアターに車椅子スペースをご用意しています。車椅子スペースは数に限りがございますので、詳しくは劇場までお問合せください。バリアフリー対応も行っております。",
    },
    {
        question: "チャイルドシートはありますか？",
        answer:
            "ご用意しております。ご不明な点は各劇場スタッフまでお問い合わせください。数に限りがありますので、事前のご予約をおすすめします。",
    },
]

export default function FAQ() {
    // アコーディオンの開閉状態を管理
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    // フォームの状態管理
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    // フォーム入力の変更を処理
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // フォームが有効かどうかをチェック
    const isFormValid = formData.name && formData.email && formData.subject && formData.message

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
                            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-4 font-en">FAQ</h1>
                            <p className="text-xl md:text-2xl text-gold mb-6 font-jp">よくあるご質問</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQセクション */}
            <section className="py-16 bg-darker">
                <div className="container-luxury">
                    {/* セクションタイトル */}
                    <div className="text-center mb-16">
                        <h2 className="section-title mb-4 font-en">FREQUENTLY ASKED QUESTIONS</h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto font-jp">
                            お客様からよくいただくご質問をまとめました
                        </p>
                    </div>

                    {/* FAQリスト */}
                    <div className="max-w-3xl mx-auto space-y-6">
                        {faqData.map((faq, index) => (
                            <div key={index} className="card-luxury overflow-hidden transition-all duration-300">
                                <button
                                    className="w-full p-6 flex justify-between items-center text-left"
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    aria-expanded={openIndex === index}
                                >
                                    <h3 className="text-lg md:text-xl font-medium text-gold font-jp">{faq.question}</h3>
                                    {openIndex === index ? (
                                        <ChevronUp className="text-gold flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="text-gold flex-shrink-0" />
                                    )}
                                </button>
                                <div
                                    className={`px-6 overflow-hidden transition-all duration-300 ${
                                        openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                                    }`}
                                >
                                    <p className="text-text-secondary font-jp">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* お問い合わせフォームセクション */}
            <section className="py-16">
                <div className="container-luxury">
                    {/* セクションタイトル */}
                    <div className="text-center mb-16">
                        <h2 className="section-title mb-4 font-en">CONTACT US</h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto font-jp">
                            ご不明な点やご要望がございましたら、お気軽にお問い合わせください
                        </p>
                    </div>

                    {/* フォーム */}
                    <div className="max-w-2xl mx-auto">
                        <div className="card-luxury p-8">
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-text-primary mb-2 font-jp">
                                        お名前
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-darker border border-accent/30
                      rounded-lg text-text-primary placeholder-text-muted
                      focus:border-gold focus:outline-none transition-colors font-jp"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-text-primary mb-2 font-jp">
                                        メールアドレス
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-darker border border-accent/30
                      rounded-lg text-text-primary placeholder-text-muted
                      focus:border-gold focus:outline-none transition-colors font-jp"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-text-primary mb-2 font-jp">
                                        件名
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-darker border border-accent/30
                      rounded-lg text-text-primary placeholder-text-muted
                      focus:border-gold focus:outline-none transition-colors font-jp"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-text-primary mb-2 font-jp">
                                        内容
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-darker border border-accent/30
                      rounded-lg text-text-primary placeholder-text-muted
                      focus:border-gold focus:outline-none transition-colors font-jp"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-text-muted text-sm font-jp">
                                        <AlertCircle size={16} className="mr-2" />
                                        <span>すべての項目にご入力ください</span>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={!isFormValid}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-none transition-all duration-300 font-jp ${
                                            isFormValid
                                                ? "bg-gradient-to-r from-gold to-gold-light text-darkest hover:shadow-gold-glow hover:scale-105"
                                                : "bg-accent/20 text-text-muted cursor-not-allowed"
                                        }`}
                                    >
                                        <Send size={18} />
                                        送信
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
