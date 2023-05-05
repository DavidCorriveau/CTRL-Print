/*
*@file config.defaults.ts
*@author UnchartedBull
*@version 2 David Corriveau, mai 2023 - Ajout des propriétés ID des capteurs et températures par défaut de l'enceinte. Ajout de l'entête de fichier
*@brief Fichier contenant la configuration de base de l'application
*/
import { Config } from './config.model';

export const defaultConfig: Config = {
  octoprint: {
    url: 'http://localhost:5000/',
    accessToken: '',
  },
  printer: {
    name: '',
    xySpeed: 150,
    zSpeed: 5,
    disableExtruderGCode: 'M18 E',
    zBabystepGCode: 'M290 Z',
    defaultTemperatureFanSpeed: {
      hotend: 200,
      heatbed: 60,
      fan: 100,
    },
  },
  filament: {
    thickness: 1.75,
    density: 1.25,
    feedLength: 0,
    feedSpeed: 20,
    feedSpeedSlow: 3,
    purgeDistance: 30,
    useM600: false,
  },
  plugins: {
    displayLayerProgress: {
      enabled: true,
    },
    enclosure: {
      enabled: true,  // Active la lecture des capteurs par défaut
      enclosureSensorID: 1, // Met la valeur par défaut du capteur pour l'enceinte à 1
      storageSensorID: 2,  // Met la valeur par défaut du capteur pour l'emplacement des filaments à 2
      defaultTemperature: {
        enclosure: 25,  // Met la température par défaut de l'emplacement de l'imprimante de 25
        storage: 50,  // Met la température par défaut de l'emplacement des filaments de 50
      },
      ambientSensorID: null,
      filament1SensorID: null,
      filament2SensorID: null,
    },
    filamentManager: {
      enabled: false,
    },
    spoolManager: {
      enabled: false,
    },
    preheatButton: {
      enabled: false,
    },
    printTimeGenius: {
      enabled: true,
    },
    psuControl: {
      enabled: false,
      turnOnPSUWhenExitingSleep: false,
    },
    ophom: {
      enabled: false,
      turnOnPSUWhenExitingSleep: false,
    },
    tpLinkSmartPlug: {
      enabled: false,
      smartPlugIP: '127.0.0.1',
    },
    tasmota: {
      enabled: false,
      ip: '127.0.0.1',
      index: null,
    },
    tasmotaMqtt: {
      enabled: false,
      topic: 'topic',
      relayNumber: null,
    },
  },
  octodash: {
    customActions: [
      {
        icon: 'home',
        command: 'G28',
        color: '#dcdde1',
        confirm: false,
        exit: true,
      },
      {
        icon: 'ruler-vertical',
        command: 'G29',
        color: '#4bae50',
        confirm: false,
        exit: true,
      },
      {
        icon: 'fire-alt',
        command: 'M140 S50; M104 S185',
        color: '#e1b12c',
        confirm: false,
        exit: true,
      },
      {
        icon: 'snowflake',
        command: 'M140 S0; M104 S0',
        color: '#0097e6',
        confirm: false,
        exit: true,
      },
      {
        icon: 'redo-alt',
        command: '[!RELOAD]',
        color: '#7f8fa6',
        confirm: true,
        exit: false,
      },
      {
        icon: 'power-off',
        command: '[!SHUTDOWN]',
        color: '#e84118',
        confirm: true,
        exit: false,
      },
    ],
    fileSorting: {
      attribute: 'name',
      order: 'asc',
    },
    invertAxisControl: {
      x: false,
      y: false,
      z: false,
    },
    pollingInterval: 2000,
    touchscreen: true,
    turnScreenOffWhileSleeping: false,
    turnOnPrinterWhenExitingSleep: false,
    preferPreviewWhilePrinting: false,
    previewProgressCircle: false,
    screenSleepCommand: 'xset dpms force standby',
    screenWakeupCommand: 'xset s off && xset -dpms && xset s noblank',
    showExtruderControl: true,
    showNotificationCenterIcon: true,
  },
};
