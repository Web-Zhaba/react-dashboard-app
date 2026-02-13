import { useState, useEffect } from 'react';
import WidgetContainer from '../WidgetContainer';
import useInput from '../../../hooks/useInput';
import SearchInput from '../../UI/SearchInput/SearchInput';
import ToDoItem from './parts/ToDoItem';
import {
  MdControlPoint,
} from 'react-icons/md';
import './ToDoWidget.css';

export default function ToDoWidget({ widgetId, onRemove }) {
  const {
    value: taskInput,
    onChange,
    reset: resetInput,
    isValid,
    errorMessage,
    touched,
  } = useInput('', { minLength: 2 });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(`todo-widget-${widgetId}`);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filter, setFilter] = useState('all'); // all, active, completed

  // Сохранение задач в localStorage
  useEffect(() => {
    localStorage.setItem(`todo-widget-${widgetId}`, JSON.stringify(tasks));
  }, [tasks, widgetId]);

  const addTask = () => {
    if (!isValid) return;

    const newTask = {
      id: Date.now(),
      text: taskInput.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    resetInput(); 
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTaskText = (taskId, newText) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, text: newText } : task
      )
    );
  };

  const moveTaskUp = (index) => {
    if (index === 0) return;
    setTasks((prev) => {
      const newTasks = [...prev];
      [newTasks[index], newTasks[index - 1]] = [
        newTasks[index - 1],
        newTasks[index],
      ];
      return newTasks;
    });
  };

  const moveTaskDown = (index) => {
    if (index === tasks.length - 1) return;
    setTasks((prev) => {
      const newTasks = [...prev];
      [newTasks[index], newTasks[index + 1]] = [
        newTasks[index + 1],
        newTasks[index],
      ];
      return newTasks;
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;

  return (
    <WidgetContainer
      title="Список дел"
      widgetId={widgetId}
      onRemove={onRemove}
    >
      <div className="todo-widget-content">
        {/* Поле ввода */}
        <div className="todo-input-container mb-4">
          <SearchInput 
            value={taskInput}
            onChange={onChange}
            isValid={isValid}
            touched={touched}
            errorMessage={errorMessage}
            placeholder="Введите новую задачу..."
            buttonText="Добавить"
            buttonAriaLabel="Добавить задачу"
            icon={<MdControlPoint className="w-5 h-5 sm:w-6 sm:h-6" />}
            onSubmit={addTask}
          />
        </div>

        {/* Фильтры */}
        <div className="flex gap-1 mb-4">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1 text-xs rounded transition-colors ${
                filter === f ? 'bg-accent-dark text-white' : 'bg-gray-800 text-sub-text-dark hover:bg-gray-700'
              }`}
            >
              {f === 'all' ? 'Все' : f === 'active' ? 'Активные' : 'Готово'}
            </button>
          ))}
        </div>

        {/* Статистика */}
        <div className="todo-stats mb-4 p-3 bg-background-dark rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm">Всего: {totalCount}</span>
            <span className="text-sm">
              Выполнено: {completedCount}
            </span>
            {totalCount > 0 && (
              <span className="text-sm text-accent-dark font-medium">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            )}
          </div>
          {totalCount > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-accent-dark h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Список задач */}
        {filteredTasks.length === 0 ? (
          <div className="empty-tasks text-center py-8 text-sub-text-dark">
            <p className="mb-2">Нет задач</p>
            <p className="text-sm">{filter !== 'all' ? 'В этом списке пусто' : 'Добавьте первую задачу выше'}</p>
          </div>
        ) : (
          <ul className="todo-list space-y-2 max-h-60 overflow-y-auto pr-1 scroll">
            {filteredTasks.map((task, index) => (
              <ToDoItem
                key={task.id}
                task={task}
                index={index}
                isLast={index === filteredTasks.length - 1}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onMoveUp={moveTaskUp}
                onMoveDown={moveTaskDown}
                onEdit={updateTaskText}
              />
            ))}
          </ul>
        )}
      </div>
    </WidgetContainer>
  );
}
