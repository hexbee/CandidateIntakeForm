import React, { useState, useMemo } from "react";
import { FIELDS, SECTIONS, EXAMPLE_DATA } from "./constants";
import { FieldCategory, FormData } from "./types";
import FieldInput from "./components/FieldInput";
import {
  exportToCSV,
  exportToMarkdown,
  exportToPDF,
} from "./services/exportService";
import {
  FileText,
  Download,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<FieldCategory>("personal");
  const [formData, setFormData] = useState<FormData>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Handle Input Change
  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Fill Example Data
  const handleFillExample = () => {
    if (Object.keys(formData).length > 0) {
      if (
        !window.confirm("这将覆盖当前所有已填写的内容，确定要填入示例数据吗？")
      ) {
        return;
      }
    }
    setFormData(EXAMPLE_DATA);
    // Optional: Reset active section to start
    setActiveSection("personal");
    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  // Calculate Progress per section
  const sectionProgress = useMemo(() => {
    const progress: Record<
      string,
      { filled: number; total: number; complete: boolean }
    > = {};

    SECTIONS.forEach((section) => {
      const fields = FIELDS.filter((f) => f.category === section.id);
      const requiredFields = fields.filter((f) => !f.isOptional);
      const filledRequired = requiredFields.filter((f) =>
        formData[f.key]?.trim(),
      ).length;

      progress[section.id] = {
        filled: filledRequired,
        total: requiredFields.length,
        complete: filledRequired === requiredFields.length,
      };
    });
    return progress;
  }, [formData]);

  // Overall Completion
  const isFormValid = useMemo(() => {
    return Object.values(sectionProgress).every(
      (p: { complete: boolean }) => p.complete,
    );
  }, [sectionProgress]);

  // Handle Export Click
  const handleExport = (format: "csv" | "md" | "pdf") => {
    if (!isFormValid) {
      setShowErrors(true);
      alert(
        "请先完成所有必填项再导出 (Please complete all required fields before exporting)",
      );
      return;
    }

    switch (format) {
      case "csv":
        exportToCSV(formData);
        break;
      case "md":
        exportToMarkdown(formData);
        break;
      case "pdf":
        exportToPDF(formData);
        break;
    }
  };

  const getFieldError = (key: string, isOptional: boolean) => {
    if (!showErrors || isOptional) return undefined;
    if (!formData[key]?.trim()) return "此项为必填项";
    return undefined;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <ShieldCheck className="text-blue-600" />
          <span>Candidate Intake</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`
        fixed inset-0 z-10 bg-white border-r w-full md:w-72 md:relative transform transition-transform duration-200 ease-in-out
        ${mobileMenuOpen ? "translate-x-0 pt-20" : "-translate-x-full md:translate-x-0 md:pt-0"}
      `}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b hidden md:flex items-center gap-2 font-bold text-xl text-slate-800">
            <ShieldCheck className="text-blue-600" size={28} />
            <span>Candidate Intake</span>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {SECTIONS.map((section) => {
              const stats = sectionProgress[section.id];
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all border ${
                    isActive
                      ? "bg-blue-50 border-blue-200 ring-1 ring-blue-300"
                      : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`font-medium ${isActive ? "text-blue-700" : "text-slate-700"}`}
                    >
                      {section.title}
                    </span>
                    {stats.complete ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <span className="text-xs text-slate-400">
                        {stats.filled}/{stats.total}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {section.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${stats.complete ? "bg-green-500" : "bg-blue-500"}`}
                      style={{
                        width: `${(stats.filled / stats.total) * 100}%`,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="p-4 bg-slate-50 border-t space-y-4">
            {/* Test Data Button */}
            <button
              onClick={handleFillExample}
              className="w-full flex items-center justify-center p-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-colors"
            >
              <Sparkles size={16} className="mr-2" />
              一键填入示例数据 (Test)
            </button>

            <div>
              <div className="text-xs text-slate-500 mb-2 font-medium">
                导出选项 (Export)
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleExport("csv")}
                  className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200 rounded hover:border-blue-400 hover:text-blue-600 transition-colors"
                  title="Download CSV"
                >
                  <FileText size={16} />
                  <span className="text-[10px] mt-1 font-medium">CSV</span>
                </button>
                <button
                  onClick={() => handleExport("md")}
                  className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200 rounded hover:border-blue-400 hover:text-blue-600 transition-colors"
                  title="Download Markdown"
                >
                  <FileText size={16} />
                  <span className="text-[10px] mt-1 font-medium">MD</span>
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200 rounded hover:border-blue-400 hover:text-blue-600 transition-colors"
                  title="Download PDF"
                >
                  <FileText size={16} />
                  <span className="text-[10px] mt-1 font-medium">PDF</span>
                </button>
              </div>
            </div>

            {!isFormValid && showErrors && (
              <div className="text-xs text-red-600 flex items-center">
                <AlertTriangle size={12} className="mr-1" />
                请先完成所有必填项
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-60px)] md:h-screen overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {SECTIONS.find((s) => s.id === activeSection)?.title}
            </h1>
            <p className="text-slate-500">
              {SECTIONS.find((s) => s.id === activeSection)?.description}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            {FIELDS.filter((f) => f.category === activeSection).map((field) => (
              <FieldInput
                key={field.key}
                field={field}
                value={formData[field.key] || ""}
                onChange={(val) => handleInputChange(field.key, val)}
                error={getFieldError(field.key, field.isOptional)}
              />
            ))}

            {/* Navigation Buttons within Form */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={() => {
                  const idx = SECTIONS.findIndex((s) => s.id === activeSection);
                  if (idx > 0) setActiveSection(SECTIONS[idx - 1].id);
                }}
                disabled={
                  SECTIONS.findIndex((s) => s.id === activeSection) === 0
                }
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一步
              </button>

              <button
                onClick={() => {
                  const idx = SECTIONS.findIndex((s) => s.id === activeSection);
                  if (idx < SECTIONS.length - 1) {
                    setActiveSection(SECTIONS[idx + 1].id);
                  } else {
                    // If on last step, validate and show export hint
                    if (!isFormValid) {
                      setShowErrors(true);
                      alert("请检查侧边栏，完成所有红色标记的必填项。");
                    }
                  }
                }}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {SECTIONS.findIndex((s) => s.id === activeSection) ===
                SECTIONS.length - 1
                  ? "完成检查"
                  : "下一步"}
                {SECTIONS.findIndex((s) => s.id === activeSection) !==
                  SECTIONS.length - 1 && (
                  <ChevronRight size={16} className="ml-1" />
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
