import React from 'react';
import './styles/input-area.scss';

interface InputAreaProps {
  name: string;
  onChange: (event: number) => void;
}

const InputArea: React.FC<InputAreaProps> = (props: InputAreaProps) => {
  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    event.stopPropagation();
    const code = event.key;
    if  (code === 'Enter') {
      props.onChange(+event.currentTarget.value);
    }
  }

  return (
    <div className='input-area'>
      <svg
        className='back-icon'
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        onClick={() => props.onChange(Infinity)}
      >
        <path d='M0 0h24v24H0z' fill='none'/>
        <path d='M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z'/>
      </svg>
      <div className='input-wrapper'>
        <span className='input-symbol'>₹</span>
        <input
          type='number'
          autoFocus
          className='input-field'
          placeholder='Enter value Ex: ₹ 500'
          onKeyPress={handleKeyPress}
        />
      </div>
      <button className='submit'>Submit</button>
    </div>
  );
};

export default InputArea;
