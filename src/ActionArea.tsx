import React from 'react';
import { ReactSVG } from 'react-svg';
import './styles/action-area.scss';

interface ActionAreaProps {
  onSelect: (value: string) => void;
}

const ActionArea: React.FC<ActionAreaProps> = (props) => {
  return (
    <div className='action-area'>
      <div className='action-types' onClick={() => props.onSelect('fruits')}>
        <ReactSVG  src='./icons/one.svg'/>
        <span>Fruits</span>
      </div>
      <div className='action-types' onClick={() => props.onSelect('juice')}>
        <ReactSVG  src='./icons/two.svg'/>
        <span>Juice</span>
      </div>
      <div className='action-types' onClick={() => props.onSelect('others')}>
        <ReactSVG  src='./icons/three.svg'/>
        <span>Others</span>
      </div>
    </div>
  );
};

export default ActionArea;
