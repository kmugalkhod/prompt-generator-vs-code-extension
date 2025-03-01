interface TextAreaProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export function TextArea({ 
  value, 
  onChange, 
  placeholder = "Describe your task...",
  disabled = false,
  rows = 8
}: TextAreaProps) {
  return (
    <textarea
      className="w-full px-3 py-2 text-sm rounded-md
        bg-[var(--vscode-input-background)]
        text-[var(--vscode-input-foreground)]
        border border-[var(--vscode-input-border)]
        focus:outline-none focus:ring-2 
        focus:ring-[var(--vscode-focusBorder)]
        placeholder-[var(--vscode-input-placeholderForeground)]
        disabled:opacity-50 disabled:cursor-not-allowed
        resize-y min-h-[150px]"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
    />
  );
}