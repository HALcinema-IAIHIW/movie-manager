import React from "react";
import styles from "./faq.module.css"; // CSSファイルをインポート

const faqData = [
  {
    question: "Q. チケットの購入方法は？",
    answer: "A. オンラインまたは劇場窓口で購入可能です。オンラインではクレジットカードが使用できます。",
  },
  {
    question: "Q. 上映時間はどこで確認できますか？",
    answer: "A. 映画館のトップページ、または各映画の詳細ページで確認できます。",
  },
  {
    question: "Q. 座席の指定はできますか？",
    answer: "A. はい、オンライン予約の際に座席を選択できます。",
  },
  {
    question: "Q. 飲食物の持ち込みは可能ですか？",
    answer: "A. 基本的に外部からの飲食物の持ち込みは禁止されています。劇場売店をご利用ください。",
  },
  {
    question: "Q. 車椅子で利用はできますか？",
    answer: "A. 当劇場では各シアターに車椅子スペースをご用意しています。車椅子スペースは数に限りがございますので、詳しくは劇場までお問合せください。"
  },
  {
    question: "Q. チャイルドシートはありますか？",
    answer: "A. ご用意しております。ご不明な点は各劇場スタッフまでお問い合わせください。"
  },
];

export default function faq() {
  return (
    <div className={styles["faq-container"]}>
  <h2 className={styles["faq-title"]}>よくある質問</h2>
  <div className={styles["faq-list"]}>
    {faqData.map((faq, index) => (
      <details key={index} className={styles["faq-item"]}>
        <summary className={styles["faq-question"]}>{faq.question}</summary>
        <p className={styles["faq-answer"]}>{faq.answer}</p>
      </details>
    ))}
  </div>

  <h2 className={styles["title"]}>お問い合わせ</h2>
  <form className={styles["contact-form"]}>
    <div className={styles["form-group"]}>
    <label htmlFor="name">お名前</label>
    <input type="text" id="name" name="name" />
  </div>

    <div className={styles["form-group"]}>
      <label htmlFor="email">メールアドレス</label>
      <input type="email" id="email" name="email" />
    </div>

    <div className={styles["form-group"]}>
      <label htmlFor="subject">件名</label>
      <input type="text" id="subject" name="subject" />
    </div>

    <div className={styles["form-group"]}>
      <label htmlFor="message">内容</label>
      <textarea id="message" name="message" rows="5"></textarea>
    </div>

    <button className={styles["submit-button"]}>
      送信
    </button>
  </form>
</div>

  );
}