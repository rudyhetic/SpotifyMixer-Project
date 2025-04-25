<template>
  <div id="app">

    <!-- Bouton de connexion -->
    <button @click="loginWithSpotify" class="login-btn">Se connecter avec Spotify</button>

    <!-- Bouton Fusionner centré -->
    <div class="merge-zone">
      <button
        @click="mergePlaylists"
        :disabled="selectedPlaylists.length !== 2"
        class="merge-btn"
      >
        Fusionner 🎶
      </button>
    </div>

    <!-- Playlists -->
    <div v-if="playlists.length" class="playlist-bar">
      <h2>Mes Playlists</h2>
      <div class="grid">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="playlist-item"
        >
          <input
            type="checkbox"
            :value="playlist"
            v-model="selectedPlaylists"
            :disabled="selectedPlaylists.length >= 2 && !selectedPlaylists.includes(playlist)"
          />
          <img
            :src="playlist.images[0]?.url || 'https://via.placeholder.com/100'"
            alt="cover"
          />
          <span>{{ playlist.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playlists: [],
      selectedPlaylists: [],
      accessToken: '',
    };
  },
  mounted() {
    const path = window.location.pathname;

    if (path === "/callback") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        fetch("http://localhost:3000/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.access_token) {
              localStorage.setItem("access_token", data.access_token);
              window.location.href = "/";
            } else {
              alert("Erreur lors de la récupération du token.");
            }
          })
          .catch((err) => {
            console.error(err);
            alert("Erreur serveur.");
          });
      }
    } else {
      const token = localStorage.getItem("access_token");
      if (token) {
        this.accessToken = token;
        this.getUserPlaylists(token);
      }
    }
  },
  methods: {
    loginWithSpotify() {
      const clientId = "11897c990fe24b77919775eb110bf9d9";
      const redirectUri = "http://localhost:5173/callback";
      const scope =
        "playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private";
      const responseType = "code";

      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=${encodeURIComponent(scope)}&response_type=${responseType}`;

      window.location.href = authUrl;
    },

    async getUserPlaylists(token) {
      const res = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      this.playlists = data.items || [];
    },

    async getTracksFromPlaylist(playlistId) {
      const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      const data = await res.json();
      return data.items.map((item) => item.track.uri);
    },

    async mergePlaylists() {
      if (this.selectedPlaylists.length !== 2) return;

      const uris1 = await this.getTracksFromPlaylist(this.selectedPlaylists[0].id);
      const uris2 = await this.getTracksFromPlaylist(this.selectedPlaylists[1].id);
      const allUris = [...new Set([...uris1, ...uris2])];

      const userRes = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      const userData = await userRes.json();

      const createRes = await fetch(
        `https://api.spotify.com/v1/users/${userData.id}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Fusion de ${this.selectedPlaylists[0].name} + ${this.selectedPlaylists[1].name}`,
            description: "Créée via Vue.js 🎵",
            public: false,
          }),
        }
      );
      const newPlaylist = await createRes.json();

      for (let i = 0; i < allUris.length; i += 100) {
        const batch = allUris.slice(i, i + 100);
        await fetch(`https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: batch }),
        });
      }

      alert("✅ Playlists fusionnées avec succès !");
    },
  },
};
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #121212;
  color: white;
  font-family: sans-serif;
  overflow: hidden;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.login-btn {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #1db954;
  border: none;
  color: white;
  margin: 10px;
  width: fit-content;
  border-radius: 10px;
}

.login-btn:hover {
  background-color: #1ed760;
}

.merge-zone {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.merge-btn {
  padding: 14px 24px;
  font-size: 18px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: #2c2c2c;
  color: white;
}

.merge-btn:disabled {
  background-color: #444;
  cursor: not-allowed;
}

.merge-btn:not(:disabled):hover {
  background-color: #1db954;
}

.playlist-bar {
  background-color: #181818;
  height: 30%;
  padding: 10px 20px;
  overflow-y: auto; 
  border-top: 1px solid #333;
}


.playlist-bar h2 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

/* bar style */

.playlist-bar::-webkit-scrollbar {
  width: 8px;
}

.playlist-bar::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.playlist-bar::-webkit-scrollbar-thumb {
  background-color: #3e3e3e;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.playlist-bar::-webkit-scrollbar-thumb:hover {
  background-color: #1db954; 
}

/* ---- */

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-height: 100%;
}

.playlist-item {
  display: flex;
  align-items: center;
  width: 250px;
  background-color: #242424;
  border-radius: 8px;
  padding: 10px;
  gap: 10px;
  overflow: hidden;
}

.playlist-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
