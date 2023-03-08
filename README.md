# Projet-controle-température-imprimante-3D

## table des matières
1. Description des dossiers
2. Procédure pour compiler l'application

### Descrition des dossiers

#### 1. OctoDash-modifier:
Contient tout le code qui fait fonctionner l'interface utilisateur. Cette interface est un projet Angular qui permet de faire des applications avec plusieurs fenêtres et de permettre de passer de l'information entre elles comme par exemple des variables.
#### 2. OctoPrint-Enclosure-master:
Contient le code source pour le plugin Enclosure qui se trouve dans OctoPrint. C'est ce qui permet de controler les éléments chauffants et récupérer les informations des capteurs.
#### 3. app:
Contient les fichiers qui doivent être compressé en un fichier .asar et transférer dans le Raspberry Pi pour que l'application soit utilisé par lui. Une procédure pour compresser ces fichiers est expliqué plus bas.

### Procédure pour compiler l'application

Il faut ajouté le projet Angular compilé qui doit se retrouvé dans app/dist/en. Pour compiler le projet Angular, il faut suivre ces étapes:
1. Il faut ouvrir le dossier Octodash modifier dans VSCode.
2. Ouvrir un terminal en bash
3. il faut installer Angular CLI dans le terminal ouvert si ce n'est pas fait. npm install -g @angular/cli. Possible qu'il faut faire d'autre manipulation pour que les commandes fonctionnent.
4. Ensuite, il suffit d'entrer la commande ng build. Cette commande va ajouter un dossier dist au projet avec les fichiers compilés.

Ensuite, pour compresser l'application en asar, suivre ces étapes:
1. transfèrer les fichier compilé dans le dossier app/dist/en.
2. Si ce n'est pas fait, il faut installer la commande asar avec cette commande: npm install --engine-strict asar
3. Faire un npm init dans le dossier app à l'aide d'un terminal
4. Pour compresser, il suffit d'entrer la commande: asar pack *emplacement* app.asar. Exemple: asar pack C:\User\user\app app.asar

Maintenant, le fichier app.asar est prêt à être mis dans le raspberry pi dans le répertoire /opt/Octodash/ressources.
