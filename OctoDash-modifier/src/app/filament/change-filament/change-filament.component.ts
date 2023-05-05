/*
*@file change-filament.component.ts
*@author UnchartedBull
*@version 2 David Corriveau, mai 2023 - ajout de l'entête du fichier
*@brief Classe pour l'étape de l'insertion du nouveau filament pour la procédure de changement de filament
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ConfigService } from '../../config/config.service';
import { FilamentSpool } from '../../model';
import { PrinterService } from '../../services/printer/printer.service';

@Component({
  selector: 'app-filament-change-filament',
  templateUrl: './change-filament.component.html',
  styleUrls: [
    './change-filament.component.scss',
    '../filament.component.scss',
    '../heat-nozzle/heat-nozzle.component.scss',
  ],
})
export class ChangeFilamentComponent implements OnInit {
  @Input() selectedSpool: FilamentSpool;

  @Output() increasePage = new EventEmitter<void>();

  constructor(private configService: ConfigService, private printerService: PrinterService) {}

  ngOnInit(): void {
    if (this.configService.useM600()) {
      this.initiateM600FilamentChange();
    } else {
      this.disableExtruderStepper();
    }
  }

  private disableExtruderStepper(): void {
    this.printerService.executeGCode(`${this.configService.getDisableExtruderGCode()}`);
  }

  private initiateM600FilamentChange(): void {
    this.printerService.executeGCode('M600');
  }

  public getSpoolWeightLeft(weight: number, used: number): number {
    return Math.floor(weight - used);
  }

  public usingM600(): boolean {
    return this.configService.useM600();
  }
}
