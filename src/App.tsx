// import { ipcRenderer } from 'electron';
import React, { Fragment, useEffect, useState } from 'react';
import ActionArea from './ActionArea';
import BillView from './BillView';
import InputArea from './InputArea';
import './styles/app.scss';

const App: React.FC = () => {
  const [selected, setSelected] = useState('none');
  const [title, setTitle] = useState('Press');

  function mapKeyToSelected(code: string) {
    switch (code) {
      case 'Digit1': return 'fruits';
      case 'Digit2': return 'juices';
      case 'Digit3': return 'others';
      case 'KeyV': return 'reports';
      default: return 'none';
    }
  }

  function setTitleAndSelected(value: string) {
    if (value === 'none') {
      setTitle('Press');
    } else {
      setTitle(`${value[0].toUpperCase()}${value.substring(1)}`);
    }
    setSelected(value);
  }

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (selected !== 'none' && selected !== 'reports') {
        return;
      }
      const { code } = event;
      event.preventDefault();
      const value = mapKeyToSelected(code);
      setTitleAndSelected(value);
    }
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [selected]);

  function handleChange(value: number) {
    if (value !== Infinity) {
      window.ipcRenderer.send('add-data', selected, value);
    }
    setTitleAndSelected('none');
  }

  function updateUI() {
    switch (selected) {
      case 'none':
        return (
        <Fragment>
          <ActionArea onSelect={setTitleAndSelected}/>
          <div className='action-cta'>
            <button
              className='view-report'
              onClick={() => setTitleAndSelected('reports')}
            >
                View Data <kbd>V</kbd>
            </button>
          </div>
        </Fragment>
      );
      case 'reports':
        return <BillView onBack={() => setTitleAndSelected('none')} />;
      default:
        return <InputArea name={selected} onChange={handleChange}/>;
    }
  }

  return (
    <div className='app'>
      <header className='header'>
        <h3 className='title'>Sri Ganesh Fruit Shop</h3>
      </header>
      <section className='action'>
        <h3 className='action-title'>{ title }</h3>
        { updateUI() }
      </section>
    </div>
  );
};

export default App;
