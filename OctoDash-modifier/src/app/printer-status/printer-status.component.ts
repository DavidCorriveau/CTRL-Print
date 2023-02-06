import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { PrinterStatus } from '../model';
import { PrinterService } from '../services/printer/printer.service';
import { SocketService } from '../services/socket/socket.service';

@Component({
  selector: 'app-printer-status',
  templateUrl: './printer-status.component.html',
  styleUrls: ['./printer-status.component.scss'],
})
export class PrinterStatusComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public printerStatus: PrinterStatus;
  public fanSpeed: number;
  public status: string;

  public hotendTarget: number;
  public heatbedTarget: number;
  public fanTarget: number;
  public enclosureTarget: number;
  public filamentsTarget: number;

  public QuickControlView = QuickControlView;
  public view = QuickControlView.NONE;

  public maxTemperatureEnclosure: 70;
  public minTemperatureEnclosure: 0;
  public maxTemperatureFilaments: 60;
  public minTemperatureFilaments: 0;

  public enclosureTemperature: number;
  public filamentsTemperature: number;

  public constructor(
    private printerService: PrinterService,
    private configService: ConfigService,
    private socketService: SocketService,
  ) {
    this.hotendTarget = this.configService.getDefaultHotendTemperature();
    this.heatbedTarget = this.configService.getDefaultHeatbedTemperature();
    this.fanTarget = this.configService.getDefaultFanSpeed();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.socketService.getPrinterStatusSubscribable().subscribe((status: PrinterStatus): void => {
        this.printerStatus = status;
      }),
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

  public showQuickControlEnclosure(): void {
    this.view = QuickControlView.ENCLOSURE;
    this.showQuickControl();
  }

  public showQuickControlFilaments(): void {
    this.view = QuickControlView.FILAMENTS;
    this.showQuickControl();
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
      case QuickControlView.ENCLOSURE:
        this.changeTemperatureEnclosure(value);
        break;
      case QuickControlView.FILAMENTS:
        this.changeTemperatureFilaments(value);
        break;
    }
  }

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
      case QuickControlView.ENCLOSURE:
        this.setTemperatureEnclosure();
        break;
      case QuickControlView.FILAMENTS:
        this.setTemperatureFilaments();
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

  private changeTemperatureEnclosure(value: number): void {
    this.enclosureTarget += value;
    if (this.enclosureTarget < this.minTemperatureEnclosure) {
      this.enclosureTarget = this.minTemperatureEnclosure;
    } else if (this.enclosureTarget > this.maxTemperatureEnclosure) {
      this.enclosureTarget = this.maxTemperatureEnclosure;
    }
  }

  private changeTemperatureFilaments(value: number): void {
    this.filamentsTarget += value;
    if (this.filamentsTarget < this.minTemperatureFilaments) {
      this.filamentsTarget = this.minTemperatureFilaments;
    } else if (this.filamentsTarget > this.maxTemperatureFilaments) {
      this.filamentsTarget = this.maxTemperatureFilaments;
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

  private setTemperatureEnclosure(): void {
    this.enclosureTemperature = this.enclosureTarget;
    this.hideQuickControl();
  }

  private setTemperatureFilaments(): void {
    this.filamentsTemperature = this.filamentsTarget;
    this.hideQuickControl();
  }
}

enum QuickControlView {
  NONE,
  HOTEND,
  HEATBED,
  FAN,
  ENCLOSURE,
  FILAMENTS
}