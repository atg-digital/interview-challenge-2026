import type { Todo } from '../types';
import { TodoCard } from './TodoCard';

type TodoGridProps = {
  todos: Todo[];
  loading: boolean;
  searchQuery: string;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
};

export function TodoGrid({
  todos,
  loading,
  searchQuery,
  onToggle,
  onDelete,
}: TodoGridProps) {
  if (loading) {
    return <p className="empty-state">Loading...</p>;
  }

  if (todos.length === 0) {
    return (
      <p className="empty-state">
        {searchQuery.trim()
          ? 'No todos match your search.'
          : 'No todos yet. Add one above!'}
      </p>
    );
  }

  return (
    <div className="todo-grid">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
