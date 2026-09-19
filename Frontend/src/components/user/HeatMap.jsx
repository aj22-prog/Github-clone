import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

const generateActivityData = () => {
  const data = [];
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setDate(today.getDate() - 120);

  let currentDate = new Date(oneYearAgo);

  while (currentDate <= today) {
    const count = Math.random() > 0.4 ? Math.floor(Math.random() * 8) + 1 : 0;
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count: count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    setActivityData(generateActivityData());
  }, []);

  const totalContributions = activityData.reduce((acc, curr) => acc + curr.count, 0);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 120);

  return (
    <div className="heat-map-wrapper">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
          {totalContributions} contributions in the last 4 months
        </h4>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Contribution settings ▾</span>
      </div>

      <div style={{ overflowX: "auto", paddingBottom: "8px" }}>
        <HeatMap
          value={activityData}
          width="100%"
          style={{ color: "#8b949e", fontSize: "11px" }}
          startDate={startDate}
          rectSize={13}
          space={3}
          rectProps={{
            rx: 2,
          }}
          panelColors={{
            0: "#161b22",
            1: "#0e4429",
            3: "#006d32",
            5: "#26a641",
            8: "#39d353",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
        <span>Less</span>
        <span style={{ width: "10px", height: "10px", background: "#161b22", borderRadius: "2px", display: "inline-block" }}></span>
        <span style={{ width: "10px", height: "10px", background: "#0e4429", borderRadius: "2px", display: "inline-block" }}></span>
        <span style={{ width: "10px", height: "10px", background: "#006d32", borderRadius: "2px", display: "inline-block" }}></span>
        <span style={{ width: "10px", height: "10px", background: "#26a641", borderRadius: "2px", display: "inline-block" }}></span>
        <span style={{ width: "10px", height: "10px", background: "#39d353", borderRadius: "2px", display: "inline-block" }}></span>
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatMapProfile;