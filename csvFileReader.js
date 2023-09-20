const fs = require("fs");
const csvtojson = require("csvtojson");
const { Transform, pipeline } = require("stream");

const CSV_FILE_PATH = "./csv/nodejs-hw3-ex3.csv";
const TXT_FILE_PATH = "./csv/nodejs-hw3-ex3.txt";

const normalizePropsName = new Transform({
  transform(chunk, encoding, next) {
    const line = chunk.toString();
    const matches = line.match(/\"[\w\s]+\":/g);

    const newLine = matches.reduce((result, name) => {
      return result.replace(name, name.trim().toLowerCase());
    }, line);

    this.push(newLine);
    next();
  },
});

pipeline(
  fs.createReadStream(CSV_FILE_PATH),
  csvtojson(),
  normalizePropsName,
  fs.createWriteStream(TXT_FILE_PATH),
  (error) => {
    if (error) {
      console.error("Pipeline failed: ", error);
    } else {
      console.log("Pipeline succeeded!");
    }
  }
);
