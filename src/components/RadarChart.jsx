import React from 'react';
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

function RadarChart({label, dataset}) {
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );

  const data = {
    labels: label, //['Operative', 'Periodontic', 'Endodontic', 'Prosthodontic', 'Oral Diagnosis', 'Oral Radiology', 'Oral Surgery', 'Orthodontic', 'Pediatric Dentistry'],
    datasets: [
      {
        label: '%',//'Requirement Progression',
        data: dataset,//[20, 90, 30, 50, 20, 30, 0, 10, 70],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
  return (
    <Radar data={data} />
  )
}

export default RadarChart; 
