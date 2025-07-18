const fs = require("fs-extra");
const path = require("path");

// Define paths
const monacoMinVsSource = path.resolve(__dirname, "node_modules/monaco-editor/min/vs");
const monacoEsmVsSource = path.resolve(__dirname, "node_modules/monaco-editor/esm/vs");
const monacoVsTarget = path.resolve(__dirname, "src/assets/monaco/vs");

// Copy main Monaco VS files (min)
console.log("Copying from", monacoMinVsSource, "to", monacoVsTarget);
fs.copySync(monacoMinVsSource, monacoVsTarget);

// Copy main Monaco VS files (ESM)
console.log("Copying from", monacoEsmVsSource, "to", monacoVsTarget);
fs.copySync(monacoEsmVsSource, monacoVsTarget);

// Copy editor worker
const editorWorkerSource = path.resolve(__dirname, "node_modules/monaco-editor/esm/vs/editor/editor.worker.js");
const editorWorkerTarget = path.resolve(__dirname, "src/assets/monaco/vs/editor/editor.worker.js");
if (fs.existsSync(editorWorkerSource)) {
  console.log("Copying editor worker from", editorWorkerSource, "to", editorWorkerTarget);
  fs.copySync(editorWorkerSource, editorWorkerTarget);
}

// Copy basic languages
const basicWorkerSource = path.resolve(__dirname, "node_modules/monaco-editor/esm/vs/basic-languages");
const basicWorkerTarget = path.resolve(__dirname, "src/assets/monaco/vs/basic-languages");
if (fs.existsSync(basicWorkerSource)) {
  console.log("Copying basic languages from", basicWorkerSource, "to", basicWorkerTarget);
  fs.copySync(basicWorkerSource, basicWorkerTarget);
}

// Copy TypeScript worker
const tsWorkerSource = path.resolve(__dirname, "node_modules/monaco-editor/esm/vs/language/typescript/tsWorker.js");
const tsWorkerTarget = path.resolve(__dirname, "src/assets/monaco/vs/language/typescript/tsWorker.js");
if (fs.existsSync(tsWorkerSource)) {
  console.log("Copying TypeScript worker from", tsWorkerSource, "to", tsWorkerTarget);
  fs.copySync(tsWorkerSource, tsWorkerTarget);
}