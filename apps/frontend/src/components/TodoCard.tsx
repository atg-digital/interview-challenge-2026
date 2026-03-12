import type { Todo } from '../types';

type TodoCardProps = {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
};

function getImageSrc(todo: Todo): string {
  const imgHeight = 60 + (todo.id.charCodeAt(0) % 3) * 25;
  return (
    todo.imageUrl ??
    `https://picsum.photos/seed/${todo.id}/80/${imgHeight}`
  );
}

export function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  return (
    <div
      className={`todo-card ${todo.completed ? 'completed' : ''}`}
    >
      <img src={getImageSrc(todo)} alt="image" />
      <span className="todo-card-title">{todo.title}</span>
      <div className="todo-card-actions">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.title}"`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
