export type BillTypes = 'fruits' | 'juices' | 'others';
export type DailyBill = Record<BillTypes, Array<[number, number]>>;
export type MonthlyBill = Record<string, DailyBill>;

export interface AppInfo {
  installedDate: number;
}
