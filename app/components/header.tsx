"use client";
import Link from "next/link";
import React from "react";
import style from "./header.module.css";

export default function Header() {
  return (
    <>
      <header className={style.header}>
        <Link href="/" className={style.linkelement}>
          <h1 className={style.title}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            Mld Inventory
          </h1>
        </Link>

        <div className={style.navlinks}>
          <Link href="/categories">
            <button className={style.navbtn}>Categories</button>
          </Link>
          <Link href="/items">
            <button className={style.navbtn}>Items</button>
          </Link>
        </div>
      </header>
    </>
  );
}
