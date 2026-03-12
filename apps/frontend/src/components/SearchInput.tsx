type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <input
      type="search"
      placeholder="Search todos..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search todos by title"
      className="search-input"
    />
  );
}
