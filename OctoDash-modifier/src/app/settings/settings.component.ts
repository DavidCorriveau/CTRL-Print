/*
*@file settings.component.ts
*@author UnchartedBull
*@version 2 David Corriveau, mai 2023 - Ajout d'un clavier sur chaque zone de texte qui en lien avec le plugin Enclosure. Ce clavier
* permet de changer des valeurs d'ID des capteurs et des température par défaut ajoutés.Ajout de la posibilité de changer le port 
* et le baudrate de la communication série entre OctoPrint et l'imprimante. Ajout de l'entête du fichier.
*@brief Classe qui permet de configuration de l'interface utilisateur. On peut activer ou désactiver des plugins, changer des valeur par défaut, donner un nom
* à l'imprimante, etc.
*/
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Config } from '../config/config.model';
import { ConfigService } from '../config/config.service';
import { ElectronService } from '../electron.service';
import { NotificationType } from '../model';
import { connectionInfo } from '../model/octoprint';
import { NotificationService } from '../notification/notification.service';
import { PrinterService } from '../services/printer/printer.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  @Output() closeFunction = new EventEmitter<void>();
  @ViewChild('settingsMain') private settingsMain: ElementRef;
  @ViewChild('settingsGeneral') private settingsGeneral: ElementRef;
  @ViewChild('settingsOctoDash') private settingsOctoDash: ElementRef;
  @ViewChild('settingsPlugins') private settingsPlugins: ElementRef;
  @ViewChild('settingsConnection') private settingsConnection: ElementRef
  @ViewChild('settingsCredits') private settingsCredits: ElementRef;
  @Input() keyboardHTML: string;

  public fadeOutAnimation = false;
  public config: Config;
  public customActionsPosition = [
    $localize`:@@top-left:Top Left`,
    $localize`:@@top-right:Top Right`,
    $localize`:@@middle-left:Middle Left`,
    $localize`:@@middle-right:Middle Right`,
    $localize`:@@bottom-left:Bottom Left`,
    $localize`:@@bottom-right:Bottom Right`,
  ];
  private overwriteNoSave = false;
  private pages = [];
  public update = false;
  public availablePortsOptions: string[] = [];  // Tableau pour contenir les ports disponibles. Son contenu est affiché dans son droplist
  public availableBaudratesOptions: number[] = [];  // Tableau pour contenir les différents bauderates disponibles. Son contenu est affiché dans son droplist
  public portSelected: string;  // Variable qui contient le port sélectionné. Son contenu est affiché dans la case de l'option sélectionné de son droplist
  public baudrateSelected: number;  // Variable qui contient le bauderate sélectionné. Son contenu est affiché dans la case de l'option sélectionné de son droplist
  public info: connectionInfo;  // Objet qui contient toutes les informations de la connexion d'Octoprint à une imprimante.

  public constructor(
    private configService: ConfigService,
    private notificationService: NotificationService,
    private electronService: ElectronService,
    public service: AppService,
    public printerservice: PrinterService,  // Objet pour récupérer les infomations de la connexion et de changer ses paramètres.
  ) {
    this.config = this.configService.getCurrentConfig();
    this.config.octoprint.urlSplit = this.configService.splitOctoprintURL(this.config.octoprint.url);
  }

  public ngOnInit(): void {
    setTimeout((): void => {
      this.pages = [
        this.settingsMain.nativeElement,
        this.settingsGeneral.nativeElement,
        this.settingsOctoDash.nativeElement,
        this.settingsPlugins.nativeElement,
        this.settingsConnection.nativeElement,  // Ajout d'une section connexion dans la fenêtre des paramètres
        this.settingsCredits.nativeElement,
      ];
    }, 400);
    this.lectureInfoConnection(); // Effectue une première lecture des informations de connexions. Important de garder, car aussi non les lecture seront décalés (mystère non résolu)
  }

  /*
  *@brief: Méthode pour gérer les actions du clavier pour changer la valeur de la zone de texte
  *@param: source: contient la variable à changer
  *@param: value: contient la nouvelle à ajouter ou signal pour effacer un caractère
  *@return: source qui contient la valeur changé en n
  */
  public changeValue(source: string, value: string): number{
    let stringTemporaire = "";  // Crée une variable temporaire pour garder en mémoire la valeur de base
    if(value != "backspace")  // Si le bouton appuyé n'est pas le backspace
    {
      source = source + value;  // Ajoute à la valeur le chiffre inscrit sur le boutn
    }
    else  // Si le bouton appuyé est le backspace
    {
      if(source.length == 1)  // Si la valeur a un seul caractère
      {
        source = '0'; // Met la valeur à 0
      }
      else  // Si la valeur plus qu'un caractère
      {
        for(let i=0; i<source.length-1;i++) // Boucle qui parcour chaque caractère de la valeur sauf le dernier
        {
          stringTemporaire += source[i];  // Garde en mémoire les caractères
        }
        source = stringTemporaire;  // Met la valeur égale à celle mémoire qui ne contient pas le dernier caractère
      }
    }
    return +source  // Retour la nouvelle valeur en nombre
  }

  /*
  *@brief: Méthode pour changer la température par défaut pour l'emplacement de l'imprimante
  *@param: value: contient la nouvelle température par défaut
  *@return: rien
  */
  changeDefaultEnclosureValue(value: string): void {
    this.config.plugins.enclosure.defaultTemperature.enclosure = this.changeValue(this.config.plugins.enclosure.defaultTemperature.enclosure.toString(),value)
  }

  /*
  *@brief: Méthode pour changer la température par défaut pour l'emplacement des filaments
  *@param: value: contient la nouvelle température par défaut 
  *@return: rien
  */
  changeDefaultStorageValue(value: string): void {
    this.config.plugins.enclosure.defaultTemperature.storage = this.changeValue(this.config.plugins.enclosure.defaultTemperature.storage.toString(),value)
  }

  /*
  *@brief: Méthode pour changer la valeur du ID du capteur de l'emplacement de l'imprimante
  *@param: value: contient le nouvel ID du capteur
  *@return: rien
  */
  changeValueEnclosureSensor(value: string): void {
    this.config.plugins.enclosure.enclosureSensorID = this.changeValue(this.config.plugins.enclosure.enclosureSensorID.toString(),value);
  }

  /*
  *@brief: Méthode pour changer la valeur du ID du capteur de l'emplacement de l'imprimante
  *@param: value: contient le nouvel ID du capteur
  *@return: rien
  */
  changeValueStorageSensor(value: string): void {
    this.config.plugins.enclosure.storageSensorID = this.changeValue(this.config.plugins.enclosure.storageSensorID.toString(),value);
  }

  /*
  *@brief: Méthode pour récupérer les ports disponibles
  *@param: aucun
  *@return: rien
  */
  showAvailablePorts(): void {
    this.lectureInfoConnection();
    this.availablePortsOptions = [];  // Efface les anciens port disponibles
    for(let i=0;i<this.info.options.ports.length;i++) // Boucle qui parcour tous les ports disponibles
    { 
      this.availablePortsOptions[i] = this.info.options.ports[i]; // Ajoute les ports dans la droplist des ports
    }
  }

  /*
  *@brief: Méthode pour récupérer les bauderates disponibles
  *@param: aucun
  *@return: rien
  */
  showAvailableBaudrates(): void {
    this.lectureInfoConnection();
    this.availableBaudratesOptions = [];  // Efface les anciens bauderates disponibles
    for(let i=0;i<this.info.options.baudrates.length;i++) // Boucle qui parcour tous les bauderates disponibles
    {
      this.availableBaudratesOptions[i] = this.info.options.baudrates[i]; // Ajoute les bauderates dans la droplist des bauderates
    }
  }

  /*
  *@brief: Méthode pour récupérer les informations de connexions
  *@param: aucun
  *@return: rien
  */
  private lectureInfoConnection(): void {
    this.printerservice.getCurrentConnection().subscribe({
      next: (connectionInfo: connectionInfo) => (this.info = connectionInfo) // Garde en mémoire les informations dans l'objet connectionInfo
    });
  }
  public ngOnDestroy(): void {
    this.electronService.removeListener('configSaved', this.onConfigSaved.bind(this));
    this.electronService.removeListener('configSaveFail', this.onConfigSaveFail.bind(this));
  }

  public hideSettings(): void {
    if (
      this.configService.isEqualToCurrentConfig(this.configService.createConfigFromInput(this.config)) ||
      this.overwriteNoSave
    ) {
      this.fadeOutAnimation = true;
      this.closeFunction.emit();
      setTimeout((): void => {
        this.fadeOutAnimation = false;
      }, 5000);
    } else {
      this.notificationService.setNotification({
        heading: $localize`:@@conf-unsaved:Configuration not saved!`,
        // eslint-disable-next-line max-len
        text: $localize`:@@conf-unsaved-message:You haven't saved your config yet, so your changes will not be applied. Click close again if you want to discard your changes!`,
        type: NotificationType.WARN,
        time: new Date(),
      });
      this.overwriteNoSave = true;
    }
  }

  public stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  public changePage(page: number, current: number, direction: 'forward' | 'backward'): void {
    this.pages[current].classList.add('settings__content-slideout-' + direction);
    this.pages[page].classList.remove('settings__content-inactive');
    this.pages[page].classList.add('settings__content-slidein-' + direction);

    setTimeout((): void => {
      this.pages[current].classList.add('settings__content-inactive');
      this.pages[current].classList.remove('settings__content-slideout-' + direction);
      this.pages[page].classList.remove('settings__content-slidein-' + direction);
    }, 370);
    if(page == 4 && direction == 'forward') // Si on accède à la page de connexion
    {
      this.showAvailablePorts();  
      this.showAvailableBaudrates();  
      this.portSelected = this.info.current.port; // Récupère le port présentement sélectionné et l'affiche
      this.baudrateSelected = this.info.current.baudrate; // Récupère le bauderate présentement sélectionné et l'affiche
    }
  }

  public updateConfig(): void {
    // Variable pour convertir le bauderate en string, car la valeur dans la variable qui contient le bauderate sélectionné ne fonctionne pas 
    // pour changer ce paramètre dans la connexion. Alors, pour régler se problème, on transforme la valeur en string pour la retransformer
    // en number. C'est stupide, mais fonctionnel
    let workingBauderate: string; 
    const config = this.configService.createConfigFromInput(this.config);
    this.electronService.on('configSaved', this.onConfigSaved.bind(this));
    this.electronService.on('configSaveFail', this.onConfigSaveFail.bind(this));
    this.configService.saveConfig(config);
    workingBauderate = this.baudrateSelected.toString();  // Converti le bauderate en string
    if(this.portSelected != this.info.current.port || this.baudrateSelected != this.info.current.baudrate)  // Si le port ou le bauderate choisi est différent que celui actuel
    {
      this.printerservice.setConnection(this.portSelected,+workingBauderate); // Change le port et le bauderate de la connexion entre OctoPRint et l'imprimante
    }
  }

  private onConfigSaveFail(_, errors: string[]) {
    this.notificationService.setNotification({
      heading: $localize`:@@error-invalid-config:Can't save invalid config`,
      text: String(errors),
      type: NotificationType.WARN,
      time: new Date(),
    });
  }

  private onConfigSaved() {
    this.hideSettings();
    this.electronService.send('reload');
  }

  public showUpdate(): void {
    this.update = true;
  }

  public hideUpdate(): void {
    this.update = false;
  }
}
