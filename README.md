# CTRL-Print

## table des matières
1. Description des dossiers
2. Procédure pour compiler l'application

## Descrition des dossiers

### 1. OctoDash-modifier:
Contient tout le code qui fait fonctionner l'interface utilisateur. Cette interface est un projet Angular qui permet de faire des applications avec plusieurs fenêtres et de permettre de passer de l'information entre elles comme par exemple des variables.
### 2. OctoPrint-Enclosure-master:
Contient le code source pour le plugin Enclosure qui se trouve dans OctoPrint. C'est ce qui permet de controler les éléments chauffants et récupérer les informations des capteurs. Dossier original, rien n'a été modifié.
### 3. app:
Contient les fichiers qui doivent être compressé en un fichier .asar et transférer dans le Raspberry Pi pour que l'application soit utilisé par lui. Une procédure pour compresser ces fichiers est expliqué plus bas.

## Procédure pour compiler l'application
1. Ouvrir le dossier Octodash-modifier dans VSCode.
2. Ouvrir un terminal dans VSCode à l'aide de l'onglet Terminal. ![image](https://user-images.githubusercontent.com/89463135/229137042-135e6e43-b1c0-4829-9986-2d3fffe35966.png)
3. Sélectionner un terminal en bash.
4. Installer Angular CLI dans le terminal ouvert si ce n'est pas fait. npm install -g @angular/cli. Cela permettera de compilé tous les fichiers du programme. Possible qu'il faut faire d'autre manipulation pour que les commandes fonctionnent.
5. Dand le terminal bash dans VSCode, entrez la commande ng build pour commencer la compilation du programme.
6. Après, un dossier dist apparait dans le dossier Octodash-modifier. Il faut transférer tous les fichiers du dossier dist dans le dossier /CTRL-Pint/app/dist/en.
7. Ouvrez un terminal dans le dossier /CTRL-Print/app.
8. Installez la commande asar avec la commande suivante: npm install --engine-strict asar. C'est pour compresser les fichiers compilés en asar, car le Raspberry pi à besoin de ce type de fichier pour démarrer l'application.
9. Tapez la commande npm init et appuyé sur enter à chaque nouvelle ligne qui apparait.
10. Entrez la commande: asar pack *emplacement du dossier app* app.asar. Exemple: asar pack C:\Users\User\app app.asar

Maintenant, le fichier app.asar est prêt à être mis dans le raspberry pi dans le répertoire /opt/Octodash/ressources pour faire fonctionner l'interface. Penser à relancer le tty utilisé par l'application: sudo service getty@tty1 restart
