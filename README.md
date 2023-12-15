# Guide d'installation et de démarrage pour un projet React déjà téléchargé

Ce guide vous aidera à lancer un projet React préalablement téléchargé sur votre machine en installant les packages requis et en exécutant `npm start` pour le faire fonctionner en local.

## Prérequis

Assurez-vous d'avoir Node.js installé sur votre machine. Si ce n'est pas le cas, vous pouvez télécharger et installer Node.js en suivant les étapes ci-dessous.

### Installation de Node.js

1. **Téléchargement de Node.js :**

   - Rendez-vous sur le [site officiel de Node.js](https://nodejs.org).
   - Téléchargez la version recommandée pour votre système d'exploitation (Windows, macOS, Linux).
   - Suivez les instructions du programme d'installation pour installer Node.js.

2. **Vérification de l'installation :**
   - Ouvrez votre terminal (ou invite de commande sur Windows).
   - Tapez les commandes suivantes pour vérifier si Node.js et npm (le gestionnaire de paquets de Node.js) sont installés et pour voir leurs versions :
     ```
     node -v
     npm -v
     ```

## Installation des dépendances du projet

1. **Accédez au répertoire du projet :**

   - Ouvrez votre terminal.
   - Utilisez la commande `cd` pour naviguer jusqu'au répertoire du projet téléchargé.

2. **Installation des packages nécessaires :**
   - Une fois dans le répertoire du projet, exécutez la commande suivante pour installer toutes les dépendances :
     ```
     npm i
     ```

## Démarrage du projet React en local

Une fois les dépendances installées, suivez ces étapes pour lancer le projet en local :

1. **Démarrage du serveur de développement :**

   - Utilisez la commande suivante pour lancer le projet en mode développement :
     ```
     npm start
     ```

2. **Accès à l'application :**

   - Après avoir démarré le serveur, ouvrez un navigateur web et allez à l'adresse suivante :
     ```
     http://localhost:3000/
     ```

3. **Arrêt du serveur de développement :**
   - Pour arrêter le serveur de développement, retournez dans votre terminal et utilisez `Ctrl + C`.
