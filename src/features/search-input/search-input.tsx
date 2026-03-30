'use client';

import { useState } from 'react';

interface SearchInputProps {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className='px-4 py-2'>
      <div className='relative flex items-center'>
        <input
          type='text'
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            // 입력값이 비면 즉시 검색 초기화
            if (e.target.value === '') onSearch('');
          }}
          placeholder='공연명 검색 후 엔터'
          className='w-full rounded-lg border border-border bg-transparent px-3 py-2 pr-8 text-sm outline-none placeholder:text-subtle focus:border-brand'
        />
        {inputValue && (
          <button
            type='button'
            onClick={handleClear}
            aria-label='검색어 초기화'
            className='absolute right-2 text-subtle hover:text-foreground'>
            ✕
          </button>
        )}
      </div>
    </form>
  );
}
