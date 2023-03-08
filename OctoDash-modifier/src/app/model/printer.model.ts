export interface PrinterStatus {
  status: PrinterState;
  bed: Temperature;
  tool0: Temperature;
  fanSpeed: number;
}

export interface Temperature {
  current: number;
  set: number;
  min: number;
  max: number;
}

export enum PrinterState {
  operational,
  pausing,
  paused,
  printing,
  cancelling,
  closed,
  connecting,
  reconnecting,
  socketDead,
}
