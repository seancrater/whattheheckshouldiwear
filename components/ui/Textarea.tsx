import type { TextareaProps } from "@/types";

export default function Textarea({ rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      {...props}
      className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-shadow resize-none ${props.className || ''}`}
    />
  );
}