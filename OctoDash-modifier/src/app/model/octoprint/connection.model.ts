/*
*@file printer.model.ts
*@author UnchartedBull
*@version 2 David Corriveau, mai 2023 - Ajout de l'interface connectionInfo.
*@brief Models pour les informations et la générations de la commande de la connexion entre OctoPrint et l'imprimante. Pour plus d'information
* sur les paramètres, allez sur le site de l'API d'OctoPrint: https://docs.octoprint.org/en/master/api/connection.html
*/
import { PrinterProfile } from "../printer-profile.model";

export interface ConnectCommand {
  command: string;
  port?: string;
  baudrate?: number;
  printerProfile?: string;
  save?: boolean;
  autoconnect?: boolean;
}
export interface connectionInfo{
  current: {
    state: string,
    port: string,
    baudrate: number,
    printerProfile: string
  },
  options: {
    ports: string[],
    baudrates: number[],
    printerProfiles: PrinterProfile,
    portPreference: string,
    baudratePreference: number,
    printerProfilePreference: string,
    autoconnect: boolean
  }
}
