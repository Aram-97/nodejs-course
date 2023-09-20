const childProcess = require("child_process");
const { EventEmitter } = require("./EventEmitter");

const GET_DATA_URL = "https://jsonplaceholder.typicode.com/posts/1";

class WithTime extends EventEmitter {
  execute(asyncFunc, ...args) {
    this.emit("begin");
    const startTime = Date.now();

    asyncFunc(...args)
      .then((res) => this.emit("data", JSON.parse(res)))
      .catch((err) => console.error(err))
      .finally(() => this.emit("end", Date.now() - startTime));
  }
}

const withTime = new WithTime();

withTime.on("begin", () => console.log("About to execute!"));
withTime.on("data", (data) => console.log("Received data: ", data));
withTime.on("end", (elapsedTime) =>
  console.log(`Done with execution!\nOperation took ${elapsedTime}ms`)
);

withTime.execute(
  (command, ...args) => {
    const process = childProcess.spawn(command, args);

    return new Promise((resolve, reject) => {
      let fullData = "";
      let fullError = "";

      process.stdout.on("data", (data) => {
        fullData += data;
      });

      process.stderr.on("data", (data) => {
        fullError += data;
      });

      process.stdout.on("end", () => {
        resolve(fullData.toString());
      });

      process.stdout.on("close", (code) => {
        if (code) {
          reject(fullError.toString());
        }
      });
    });
  },
  "curl",
  GET_DATA_URL
);
