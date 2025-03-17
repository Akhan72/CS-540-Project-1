import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ResultsChart({ results }) {
  if (!results || Object.keys(results).length === 0) {
    return <p>No results available.</p>;
  }

  const datasets = Object.keys(results).map((algorithm, index) => ({
    label: algorithm,
    data: results[algorithm].map((process) => process.completionTime),
    backgroundColor: `rgba(${index * 60}, 99, 132, 0.5)`,
  }));

  const data = {
    labels: results[Object.keys(results)[0]].map((process) => `P${process.id}`),
    datasets: datasets,
  };

  return (
    <div style={{ width: "600px", margin: "20px auto" }}>
      <h2>Scheduling Results</h2>
      <Bar data={data} />
    </div>
  );
}
