import { Temperature } from '../../index';

// Interface qui contient les informations de l'enceinte
export interface EnclosureStatus {
  enclosure: Space; // Informations du boitier de l'imprimante 3D
  storage: Space; // Informations de l'emplacement des filaments
}

// Interface qui contient les informations de températures et d'humidité
interface Space {
  temperature: Temperature; // Contient les informations de la température
  humidity: number  // Contient l'humidité
}

export interface EnclosurePluginOutputAPI {
  controlled_io: string;
  temp_sensor_address: string;
  temp_sensor_navbar: boolean;
  temp_sensor_temp: number;
  printer_action: string;
  filament_sensor_enabled: boolean;
  controlled_io_set_value: number;
  temp_sensor_type: string;
  temp_sensor_humidity: number;
  filament_sensor_timeout: number;
  edge: string;
  ds18b20_serial: string;
  action_type: string;
  input_pull_resistor: string;
  input_type: string;
  label: string;
  index_id: number;
  use_fahrenheit: boolean;
  gpio_pin: string;
  temp_ctr_set_value: number; // Contient la température cible 
}

// Crée un nouveau model de variable pour aller écrire une température cible dans le plugin Enclosure dans Octoprint
export interface EnclosurePluginInputAPI {
  temperature: number;  // Contient une variable température
}

export interface EnclosureColorBody {
  red: number;
  green: number;
  blue: number;
}

export interface EnclosureOutputBody {
  status: boolean;
}

export interface EnclosurePWMBody {
  duty_cycle: number;
}
