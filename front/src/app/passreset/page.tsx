'use client'
import React, { useState } from 'react';
import './passReset.css';
import Link from 'next/link'

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('メールアドレスを入力してください。');
      setMessageType('error'); //エラータイプをセット
      return;
    }

    setMessage('パスワードリセット用のリンクを送信しました。しばらくしてもメールが届かない場合は、スパムフォルダをご確認してください。');
    setMessageType('success');
    setEmail('');
  };

  return (
    <div className="reset-container">
      <h1 className='reset-title'>パスワード再設定メールを送る</h1>
      <form onSubmit={handleSubmit} className="reset-form">
        <input
          type="email"
          placeholder="メールアドレスを入力"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="reset-input"
        />
        <h2>ここにreCAPCHAが入ります？</h2>
        <button type="submit" className="reset-button">送信</button>
      </form>
      {message && <p className={`reset-message ${messageType}`}>{message}</p>}
      <Link href="/">
  <button className="submit-btn">トップページに戻る</button>
</Link>
    </div>
  );
};

export default PasswordReset;
