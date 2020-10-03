import { IpcRendererEvent } from 'electron';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AppInfo, DailyBill } from '../electron/interfaces';
import { generatePieChart } from './charts/pie';
import './styles/bill-view.scss';

interface BillViewProps {
  onBack: () => void;
}

const BillView: React.FC<BillViewProps> = (props) => {
  const EMPTY_DATA: DailyBill = {
    fruits: [],
    juices: [],
    others: [],
  };

  const [startDate, setStartDate] = useState(new Date());
  const [filter, setFilter] = useState(new Date());
  const [bills, setBills] = useState<DailyBill>(EMPTY_DATA);

  useEffect(() => {
    window.ipcRenderer.send('get-bills');
    window.ipcRenderer.send('app-info');

    window.ipcRenderer.on('get-bills-reply', (event: IpcRendererEvent, bill: DailyBill) => {
      setBills(bill);
    });

    window.ipcRenderer.on('app-info-reply', (event: IpcRendererEvent, info: AppInfo) => {
      setStartDate(new Date(info.installedDate));
    });

    return () => {
      window.ipcRenderer.removeAllListeners('get-bills-reply');
      window.ipcRenderer.removeAllListeners('app-info-reply');
    };
  }, []);

  function renderTable() {
    let totalFruits = 0;
    let totalJuice = 0;
    let totalOthers = 0;
    const rows = [];
    const highestSelling = Math.max(
      bills.fruits.length,
      bills.juices.length,
      bills.others.length,
    );

    for (let i = 0; i < highestSelling; i++) {
      const f = bills.fruits[i] !== undefined ? bills.fruits[i][1] : 0;
      const j = bills.juices[i] !== undefined ? bills.juices[i][1] : 0;
      const o = bills.others[i] !== undefined ? bills.others[i][1] : 0;
      totalFruits += f;
      totalJuice += j;
      totalOthers += o;

      rows.push(
        <tr key={`${highestSelling}:${i}`}>
          <td>{ i + 1 }</td>
          <td>{ f }</td>
          <td>{ j }</td>
          <td>{ o }</td>
        </tr>,
      );
    }

    rows.push(
      <tr key='total' className='bill-total'>
        <td>Total</td>
        <td>{ totalFruits }</td>
        <td>{ totalJuice }</td>
        <td>{ totalOthers }</td>
      </tr>,
    );
    const ref = document.getElementById('chart-area');
    if (ref !== null) {
      generatePieChart([totalFruits, totalJuice, totalOthers], ref);
    }
    return rows;
  }

  async function handleFilterChange(date: Date | null) {
    if (date !== null) {
      setFilter(date);
      window.ipcRenderer.send('get-bills', `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`);
    }
  }

  return (
    <div className='bill-view'>
      <div className='filter-bar'>
        <svg
          className='back-icon'
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          onClick={() => props.onBack()}
        >
        <path d='M0 0h24v24H0z' fill='none'/>
        <path d='M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z'/>
      </svg>
        <h5>Select a date: </h5>
        <DatePicker
          selected={filter}
          minDate={startDate}
          onChange={handleFilterChange}
        />
      </div>
      <div id="chart-area"></div>
      <table className='bill-table'>
        <thead>
          <tr>
            <th>S.no</th>
            <th>Fruits</th>
            <th>Juices</th>
            <th>Others</th>
          </tr>
        </thead>
        <tbody>
          { renderTable() }
        </tbody>
      </table>
    </div>
  );
};

export default BillView;
