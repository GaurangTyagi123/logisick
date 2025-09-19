import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {type  ChartData } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);



interface PieChartProps {
  data: ChartData<'doughnut', number[], string>;
}
const options = {
  plugins: {
    legend: {
      position: "right" as const, // 'top' | 'left' | 'bottom' | 'right' | 'center' | 'chartArea'
    },
  },
};

export function PieChart({ data }: PieChartProps) {
  return <Doughnut data={data} options={options} style={{width:"150px",height:"150px"}}/>;
}
