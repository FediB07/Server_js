const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Create a WebSocket server by passing the HTTP server instance
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Add the new client to the set
  clients.add(ws);

  // Event handler for messages from clients
  ws.on('message', (message) => {
    console.log(`${message}`);

    // Broadcast the received message to all connected clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // Send the message as plain text
        client.send(message.toString());
      }
    });
  });

  // Event handler for client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    // Remove the disconnected client from the set
    clients.delete(ws);
  });
});

// Define the path to your HTML page
const htmlPath = path.join(__dirname, 'index.html'); // assuming your HTML file is named index.html

// Serve the HTML page at the root URL path
app.get('/', (req, res) => {
  res.sendFile(htmlPath);
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// const WebSocket = require('ws');
// const http = require('http');
// const express = require('express');
// const path = require('path');
// const admin = require('firebase-admin');

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// // Initialiser Firestore
// admin.initializeApp({
//   credential: admin.credential.applicationDefault()
// });

// const firestore = admin.firestore();

// // Stocker les clients connectés
// const clients = new Set();

// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   // Ajouter le nouveau client à l'ensemble
//   clients.add(ws);

//   // Gestionnaire d'événements pour les messages WebSocket
//   ws.on('message', (message) => {
//     console.log(`Message received: ${message}`);
//     // Vous pouvez traiter le message reçu ici si nécessaire
//   });

//   // Gestionnaire d'événements pour la déconnexion du client
//   ws.on('close', () => {
//     console.log('Client disconnected');
//     // Supprimer le client déconnecté de l'ensemble
//     clients.delete(ws);
//   });
// });

// // Définir le chemin vers votre page HTML
// const htmlPath = path.join(__dirname, 'index.html'); // en supposant que votre fichier HTML s'appelle index.html

// // Servir la page HTML à l'URL racine
// app.get('/', (req, res) => {
//   res.sendFile(htmlPath);
// });

// // Définir une route pour récupérer les données de température et d'humidité depuis Firestore
// app.get('/api/donne/temp-humidity', (req, res) => {
//   // ... (votre code pour récupérer les données Firestore)

//   // Envoyer les données aux clients WebSocket
//   const jsonData = JSON.stringify(data);
//   clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       // Envoyer les données en tant que chaîne JSON
//       client.send(jsonData);
//     }
//   });

//   // Répondre à la requête HTTP avec les données
//   res.json(data);
// });

// // Démarrer le serveur
// const PORT = process.env.PORT || 8080;
// server.listen(PORT, () => {
//   console.log(`Le serveur fonctionne sur http://localhost:${PORT}`);
// });
