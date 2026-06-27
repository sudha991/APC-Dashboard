import React from "react";
import "../index.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <span>
          Designed & Developed by IT Department <strong>Renuka-107425</strong>,{" "}
          <strong>Sudha</strong>
        </span>

        <span className="footer-divider">|</span>

        <span>
          NTPC Simhadri Super Thermal Power Station
        </span>

        <span className="footer-divider">|</span>

        <span>
          APC Dashboard © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}