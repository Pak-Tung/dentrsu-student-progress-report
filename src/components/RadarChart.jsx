import React, { useContext } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import "../DarkMode.css";
import { ThemeContext } from "../ThemeContext";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function RadarChart({ label, dataset }) {
  const { theme } = useContext(ThemeContext);

  const isDarkMode = theme === 'dark';

  const data = {
    labels: label,
    datasets: [
      {
        label: '%',
        data: dataset,
        backgroundColor: isDarkMode ? 'rgba(255, 99, 132, 0.2)' : 'rgba(54, 162, 235, 0.2)',
        borderColor: isDarkMode ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: isDarkMode ? '#ffffff' : '#000000',
        },
        grid: {
          color: isDarkMode ? '#888888' : '#cccccc',
        },
        pointLabels: {
          color: isDarkMode ? '#ffffff' : '#000000',
        },
        ticks: {
          backdropColor: isDarkMode ? '#333333' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? '#ffffff' : '#000000',
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#ffffff' : '#000000',
      },
    },
  };

  return (
    <Radar data={data} options={options} />
  );
}

export default RadarChart;
