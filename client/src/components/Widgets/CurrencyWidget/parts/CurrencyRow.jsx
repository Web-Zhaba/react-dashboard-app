import { memo } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const CurrencyRow = ({ label, rate, previous }) => {
  const trend = (current, previousValue) => {
    if (current > previousValue) return (<FaArrowUp className="inline text-green-500 w-3 h-3 sm:w-4 sm:h-4" />);
    if (current < previousValue) return (<FaArrowDown className="inline text-red-500 w-3 h-3 sm:w-4 sm:h-4" />);
    return null;
  };

  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-background-dark rounded-lg'>
      <div className='text-sm sm:text-base font-medium'>{label}</div>
      <div className='flex items-center justify-between sm:justify-end sm:gap-4'>
        <span className='text-lg sm:text-xl font-bold'>{rate.toFixed(2).replace('.', ',')}₽</span>
        <span className='flex items-center text-sub-text-dark text-xs sm:text-sm'>
          {trend(rate, previous)}
          <span className='ml-1'>{previous.toFixed(2).replace('.', ',')}₽</span>
        </span>
      </div>
    </div>
  );
};

export default memo(CurrencyRow);
