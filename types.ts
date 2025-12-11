export type FieldCategory = 
  | 'personal' 
  | 'professional' 
  | 'preferences' 
  | 'financial_legal' 
  | 'meta';

export interface FieldConfig {
  key: string;
  label: string;
  category: FieldCategory;
  isSensitive: boolean;
  isOptional: boolean;
  placeholder?: string;
  type?: 'text' | 'date' | 'number' | 'textarea' | 'select' | 'email' | 'tel';
  options?: string[]; // For select inputs
}

export interface FormData {
  [key: string]: string;
}

export interface SectionMeta {
  id: FieldCategory;
  title: string;
  description: string;
}
