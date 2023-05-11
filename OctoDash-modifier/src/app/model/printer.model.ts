/*
*@file printer.model.ts
*@author UnchartedBull
*@version 2 David Corriveau, mai 2023 - Ajout de l'interface Temperature
*@brief Models pour les informations de l'imprimante.
*/
export interface PrinterStatus {
  status: PrinterState;
  bed: Temperature;
  tool0: Temperature;
  fanSpeed: number;
}

// Interface contenant chaque propriété de la Température
export interface Temperature {
  current: number;  // Température courrante
  set: number;  // Température voulu
  min: number;  // Température minimale
  max: number;  // Température maximum
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
