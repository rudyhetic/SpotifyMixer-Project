# SpotifyMixer-Project 🎶🎧

Ce projet permet de **fusionner deux playlists Spotify** en une seule, en utilisant l'API de Spotify et un frontend développé avec **Vue.js**.

## Fonctionnalités principales :
- 🔑 **Connexion avec Spotify** via OAuth2.
- 🎶 **Sélection de deux playlists** à fusionner.
- 🎉 **Création d'une nouvelle playlist fusionnée** sur le compte utilisateur avec les chansons des deux playlists sélectionnées.
- 📱 **Interface utilisateur simple** pour gérer la connexion, la sélection des playlists, et la fusion.

## Technologies utilisées :
- **Frontend** : Vue.js ⚡
- **Backend** : Node.js (si applicable) 🚀
- **API** : Spotify Web API 🎧 pour accéder aux playlists et aux pistes des utilisateurs.

## Prérequis :
Avant de commencer, assurez-vous d'avoir :
- 🎵 Un compte Spotify
- 🔑 Une clé API Spotify (que vous pouvez obtenir via le [Tableau de bord des développeurs Spotify](https://developer.spotify.com/dashboard/applications))

### Installation du projet :

1. Clonez ce dépôt :
    ```bash
    git clone https://github.com/ton-utilisateur/Fusionner-Playlists-Spotify-Project.git
    ```

2. Allez dans le répertoire du projet :
    ```bash
    cd Fusionner-Playlists-Spotify-Project
    ```

3. Installez les dépendances pour le frontend (Vue.js) :
    ```bash
    npm install
    ```

4. Lancez le projet localement :
    ```bash
    npm run dev
    ```

### Variables d'environnement :
Avant de démarrer l'application, vous devez configurer les clés d'API dans un fichier `.env`. Placez ce fichier dans le répertoire `backend/` si vous avez un backend, ou dans la racine du projet si vous gérez tout côté frontend.

Exemple de fichier `.env` :
```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
