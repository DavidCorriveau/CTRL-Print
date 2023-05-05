/*
*@file config.models.ts
*@author UnchartedBull
*@version 2 David Corriveau, mai 2023 - Ajout d'un interface pour des températures par défaut. Ajout dans l'interface EnclosurePlugin des propriétés ID
* des capteurs et température par défaut. Ajout de l'entête de fichier
*@brief Fichier contenant les différentes interfaces pour la configuration
*/
import { HttpHeaders } from '@angular/common/http';

export interface HttpHeader {
  headers: HttpHeaders;
}

export interface Config {
  octoprint: Octoprint;
  printer: Printer;
  filament: Filament;
  plugins: Plugins;
  octodash: OctoDash;
}

interface Octoprint {
  url: string;
  accessToken: string;
  urlSplit?: URLSplit;
}

export interface URLSplit {
  host: string;
  port: number;
}

interface Printer {
  name: string;
  xySpeed: number;
  zSpeed: number;
  disableExtruderGCode: string;
  zBabystepGCode: string;
  defaultTemperatureFanSpeed: DefaultTemperatureFanSpeed;
}

interface DefaultTemperatureFanSpeed {
  hotend: number;
  heatbed: number;
  fan: number;
}

// Interface pour la température par défaut dans l'enceinte
interface DefaultTemperatureEnclosure {
  enclosure: number;  // Température par défaut de l'emplacement de l'imprimante
  storage: number;    // Température par défaut de l'emplacement des filaments
}

interface Filament {
  thickness: number;
  density: number;
  feedLength: number;
  feedSpeed: number;
  feedSpeedSlow: number;
  purgeDistance: number;
  useM600: boolean;
}

interface Plugins {
  displayLayerProgress: Plugin;
  enclosure: EnclosurePlugin;
  filamentManager: Plugin;
  spoolManager: Plugin;
  preheatButton: Plugin;
  printTimeGenius: Plugin;
  psuControl: PSUControlPlugin;
  ophom: PSUControlPlugin;
  tpLinkSmartPlug: TPLinkSmartPlugPlugin;
  tasmota: TasmotaPlugin;
  tasmotaMqtt: TasmotaMqttPlugin;
}

interface Plugin {
  enabled: boolean;
}

interface EnclosurePlugin extends Plugin {
  enclosureSensorID: number; // Variable qui contient l'ID du capteur dans Octoprint qui sera dans l'enceinte avec l'imprimante 3D
  storageSensorID: number; // Variable qui contient l'ID du capteur dans Octoprint qui sera dans l'emplacement des filaments
  defaultTemperature: DefaultTemperatureEnclosure;  // Interface qui contient les températures par défaut de l'enceinte 
  ambientSensorID: number | null;
  filament1SensorID: number | null;
  filament2SensorID: number | null;
}

interface PSUControlPlugin extends Plugin {
  // TODO: this option still exists to allow migration path... need to be removed
  // when the new `turnOnPSUWhenExitingSleep` will be released
  turnOnPSUWhenExitingSleep?: boolean;
}

interface TPLinkSmartPlugPlugin extends Plugin {
  smartPlugIP: string;
}

interface TasmotaPlugin extends Plugin {
  ip: string;
  index: number;
}

interface TasmotaMqttPlugin extends Plugin {
  topic: string;
  relayNumber: number;
}

interface OctoDash {
  customActions: CustomAction[];
  fileSorting: FileSorting;
  invertAxisControl: InvertAxisControl;
  pollingInterval: number;
  touchscreen: boolean;
  turnScreenOffWhileSleeping: boolean;
  turnOnPrinterWhenExitingSleep: boolean;
  preferPreviewWhilePrinting: boolean;
  previewProgressCircle: boolean;
  screenSleepCommand: string;
  screenWakeupCommand: string;
  showExtruderControl: boolean;
  showNotificationCenterIcon: boolean;
}

export interface CustomAction {
  icon: string;
  command: string;
  color: string;
  confirm: boolean;
  exit: boolean;
}

interface FileSorting {
  attribute: 'name' | 'date' | 'size';
  order: 'asc' | 'dsc';
}

interface InvertAxisControl {
  x: boolean;
  y: boolean;
  z: boolean;
}
