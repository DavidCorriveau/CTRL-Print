/*
*@file printer.model.ts
*@author David Corriveau
*@date Avril 2023
*@brief Fichier contenant des interfaces pour les informations de l'imprimante
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
