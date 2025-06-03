import React from "react";

export default function TrendingSection() {
  const tags = ["#VideoEditing", "#VlogTips", "#AIinVideo", "#ShortsEditing"];

  return (
    <section style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div
        className="trending-section"
        style={{
          margin: "1rem 0 3rem 0",
          width: "60%",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2
          className="trending-title"
          style={{
            fontSize: "20px",
            marginBottom: "5px",
            fontWeight: "bold",
            fontFamily: "'Dancing Script', cursive",
          }}
        >
          Trending:
        </h2>

        {tags.map((tag, index) => (
          <div
            key={index}
            style={{
              padding: "0.5rem 1rem",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              width: "fit-content",
            }}
          >
            <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>{tag}</p>
          </div>
        ))}
      </div>
    </section>
  );
}