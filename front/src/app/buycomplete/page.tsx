'use client'
import React from 'react'
import "./buycomplete.css"

const App = () => {
  return (
    <div className="container">
      <main className="main">
        <h1 className="title">購入完了</h1>
        <p className="subtitle">ご購入ありがとうございました</p>

        <div className="entry-section">
          <div className="entry-box">
            <h2>QRコードで入場</h2>
            <button className="qr-button">チケットQRを表示</button>
            <p className="note">上記ボタンからチケットQRを表示してください</p>
          </div>

          <div className="entry-box">
            <h2>チケットを発券して入場</h2>
            <div className="ticket-number">xxxxxx</div>
            <p className="note">
              劇場設置の発券機に、<span className="highlight">上記番号</span>を入力してチケットを発券してください。
            </p>
          </div>
        </div>

        <div className="table-section">
          <table>
            <thead>
              <tr>
                <th>劇場</th>
                <th>作品名</th>
                <th>日時</th>
                <th>金額</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>HALシネマ</td>
                <td>四月は君の噓</td>
                <td>6月14日</td>
                <td>￥xxxx</td>
              </tr>
              <tr>
                <td>HALシネマ</td>
                <td>xxxxxx</td>
                <td>6月15日</td>
                <td>￥xxxx</td>
              </tr>
              <tr>
                <td>HALシネマ</td>
                <td>xxxxxx</td>
                <td>6月16日</td>
                <td>￥xxxx</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default App;
