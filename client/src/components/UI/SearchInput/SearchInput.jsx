import { memo } from 'react';

function SearchInput({
  value,
  onChange,
  isValid,
  touched,
  placeholder = '',
  buttonText = '',
  buttonAriaLabel = '',
  icon = null,
  onSubmit,
  onEnterPress,
  errorMessage = ''
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) {
      const fn = onEnterPress || onSubmit;
      if (fn) fn();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 items-start">
        <div className="grow">
          <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
              touched && !isValid
                ? 'border-red-500 focus:ring-red-500'
                : 'border-accent-dark focus:ring-accent-dark'
            }`}
          />
          {touched && !isValid && errorMessage && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
        <button
          onClick={onSubmit}
          disabled={!isValid || !value.trim()}
          className="px-4 py-2 bg-accent-dark text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={buttonAriaLabel}
        >
          {icon}
          <span className="hidden sm:inline">{buttonText}</span>
        </button>
      </div>
    </div>
  );
}

export default memo(SearchInput);
