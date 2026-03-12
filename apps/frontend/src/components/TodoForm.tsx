type TodoFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function TodoForm({ value, onChange, onSubmit }: TodoFormProps) {
  return (
    <form className="todo-form" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Add a new todo..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="New todo title"
      />
      <button type="submit">Add</button>
    </form>
  );
}
