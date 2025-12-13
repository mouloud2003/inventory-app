"use client";
import Link from "next/link";
import React from "react";
import style from "./header.module.css";

export default function Header() {
  return (
    <>
      <header className={style.header}>
        <Link href="/" className={style.linkelement}>
          <h1 className={style.title}>Mld Inventory</h1>
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
