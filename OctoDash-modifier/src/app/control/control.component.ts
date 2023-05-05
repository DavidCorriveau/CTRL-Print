/*
*@file control.component.ts
*@author UnchartedBull
*@version 2 David Corriveau, mai 2023 - ajout de l'entête du fichier
*@brief Classe contenant des boutons pour controler l'imprimante. On peut bouger les trois axes du nozzle, rentrer ou retirer des filaments et exécuter
* d'autres commandes. Les commandes exécutables de base sont faire un home à l'imprimante, faire un leveling du plateau, préchauffer, refroidir, 
* redémarré le Raspberry Pi et éteindre le Raspberry Pi. Les distances de déplacement des nozzles sont ajustables à l'aide des boutons qui représente
* le déplacement
*/
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { ConfigService } from '../config/config.service';
import { NotificationType } from '../model';
import { OctoprintPrinterProfile } from '../model/octoprint';
import { NotificationService } from '../notification/notification.service';
import { PrinterService } from '../services/printer/printer.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
})
export class ControlComponent {
  public printerProfile: OctoprintPrinterProfile;

  public jogDistance = 10;
  public showExtruder = this.configService.getShowExtruderControl();

  public constructor(
    private printerService: PrinterService,
    private configService: ConfigService,
    private notificationService: NotificationService,
  ) {
    this.printerService.getActiveProfile().subscribe({
      next: (printerProfile: OctoprintPrinterProfile) => (this.printerProfile = printerProfile),
      error: (error: HttpErrorResponse) => {
        this.notificationService.setNotification({
          heading: $localize`:@@error-printer-profile:Can't retrieve printer profile!`,
          text: error.message,
          type: NotificationType.ERROR,
          time: new Date(),
          sticky: true,
        });
      },
    });
  }

  public setDistance(distance: number): void {
    this.jogDistance = distance;
  }

  public extrude(direction: '+' | '-'): void {
    if (this.printerProfile.axes['e'].inverted == true) {
      direction = direction === '+' ? '-' : '+';
    }
    const distance = Number(direction + this.jogDistance);
    this.printerService.extrude(distance, this.configService.getFeedSpeed());
  }

  public moveAxis(axis: string, direction: '+' | '-'): void {
    if (this.printerProfile.axes[axis].inverted == true) {
      direction = direction === '+' ? '-' : '+';
    }

    const distance = Number(direction + this.jogDistance);

    this.printerService.jog(axis === 'x' ? distance : 0, axis === 'y' ? distance : 0, axis === 'z' ? distance : 0);
  }
}
