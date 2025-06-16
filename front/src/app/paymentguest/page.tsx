'use client'
import React from 'react';
import './PaymentForm.css';

const PaymentForm = () => {
  return (
    <div className="container">
      <h2 className="section-title">支払入力</h2>
      <div className="form-box">
        {/* 購入者情報入力 */}
        <div className="section">
          <h3>購入者情報入力</h3>
          <input type="text" placeholder="氏名" />
          <input type="email" placeholder="メールアドレス" />
          <input type="tel" placeholder="電話番号" />
        </div>

        {/* 決済情報入力 */}
        <div className="section">
          <h3>決済情報入力</h3>
          <p className="price">¥xxxx</p>
          <select>
            <option>クレジットカード</option>
          </select>
          <input type="text" placeholder="カード番号" />
          <div className="card-logos">
            <img
              src="/images/pay.png"/>
          </div>
          <input type="text" placeholder="カード有効期限（MM/YY）" />
          <input type="text" placeholder="セキュリティコード" />
          <input type="text" placeholder="カード名義人" />
        </div>

        {/* ボタン */}
        <button className="submit-button">決済</button>
      </div>
    </div>
  );
};

export default PaymentForm;
