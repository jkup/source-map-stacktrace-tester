import StackTrace from "stacktrace-js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

/**
 * @typedef {Object} CLIArguments
 * @property {string} errorObjectPath - The path to the JSON file containing the error object.
 * @property {string} sourceMapPath - The path to the source map file.
 */

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option("errorObjectPath", {
    alias: "e",
    description: "The path to the JSON file containing the error object",
    type: "string",
    demandOption: true,
  })
  .option("sourceMapPath", {
    alias: "s",
    description: "The path to the source map file",
    type: "string",
    demandOption: true,
  })
  .help()
  .alias("help", "h").argv;

/**
 * Main function to parse and log the error stack trace.
 * @param {CLIArguments} args - Command line arguments
 */
async function main(args) {
  const { errorObjectPath, sourceMapPath } = args;

  // Load the error object and source map
  const errorObject = await import(`./${errorObjectPath}`);
  const sourceMap = await import(`./${sourceMapPath}`);

  // Parse the stack trace using StackTrace.js
  StackTrace.fromError(errorObject, { sourceMap })
    .then((stackframes) => {
      // Log the parsed stack trace
      console.log("Parsed Stack Trace:", stackframes);

      // Also log the original error object
      console.log("Original Error Object:", errorObject);
    })
    .catch((error) => {
      console.error("Error parsing stack trace:", error);
    });
}

// Run the main function with the provided arguments
main(argv);
