import { load } from "js-yaml";
import MarkdownIt from "markdown-it";
import { openapiChangelog, openapiCompare } from "../dist";

let version = "__VERSION__";
let currentChangelogTab: ChangelogTab = "raw";
let currentOutputMode: OutputMode = "changelog";

window.onload = () => {
  const versionElements = document.getElementsByClassName("version");
  for (let i = 0; i < versionElements.length; i++) {
    const versionElement = versionElements.item(i);
    if (versionElement === null) {
      continue;
    }

    versionElement.textContent = version;
  }

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

  setOutputMode("changelog");
  setChangelogTab("markdown");
  computeChangelog();
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
  setChangelogTab("raw");
  computeChangelog();
}

function computeMarkdownChangelog() {
  setChangelogTab("markdown");
  computeChangelog();
}

function computeChangelog(detailed?: boolean | undefined) {
  const oldDocument = parseOpenapiDocument("oldDocumentTextArea", "oldDocumentFormatSelect");
  const newDocument = parseOpenapiDocument("newDocumentTextArea", "newDocumentFormatSelect");

  const changelogTabs = document.getElementById("changelogTabs");
  if (changelogTabs) {
    changelogTabs.style.visibility = "visible";
  }

  const resultDiv: HTMLDivElement | undefined = document.getElementById("resultDiv") as HTMLDivElement | undefined;
  if (!resultDiv) {
    console.error("Result div not found");
    return;
  }

  if (detailed !== undefined) {
    setOutputMode(detailed ? "detailed" : "changelog");
  }

  const raw = openapiChangelog([oldDocument, newDocument], { detailed: currentOutputMode === "detailed" });

  switch (currentChangelogTab) {
    case "raw":
      resultDiv.innerText = raw;
      break;
    case "markdown":
      const md = MarkdownIt();
      const mdChangelog = md.render(raw);
      resultDiv.innerHTML = mdChangelog;
      break;

  }
}

function computeDiff() {
  const oldDocument = parseOpenapiDocument("oldDocumentTextArea", "oldDocumentFormatSelect");
  const newDocument = parseOpenapiDocument("newDocumentTextArea", "newDocumentFormatSelect");

  const resultDiv: HTMLDivElement | undefined = document.getElementById("resultDiv") as HTMLDivElement | undefined;
  if (!resultDiv) {
    console.error("Result div not found");
    return;
  }

  setOutputMode("diff");
  hideChangelogTabs();

  const result = openapiCompare(oldDocument, newDocument);
  resultDiv.innerText = JSON.stringify(result.changes, null, 2);
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

function setOutputMode(mode: OutputMode) {
  currentOutputMode = mode;

  if (mode === "changelog") {
    document.getElementById("changelogButton")?.classList.add("btn-primary");
    document.getElementById("changelogButton")?.classList.remove("btn-outline-primary");
  } else {
    document.getElementById("changelogButton")?.classList.remove("btn-primary");
    document.getElementById("changelogButton")?.classList.add("btn-outline-primary");
  }

  if (mode === "detailed") {
    document.getElementById("detailedChangelogButton")?.classList.add("btn-primary");
    document.getElementById("detailedChangelogButton")?.classList.remove("btn-outline-primary");
  } else {
    document.getElementById("detailedChangelogButton")?.classList.remove("btn-primary");
    document.getElementById("detailedChangelogButton")?.classList.add("btn-outline-primary");
  }

  if (mode === "diff") {
    document.getElementById("diffButton")?.classList.add("btn-secondary");
    document.getElementById("diffButton")?.classList.remove("btn-outline-secondary");
  } else {
    document.getElementById("diffButton")?.classList.remove("btn-secondary");
    document.getElementById("diffButton")?.classList.add("btn-outline-secondary");
  }
}

function setChangelogTab(tab: ChangelogTab) {
  currentChangelogTab = tab;

  const changelogTabs = document.getElementById("changelogTabs");
  if (changelogTabs) {
    changelogTabs.style.visibility = "visible";
  }

  if (tab === "raw") {
    document.getElementById("rawTab")?.classList.add("active");
  } else {
    document.getElementById("rawTab")?.classList.remove("active");
  }

  if (tab === "markdown") {
    document.getElementById("markdownTab")?.classList.add("active");
  } else {
    document.getElementById("markdownTab")?.classList.remove("active");
  }
}

function hideChangelogTabs() {
  const changelogTabs = document.getElementById("changelogTabs");
  if (changelogTabs) {
    changelogTabs.style.visibility = "hidden";
  }
}

type OutputMode = "changelog" | "detailed" | "diff"
type ChangelogTab = "raw" | "markdown"