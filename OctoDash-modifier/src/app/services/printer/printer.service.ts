/*
*@file printer.service.ts
*@author UnchartedBull
*@version 2 David Corriveau, mai 2023 - Ajout des méthodes pour récupérer les options et configurer la connexion entre OctoPrint et l'imprimante.
* Ajout de l'entête du fichier.
*@brief Classe qui permet de configuration l'application OctoPrint. On peut changer les températures, exécuter des commandes GCODE, agir sur
* l'extrudeur, etc.
*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PrinterProfile } from '../../model';
import { connectionInfo } from '../../model/octoprint';

@Injectable()
export abstract class PrinterService {
  abstract getCurrentConnection(): Observable<connectionInfo>;

  abstract setConnection(port: string, baudrate: number): void;

  abstract getActiveProfile(): Observable<PrinterProfile>;

  abstract saveToEPROM(): void;

  abstract executeGCode(gCode: string): void;

  abstract jog(x: number, y: number, z: number): void;

  abstract extrude(amount: number, speed: number): void;

  abstract setTemperatureHotend(temperature: number): void;

  abstract setTemperatureBed(temperature: number): void;

  abstract setFanSpeed(percentage: number): void;

  abstract setFeedrate(feedrate: number): void;

  abstract setFlowrate(flowrate: number): void;

  abstract disconnectPrinter(): void;

  abstract emergencyStop(): void;
}
