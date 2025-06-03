"use client";

import React from "react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import Header from "@/features/dashboard/components/Header";
import SearchBar from "@/features/dashboard/components/SearchBar";
import TrendingSection from "@/features/dashboard/components/TrendingSection";
import RecentProjectsSection from "@/features/dashboard/components/RecentProjectsSection";
import "./layout.css";

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: "5rem 0 0 0",
          background: "url('/Bg.svg') no-repeat center top",
          backgroundSize: "cover",
        }}
      >
        <Header />
        <SearchBar />
        <TrendingSection />
        <RecentProjectsSection />
      </main>
    </div>
  );
}