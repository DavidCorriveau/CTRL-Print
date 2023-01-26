# Projet-controle-température-imprimante-3D
dossier Octodash modifier: Contient tout le code de la logique de l'application qui est fait avec Angular.
dossier app: Contient tous les fichiers pour fonctionner sur Raspberry pi. Il manque juste à le compresser en format asar.
Avant, il faut ajouté le projet Angular compilé qui doit se retrouvé dans app/dist/en. Pour compiler le projet Angular, il faut suivre ces étapes:
1. Il faut ouvrir le dossier Octodash modifier dans VSCode.
2. Ouvrir un terminal en bash
3. il faut installer Angular CLI dans le terminal ouvert si ce n'est pas fait. npm install -g @angular/cli. Possible qu'il faut faire d'autre manipulation pour que les commandes fonctionnent.
4. Ensuite, il suffit d'entrer la commande ng build. Cette commande va ajouter un dossier dist au projet avec les fichiers compilés.

Après, pour compresser l'application en asar, suivre ces étapes:
1. transfèrer les fichier compilé dans le dossier app/dist/en.
2. Si ce n'est pas fait, il faut installer la commande asar avec cette commande: npm install --engine-strict asar
3. Faire un npm init dans le dossier app à l'aide d'un terminal
4. Pour compresser, il suffit d'entrer la commande: asar pack *emplacement* app.asar. Exemple: asar pack C:\User\user\app app.asar

Maintenant, le fichier app.asar est prêt à être mis dans le raspberry pi dans /opt/Octodash/ressources.
