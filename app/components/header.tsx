"use client";
import Link from "next/link";
import React from "react";
import { useState } from "react";

const headerStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
  padding: "0.7rem 2rem",
  boxShadow: "0 4px 16px rgba(38, 50, 56, 0.1)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottomLeftRadius: "5px",
  borderBottomRightRadius: "5px",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  fontWeight: 700,
  fontSize: "2.2rem",
  margin: 0,
  letterSpacing: "2px",
  textShadow: "0 2px 8px rgba(38, 50, 56, 0.12)",
};

const navButtonStyle: React.CSSProperties = {
  background: "#fff",
  color: "#43e97b",
  padding: "0.7rem 1.3rem",
  borderRadius: "16px",
  fontWeight: 600,
  fontSize: "1.05rem",
  boxShadow: "0 2px 8px rgba(38, 50, 56, 0.10)",
  border: "none",
  cursor: "pointer",
  transition: "box-shadow 0.2s, transform 0.2s",
  marginLeft: "1rem",
};

export default function Header() {
  return (
    <>
      <header style={headerStyle}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              ...titleStyle,
              cursor: "pointer",
              transition: "transform 0.2s, text-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLHeadingElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLHeadingElement).style.textShadow =
                "0 4px 16px rgba(38, 50, 56, 0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLHeadingElement).style.transform = "none";
              (e.currentTarget as HTMLHeadingElement).style.textShadow =
                "0 2px 8px rgba(38, 50, 56, 0.12)";
            }}
          >
            Mld Inventory
          </h1>
        </Link>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/categories">
            <button
              style={navButtonStyle}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 4px 16px rgba(38, 50, 56, 0.18)";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-2px) scale(1.05)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 2px 8px rgba(38, 50, 56, 0.10)";
                (e.currentTarget as HTMLButtonElement).style.transform = "none";
              }}
            >
              Categories
            </button>
          </Link>
          <Link href="/items">
            <button
              style={navButtonStyle}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 4px 16px rgba(38, 50, 56, 0.18)";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-2px) scale(1.05)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 2px 8px rgba(38, 50, 56, 0.10)";
                (e.currentTarget as HTMLButtonElement).style.transform = "none";
              }}
            >
              Items
            </button>
          </Link>
        </div>
      </header>
    </>
  );
}
