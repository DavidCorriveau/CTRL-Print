1.Afficher les données d'un capteur connecté au plugin Enclosure dans Octoprint
Mettre les bon ID dans la bonne case dans les paramètres plugin d'octodash.
Exemple: le capteur physique pour l'enceinte a l'ID 1 dans Octoprint. Alors, mettre 1 dans la
 	 zone de texte pour l'ID du capteur dans l'enceinte dans Octodash.
   
   

2.Quoi modifier dans le code pour afficher un autre capteur

2.1 ajouter une variable qui contiendera le numéro d'ID du capteur dans l'interface EnclosurePlugin dans le fichier /config/config.model.ts et dans le fichier /config/config.default.ts.

2.2 ajouter une zone de texte dans la fenêtre settings -> puglin dans la section Enclosure qui permet d'entrer un numéro d'ID qui est lié avec
    l'interface EnclosurePlugin.
    
2.3 Dans le fichier /config/config.service.ts, copier-coller la méthode getAmbiantTemperatureSensorName(), mais en modifiant son nom et remplacer .ambientSensorID pour le nom de variable créé à l'étape 2.1

2.4 Dans le fichier /services/enclosure/enclosure.service.ts, copier-coller la méthode getEnclosureTemperature(), mais avec un nom différent

2.5 Dans le fichier /services/enclosure/enclosure.octoprint.service.ts, copier-coller la méthode getEnclosureTemperature(), mais avec un nom différent et changer l'appel de la méthode par celle de l'étape 2.3

2.6 Dans le fichier /bottom-bar/bottom-bar.component.ts, copier le code qui commence par if (this.configService.getAmbientTemperatureSensorName() !== null) { jusqu'a la fermeture de l'accolade de ce if.Mettre ce bout de code dans le fichier ts de la page désirée dans son constructeur, changer les noms des méthodes pour ceux ajoutées dans les étapes précèdentes, créer une variable qui remplacera this.enclosureTemperature qui contient la lecture du capteur et ajouter les import nécessaire. 
