import React from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

export const ChatInput = ({ value, onChange, onSubmit, disabled }) => {
  return (
    <form onSubmit={onSubmit} className="p-3 border-t border-gray-200 flex gap-2 bg-white">
      <Input 
        value={value} 
        onChange={onChange} 
        placeholder="Ask anything about the research paper..." 
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || !value.trim()}>Send</Button>
    </form>
  );
};