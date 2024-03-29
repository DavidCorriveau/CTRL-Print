/*
*@file printer-status.component.ts
*@author UnchartedBull
*@version 2 David Corriveau, mai 2023 - Ajout de deux boutons pour paramétrer les températures de l'enceinte et de les afficher. 
* Ajout de l'entête du fichier.
*@brief Classe qui affiche les informations de températures de l'imprimante et de l'enceinte. On peut changer ces paramètres en appuyant sur les
* boutons qui sont les icones associés à leur valeur affichée.
*/
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { PrinterStatus } from '../model';
import { EnclosureStatus } from '../model/octoprint';
import { PrinterService } from '../services/printer/printer.service';
import { SocketService } from '../services/socket/socket.service';
import { EnclosureService } from '../services/enclosure/enclosure.service'; // Pour récupérer et enregistrer les valeurs de température de l'enceinte et de l'emplacement des filaments. Aussi pour communiquer avec le plugin Enclosure

@Component({
  selector: 'app-printer-status',
  templateUrl: './printer-status.component.html',
  styleUrls: ['./printer-status.component.scss'],
})
export class PrinterStatusComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription(); // Pour ajouter des lectures automatiques
  public printerStatus: PrinterStatus;  // Contient les informations de l'imprimante

  public fanSpeed: number; // Vitesse du ventilateur près de la buse de l'imprimante

  public hotendTarget: number;  // Température cible qui va être changé pour la buse de l'imprimante
  public heatbedTarget: number;
  public fanTarget: number;
  public enclosureTarget: number; // Variable qui contient la température cible qui va être changé pour le boitier
  public storageTarget: number; // Variable qui contient la température cible qui va être changé de l'emplacement des filaments

  public QuickControlView = QuickControlView;
  public view = QuickControlView.NONE;

  public valeurChangePourDefaut = -999; // Valeur pour changer entre le minimum et le maximum

  public enclosureStatus: EnclosureStatus;  // Objet qui contient les informations de l'enceinte au complet

  public constructor(
    private printerService: PrinterService,
    private socketService: SocketService,
    private enclosureService: EnclosureService,
    private configService: ConfigService,
  ) {
    this.hotendTarget = this.configService.getDefaultHotendTemperature();
    this.heatbedTarget = this.configService.getDefaultHeatbedTemperature();
    this.fanTarget = this.configService.getDefaultFanSpeed();
    this.enclosureTarget = this.configService.getDefaultEnclosureTemperature();
    this.storageTarget = this.configService.getDefaultStorageTemperature();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.socketService.getPrinterStatusSubscribable().subscribe((status: PrinterStatus): void => {
        this.printerStatus = status;
      }),
    );
    this.subscriptions.add( // Ajoute une lecture automatique
      this.enclosureService.getEnclosureStatusSubscribable().subscribe(status => {this.enclosureStatus = status}) // Lecture des informations de l'enceinte
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public showQuickControlHotend(): void {
    this.view = QuickControlView.HOTEND;
    this.showQuickControl();
  }

  public showQuickControlHeatbed(): void {
    this.view = QuickControlView.HEATBED;
    this.showQuickControl();
  }

  public showQuickControlFan(): void {
    this.view = QuickControlView.FAN;
    this.showQuickControl();
  }

  /*
   * @brief: Méthode qui fait aparaitre le menu de controle pour la température du boitier
   * @param: aucun
   */
  public showQuickControlEnclosure(): void {
    this.view = QuickControlView.ENCLOSURE; // Règle l'affichage pour celui de l'enceinte
    this.showQuickControl();  // Affiche le menu de paramétrage
  }

  /*
   * @brief: Méthode qui fait aparaitre le menu de contrôle pour la température de l'emplacement des filaments
   * @aucun: aucun
   */
  public showQuickControlStorage(): void {
    this.view = QuickControlView.STORAGE; // Règle l'affichage pour celui de l'espace des filaments
    this.showQuickControl();  // Affiche le menu de paramétrage
  }

  private showQuickControl(): void {
    setTimeout((): void => {
      const controlViewDOM = document.getElementById('quickControl');
      controlViewDOM.style.opacity = '1';
    }, 50);
  }

  public hideQuickControl(): void {
    const controlViewDOM = document.getElementById('quickControl');
    controlViewDOM.style.opacity = '0';
    setTimeout((): void => {
      this.view = QuickControlView.NONE;
    }, 500);
  }

  public stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  /*
   * @brief: Méthode qui change la température cible lorsque les boutons de changements de valeurs sont appuyés 
   * @param value: Contient la température qui sera additionée à celle cible. Elle est déterminée par la valeur affichée par le bouton appuyé
   */
  public quickControlChangeValue(value: number): void {
    switch (this.view) {
      case QuickControlView.HOTEND:
        this.changeTemperatureHotend(value);
        break;
      case QuickControlView.HEATBED:
        this.changeTemperatureHeatbed(value);
        break;
      case QuickControlView.FAN:
        this.changeSpeedFan(value);
        break;
      case QuickControlView.ENCLOSURE:  // Si l'affichage de controle est celui pour le boitier
        this.changeTemperatureEnclosure(value); // Appel la méthode pour changer la température cible du boitier en additionnant avec la valeur passée en paramètre
        break;
      case QuickControlView.STORAGE:  // Si l'affichage de controle est celui pour l'emplacement des filaments
        this.changeTemperatureStorage(value); // Appel la méthode pour changer la température cible de l'emplacement des filaments en additionnant avec la valeur passée en paramètre
        break;
    }
  }

  /*
   * @brief: Méthode qui change la température appliqué par celle cible lorsque l'utilisateur appuie sur le bouton 'Set'
   * @param: aucun
   */
  public quickControlSetValue(): void {
    switch (this.view) {
      case QuickControlView.HOTEND:
        this.setTemperatureHotend();
        break;
      case QuickControlView.HEATBED:
        this.setTemperatureHeatbed();
        break;
      case QuickControlView.FAN:
        this.setFanSpeed();
        break;
      case QuickControlView.ENCLOSURE:  // Si l'affichage de controle est celui pour le boitier
        this.setTemperatureEnclosure(); // Appel la méthode pour changer la température appliquée par celle cible pour le boitier
        break;
      case QuickControlView.STORAGE:  // Si l'affichage de controle est celui pour l'emplacement des filaments
        this.setTemperatureStorage(); // Appel la méthode pour changer la température appliquée par celle cible pour l'emplacement des filaments
         break;
    }
  }

  private changeTemperatureHotend(value: number): void {
    this.hotendTarget += value;
    if (this.hotendTarget < -999) {
      this.hotendTarget = this.configService.getDefaultHotendTemperature();
    } else if (this.hotendTarget < 0) {
      this.hotendTarget = 0;
    } else if (this.hotendTarget > 999) {
      this.hotendTarget = 999;
    }
  }

  private changeTemperatureHeatbed(value: number): void {
    this.heatbedTarget += value;
    if (this.heatbedTarget < -999) {
      this.heatbedTarget = this.configService.getDefaultHeatbedTemperature();
    } else if (this.heatbedTarget < 0) {
      this.heatbedTarget = 0;
    } else if (this.heatbedTarget > 999) {
      this.heatbedTarget = 999;
    }
  }

  private changeSpeedFan(value: number): void {
    this.fanTarget += value;
    if (this.fanTarget < -999) {
      this.fanTarget = this.configService.getDefaultFanSpeed();
    } else if (this.fanTarget < 0) {
      this.fanTarget = 0;
    } else if (this.fanTarget > 100) {
      this.fanTarget = 100;
    }
  }

  /*
   * @brief: Méthode qui change la température cible pour le boitier
   * @param value: Contient la valeur qui sera additionné avec celle cible
   */
  private changeTemperatureEnclosure(value: number): void {
    this.enclosureTarget += value;  // Additionne la valeur à la température cible
    if (this.enclosureTarget < this.valeurChangePourDefaut) { // Si la température cible est plus petite que celle pour indiquer de changer pour la température maximum
      this.enclosureTarget = this.configService.getDefaultEnclosureTemperature();  // Met la température cible égale à la température idéal
    } else if (this.enclosureTarget < this.enclosureStatus.enclosure.temperature.min) { // Si la température cible est plus petite que son minimum
      this.enclosureTarget = this.enclosureStatus.enclosure.temperature.min;  // Met la température cible à son minimum
    } else if (this.enclosureTarget > this.enclosureStatus.enclosure.temperature.max) { // Si la température cible est plus grande que son maximum
      this.enclosureTarget = this.enclosureStatus.enclosure.temperature.max;  // Met la température cible à son maximum
    }
  }

  /*
   * @brief: Méthode qui change la température cible pour l'emplacement des filaments
   * @param value: Contient la valeur qui sera additionné avec celle cible
   */
  private changeTemperatureStorage(value: number): void {
    this.storageTarget += value;  // Additionne la valeur à la température cible
    if (this.storageTarget < this.valeurChangePourDefaut) { // Si la température cible est plus petite que celle pour indiquer de changer pour la température maximum
      this.storageTarget = this.configService.getDefaultStorageTemperature();  // Met la température cible égale à la température idéal
    } else if (this.storageTarget < this.enclosureStatus.storage.temperature.min) { // Si la température cible est plus petite que son minimum
      this.storageTarget = this.enclosureStatus.storage.temperature.min;  // Met la température cible à son minimum
    } else if (this.storageTarget > this.enclosureStatus.storage.temperature.max) { // Si la température cible est plus grande que son maximum
      this.storageTarget = this.enclosureStatus.storage.temperature.max;  // Met la température cible égale à la température maximum
    }
  }

  private setTemperatureHotend(): void {
    this.printerService.setTemperatureHotend(this.hotendTarget);
    this.hideQuickControl();
  }

  private setTemperatureHeatbed(): void {
    this.printerService.setTemperatureBed(this.heatbedTarget);
    this.hideQuickControl();
  }

  private setFanSpeed(): void {
    this.printerService.setFanSpeed(this.fanTarget);
    this.hideQuickControl();
  }

  /*
   * @brief: Méthode qui met le température appliquée du botier égale à celle cible
   * @param: aucun
   */
  private setTemperatureEnclosure(): void {
    this.enclosureService.setTemperatureHeater(this.configService.getEnclosureTemperatureSensorName(),this.enclosureTarget);  // Envoie la température de l'enceinte souhaité au plugin Enclosure pour qu'il agit avec l'élément chauffant
    this.hideQuickControl();  // Ferme l'affichage de paramétrage de la température
  }

  /*
   * @brief: Méthode qui met la température appliquée de l'emplacement des filaments égale à celle cible
   * @param: aucun
   */
  private setTemperatureStorage(): void {
    this.enclosureService.setTemperatureHeater(this.configService.getStorageTemperatureSensorName(),this.storageTarget);  // Envoie la température de l'emplacement des filament souhaité au plugin Enclosure pour qu'il agit avec l'élément chauffant
    this.hideQuickControl();  // Ferme l'affichage de paramétrage de la température
  }
}

enum QuickControlView {
  NONE,
  HOTEND,
  HEATBED,
  FAN,
  ENCLOSURE,
  STORAGE
}