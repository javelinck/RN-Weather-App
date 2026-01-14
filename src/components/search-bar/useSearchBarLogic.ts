import { useState } from 'react';

export const useSearchBarLogic = (onSubmit: (query: string) => void) => {
  const [value, setValue] = useState('');

  const handleSubmitEditing = () => {
    if (value) {
      onSubmit(value);
      setValue('');
    }
  };

  return {
    value,
    setValue,
    handleSubmitEditing,
  };
};
