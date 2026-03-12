import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '../components/TodoForm';

describe('TodoForm', () => {
  it('renders input and submit button', () => {
    render(
      <TodoForm
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TodoForm value="" onChange={onChange} onSubmit={vi.fn()} />
    );
    const input = screen.getByPlaceholderText('Add a new todo...');
    await user.type(input, 'test');
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('t'); // first keystroke
  });

  it('calls onSubmit when form is submitted', async () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    const user = userEvent.setup();
    render(
      <TodoForm
        value="New todo"
        onChange={vi.fn()}
        onSubmit={onSubmit}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
