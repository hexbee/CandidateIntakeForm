import { jsPDF } from 'jspdf';
import { FIELDS, SECTIONS } from '../constants';
import { FormData } from '../types';

const generateFileName = (ext: string) => {
  const date = new Date().toISOString().split('T')[0];
  return `info_collection_${date}.${ext}`;
};

export const exportToCSV = (data: FormData) => {
  // CSV Header
  const headers = ['Category', 'Field Key', 'Question', 'Is Sensitive', 'Answer'];
  
  // CSV Rows
  const rows = FIELDS.map(field => {
    const sectionName = SECTIONS.find(s => s.id === field.category)?.title || field.category;
    const value = (data[field.key] || '').replace(/"/g, '""'); // Escape quotes
    return `"${sectionName}","${field.key}","${field.label}","${field.isSensitive ? 'Yes' : 'No'}","${value}"`;
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = generateFileName('csv');
  link.click();
};

export const exportToMarkdown = (data: FormData) => {
  let content = `# Info Collection Report\n\n`;
  content += `**Date:** ${new Date().toLocaleDateString()}\n\n`;

  SECTIONS.forEach(section => {
    const sectionFields = FIELDS.filter(f => f.category === section.id);
    if (sectionFields.length === 0) return;

    content += `## ${section.title}\n\n`;
    
    sectionFields.forEach(field => {
      const value = data[field.key] || '(Not provided)';
      const sensitiveMarker = field.isSensitive ? ' `[SENSITIVE]`' : '';
      content += `### ${field.label}${sensitiveMarker}\n`;
      content += `${value}\n\n`;
    });
    content += `---\n\n`;
  });

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = generateFileName('md');
  link.click();
};

export const exportToPDF = (data: FormData) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Info Collection Report', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
  
  let yPos = 40;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 14;
  const lineHeight = 7;

  const checkPageBreak = (neededSpace: number) => {
    if (yPos + neededSpace > pageHeight - margin) {
      doc.addPage();
      yPos = 20;
    }
  };

  SECTIONS.forEach(section => {
    const sectionFields = FIELDS.filter(f => f.category === section.id);
    if (sectionFields.length === 0) return;

    checkPageBreak(20);
    
    // Section Header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos - 5, 180, 10, 'F');
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin + 2, yPos + 1);
    yPos += 12;

    sectionFields.forEach(field => {
      const value = data[field.key] || '(Not provided)';
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      if (field.isSensitive) {
        doc.setTextColor(185, 28, 28); // Red for sensitive
        doc.text(`${field.label} [SENSITIVE]:`, margin, yPos);
      } else {
        doc.setTextColor(60, 60, 60);
        doc.text(`${field.label}:`, margin, yPos);
      }
      
      const splitValue = doc.splitTextToSize(value, 170); // Wrap text
      const textHeight = splitValue.length * 5;
      
      checkPageBreak(textHeight + 10);
      
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0);
      doc.text(splitValue, margin, yPos);
      yPos += textHeight + 4; // Spacing between questions
    });
    
    yPos += 5; // Spacing between sections
  });

  doc.save(generateFileName('pdf'));
};
