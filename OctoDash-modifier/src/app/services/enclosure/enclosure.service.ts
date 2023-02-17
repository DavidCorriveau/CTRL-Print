import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { PSUState, TemperatureReading } from '../../model';

@Injectable()
export abstract class EnclosureService {

  private enclosureTemp = new BehaviorSubject(0); // Crée une nouvelle variable égale à 0 qui pourra être lu par d'autre fenêtre
  private storageTemp = new BehaviorSubject(0);   // Crée une nouvelle variable égale à 0 qui pourra être lu par d'autre fenêtre
  private minEnclosure = new BehaviorSubject(0);  // Crée une nouvelle variable égale à 0 qui pourra être lu par d'autre fenêtre
  private maxEnclosure = new BehaviorSubject(50); // Crée une nouvelle variable égale à 50 qui pourra être lu par d'autre fenêtre
  private minStorage = new BehaviorSubject(0);    // Crée une nouvelle variable égale à 0 qui pourra être lu par d'autre fenêtre
  private maxStorage = new BehaviorSubject(90);   // Crée une nouvelle variable égale à 90 qui pourra être lu par d'autre fenêtre

  enclosureTempDesire = this.enclosureTemp.asObservable();  // Permet de lire cette variable par d'autre fenêtre
  storageTempDesire = this.storageTemp.asObservable();      // Permet de lire cette variable par d'autre fenêtre
  minTempEnclosure = this.minEnclosure.asObservable();      // Permet de lire cette variable par d'autre fenêtre
  maxTempEnclosure = this.maxEnclosure.asObservable();      // Permet de lire cette variable par d'autre fenêtre
  minTempStorage = this.minStorage.asObservable();          // Permet de lire cette variable par d'autre fenêtre
  maxTempStorage = this.maxStorage.asObservable();          // Permet de lire cette variable par d'autre fenêtre

  /*
  * @brief: Méthode qui permet de mettre à jour la température du boitier pour permettre un traquage des modification de se paramètre apporté par les autres fenêtres
  * @param newTemp: Nouvelle température appliquée pour le boitier
  */
  public updateEnclosureTemp(newTemp)
  {
    this.enclosureTemp.next(newTemp); // Met à jour la nouvelle température désirée pour le boitier
  }
  /*
  * @brief: Méthode qui permet de mettre à jour la température de l'emplacement des filaments pour permettre un traquage des modification de se paramètre apporté par les autres fenêtres
  * @param newTemp: Nouvelle température appliquée pour l'emplacement des filaments
  */
  public updateStorageTemp(newTemp)
  {
    this.storageTemp.next(newTemp); // Met à jour la nouvelle température désirée pour l'emplacement des filaments
  }

  // Méthode modifiable qui permet d'aller chercher les données du capteur de l'enceinte. Définit dans enclosure.octoprint.services.ts
  abstract getEnclosureTemperature(): Observable<TemperatureReading>;

  // Méthode modifiable qui permet d'aller chercher les données du capteur pour l'emplacement des filament. Définit dans enclosure.octoprint.services.ts
  abstract getStorageTemperature(): Observable<TemperatureReading>;

  abstract setLEDColor(identifier: number, red: number, green: number, blue: number): void;

  /* 
  * @brief: Méthode modifiable qui permet d'ajuster la température désirée dans OctoPrint pour un élément chauffant. Définit dans enclosure.octoprint.services.ts
  * @param identifier: ID de l'élément chauffant qu'on lui applique une température cible
  * @param temperature: Température cible que l'élément chauffant doit atteindre
  */
  abstract setTemperatureHeater(identifier: number, temperature: number): void;

  abstract setOutput(identifier: number, status: boolean): void;

  abstract setOutputPWM(identifier: number, dutyCycle: number): void;

  abstract runEnclosureShell(identifier: number): void;

  abstract setPSUState(state: PSUState): void;

  abstract togglePSU(): void;
}
