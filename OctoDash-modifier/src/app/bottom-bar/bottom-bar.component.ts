import { Component, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { PrinterState, PrinterStatus, TemperatureReading } from '../model';
import { SocketService } from '../services/socket/socket.service';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.scss'],
})
export class BottomBarComponent implements OnDestroy {
  private subscriptions: Subscription = new Subscription();
  private lastStatusText: string;

  public statusText: string;
  public enclosureTemperature: TemperatureReading;

  public constructor(
    private socketService: SocketService,
    private configService: ConfigService,
  ) {

    this.subscriptions.add(
      this.socketService.getPrinterStatusSubscribable().subscribe((printerStatus: PrinterStatus): void => {
        this.setStatusText(this.getStringStatus(printerStatus?.status));
      }),
    );

    this.subscriptions.add(
      this.socketService.getPrinterStatusText().subscribe((statusText: string): void => {
        this.setStatusText(statusText);
      }),
    );
  }

  private getStringStatus(printerState: PrinterState): string {
    if (printerState === PrinterState.socketDead) {
      return 'socket is dead';
    }
    return PrinterState[printerState];
  }

  private setStatusText(statusText: string) {
    if (statusText !== this.lastStatusText) {
      this.lastStatusText = this.statusText;
      this.statusText = statusText;
    }
  }

  public getPrinterName(): string {
    return this.configService.getPrinterName();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
