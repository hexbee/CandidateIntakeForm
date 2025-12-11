import React from "react";
import { FieldConfig } from "../types";
import { Lock, AlertCircle } from "lucide-react";

interface FieldInputProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const FieldInput: React.FC<FieldInputProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const baseClasses =
    "w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
  const borderClasses = error
    ? "border-red-500 bg-red-50"
    : field.isSensitive
      ? "border-amber-300 bg-amber-50/30"
      : "border-slate-300 bg-white";

  const renderInput = () => {
    if (field.type === "textarea") {
      return (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "请输入..."}
          className={`${baseClasses} ${borderClasses}`}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} ${borderClasses}`}
        >
          <option value="">请选择</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || "请输入..."}
        className={`${baseClasses} ${borderClasses}`}
      />
    );
  };

  return (
    <div className="mb-5 group">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-slate-700">
          {field.label}
          {!field.isOptional && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {field.isSensitive && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
              <Lock size={12} className="mr-1" />
              敏感信息
            </span>
          )}
          {field.isOptional && (
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              可选
            </span>
          )}
        </div>
      </div>

      {renderInput()}

      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center">
          <AlertCircle size={12} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FieldInput;
