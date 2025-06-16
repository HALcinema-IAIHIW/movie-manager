'use client'
import React, { useState } from 'react';
import './paymentForm.css'; // 外部CSSファイルを読み込み

const CreditCardForm = () => {
  const [useSavedCard, setUseSavedCard] = useState(true);
  const [saveCard, setSaveCard] = useState(false);

  return (
    <div className="container">
      <div className="header">
        決済金額 <span className="amount">￥xxxx</span>
      </div>

      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="pay_option"
            checked={useSavedCard}
            onChange={() => setUseSavedCard(true)}
          />
          登録されたクレジットで支払う
        </label>
        <label>
          <input
            type="radio"
            name="pay_option"
            checked={!useSavedCard}
            onChange={() => setUseSavedCard(false)}
          />
          クレジットを追加して支払う
        </label>
      </div>

      {!useSavedCard && (
        <>
          <hr />

          <div className="form-group">
            <label>カード番号</label>
            <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" />
          </div>

          <div className="card-logos">
            <img
              src="/images/pay.png"/>
          </div>

          <div className="form-group">
            <label>カード有効期限</label>
            <input type="text" placeholder="MM/YY" />
          </div>

          <div className="form-group">
            <label>セキュリティコード</label>
            <input type="text" placeholder="XXX" />
          </div>

          <div className="form-group">
            <label>カード名義人</label>
            <input type="text" placeholder="TARO YAMADA" />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="save_card"
              checked={saveCard}
              onChange={() => setSaveCard(!saveCard)}
            />
            <label htmlFor="save_card">このクレジットカードを保存する</label>
          </div>
        </>
      )}

      <button className="submit-btn">決済</button>
    </div>
  );
};

export default CreditCardForm;
