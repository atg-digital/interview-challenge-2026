import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoCard } from '../components/TodoCard';

describe('TodoCard', () => {
  const defaultTodo = {
    id: 'todo-1',
    title: 'Buy groceries',
    completed: false,
    createdAt: new Date().toISOString(),
  };

  it('renders todo title', () => {
    render(
      <TodoCard
        todo={defaultTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('shows checkbox checked when todo is completed', () => {
    render(
      <TodoCard
        todo={{ ...defaultTodo, completed: true }}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    const checkbox = screen.getByRole('checkbox', {
      name: /mark "buy groceries" as incomplete/i,
    });
    expect(checkbox).toBeChecked();
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <TodoCard
        todo={defaultTodo}
        onToggle={onToggle}
        onDelete={vi.fn()}
      />
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('todo-1', true);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <TodoCard
        todo={defaultTodo}
        onToggle={vi.fn()}
        onDelete={onDelete}
      />
    );
    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('todo-1');
  });
});
