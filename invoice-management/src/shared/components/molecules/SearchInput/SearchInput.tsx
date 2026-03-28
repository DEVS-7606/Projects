import { Input } from "@/shared/components/atoms/Input";
import { Loader2, Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isSearching?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  isSearching = false,
}: SearchInputProps) {
  return (
    <Input
      icon={
        isSearching ? (
          <Loader2 size={16} className="animate-spin text-[#3b82f6]" />
        ) : (
          <Search size={16} />
        )
      }
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}
