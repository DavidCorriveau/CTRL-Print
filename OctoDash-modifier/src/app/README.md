# Dossier contenant les différentes fenêtres de l'application. Il contient aussi des fichier pour le fonctionnement de l'application

## Explications des dossiers qu'on a modifiés
bottom-bar (modifié): Affiche le nom de l'imprimante et son état (connecté, en train d'imprimer, etc.).

config (modifié): Contient toutes les paramètres modifiables de l'application. Il y a des paramètres par défaut. La fenêtre de paramètre change la configuration et elle se trouve dans un autre dossier qui settings

control: Menu qui permet de controler la buse de l'imprimante. Permet aussi d'exécuter des commandes personnalisables.

filament: Menu qui permet de changer le filament de plastique de l'imprimante 3D.

files: Affiche les différents fichiers d'impression présent dans l'imprimante 3D.

height-progress: Affiche le nombre de couches finis d'imprimer sur le nombre total d'une impression.

job-status: Affichage la progression d'une impression en pourcentage. Affiche le temps restant, passé et la quantité de filaments utilisée en gramme.

main-menu: Contient les trois gros boutons pour aller dans les menu des fichiers, du changement de filaments et de control.

main-screen: Contient les fenêtres utilisés pour le menu principale.

model (modifié): Contient les différentes interfaces typescript créées.

notification: S'occupe d'afficher les notifications dans l'application lorsqu'il y a une qui est envoyé.

notification-center: Menu qui affiches toutes les notifications. Affiche aussi les commandes personalisables.

print-control (modifié): Menu qui permet d'arrêter une impression, de la mettre en pause ou ajuster des paramètres lors d'une impression.

printer-status (modifié): Affiche les températures de l'imprimante et de l'enceinte. Contient des boutons pour aller les modifiées.

services (modifié): Contient les différents service Angular utilisé par l'application.

settings (modifié): Menu des paramètres de l'application.

toggle-switch: Utilise l'animation toggle-switch

standby: Première fenêtre qui apparait lorsque l'application démarre.

update: Menu pour mettre à jour l'application.


## Procédure pour afficher les données d'un capteur connecté au plugin Enclosure dans Octoprint
Mettre les bon ID dans la bonne case dans les paramètres plugin d'octodash.
Exemple: le capteur physique pour l'enceinte a l'ID 1 dans Octoprint. Alors, mettre 1 dans la
 	 zone de texte pour l'ID du capteur dans l'enceinte dans Octodash.
   
   

## Quoi modifier dans le code pour afficher un autre capteur

1. ajouter une variable qui contiendera le numéro d'ID du capteur dans l'interface EnclosurePlugin dans le fichier /config/config.model.ts et dans le fichier /config/config.default.ts.

2. ajouter une zone de texte dans la fenêtre settings -> puglin dans la section Enclosure qui permet d'entrer un numéro d'ID qui est lié avec
    l'interface EnclosurePlugin.
    
3. Dans le fichier /config/config.service.ts, copier-coller la méthode getAmbiantTemperatureSensorName(), mais en modifiant son nom et remplacer .ambientSensorID pour le nom de variable créé à l'étape 2.1

4. Dans le fichier /services/enclosure/enclosure.service.ts, copier-coller la méthode getEnclosureTemperature(), mais avec un nom différent

5. Dans le fichier /services/enclosure/enclosure.octoprint.service.ts, copier-coller la méthode getEnclosureTemperature(), mais avec un nom différent et changer l'appel de la méthode par celle de l'étape 2.3

6. Dans le fichier /bottom-bar/bottom-bar.component.ts, copier le code qui commence par if (this.configService.getAmbientTemperatureSensorName() !== null) { jusqu'a la fermeture de l'accolade de ce if.Mettre ce bout de code dans le fichier ts de la page désirée dans son constructeur, changer les noms des méthodes pour ceux ajoutées dans les étapes précèdentes, créer une variable qui remplacera this.enclosureTemperature qui contient la lecture du capteur et ajouter les import nécessaire. 
