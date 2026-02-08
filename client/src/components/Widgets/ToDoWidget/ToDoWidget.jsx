import { useState, useEffect } from 'react';
import WidgetContainer from '../WidgetContainer';
import useInput from '../../../hooks/useInput';
import { 
  MdControlPoint, 
  MdCheckBoxOutlineBlank, 
  MdCheckBox 
} from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import './ToDoWidget.css'

export default function ToDoWidget ({ widgetId, onRemove }) {
    const { value: taskInput, onChange, reset: resetInput } = useInput('');
    const [tasks, setTasks] = useState([]);

    // Загрузка задач из localStorage
    useEffect(() => {
        const savedTasks = localStorage.getItem(`todo-widget-${widgetId}`);
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, [widgetId]);
    
    // Сохранение задач в localStorage
    useEffect(() => {
        localStorage.setItem(`todo-widget-${widgetId}`, JSON.stringify(tasks));
    }, [tasks, widgetId]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    };

    const addTask = () => {
        if (taskInput.trim() === '') return;
        const newTask = {
            id: Date.now(),
            text: taskInput.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        setTasks(prev => [...prev, newTask]);
        resetInput();
    }

    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    };

    const toggleTask = (taskId) => {
        setTasks(prev => prev.map(task => 
            task.id === taskId 
                ? { ...task, completed: !task.completed }
                : task
        ));
    };

    const moveTaskUp = (index) => {
        if (index === 0) return;
        setTasks(prev => {
            const newTasks = [...prev];
            [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
            return newTasks;
        });
    };
    
    const moveTaskDown = (index) => {
        if (index === tasks.length - 1) return;
        setTasks(prev => {
            const newTasks = [...prev];
            [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
            return newTasks;
        });
    };

    const completedCount = tasks.filter(task => task.completed).length;
    const totalCount = tasks.length;
    
    return (
        <WidgetContainer
            title="Список дел" 
            widgetId={widgetId}
            onRemove={onRemove}
        >
            <div className="todo-widget-content">
                {/* Поле ввода для новой задачи */}
                <div className="todo-input-container mb-4">
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={taskInput}
                            onChange={onChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Введите новую задачу..."
                            className="grow p-2 border border-accent-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-dark"
                        />
                        <button 
                            onClick={addTask}
                            className="px-4 py-2 bg-accent-dark text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                            aria-label="Добавить задачу"
                        >
                            <MdControlPoint className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="hidden sm:inline">Добавить</span>
                        </button>
                    </div>
                </div>
                
                {/* Статистика */}
                <div className="todo-stats mb-4 p-3 bg-background-dark rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">
                            Всего задач: {totalCount}
                        </span>
                        <span className="text-sm">
                            Выполнено: {completedCount} из {totalCount}
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
                {tasks.length === 0 ? (
                    <div className="empty-tasks text-center py-8 text-sub-text-dark">
                        <p className="mb-2">Нет задач</p>
                        <p className="text-sm">Добавьте первую задачу выше</p>
                    </div>
                ) : (
                    <ul className="todo-list space-y-2 max-h-60 overflow-y-auto">
                        {tasks.map((task, index) => (
                            <li 
                                key={task.id}
                                className={`todo-item flex items-center gap-3 p-3 rounded-lg transition-all ${
                                    task.completed 
                                        ? 'bg-gray-800/60' 
                                        : 'bg-background-dark'
                                }`}
                            >
                                {/* Чекбокс выполнения */}
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className="shrink-0"
                                    aria-label={task.completed ? "Отметить как невыполненное" : "Отметить как выполненное"}
                                >
                                    {task.completed ? (
                                        <MdCheckBox className="w-6 h-6 text-accent-dark" />
                                    ) : (
                                        <MdCheckBoxOutlineBlank className="w-6 h-6 text-sub-text-dark" />
                                    )}
                                </button>
                                
                                {/* Текст задачи */}
                                <div className="flex-1 min-w-0">
                                    <span 
                                        className={`block wrap-break-word whitespace-normal text-sm ${
                                            task.completed 
                                                ? 'line-through text-gray-500' 
                                                : 'text-white'
                                        }`}
                                    >
                                        {task.text}
                                    </span>
                                    {task.createdAt && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(task.createdAt).toLocaleDateString('ru-RU', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    )}
                                </div>
                                {/* Управление */}
                                <div className="flex gap-1 shrink-0">
                                    <button
                                        onClick={() => moveTaskUp(index)}
                                        disabled={index === 0}
                                        className={`p-1 rounded ${
                                            index === 0 
                                                ? 'text-gray-600 cursor-not-allowed' 
                                                : 'text-sub-text-dark hover:bg-gray-600'
                                        }`}
                                        aria-label="Переместить вверх"
                                    >
                                        <IoMdArrowUp className="w-5 h-5" />
                                    </button>
                                    
                                    <button
                                        onClick={() => moveTaskDown(index)}
                                        disabled={index === tasks.length - 1}
                                        className={`p-1 rounded ${
                                            index === tasks.length - 1 
                                                ? 'text-gray-600 cursor-not-allowed' 
                                                : 'text-sub-text-dark hover:bg-gray-600'
                                        }`}
                                        aria-label="Переместить вниз"
                                    >
                                        <IoMdArrowDown className="w-5 h-5" />
                                    </button>
                                    
                                    <button 
                                        onClick={() => deleteTask(task.id)}
                                        className="p-1 text-red-500 hover:bg-gray-600 rounded"
                                        aria-label="Удалить задачу"
                                    >
                                        <FaTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                
                {/* Подсказка */}
                {tasks.length < 0 && (
                    <div className="mt-4 text-xs text-sub-text-dark text-center">
                        <p>Добавьте задачу, нажав Enter или кнопку "Добавить"</p>
                    </div>
                )}
            </div>
        </WidgetContainer>
    );
};