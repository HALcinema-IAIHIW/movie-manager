'use client';
import React from 'react';
import "./header.css"

const Header = () =>{
    return(
        <header id={"header"}>
            <div id={"menuBtn"}>MENU</div>
            <h1 id={"siteTitle"}>HAL CINEMA</h1>
            <input type="text"/>
            <div id={"member"}>MEMBER</div>
        </header>
    );
}

export default Header;