import React from "react";

export interface FormField {
  name: string;
  label: string;
  icon: React.ReactNode;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[] | string[];
  tip?: string;
  maxLength?: number;
  colSpan?: 1 | 2;
  group?: string;
  action?: { label: string; onClick: (setFormData: Function) => void; icon: React.ReactNode };
}
