"use client"

import {useState} from "react"
import Link from "next/link"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isMemberPanelOpen, setIsMemberPanelOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("login")

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const toggleMemberPanel = () => {
        setIsMemberPanelOpen(!isMemberPanelOpen)
    }

    const showTab = (tabName: string) => {
        setActiveTab(tabName)
    }

    return (
        <>
            <style jsx>{`
              .header {
                display: flex;
                align-items: center;
                background-color: black;
                color: white;
                height: 65px;
                position: relative;
              }

              .menu-container {
                height: 100%;
                width: 65px;
                background-color: grey;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
              }

              .menu-toggle {
                width: 30px;
                height: 24px;
                position: relative;
                cursor: pointer;
                transition: 0.3s ease;
              }

              .menu-toggle .bar {
                height: 3px;
                width: 100%;
                background-color: white;
                position: absolute;
                transition: 0.3s ease;
                border-radius: 2px;
              }

              .bar.top {
                top: 0;
              }

              .bar.middle {
                top: 7px;
              }

              .bar.bottom {
                top: 14px;
              }

              .menu-toggle.open .bar.top {
                transform: rotate(45deg);
                top: 10px;
              }

              .menu-toggle.open .bar.middle {
                opacity: 0;
              }

              .menu-toggle.open .bar.bottom {
                transform: rotate(-45deg);
                top: 10px;
              }

              .menu-header {
                font-size: 0.65rem;
                margin-top: 5px;
                text-align: center;
              }

              .logo {
                font-size: 40px;
                margin-left: 30px;
                font-family: "Italiana", sans-serif;
                font-weight: 400;
                font-style: normal;
                text-decoration: none;
                color: white;
                //letter-spacing: 1px;
              }

              .right-section {
                margin-left: auto;
                display: flex;
                align-items: center;
                gap: 20px;
                margin-right: 40px;
              }

              .search-bar {
                width: 400px;
                padding: 8px 13px; /* 高さを狭くしました */
                border-radius: 50px; /* 角丸を最大にしました */
                border: none;
                color: black;
                background-color: white;
              }

              .search-bar::placeholder {
                color: #999;
              }

              .side-menu {
                position: fixed;
                top: 65px;
                left: -350px;
                width: 250px;
                height: 100%;
                background-color: gray;
                color: white;
                padding: 20px;
                transition: 0.3s;
                z-index: 1000;
              }

              .side-menu.open {
                left: 0;
              }

              .side-menu ul {
                list-style: none;
                padding: 0;
              }

              .side-menu li {
                margin: 15px 0 15px 10px;
                cursor: pointer;
                font-family: "Italiana", sans-serif;
                font-size: 1.2rem;
                transition: opacity 0.3s ease;
              }

              .side-menu li:hover {
                opacity: 0.6;
              }

              .side-menu a {
                color: white;
                text-decoration: none;
              }

              .member-btn {
                font-family: "Italiana", sans-serif;
                font-weight: 400;
                font-size: 40px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
              }

              .member-panel {
                position: absolute;
                top: 65px;
                right: 40px;
                width: 300px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                padding: 20px;
                display: ${isMemberPanelOpen ? "block" : "none"};
                animation: slideDown 0.3s ease forwards;
                z-index: 1000;
              }

              .arrow-up {
                position: absolute;
                top: -10px;
                right: 20px;
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 10px solid white;
              }

              .tabs {
                display: flex;
                justify-content: space-around;
                font-size: 20px;
                font-family: "Italiana", sans-serif;
                margin-bottom: 10px;
                position: relative;
              }

              .tab {
                padding: 5px 10px;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.3s;
                color: black;
              }

              .tab.active {
                border-bottom: 2px solid orange;
              }

              .form-section {
                display: flex;
                flex-direction: column;
                gap: 10px;
              }

              .hidden {
                display: none;
              }

              #loginTab {
                margin-left: 10px;
              }

              #signupTab {
                margin-left: 60px;
              }

              .form-group {
                margin: 10px 0;
              }

              .form-group input {
                width: 90%;
                padding: 8px 15px;
                border: 1px solid black;
                border-radius: 20px;
                font-family: "Italiana", sans-serif;
                font-size: 14px;
                outline: none;
                color: black;
              }

              .signup-btn {
                background-color: #ffd966;
                font-family: "Italiana", sans-serif;
                border: 1px solid black;
                border-radius: 20px;
                width: 100%;
                padding: 10px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                color: black;
              }

              .forgot {
                font-family: "Italiana", sans-serif;
              }

              .forgot a {
                text-decoration: none;
                color: black;
              }

              .arrow-icon {
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid white;
                transition: transform 0.3s ease;
                transform: ${isMemberPanelOpen ? "rotate(180deg)" : "rotate(0deg)"};
              }

              .member-text {
                position: relative;
              }

              @keyframes slideDown {
                0% {
                  opacity: 0;
                  transform: translateY(-20px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @media (max-width: 768px) {
                .search-bar {
                  width: 200px;
                }

                .logo {
                  font-size: 36px;
                  margin-left: 15px;
                }

                .member-btn {
                  font-size: 28px;
                }

                .right-section {
                  margin-right: 20px;
                }

                .member-panel {
                  right: 20px;
                  width: 280px;
                }
              }
            `}</style>

            <header className="header">
                <div className="menu-container">
                    <div className={`menu-toggle ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}>
                        <span className="bar top"></span>
                        <span className="bar middle"></span>
                        <span className="bar bottom"></span>
                    </div>
                    <p className="menu-header">MENU</p>
                </div>

                <div className={"logo "}>
                    <Link href="/">
                        HALCINEMA
                    </Link>
                </div>


                <div className="right-section">
                    <input type="text" className="search-bar" placeholder=""/>
                    <div className="member-btn" onClick={toggleMemberPanel}>
                        <span className="member-text">MEMBER</span>
                        <div className="arrow-icon"></div>
                    </div>
                </div>
            </header>

            <nav className={`side-menu ${isMenuOpen ? "open" : ""}`}>
                <ul>
                    <li>
                        <Link href="/">Top Page</Link>
                    </li>
                    <li>
                        <Link href="/news">Information</Link>
                    </li>
                    <li>
                        <Link href="/movies">Movies</Link>
                    </li>
                    <li>
                        <Link href="/access">Access</Link>
                    </li>
                    <li>
                        <Link href="/mypage">My Page</Link>
                    </li>
                    <li>
                        <Link href="/faq">Q & A</Link>
                    </li>
                </ul>
            </nav>

            <div className="member-panel">
                <div className="arrow-up"></div>
                <div className="tabs">
          <span
              id="loginTab"
              className={`tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => showTab("login")}
          >
            Login
          </span>
                    <span
                        id="signupTab"
                        className={`tab ${activeTab === "signup" ? "active" : ""}`}
                        onClick={() => showTab("signup")}
                    >
            Sign-Up
          </span>
                </div>
                <div className={`form-section ${activeTab === "login" ? "" : "hidden"}`}>
                    <div className="form-group">
                        <input type="email" placeholder="Email"/>
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password"/>
                    </div>
                    <div className="form-group">
                        <button className="signup-btn">Login</button>
                    </div>
                    <div className="forgot">
                        <a href="#">Email/Passwordを忘れた方</a>
                    </div>
                </div>
                <div className={`form-section ${activeTab === "signup" ? "" : "hidden"}`}>
                    <div className="form-group">
                        <input type="text" placeholder="Full Name"/>
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Gender"/>
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email"/>
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password"/>
                    </div>
                    <div className="form-group">
                        <input type="tel" placeholder="Phone"/>
                    </div>
                    <div className="form-group">
                        <button className="signup-btn">Sign Up</button>
                    </div>
                </div>
            </div>
        </>
    )
}
