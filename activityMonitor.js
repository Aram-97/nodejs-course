const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");

const REFRESH_RATE = 100;
const LOGGING_RATE = 60000;
const LOG_FILE_NAME = "activityMonitor.log";

const GET_PROCESS_COMMAND_UNIX = "ps -A -o %cpu,%mem,comm | sort -nr | head -n 1";
const GET_PROCESS_COMMAND_WINDOWS = `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`;

const resultsQueue = [];

// Each command execution took:
// - ~2s on Windows machine
// - ~40ms on MacOS machine
const executeCommandLoop = (command) => {
  const processStartTime = Date.now();
  const cp = childProcess.exec(command, (error, stdout, stderr) => {
    resultsQueue.push(stdout.trim());

    if (error !== null || stderr) {
      console.log("An error has occurred!");
      console.error(error || stderr);
    }
  });

  cp.on("exit", () => {
    // Throttle execution time to make sure at least ${REFRESH_RATE} time has passed
    // before the next command is executed, otherwise the queue is gonna overflow.
    const processEndTime = Date.now();
    const leftoverTime = REFRESH_RATE - (processEndTime - processStartTime);

    if (leftoverTime > 0) {
      setTimeout(() => {
        executeCommandLoop(command);
      }, leftoverTime);
    } else {
      executeCommandLoop(command);
    }
  });
};

const printCommandResult = () => {
  if (!resultsQueue.length) {
    process.stdout.clearLine();
    process.stdout.write("Starting...\r");
    return;
  }

  process.stdout.clearLine();
  process.stdout.write(`${resultsQueue[0]}\r`);

  if (resultsQueue.length > 1) {
    resultsQueue.shift();
  }
};

const logCommandResult = () => {
  const resultLog = `${Date.now()} : ${resultsQueue[0]}\n`;

  fs.appendFile(LOG_FILE_NAME, resultLog, (error) => {
    if (error) {
      console.error("Failed to log command result!");
      throw error;
    }
  });
};

const startActivityMonitor = (command) => {
  executeCommandLoop(command);

  setInterval(() => {
    printCommandResult();
  }, REFRESH_RATE);

  setInterval(() => {
    logCommandResult();
  }, LOGGING_RATE);
};

switch (os.type()) {
  case "Linux":
  case "Darwin": {
    startActivityMonitor(GET_PROCESS_COMMAND_UNIX);
    break;
  }
  case "Windows_NT": {
    startActivityMonitor(GET_PROCESS_COMMAND_WINDOWS);
    break;
  }
  default: {
    console.log("Operating system currently not supported!");
    break;
  }
}
