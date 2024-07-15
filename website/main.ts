import { load } from "js-yaml";
import MarkdownIt from "markdown-it";
import { openapiChangelog, openapiCompare } from "../dist";

let currentChangelogTab: "raw" | "markdown" = "raw";
let currentlyDetailed: boolean = false;

window.onload = () => {
  const oldDocumentInputFile = document.getElementById("oldDocumentInputFile");
  oldDocumentInputFile?.addEventListener("change", (e) => inputOldDocument(e));

  const newDocumentInputFile = document.getElementById("newDocumentInputFile");
  newDocumentInputFile?.addEventListener("change", (e) => inputNewDocument(e));

  const diffButton = document.getElementById("diffButton");
  diffButton?.addEventListener("click", (_) => computeDiff());

  const changelogButton = document.getElementById("changelogButton");
  changelogButton?.addEventListener("click", (_) => computeChangelog(false));

  const detailedChangelogButton = document.getElementById("detailedChangelogButton");
  detailedChangelogButton?.addEventListener("click", (_) => computeChangelog(true));

  const rawTab = document.getElementById("rawTab");
  rawTab?.addEventListener("click", (_) => computeRawChangelog());

  const markdownTab = document.getElementById("markdownTab");
  markdownTab?.addEventListener("click", (_) => computeMarkdownChangelog());
};

function inputOldDocument(e: Event) {
  loadFileContentsOnChange(e, "oldDocumentTextArea", "oldDocumentFormatSelect");
}

function inputNewDocument(e: Event) {
  loadFileContentsOnChange(e, "newDocumentTextArea", "newDocumentFormatSelect");
}

function loadFileContentsOnChange(e: Event, textAreaId: string, formatSelectId: string): void {
  const input = e.target as HTMLInputElement | undefined;
  if (input === undefined || input.files === null || input.files.length === 0) {
    const textArea: HTMLTextAreaElement | undefined = document.getElementById(textAreaId) as HTMLTextAreaElement | undefined;
    if (!textArea) {
      console.error("Text area not found");
      return;
    }

    textArea.value = "";
    return;
  }

  const file = input.files[0];

  const formatSelect = document.getElementById(formatSelectId) as HTMLSelectElement | undefined;
  if (formatSelect !== undefined) {
    if (file.name.endsWith(".json")) {
      formatSelect.value = "json";
    }
    if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
      formatSelect.value = "yaml";
    }
  }

  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = (e: Event) => {
    const textArea: HTMLTextAreaElement | undefined = document.getElementById(textAreaId) as HTMLTextAreaElement | undefined;
    if (!textArea) {
      console.error("Text area not found");
      return;
    }

    const fileReader = e.target as FileReader;
    textArea.value = fileReader.result as string;
  };
}

function computeRawChangelog() {
  currentChangelogTab = "raw";
  document.getElementById("rawTab")?.classList.add("active");
  document.getElementById("markdownTab")?.classList.remove("active");

  computeChangelog();
}

function computeMarkdownChangelog() {
  currentChangelogTab = "markdown";
  document.getElementById("rawTab")?.classList.remove("active");
  document.getElementById("markdownTab")?.classList.add("active");

  computeChangelog();
}

function computeChangelog(detailed?: boolean | undefined) {
  const oldDocument = parseOpenapiDocument("oldDocumentTextArea", "oldDocumentFormatSelect");
  const newDocument = parseOpenapiDocument("newDocumentTextArea", "newDocumentFormatSelect");

  const changelogTabs = document.getElementById("changelogTabs");
  if (changelogTabs) {
    changelogTabs.style.visibility = "visible";
  }

  const resultTextArea: HTMLTextAreaElement | undefined = document.getElementById("resultTextArea") as HTMLTextAreaElement | undefined;
  if (!resultTextArea) {
    console.error("Result text area not found");
    return;
  }

  const resultDiv: HTMLDivElement | undefined = document.getElementById("resultDiv") as HTMLDivElement | undefined;
  if (!resultDiv) {
    console.error("Result div not found");
    return;
  }

  currentlyDetailed = detailed === undefined ? currentlyDetailed : detailed === true;
  if (currentlyDetailed) {
    document.getElementById("changelogButton")?.classList.remove("btn-primary");
    document.getElementById("changelogButton")?.classList.add("btn-outline-primary");
    document.getElementById("detailedChangelogButton")?.classList.add("btn-primary");
    document.getElementById("detailedChangelogButton")?.classList.remove("btn-outline-primary");
  } else {
    document.getElementById("changelogButton")?.classList.add("btn-primary");
    document.getElementById("changelogButton")?.classList.remove("btn-outline-primary");
    document.getElementById("detailedChangelogButton")?.classList.remove("btn-primary");
    document.getElementById("detailedChangelogButton")?.classList.add("btn-outline-primary");
  }

  const raw = openapiChangelog([oldDocument, newDocument], { detailed: currentlyDetailed });

  switch (currentChangelogTab) {
    case "raw":
      resultTextArea.style.display = "block";
      resultDiv.style.display = "none";

      resultTextArea.value = raw;
      break;
    case "markdown":
      resultTextArea.style.display = "none";
      resultDiv.style.display = "block";

      const md = MarkdownIt();
      const mdChangelog = md.render(raw);
      resultDiv.innerHTML = mdChangelog;
      break;

  }
}

function computeDiff() {
  const oldDocument = parseOpenapiDocument("oldDocumentTextArea", "oldDocumentFormatSelect");
  const newDocument = parseOpenapiDocument("newDocumentTextArea", "newDocumentFormatSelect");

  const resultTextArea: HTMLTextAreaElement | undefined = document.getElementById("resultTextArea") as HTMLTextAreaElement | undefined;
  if (!resultTextArea) {
    console.error("Result text area not found");
    return;
  }

  const changelogTabs = document.getElementById("changelogTabs");
  if (changelogTabs) {
    changelogTabs.style.visibility = "hidden";
  }

  const result = openapiCompare(oldDocument, newDocument);
  resultTextArea.value = JSON.stringify(result.changes, null, 2);
}

function parseOpenapiDocument(textAreaId: string, formatSelectId: string) {
  const documentTextArea: HTMLTextAreaElement | undefined = document.getElementById(textAreaId) as HTMLTextAreaElement | undefined;
  if (!documentTextArea) {
    console.error("Text area not found");
    return;
  }

  const documentStr = documentTextArea.value;
  if (documentStr === undefined) {
    console.error("Raw document not found");
    return;
  }

  const formatSelect: HTMLSelectElement | undefined = document.getElementById(formatSelectId) as HTMLSelectElement | undefined;
  if (!documentTextArea) {
    console.error("Format select not found");
    return;
  }

  const format = formatSelect?.value;
  if (format === undefined) {
    console.error("Format not found");
    return;
  }

  let result;
  switch (format) {
    case "json":
      result = JSON.parse(documentStr);
      break;
    case "yaml":
      result = load(documentStr);
      break;
    default:
      console.error("Invalid format " + formatSelect);
      return;
  }

  return result;
}