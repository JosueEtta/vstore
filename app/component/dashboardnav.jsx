import React from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faChevronDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function NavDashboard({ onMenuClick, showMenuButton = false }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 lg:hidden"
              aria-label="Open menu"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          )}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-black tracking-tight text-gray-950">
              V<span className="text-amber-500">store</span>
            </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-gray-600 md:flex">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <Link to="/products" className="hover:text-amber-600">Products</Link>
            <Link to="/admindashboard" className="text-amber-600">Dashboard</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-50" aria-label="Notifications">
            <FontAwesomeIcon icon={faBell} />
            <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-white">3</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <p className="hidden text-sm font-bold sm:block">Admin User</p>
            <FontAwesomeIcon icon={faChevronDown} className="hidden text-xs text-gray-500 sm:block" />
          </div>
        </div>
      </div>
      </div>
    </header>
  );
}
