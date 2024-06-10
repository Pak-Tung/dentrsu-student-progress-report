import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StackedBar() {
  const labels = [
    "",
    "Case 1",
    "Case 2",
    "Case 3",
    "Case 4",
    "Case 5",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Systemic phase",
        data: [100, 100, 100, 100, 100, 100],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Acute phase",
        data: [100, 100, 100, 100, 100, 100],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "Disease control phase",
        data: [100, 20, 10, 50, 0, 100],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Definitive phase",
        data: [100, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
      {
        label: "Maintenance phase",
        data: [100, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(255, 159, 64, 0.5)",
      },
    ],
  };

  const options = {
    indexAxis: "y", // This makes the bar chart horizontal
    plugins: {
      title: {
        display: true,
        text: "Complete Case Progression",
        font: {
            size: 36, // Increase the font size
          },
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default StackedBar;
