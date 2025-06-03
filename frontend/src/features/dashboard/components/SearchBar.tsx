import React from "react";

export default function SearchBar() {
  return (
    <div style={{ textAlign: "center" }}>
      <input
        type="text"
        placeholder="Tìm kiếm hoặc nhập chủ đề..."
        style={{
          marginTop: "1rem",
          padding: "0.5rem 4rem",
          width: "60%",
          height: "110px",
          border: "2px solid transparent",
          borderRadius: "20px",
          outline: "none",
          fontSize: "16px",
          transition: "box-shadow 0.2s ease-in-out",
          background: "linear-gradient(white, white) padding-box, linear-gradient(to right, #61FFF2, #300DF4) border-box",
        }}
        onFocus={(e) => (e.target.style.boxShadow = "0 0 5px rgba(255, 105, 180, 0.5)")}
        onBlur={(e) => (e.target.style.boxShadow = "none")}
      />
    </div>
  );
}