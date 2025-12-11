// import { jsPDF } from 'jspdf';
import { FIELDS, SECTIONS } from "../constants";
import { FormData } from "../types";

const generateFileName = (ext: string) => {
  const date = new Date().toISOString().split("T")[0];
  return `info_collection_${date}.${ext}`;
};

export const exportToCSV = (data: FormData) => {
  // CSV Header
  const headers = [
    "Category",
    "Field Key",
    "Question",
    "Is Sensitive",
    "Answer",
  ];

  // CSV Rows
  const rows = FIELDS.map((field) => {
    const sectionName =
      SECTIONS.find((s) => s.id === field.category)?.title || field.category;
    const value = (data[field.key] || "").replace(/"/g, '""'); // Escape quotes
    return `"${sectionName}","${field.key}","${field.label}","${field.isSensitive ? "Yes" : "No"}","${value}"`;
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = generateFileName("csv");
  link.click();
};

export const exportToMarkdown = (data: FormData) => {
  let content = `# Info Collection Report\n\n`;
  content += `**Date:** ${new Date().toLocaleDateString()}\n\n`;

  SECTIONS.forEach((section) => {
    const sectionFields = FIELDS.filter((f) => f.category === section.id);
    if (sectionFields.length === 0) return;

    content += `## ${section.title}\n\n`;

    sectionFields.forEach((field) => {
      const value = data[field.key] || "(Not provided)";
      const sensitiveMarker = field.isSensitive ? " `[SENSITIVE]`" : "";
      content += `### ${field.label}${sensitiveMarker}\n`;
      content += `${value}\n\n`;
    });
    content += `---\n\n`;
  });

  const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = generateFileName("md");
  link.click();
};

export const exportToPDF = (data: FormData) => {
  // Style for the print version
  const styles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap');
      body {
        font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
        padding: 40px;
        color: #1e293b;
        max-width: 800px;
        margin: 0 auto;
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      h1 { margin: 0; color: #0f172a; font-size: 24px; }
      .meta { color: #64748b; font-size: 12px; margin-top: 8px; }

      .section { margin-bottom: 25px; page-break-inside: avoid; }
      .section-header {
        background-color: #f1f5f9;
        padding: 8px 12px;
        font-weight: bold;
        font-size: 16px;
        border-radius: 4px;
        margin-bottom: 12px;
        color: #334155;
      }

      .field-row {
        display: flex;
        margin-bottom: 10px;
        border-bottom: 1px dotted #e2e8f0;
        padding-bottom: 4px;
      }
      .field-label {
        font-weight: 500;
        width: 40%;
        padding-right: 10px;
        color: #475569;
      }
      .field-value {
        width: 60%;
        color: #0f172a;
      }
      .sensitive { color: #dc2626; }
      .empty { color: #94a3b8; font-style: italic; }

      @media print {
        body { padding: 0; }
        .no-print { display: none; }
      }
    </style>
  `;

  // Build HTML Content
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Candidate Intake Form - Export</title>
      ${styles}
    </head>
    <body>
      <div class="header">
        <h1>Candidate Intake Form</h1>
        <div class="meta">Generated Report • ${new Date().toLocaleDateString()}</div>
      </div>
  `;

  let hasContent = false;

  SECTIONS.forEach((section) => {
    const sectionFields = FIELDS.filter((f) => f.category === section.id);
    if (sectionFields.length === 0) return;

    html += `
      <div class="section">
        <div class="section-header">${section.title}</div>
        <div class="fields">
    `;

    sectionFields.forEach((field) => {
      const value = data[field.key];
      const displayValue = value
        ? value.replace(/\n/g, "<br/>")
        : '<span class="empty">(Not provided)</span>';
      const sensitiveLabel = field.isSensitive
        ? ' <span class="sensitive">[SENSITIVE]</span>'
        : "";

      html += `
        <div class="field-row">
          <div class="field-label">${field.label}${sensitiveLabel}</div>
          <div class="field-value">${displayValue}</div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
    hasContent = true;
  });

  if (!hasContent) {
    html += '<p style="text-align:center; color:#999;">No data provided.</p>';
  }

  // Auto-print script
  html += `
    <script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
          // Optional: window.close() after print if desired, but keeping it open is usually better for UX
        }, 500);
      };
    </script>
    </body>
    </html>
  `;

  // Open in new window
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close(); // Ensure load event fires
  } else {
    alert("Pop-up blocked. Please allow pop-ups to print the report.");
  }
};
