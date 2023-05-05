/*
*@file choose-filament.component.ts
*@author UnchartedBull
*@version 2 David Corriveau, mai 2023 - ajout de l'entête du fichier
*@brief Classe pour la sélection du nouveau filament à insérer pour la procédure de changement de filament. Cette section s'exécute si le plugin
* FilamentManger est activé dans les paramètres de l'interface. 
*/
import { Component, EventEmitter, Output } from '@angular/core';

import { FilamentSpool } from '../../model';
import { FilamentService } from '../../services/filament/filament.service';

@Component({
  selector: 'app-filament-choose',
  templateUrl: './choose-filament.component.html',
  styleUrls: ['./choose-filament.component.scss', '../filament.component.scss'],
})
export class ChooseFilamentComponent {
  @Output() spoolChange = new EventEmitter<{ spool: FilamentSpool; skipChange: boolean }>();

  constructor(public filament: FilamentService) {}

  public getSpoolWeightLeft(weight: number, used: number): number {
    return Math.floor(weight - used);
  }

  public setSpool(spool: FilamentSpool): void {
    setTimeout(() => {
      this.spoolChange.emit({ spool, skipChange: false });
    }, 150);
  }

  public setSpoolSkipChange(spool: FilamentSpool): void {
    setTimeout(() => {
      this.spoolChange.emit({ spool, skipChange: true });
    }, 150);
  }
}
