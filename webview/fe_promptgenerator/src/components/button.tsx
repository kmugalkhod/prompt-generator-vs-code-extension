import { ReactElement } from "react";

interface ButtonProps {
  text: string;
  startIcon?: ReactElement;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  startIconVisible?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

interface DropdownProps{
  options : {value : string ; label : string}[];
  onChange: (value: string) => void;
}

export function Button({
  text,
  startIcon,
  variant = 'primary',
  size = 'md',
  startIconVisible,
  onClick,
  disabled
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all";
  
  const variantStyles = {
    primary: "bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)] text-[var(--vscode-button-foreground)]",
    secondary: "bg-[var(--vscode-button-secondaryBackground)] hover:bg-[var(--vscode-button-secondaryHoverBackground)] text-[var(--vscode-button-secondaryForeground)]",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIconVisible && startIcon && (
        <span className="mr-2">{startIcon}</span>
      )}
      {text}
    </button>
  );
}

export function Dropdown({ options, onChange }: DropdownProps) {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-md
        bg-[var(--vscode-input-background)]
        text-[var(--vscode-input-foreground)]
        border border-[var(--vscode-input-border)]
        focus:outline-none focus:ring-2 
        focus:ring-[var(--vscode-focusBorder)]"
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
