import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { NotificationType, PrinterState, PrinterStatus, TemperatureReading } from '../model';
import { NotificationService } from '../notification/notification.service';
import { EnclosureService } from '../services/enclosure/enclosure.service';
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
    private enclosureService: EnclosureService,
    private notificationService: NotificationService,
  ) {
    if (this.configService.getAmbientTemperatureSensorName() !== null) {
      this.subscriptions.add( // Ajoute une sorte de thread a mon avis
        timer(10000, 15000).subscribe(() => { // Le "thread" démarre un timer qui exécute la fonction définit qui prend 0 paramètre une première fois après 10 secondes, mais par la suite à chaque 15 secondes
          this.enclosureService.getEnclosureTemperature().subscribe({ // Retour de la fonction qui éxecute le bout de code en dessous
            next: (temperatureReading: TemperatureReading) => (this.enclosureTemperature = temperatureReading), // crée la varibale temperatureReading de type temperatureReading qui met égale à enclosureTemperature
            error: (error: HttpErrorResponse) => {  // Si il y a une erreur, affiche une notification à l'écran
              this.notificationService.setNotification({
                heading: $localize`:@@error-enclosure-temp:Can't retrieve enclosure temperature!`,
                text: error.message,
                type: NotificationType.ERROR,
                time: new Date(),
              });
            },
          });
        }),
      );
    }

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
