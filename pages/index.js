import ResultsChart from "@/components/ResultsChart";
import { useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";


export default function Home() {
  // State variables
  const [numProcesses, setNumProcesses] = useState("");
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState({});
  const [timeQuantum, setTimeQuantum] = useState("");

  // Function to generate random processes
  const generateProcesses = () => {
    const newProcesses = [];
    for (let i = 0; i < numProcesses; i++) {
      newProcesses.push({
        id: i + 1,
        burstTime: Math.floor(Math.random() * 10) + 1, // Random burst time 1-10
      });
    }
    setProcesses(newProcesses);
    setResults({}); // Clear previous results
  };

  // FIFO (First In First Out) Algorithm
  const runFIFO = () => {
    let completionTime = 0;
    let fifoResults = [];
    processes.forEach((process, index) => {
      setTimeout(() => {
        completionTime += process.burstTime;
        fifoResults.push({
          id: process.id,
          completionTime: completionTime,
        });
        setResults((prev) => ({ ...prev, FIFO: [...fifoResults] }));
      }, index * 1000); // Delay each process execution
    });
  };
  

  //SJF (Shortest Job First) Algorithm
  const runSJF = () => {
    let completionTime = 0;
    let sjfResults = [];
    let sortedProcesses = [...processes].sort((a, b) => a.burstTime - b.burstTime);
  
    sortedProcesses.forEach((process, index) => {
      setTimeout(() => {
        completionTime += process.burstTime;
        sjfResults.push({
          id: process.id,
          completionTime: completionTime,
        });
  
        setResults((prev) => ({ ...prev, SJF: [...sjfResults] }));
      }, index * 1000); // Delay execution
    });
  };
  

  const runSTCF = () => {
    let currentTime = 0;
    let remainingProcesses = [...processes].sort((a, b) => a.burstTime - b.burstTime);
    let stcfResults = [];
  
    remainingProcesses.forEach((process, index) => {
      setTimeout(() => {
        currentTime += process.burstTime;
        stcfResults.push({
          id: process.id,
          completionTime: currentTime,
        });
  
        setResults((prev) => ({ ...prev, STCF: [...stcfResults] }));
      }, index * 1000);
    });
  };
  

  const runRoundRobin = () => {
    let queue = [...processes];
    let completionTime = 0;
    let rrResults = [];
    let quantum = timeQuantum > 0 ? timeQuantum : 3; // Default to 3 if empty
  
    const executeProcess = (index) => {
      if (queue.length === 0) return; // Stop if no processes left
  
      let process = queue.shift(); // Get first process
      let timeSlice = Math.min(quantum, process.burstTime); // Run for time quantum or remaining time
  
      setTimeout(() => {
        completionTime += timeSlice;
        process.burstTime -= timeSlice;
  
        if (process.burstTime > 0) {
          queue.push(process); // Move unfinished process to end of queue
        } else {
          rrResults.push({ id: process.id, completionTime: completionTime });
          setResults((prev) => ({ ...prev, RR: [...rrResults] }));
        }
  
        executeProcess(index + 1); // Run the next process in queue
      }, index * 1000);
    };
  
    executeProcess(0);
  };
  
  
  const runMLFQ = () => {
    let queue1 = [];
    let queue2 = [];
    let queue3 = [];
  
    let completionTime = 0;
    let timeQuantum1 = 2; // Short quantum for Queue 1
    let timeQuantum2 = 4; // Medium quantum for Queue 2
  
    queue1 = [...processes];
    let mlfqResults = [];
  
    const executeProcess = (index) => {
      if (queue1.length === 0 && queue2.length === 0 && queue3.length === 0) return; // Stop if all queues are empty
  
      setTimeout(() => {
        // Process Queue 1 (Highest Priority)
        if (queue1.length > 0) {
          let process = queue1.shift();
          if (process.burstTime > timeQuantum1) {
            completionTime += timeQuantum1;
            process.burstTime -= timeQuantum1;
            queue2.push(process); // Move to next queue
          } else {
            completionTime += process.burstTime;
            mlfqResults.push({ id: process.id, completionTime: completionTime });
          }
        }
  
        // Process Queue 2 (Medium Priority)
        else if (queue2.length > 0) {
          let process = queue2.shift();
          if (process.burstTime > timeQuantum2) {
            completionTime += timeQuantum2;
            process.burstTime -= timeQuantum2;
            queue3.push(process); // Move to lowest queue
          } else {
            completionTime += process.burstTime;
            mlfqResults.push({ id: process.id, completionTime: completionTime });
          }
        }
  
        // Process Queue 3 (Lowest Priority - FIFO)
        else if (queue3.length > 0) {
          let process = queue3.shift();
          completionTime += process.burstTime;
          mlfqResults.push({ id: process.id, completionTime: completionTime });
        }
  
        setResults((prev) => ({ ...prev, MLFQ: [...mlfqResults] }));
        executeProcess(index + 1); // Move to next process
      }, index * 1000);
    };
  
    executeProcess(0);
  };
  
  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text("CPU Scheduling Results", 10, 10);
  
    let y = 20; // Starting position for text in PDF
  
    Object.keys(results).forEach((algo) => {
      pdf.text(`${algo} Scheduling Results:`, 10, y);
      y += 10;
  
      results[algo].forEach((result) => {
        pdf.text(`Process ${result.id}: Completion Time = ${result.completionTime}`, 10, y);
        y += 8; // Space between lines
      });
  
      y += 10; // Extra space before next algorithm results
    });
  
    pdf.save("scheduling_results.pdf"); // Save as file
  };
  

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        CPU Scheduler - Multiple Algorithms
      </motion.h1>

      {/* User Input Form */}
      <div>
        <label>Number of Processes:</label>
        <input
          type="number"
          value={numProcesses}
          onChange={(e) => setNumProcesses(e.target.value)}
          placeholder="Enter number of processes"
        />
        <label>Time Quantum:</label>
        <input
          type="number"
          value={timeQuantum}
          onChange={(e) => setTimeQuantum(Number(e.target.value))}
          placeholder="Enter Time quantum: "
          />
        <button onClick={generateProcesses}>Generate Processes</button>
      </div>

      {/* Display Generated Processes */}
      {processes.length > 0 && (
        <div>
          <h2>Generated Processes</h2>
          <ul>
            {processes.map((process) => (
              <li key={process.id}>
                Process {process.id}: Burst Time = {process.burstTime}
              </li>
            ))}
          </ul>
          <button onClick={runFIFO}>Run FIFO</button>
          <button onClick={runSJF}>Run SJF</button>
          <button onClick={runSTCF}>Run STCF</button>
          <button onClick={runRoundRobin}>Run Round Robin</button>
          <button onClick={runMLFQ}>Run MLFQ</button>



        </div>
      )}

      {/* Display Results for Each Algorithm */}
      {Object.keys(results).map((algo) => (
        <div key={algo}>
          <h2>{algo} Scheduling Results</h2>
          <ul>
            {results[algo].map((result) => (
              <li key={result.id}>
                Process {result.id}: Completion Time = {result.completionTime}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <ResultsChart results={results} />  
      {Object.keys(results).length > 0 && (
        <button onClick={downloadPDF}>Download as PDF</button>
      )}
    </div>
  );
}


/*
I did not fully understand commits, I did research on it through chatgpt like you said, and it just told me it was a checkpoint, meanign
a snapshot of what has been done, though comments. so what I had originally done was keep comments on what i did throughout, here are they:

1. Installed dependencies (chart.js, jspdf, framer-motion)
-> 
npm install chart.js jspdf framer-motion


2.Initialized state variables for managing processes and results
->
const [numProcesses, setNumProcesses] = useState("");
const [processes, setProcesses] = useState([]);
const [results, setResults] = useState({});
const [timeQuantum, setTimeQuantum] = useState("");

3.Added input form to allow user to specify process count and time quantum
->
<div>
  <label>Number of Processes:</label>
  <input
    type="number"
    value={numProcesses}
    onChange={(e) => setNumProcesses(e.target.value)}
    placeholder="Enter number of processes"
  />
  <label>Time Quantum:</label>
  <input
    type="number"
    value={timeQuantum}
    onChange={(e) => setTimeQuantum(Number(e.target.value))}
    placeholder="Enter Time Quantum"
  />
  <button onClick={generateProcesses}>Generate Processes</button>
</div>

4. Implemented function to generate random processes
->
const generateProcesses = () => {
  const newProcesses = [];
  for (let i = 0; i < numProcesses; i++) {
    newProcesses.push({
      id: i + 1,
      burstTime: Math.floor(Math.random() * 10) + 1,
    });
  }
  setProcesses(newProcesses);
  setResults({}); // Clear previous results
};

5.Implemented FIFO scheduling algorithm
->
const runFIFO = () => {
  let completionTime = 0;
  let fifoResults = [];
  processes.forEach((process, index) => {
    setTimeout(() => {
      completionTime += process.burstTime;
      fifoResults.push({
        id: process.id,
        completionTime: completionTime,
      });
      setResults((prev) => ({ ...prev, FIFO: [...fifoResults] }));
    }, index * 1000);
  });
};
6.Implemented SJF scheduling algorithm
->
const runSJF = () => {
  let completionTime = 0;
  let sjfResults = [];
  let sortedProcesses = [...processes].sort((a, b) => a.burstTime - b.burstTime);

  sortedProcesses.forEach((process, index) => {
    setTimeout(() => {
      completionTime += process.burstTime;
      sjfResults.push({
        id: process.id,
        completionTime: completionTime,
      });
      setResults((prev) => ({ ...prev, SJF: [...sjfResults] }));
    }, index * 1000);
  });
};
7.Implemented STCF scheduling algorithm
->
const runSTCF = () => {
  let currentTime = 0;
  let remainingProcesses = [...processes].sort((a, b) => a.burstTime - b.burstTime);
  let stcfResults = [];

  remainingProcesses.forEach((process, index) => {
    setTimeout(() => {
      currentTime += process.burstTime;
      stcfResults.push({
        id: process.id,
        completionTime: currentTime,
      });
      setResults((prev) => ({ ...prev, STCF: [...stcfResults] }));
    }, index * 1000);
  });
};
8.Implemented Round Robin scheduling algorithm
->
const runRoundRobin = () => {
  let queue = [...processes];
  let completionTime = 0;
  let rrResults = [];
  let quantum = timeQuantum > 0 ? timeQuantum : 3;

  const executeProcess = (index) => {
    if (queue.length === 0) return;

    let process = queue.shift();
    let timeSlice = Math.min(quantum, process.burstTime);

    setTimeout(() => {
      completionTime += timeSlice;
      process.burstTime -= timeSlice;

      if (process.burstTime > 0) {
        queue.push(process);
      } else {
        rrResults.push({ id: process.id, completionTime: completionTime });
        setResults((prev) => ({ ...prev, RR: [...rrResults] }));
      }

      executeProcess(index + 1);
    }, index * 1000);
  };

  executeProcess(0);
};


9.Implemented Multi-Level Feedback Queue (MLFQ) scheduling
->
const runMLFQ = () => {
  let queue1 = [...processes];
  let queue2 = [];
  let queue3 = [];
  let completionTime = 0;
  let timeQuantum1 = 2;
  let timeQuantum2 = 4;
  let mlfqResults = [];

  const executeProcess = (index) => {
    if (queue1.length === 0 && queue2.length === 0 && queue3.length === 0) return;

    setTimeout(() => {
      // Process queues here...
    }, index * 1000);
  };

  executeProcess(0);
};


10.Made tweaks here and there throughout, I did not realize I needed to upload commits throughout development, I just thought commits were just snapshots of what we did so far so i just made comments of what I did
Added results display section
11.Implemented Chart.js for visualizing results

12.Added animations using framer-motion
13.Improved animation timing for better UX

14.Styled UI layout for improved usability

15Implemented PDF download feature
16 Formatted PDF output

17Updated README with project details
18Optimized performance for animations
19
20
*/