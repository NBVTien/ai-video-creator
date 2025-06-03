import React from "react";

import { Island_Moments } from "next/font/google";

const islandMoments = Island_Moments({
  weight: ["400"],
});

export default function Header() {
  return (
    <header
      className={islandMoments.className}
      style={{
        paddingBottom: "1rem",
        textAlign: "center",
        fontSize: "50px",
        fontFamily: "'Island Moments', cursive",
        fontStyle: "italic",
      }}
    >
      <h1>Welcome to VideoCut</h1>
    </header>
  );
}