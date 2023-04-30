/*
*@file control.component.ts
*@author David Corriveau
*@date Avril 2023
*@brief Classe pour aller récupérer des information sur le plugin Enclosure. Elle récupère les informations des capteurs, paramètre les températures
* voulues et d'autre action possible avec ce plugin.
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, Subscription, timer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ConfigService } from '../../config/config.service';
import { NotificationType, PSUState, TemperatureReading } from '../../model';
import {
  EnclosureColorBody,
  EnclosureOutputBody,
  EnclosurePluginOutputAPI,
  EnclosurePWMBody,
  EnclosurePluginInputAPI,
  OphomPlugStatus,
  PSUControlCommand,
  TasmotaCommand,
  TasmotaMqttCommand,
  TPLinkCommand,
  EnclosureStatus,
} from '../../model/octoprint';
import { NotificationService } from '../../notification/notification.service';
import { EnclosureService } from './enclosure.service';
import { HttpErrorResponse } from '@angular/common/http'; // Pour faire des requêtes http pour communiquer avec OctoPrint

@Injectable()
export class EnclosureOctoprintService extends EnclosureService {

  private enclosureStatusSubject: Subject<EnclosureStatus>;
  private enclosureStatus: EnclosureStatus;
  private subscriptions: Subscription = new Subscription();

  public constructor(
    private configService: ConfigService,
    private notificationService: NotificationService,
    private http: HttpClient,
  ) {
    super();
    this.enclosureStatusSubject = new Subject<EnclosureStatus>(); // Crée un Subject de type EnclosureStatus pour qu'il partage ces informations avec d'autres fenêtres
    this.enclosureStatus = {  // Crée une variable qui contient les informations actuelles de l'enceinte
      enclosure: {  // Contient les informations de l'emplacement de l'imprimante
        temperature: {
          current: 0, // Contient la température actuelle
          set: 0, // Contient la température cible 
          min: 0, // Contient le minimum admisible pour la température cible
          max: 50,  // Contient le maximum admisible pour la température cible
        }
      },
      storage: {  // Contient les informations de l'emplacement des filaments
        temperature: {
          current: 0, // Contient la température actuelle
          set: 0, // Contient la température cible
          min: 0, // Contient le minimum admisible pour la température cible
          max: 90,  // Contient le maximum admisible pour la température cible
        }
      },
    } as EnclosureStatus;
    setTimeout(() => {},50000);
    this.subscriptions.add(
      timer(0,1000).subscribe(() => {
        this.getEnclosureTemperature(this.configService.getEnclosureTemperatureSensorName()).subscribe({ // ajoute une lecture des données du capteur du boitier
          next: (temperatureReading: TemperatureReading) => (this.enclosureStatus.enclosure.temperature.current = temperatureReading.temperature), // Met les données du capteurs dans la varibale temperatureReading de type temperatureReading crée dans une variable locale
          error: (error: HttpErrorResponse) => {  // Si il y a une erreur, affiche une notification à l'écran
            this.notificationService.setNotification({
              heading: $localize`:@@error-enclosure-temp:Can't retrieve enclosure temperature!`,
              text: error.message,
              type: NotificationType.ERROR,
              time: new Date(),
            });
          },
        });

        this.getEnclosureTemperature(this.configService.getStorageTemperatureSensorName()).subscribe({ // ajoute une lecture des données du capteur du boitier
          next: (temperatureReading: TemperatureReading) => (
            this.enclosureStatus.storage.temperature.current = temperatureReading.temperature,
            this.enclosureStatus.storage.humidity = temperatureReading.humidity
            ), // Met les données du capteurs dans la varibale temperatureReading de type temperatureReading crée dans une variable locale
          error: (error: HttpErrorResponse) => {  // Si il y a une erreur, affiche une notification à l'écran
            this.notificationService.setNotification({
              heading: $localize`:@@error-enclosure-temp:Can't retrieve storage temperature!`,
              text: error.message,
              type: NotificationType.ERROR,
              time: new Date(),
            });
          },
        });

        this.getTemperatureSetValue(this.configService.getEnclosureTemperatureSensorName()).subscribe({ // ajoute une lecture des données du capteur du boitier
          next: (temperature: number) => (this.enclosureStatus.enclosure.temperature.set = temperature), // Met les données du capteurs dans la varibale temperatureReading de type temperatureReading crée dans une variable locale
          error: (error: HttpErrorResponse) => {  // Si il y a une erreur, affiche une notification à l'écran
            this.notificationService.setNotification({
              heading: $localize`:@@error-enclosure-temp:Can't retrieve storage temperature!`,
              text: error.message,
              type: NotificationType.ERROR,
              time: new Date(),
            });
          },
        });

        this.getTemperatureSetValue(this.configService.getStorageTemperatureSensorName()).subscribe({ // ajoute une lecture des données du capteur du boitier
          next: (temperature) => (this.enclosureStatus.storage.temperature.set = temperature), // Met les données du capteurs dans la varibale temperatureReading de type temperatureReading crée dans une variable locale
          error: (error: HttpErrorResponse) => {  // Si il y a une erreur, affiche une notification à l'écran
            this.notificationService.setNotification({
              heading: $localize`:@@error-enclosure-temp:Can't retrieve storage temperature!`,
              text: error.message,
              type: NotificationType.ERROR,
              time: new Date(),
            });
          },
        });
        this.enclosureStatusSubject.next(this.enclosureStatus);
      })
    )
  }
  private currentPSUState = PSUState.ON;

  getEnclosureStatusSubscribable(): Observable<EnclosureStatus> {
    return this.enclosureStatusSubject;
  }
  // Definition de la méthode pour qu'il récupère les données du capteur de l'enceinte des filaments dans OctoPrint
  getEnclosureTemperature(identifier: number): Observable<TemperatureReading> {
    if(identifier != undefined)
    {
      return this.http
        .get(
          this.configService.getApiURL(
            'plugin/enclosure/inputs/' + identifier,
            false,
          ),
          this.configService.getHTTPHeaders(),
        )
        .pipe(
          map((data: EnclosurePluginOutputAPI) => {
            return {
              temperature: data.temp_sensor_temp,
              humidity: data.temp_sensor_humidity,
              unit: data.use_fahrenheit ? '°F' : '°C',
            } as TemperatureReading;
          }),
        );
    }
  }

  // Définition de la méthode pour qu'elle récupère la température cible dans OctoPrint
  getTemperatureSetValue(identifier: number): Observable<number>
  {
    if(identifier != undefined)
    {
      return this.http
        .get(
          this.configService.getApiURL(
            'plugin/enclosure/outputs/' + identifier,
            false,
          ),
          this.configService.getHTTPHeaders(),
        )
        .pipe(
          map((data: EnclosurePluginOutputAPI) => {
            return data.temp_ctr_set_value
          }),
        );
    }
  }

  // Definition de la méthode pour qu'il récupère les données d'un capteur dans OctoPrint
  getStorageTemperature(): Observable<TemperatureReading> {
    return this.http
      .get(
        this.configService.getApiURL(
          'plugin/enclosure/inputs/' + this.configService.getStorageTemperatureSensorName(),  // requête HTTP pour aller récupéré les données d'un capteur dans le plugin Enclosure dans OctoPrint
          false,
        ),
        this.configService.getHTTPHeaders(),
      )
      .pipe(
        map((data: EnclosurePluginOutputAPI) => {
          return {
            temperature: data.temp_sensor_temp,
            humidity: data.temp_sensor_humidity,
            unit: data.use_fahrenheit ? '°F' : '°C',
          } as TemperatureReading;
        }),
      );
  }

  // Definition de la méthode qui va donner une température cible à un élément chauffant dans le plugin Enclosure dans OctoPrint
  public setTemperatureHeater(identifier: number, temperature: number): void {
    const temperatureEnclosure: EnclosurePluginInputAPI = {  // Crée une constante de type EnclosureTemperature qui contient la température passé en paramètre
      temperature,
    };
    this.http 
      .patch(
        this.configService.getApiURL('plugin/enclosure/temperature/' + identifier, false), // Requête HTTP pour aller insérer dans le plugin Enclosure la température cible à l'élément chauffant passé en paramètre
        temperatureEnclosure,
        this.configService.getHTTPHeaders(),
      )
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-set-color:Can't set Temperature target!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public setLEDColor(identifier: number, red: number, green: number, blue: number): void {
    const colorBody: EnclosureColorBody = {
      red,
      green,
      blue,
    };
    this.http
      .patch(
        this.configService.getApiURL('plugin/enclosure/neopixel/' + identifier, false),
        colorBody,
        this.configService.getHTTPHeaders(),
      )
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-set-color:Can't set LED color!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public setOutput(identifier: number, status: boolean): void {
    console.log(identifier, status);

    const outputBody: EnclosureOutputBody = {
      status,
    };
    this.http
      .patch(
        this.configService.getApiURL('plugin/enclosure/outputs/' + identifier, false),
        outputBody,
        this.configService.getHTTPHeaders(),
      )
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-set-output:Can't set output!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public setOutputPWM(identifier: number, dutyCycle: number): void {
    console.log(identifier, dutyCycle);

    const pwmBody: EnclosurePWMBody = {
      /* eslint-disable camelcase */
      duty_cycle: dutyCycle,
    };
    this.http
      .patch(
        this.configService.getApiURL('plugin/enclosure/pwm/' + identifier, false),
        pwmBody,
        this.configService.getHTTPHeaders(),
      )
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-set-output:Can't set output!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public runEnclosureShell(identifier: number): void {
    this.http
      .post(
        this.configService.getApiURL('plugin/enclosure/shell/' + identifier, false),
        this.configService.getHTTPHeaders(),
      )
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-run-enclosure-shell:Can't run enclosure shell!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  public setPSUState(state: PSUState): void {
    if (this.configService.usePSUControl()) {
      this.setPSUStatePSUControl(state);
    } else if (this.configService.useOphomControl()) {
      this.setPSUStateOphomControl(state);
    } else if (this.configService.useTpLinkSmartPlug()) {
      this.setPSUStateTPLink(state);
    } else if (this.configService.useTasmota()) {
      this.setPSUStateTasmota(state);
    } else if (this.configService.useTasmotaMqtt()) {
      this.setPSUStateTasmotaMqtt(state);
    } else {
      this.notificationService.setNotification({
        heading: $localize`:@@error-psu-state:Can't change PSU State!`,
        text: $localize`:@@error-psu-provider:No provider for PSU Control is configured.`,
        type: NotificationType.WARN,
        time: new Date(),
      });
    }
    this.currentPSUState = state;
  }

  private setPSUStatePSUControl(state: PSUState) {
    const psuControlPayload: PSUControlCommand = {
      command: state === PSUState.ON ? 'turnPSUOn' : 'turnPSUOff',
    };

    this.http
      .post(this.configService.getApiURL('plugin/psucontrol'), psuControlPayload, this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-send-psu-gcode:Can't send GCode!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  private setPSUStateOphomControl(state: PSUState) {
    this.http
      .get(this.configService.getApiURL('plugin/ophom?action=checkplugstatus'), this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-send-ophom-gcode:Can't update Ophom Plug!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
        map((data: OphomPlugStatus) => {
          if (data.reponse == 1) {
            if (state == PSUState.OFF) {
              this.toggleOphom();
            }
          } else {
            if (state == PSUState.ON) {
              this.toggleOphom();
            }
          }
        }),
      )
      .subscribe();
  }

  private toggleOphom() {
    this.http
      .get(this.configService.getApiURL('plugin/ophom?action=toggle'), this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-send-psu-gcode:Can't send GCode!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  private setPSUStateTPLink(state: PSUState) {
    const tpLinkPayload: TPLinkCommand = {
      command: state === PSUState.ON ? 'turnOn' : 'turnOff',
      ip: this.configService.getSmartPlugIP(),
    };

    this.http
      .post(this.configService.getApiURL('plugin/tplinksmartplug'), tpLinkPayload, this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-send-smartplug-gcode:Can't send GCode!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  private setPSUStateTasmota(state: PSUState) {
    const tasmotaPayload: TasmotaCommand = {
      command: state === PSUState.ON ? 'turnOn' : 'turnOff',
      ip: this.configService.getTasmotaIP(),
      idx: this.configService.getTasmotaIndex(),
    };

    this.http
      .post(this.configService.getApiURL('plugin/tasmota'), tasmotaPayload, this.configService.getHTTPHeaders())
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-send-tasmota-plug:Can't update Tasmota!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  private setPSUStateTasmotaMqtt(state: PSUState) {
    const tasmotaMqttPayload: TasmotaMqttCommand = {
      command: state === PSUState.ON ? 'turnOn' : 'turnOff',
      topic: this.configService.getTasmotaMqttTopic(),
      relayN: this.configService.getTasmotaMqttRelayNumber(),
    };

    this.http
      .post(
        this.configService.getApiURL('plugin/tasmota_mqtt'),
        tasmotaMqttPayload,
        this.configService.getHTTPHeaders(),
      )
      .pipe(
        catchError(error => {
          this.notificationService.setNotification({
            heading: $localize`:@@error-send-tasmota-plug-mqtt:Can't update Tasmota MQTT!`,
            text: error.message,
            type: NotificationType.ERROR,
            time: new Date(),
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  togglePSU(): void {
    this.currentPSUState === PSUState.ON ? this.setPSUState(PSUState.OFF) : this.setPSUState(PSUState.ON);
  }
}
