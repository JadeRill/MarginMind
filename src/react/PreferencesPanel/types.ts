export type BaseSettings = {
  annotationColor: string;
  markdownFontSize: string;
};

export type CacheFileItem = {
  id: string;
  name: string;
  size: number;
  modified: Date;
};

export const FONT_SIZE_OPTIONS = [
  { value: "text-[12px]", label: "12px" },
  { value: "text-[14px]", label: "14px (Default)" },
  { value: "text-[16px]", label: "16px" },
  { value: "text-[18px]", label: "18px" },
  { value: "text-[20px]", label: "20px" },
  { value: "text-[22px]", label: "22px" },
  { value: "text-[24px]", label: "24px" },
] as const;

export const DEFAULT_BASE_SETTINGS: BaseSettings = {
  annotationColor: "#8000ff",
  markdownFontSize: "text-[14px]",
};
