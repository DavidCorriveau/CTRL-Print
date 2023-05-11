/*
*@file printer.octoprint.service.ts
*@author UnchartedBull
*@version 2 David Corriveau, mai 2023 - Ajout des définitions des méthodes pour récupérer les options et configurer la connexion entre OctoPrint et l'imprimante.
* Ajout de l'entête du fichier.
*@brief Classe qui définit les méthodes qui permet de configuration l'application OctoPrint. On peut changer les températures, exécuter des commandes GCODE, agir sur
* l'extrudeur, etc.
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ConfigService } from '../../config/config.service';
import { NotificationType, PrinterProfile, } from '../../model';
import { connectionInfo } from '../../model/octoprint';
import {
  DisconnectCommand,
  ExtrudeCommand,
  FeedrateCommand,
  GCodeCommand,
  JogCommand,
  OctoprintPrinterProfiles,
  TemperatureHeatbedCommand,
  TemperatureHotendCommand,
  ConnectCommand,
} from '../../model/octoprint';
import { NotificationService } from '../../notification/notification.service';
import { PrinterService } from './printer.service';

@Injectable()
export class PrinterOctoprintService implements PrinterService {
  public constructor(
    private configService: ConfigService,
    private notificationService: NotificationService,
    private http: HttpClient,
  ) {}

  /*
  *@brief: Méthode qui récupère les infomation de connexions entre OctoPrint et l'imprimante
  *@param: aucun
  *@return: les informations de connexions
  */
  public getCurrentConnection(): Observable<connectionInfo> {
   return this.http // Requête HTTP pour aller récupérer les informations de connexions
    .get<connectionInfo>(
      this.configService.getApiURL('connection'),
      this.configService.getHTTPHeaders(),
    )
  }

  /*
  *@brief: Méthode qui configure la connexion entre OctoPrint et l'imprimante
  *@param: port: le nom du port désiré
  *@param: bauderate: le bauderate désiré
  *@return: rien
  */
  public setConnection(port: string, baudrate: number): void {
    const disconnectCommand: ConnectCommand = { // Création de la commande pour déconnecter la connexion actuelle
      command: "disconnect"
    };
    const connectionCommand: ConnectCommand = { // Création de la commande pour la nouvelle connexion
      command: "connect",
      port: port,
      baudrate: baudrate,
    };
    // Arrête la connecion actuelle pour pouvoir changer les paramètres de connexions par après
    this.http.post(this.configService.getApiURL('connection'), disconnectCommand ,this.configService.getHTTPHeaders()).subscribe(); 
    // Démarre une connexion avec les nouveaux paramètres
    this.http.post(this.configService.getApiURL('connection'), connectionCommand ,this.configService.getHTTPHeaders()).subscribe(); 
  }

  public getActiveProfile(): Observable<PrinterProfile> {
    return this.http
      .get<OctoprintPrinterProfiles>(
        this.configService.getApiURL('printerprofiles'),
        this.configService.getHTTPHeaders(),
      )
      .pipe(
        map(profiles => {
          for (const profile of Object.values(profiles.profiles)) {
            if (profile.current) return profile;
          }
        }),
      );
  }

  saveToEPROM(): void {
    this.executeGCode('M500');
  }

  public executeGCode(gCode: string): void {
    const gCodePayload: GCodeCommand = {
      commands: gCode.split('; '),
    };
    this.http
      .post(this.configService.getApiURL('printer/command'), gCodePayload, this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@printer-error-gcode:Can't send GCode!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public jog(x: number, y: number, z: number): void {
    const jogPayload: JogCommand = {
      command: 'jog',
      x: this.configService.isXAxisInverted() ? x * -1 : x,
      y: this.configService.isYAxisInverted() ? y * -1 : y,
      z: this.configService.isZAxisInverted() ? z * -1 : z,
      speed: z !== 0 ? this.configService.getZSpeed() * 60 : this.configService.getXYSpeed() * 60,
    };
    this.http
      .post(this.configService.getApiURL('printer/printhead'), jogPayload, this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-printer-head:Can't move Printhead!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  private moveExtruder(amount: number, speed: number): void {
    const extrudePayload: ExtrudeCommand = {
      command: 'extrude',
      amount,
      speed: speed * 60,
    };
    this.http
      .post(this.configService.getApiURL('printer/tool'), extrudePayload, this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-printer-extrude:Can't extrude Filament!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public setTemperatureHotend(temperature: number): void {
    const temperatureHotendCommand: TemperatureHotendCommand = {
      command: 'target',
      targets: {
        tool0: temperature,
      },
    };
    this.http
      .post(this.configService.getApiURL('printer/tool'), temperatureHotendCommand, this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-printer-hotend:Can't set Hotend Temperature!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public setTemperatureBed(temperature: number): void {
    const temperatureHeatbedCommand: TemperatureHeatbedCommand = {
      command: 'target',
      target: temperature,
    };
    this.http
      .post(this.configService.getApiURL('printer/bed'), temperatureHeatbedCommand, this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-printer-bed:Can't set Bed Temperature!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public setFeedrate(feedrate: number): void {
    const feedrateCommand: FeedrateCommand = {
      command: 'feedrate',
      factor: feedrate,
    };
    this.http
      .post(this.configService.getApiURL('printer/printhead'), feedrateCommand, this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-printer-feedrate:Can't set Feedrate!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public setFlowrate(flowrate: number): void {
    const flowrateCommand: FeedrateCommand = {
      command: 'flowrate',
      factor: flowrate,
    };
    this.http
      .post(this.configService.getApiURL('printer/tool'), flowrateCommand, this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-printer-flowrate:Can't set Flowrate!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public disconnectPrinter(): void {
    const disconnectPayload: DisconnectCommand = {
      command: 'disconnect',
    };
    this.http
      .post(this.configService.getApiURL('connection'), disconnectPayload, this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-printer-disconnect:Can't disconnect Printer!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public extrude(amount: number, speed: number): void {
    let multiplier = 1;
    let toBeExtruded: number;
    if (amount < 0) {
      multiplier = -1;
      toBeExtruded = amount * -1;
    } else {
      toBeExtruded = amount;
    }

    while (toBeExtruded > 0) {
      if (toBeExtruded >= 100) {
        toBeExtruded -= 100;
        this.moveExtruder(100 * multiplier, speed);
      } else {
        this.moveExtruder(toBeExtruded * multiplier, speed);
        toBeExtruded = 0;
      }
    }
  }

  public emergencyStop(): void {
    this.executeGCode('M410');
  }

  public setFanSpeed(percentage: number): void {
    this.executeGCode('M106 S' + Math.round((percentage / 100) * 255));
  }
}
