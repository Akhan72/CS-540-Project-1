import ResultsChart from "@/components/ResultsChart";
import { useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

//installed other programs needed such as chart.js, jsPdf, and framer-motion

export default function Home() {
  // State variables
  const [numProcesses, setNumProcesses] = useState("");
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState({});
  const [timeQuantum, setTimeQuantum] = useState("");

  
  };
