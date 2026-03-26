import React, { useRef } from "react";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ReportsPage.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function Reports() {
  const reportRef = useRef();

  const monthlyRevenue = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue",
        data: [50000, 62000, 75000, 88000, 92000],
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const areaPerformance = {
    labels: ["Downtown", "Uptown", "West Zone", "East Zone"],
    datasets: [
      {
        label: "Pickups",
        data: [120, 98, 150, 110],
        backgroundColor: "#22c55e",
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };
  const collectorPerformance = {
    labels: ["Ravi", "Suresh", "Arjun", "Imran"],
    datasets: [
      {
        label: "Pickups Completed",
        data: [85, 110, 76, 95],
        backgroundColor: "#3b82f6",
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };
  const scrapPopularity = {
    labels: ["Metal", "Plastic", "Glass", "E-waste"],
    datasets: [
      {
        data: [30, 35, 15, 20],
        backgroundColor: [
          "#6B7280",
          "#22C55E",
          "#38BDF8",
          "#F97316",
        ],
        borderWidth: 0,
      },
    ],
  };

  const paymentBreakdown = {
    labels: ["UPI", "Cash", "Wallet"],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: [
          "#2563EB",
          "#16A34A",
          "#A855F7",
        ],
        borderWidth: 0,
      },
    ],
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("scrap-collector-reports.pdf");
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2>Business Reports</h2>
        <div className="header-actions">
          <input type="date" />
          <input type="date" />
          <button onClick={downloadPDF} className="primary-btn">
            Download PDF
          </button>
        </div>
      </div>
      <div ref={reportRef}>
        {/* KPI Section */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <h4>Total Revenue</h4>
            <p>₹3,67,000</p>
          </div>
          <div className="kpi-card">
            <h4>Total Pickups</h4>
            <p>578</p>
          </div>
          <div className="kpi-card">
            <h4>Top Area</h4>
            <p>West Zone</p>
          </div>
          <div className="kpi-card">
            <h4>Top Collector</h4>
            <p>Suresh Patel</p>
          </div>
        </div>
        {/* Monthly Revenue */}
        <div className="chart-card large-chart">
          <h3>Monthly Revenue Trend</h3>
          <Line
            data={monthlyRevenue}
            options={{ maintainAspectRatio: false }}
          />
        </div>
        {/* Area + Collector (Medium Size) */}
        <div className="two-column">
          <div className="medium-chart-card">
            <h3>Area-wise Performance</h3>
            <Bar
              data={areaPerformance}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
          <div className="medium-chart-card">
            <h3>Collector Performance</h3>
            <Bar
              data={collectorPerformance}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
        {/* Small Analytics */}
        <div className="small-analytics">
          <div className="small-chart-card">
            <h3>Scrap Type Popularity</h3>
            <Pie
              data={scrapPopularity}
              options={{
                plugins: { legend: { position: "bottom" } },
                maintainAspectRatio: false,
              }}
            />
          </div>
          <div className="small-chart-card">
            <h3>Payment Method Breakdown</h3>
            <Doughnut
              data={paymentBreakdown}
              options={{
                plugins: { legend: { position: "bottom" } },
                cutout: "65%",
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}