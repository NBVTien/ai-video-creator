import React from "react";

export default function RecentProjectsSection() {
  const projects = [
    { id: 1, alt: "Video 1" },
    { id: 2, alt: "Video 2" },
    { id: 3, alt: "Video 3" },
    { id: 4, alt: "Video 4" },
  ];

  return (
    <section style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div className="list-project-section" style={{ marginTop: "5px", width: "90%" }}>
        <h2
          className="trending-title"
          style={{
            fontSize: "20px",
            marginBottom: "5px",
            fontWeight: "bold",
            fontFamily: "'Dancing Script', cursive",
          }}
        >
          Dự án gần đây:
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {projects.map((project) => (
            <div key={project.id}>
              <div
                style={{
                  padding: "1rem",
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  width: "100%",
                  height: "180px",
                  backgroundColor: "#EEEEEE",
                }}
              >
                <img src="/videoTemp.svg" alt={project.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "5px 15px", background: "white" }}>
                <p style={{ fontSize: "14px", color: "#00000", fontFamily: "'Inter', cursive" }}>#VideoEditing</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}