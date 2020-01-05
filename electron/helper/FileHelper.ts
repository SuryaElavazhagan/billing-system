import electron, { ipcMain, IpcMainEvent } from 'electron';
import fs from 'fs';
import path from 'path';
import { AppInfo, BillTypes, DailyBill, MonthlyBill } from '../interfaces';

export class FileHelper {
  public static INSTANCE: FileHelper;

  public static getInstance() {
    if (this.INSTANCE === undefined) {
      this.INSTANCE = new FileHelper();
    }

    return this.INSTANCE;
  }

  private DEFAULT_DATA: DailyBill = {
    fruits: [],
    juices: [],
    others: [],
  };

  private constructor() {
    this.init();
    this.getAppInformation();
  }

  public init() {
    ipcMain.on('addData', async (_: IpcMainEvent, type: BillTypes, amount: number) =>  {
      await this.addData(type, amount);
    });

    ipcMain.on('get-bills', async (event: IpcMainEvent, filter?: string) => {
      const data = await this.getBillOfADay(filter);
      event.reply('get-bills-reply', data);
    });

    ipcMain.on('app-info', async (event: IpcMainEvent) => {
      const data = await this.getAppInformation();
      event.reply('app-info-reply', data);
    });
  }

  public async getBillOfAMonth(filter?: string): Promise<MonthlyBill> {
    const currentMonth = this.getCurrentParsedDateAndMonth()[1];
    const fileName = `${filter === undefined ? currentMonth : filter}.json`;
    const filePath = this.getFilePath(fileName);
    const json: MonthlyBill = {};

    try {
      await fs.promises.access(filePath);
      const bills = await fs.promises.readFile(filePath);
      return JSON.parse(bills.toString());
    } catch {
      await fs.promises.writeFile(filePath, JSON.stringify(json));
      return json;
    }
  }

  public async getBillOfADay(filter?: string): Promise<DailyBill> {
    // tslint:disable-next-line: prefer-const
    let [currentDate, currentMonth] = this.getCurrentParsedDateAndMonth();
    currentDate = filter ?? currentDate;

    const fileName = `${filter === undefined ? currentMonth : filter.substring(filter.indexOf('-'))}`;
    const json = await this.getBillOfAMonth(fileName);

    if (!(currentDate in json)) {
      json[currentDate] = this.DEFAULT_DATA;
      await fs.promises.writeFile(this.getFilePath(`${fileName}.json`), JSON.stringify(json));
    }

    return json[currentDate];
  }

  public async addData(type: BillTypes, amount: number) {
    const data: [number, number] = [+new Date(), amount];
    const currentMonthBill = await this.getBillOfAMonth();
    const [currentDate, currentMonth] = this.getCurrentParsedDateAndMonth();
    if (!(currentDate in currentMonthBill)) {
      currentMonthBill[currentDate] = this.DEFAULT_DATA;
    }
    currentMonthBill[currentDate][type].push(data);

    await fs.promises.writeFile(this.getFilePath(`${currentMonth}.json`), JSON.stringify(currentMonthBill));
  }

  public async getAppInformation(): Promise<AppInfo> {
    const filePath = this.getFilePath('info.json');
    try {
      await fs.promises.access(filePath);
      const info = await fs.promises.readFile(filePath);
      return JSON.parse(info.toString());
    } catch {
      const initalInfo: AppInfo = {
        installedDate: +new Date(),
      };
      await fs.promises.writeFile(filePath, JSON.stringify(initalInfo));
      return initalInfo;
    }
  }

  private getCurrentParsedDateAndMonth(): [string, string] {
    const date = new Date();
    const currentMonth = `${date.getMonth() + 1}-${date.getFullYear()}`;
    const currentDate = `${date.getDate()}-${currentMonth}`;
    return [currentDate, currentMonth];
  }

  private getFilePath(name: string): string {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    const filePath = path.join(userDataPath, name);
    if (filePath.includes('.json.json')) {
      console.log(filePath, name);
    }
    return filePath;
  }
}
