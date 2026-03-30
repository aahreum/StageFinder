'use client';

import { useState, type KeyboardEvent } from 'react';

interface SearchInputProps {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className='px-4 py-2'>
      <div className='relative flex items-center'>
        <input
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='공연명 검색 후 엔터'
          className='w-full rounded-lg border border-border bg-transparent px-3 py-2 pr-8 text-sm outline-none placeholder:text-subtle focus:border-brand'
        />
        {inputValue && (
          <button
            type='button'
            onClick={handleClear}
            aria-label='검색어 초기화'
            className='absolute right-2 text-subtle hover:text-foreground'
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
