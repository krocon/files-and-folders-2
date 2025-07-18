const fs = require("fs-extra");
const path = require("path");

// Define paths
const monacoMinVsSource = path.resolve(__dirname, "node_modules/monaco-editor/min");
const monacoVsTarget = path.resolve(__dirname, "src/assets/monaco/min");

// Copy main Monaco VS files (min only)
console.log("Copying from", monacoMinVsSource, "to", monacoVsTarget);
fs.copySync(monacoMinVsSource, monacoVsTarget);

// The min version already includes all necessary files including workers and languages
// No need to copy additional files from the esm directory
