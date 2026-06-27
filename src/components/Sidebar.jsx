import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../index.css";

const menuItems = [
  { icon: "🏠", name: "Home", path: "/" },
  { icon: "📊", name: "Overview", path: "/Dashboard" },
  { icon: "⚙️", name: "Draft System", path: "/DraftSystem" },
  { icon: "⚙️", name: "Milling System", path: "/MillingSystem" },
  { icon: "💧", name: "CW Pumps", path: "/CWPumps" },
  { icon: "⚡", name: "BFP", path: "/BFP" },
  { icon: "🔧", name: "CC Pumps", path: "/CCPumps" },
  { icon: "🔋", name: "CEP", path: "/CEP" },
  { icon: "🌀", name: "Compressors", path: "/Compressors" },
  { icon: "📈", name: "PLF & APC", path: "/TestTrend" }

];

export default function Sidebar({
  collapsed
}) {

  return (
    <div
      className={`sidebar ${collapsed ? "collapsed" : ""
        }`}
    >
      <div className="menu-list">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "menu-item active-menu"
                : "menu-item"
            }
          >
            <span className="menu-icon">
              {item.icon}
            </span>

            {!collapsed && (
              <span className="menu-text">
                {item.name}
              </span>
            )}

            {collapsed && (
              <span className="menu-tooltip">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}