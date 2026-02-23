"use client";
import Link from "next/link";
import React from "react";
import style from "./header.module.css";

export default function Header() {
  return (
    <header className={style.header}>
      <Link href="/" className={style.linkelement}>
        <h1 className={style.title}><span aria-hidden="true">📦</span> Inventory</h1>
      </Link>

      <nav className={style.navlinks}>
        <Link href="/categories">
          <button className={style.navbtn}>Categories</button>
        </Link>
        <Link href="/items">
          <button className={style.navbtn}>Items</button>
        </Link>
        <Link href="/items/new">
          <button className={style.navbtn}>+ New Item</button>
        </Link>
      </nav>
    </header>
  );
}
