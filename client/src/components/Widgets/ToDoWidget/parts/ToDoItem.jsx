import { memo, useState } from 'react';
import { 
  MdDeleteOutline, 
  MdKeyboardArrowUp, 
  MdKeyboardArrowDown,
  MdEdit,
  MdCheck,
  MdClose
} from 'react-icons/md';

/**
 * Компонент элемента списка задач
 */
const ToDoItem = memo(({ 
  task, 
  index, 
  isLast, 
  onToggle, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(task.text);
  };

  const handleSave = () => {
    if (editText.trim() && editText !== task.text) {
      onEdit(task.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(task.text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <li
      className={`todo-item group flex items-center gap-2 p-2 rounded-lg transition-all ${
        task.completed ? 'bg-gray-800/60' : 'bg-background-dark'
      }`}
    >
      {/* Чекбокс */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-4 h-4 rounded border-gray-600 text-accent-dark focus:ring-accent-dark cursor-pointer"
      />

      {/* Текст задачи или поле редактирования */}
      <div className="flex-1 min-w-0 flex flex-col">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-background-dark text-white text-sm border-b border-accent-dark outline-none py-0.5"
            />
            <button onClick={handleSave} className="text-green-500 hover:text-green-400">
              <MdCheck size={18} />
            </button>
            <button onClick={handleCancel} className="text-red-500 hover:text-red-400">
              <MdClose size={18} />
            </button>
          </div>
        ) : (
          <>
            <span
              className={`text-sm wrap-break-word whitespace-normal cursor-pointer ${
                task.completed ? 'line-through text-sub-text-dark' : 'text-white'
              }`}
              onDoubleClick={handleEdit}
              title="Двойной клик для редактирования"
            >
              {task.text}
            </span>
            <span className="text-[10px] text-sub-text-dark italic mt-0.5">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </>
        )}
      </div>

      {/* Кнопки управления */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="p-1 text-sub-text-dark hover:text-accent-dark transition-colors"
            title="Редактировать"
          >
            <MdEdit size={16} />
          </button>
        )}
        <button
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          className="p-1 text-sub-text-dark hover:text-white disabled:opacity-30 transition-colors"
          title="Переместить вверх"
        >
          <MdKeyboardArrowUp size={20} />
        </button>
        <button
          onClick={() => onMoveDown(index)}
          disabled={isLast}
          className="p-1 text-sub-text-dark hover:text-white disabled:opacity-30 transition-colors"
          title="Переместить вниз"
        >
          <MdKeyboardArrowDown size={20} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-sub-text-dark hover:text-red-500 transition-colors"
          title="Удалить"
        >
          <MdDeleteOutline size={20} />
        </button>
      </div>
    </li>
  );
});

ToDoItem.displayName = 'ToDoItem';

export default ToDoItem;
