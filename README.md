Live:[https://dns-15.onrender.com/](https://dns-15.onrender.com/)

DNS Server Project
A Node.js-based DNS server and web interface for managing and querying DNS records, using MongoDB for storage. The project includes a UDP-based DNS server (server.js) and an Express web interface (web.js) for DNS record management and lookups.
Features

DNS Server: Handles DNS queries on a configurable port (default: 1024).
Web Interface: Manage DNS records (add, update, delete) and perform DNS lookups with redirection support for A records.
MongoDB Integration: Stores DNS records persistently.
Render Deployment: Configured for deployment on Render with separate web and worker services.

Prerequisites

Node.js (v18 or higher)
MongoDB Atlas account
Render account (for deployment)
npm (for dependency management)

Setup Instructions
Local Development

Clone the Repository:
git clone https://github.com/sanandalshi/DNS.git
cd DNS


Install Dependencies:
npm install


Configure Environment Variables:Create a .env file in the project root with the following:
NODE_ENV=development
MONGODB_URI=mongodb+srv://sanandalshi:QOVH95S4KQ0ESu89@cluster0.znvpuws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=sanandalshi
DB_USER=sanandalshi
DB_PASSWORD=QOVH95S4KQ0ESu89
DNS_PORT=1024
DNS_HOST=localhost
PORT=8080

Install dotenv:
npm install dotenv

Add require('dotenv').config(); to database.js, server.js, and web.js.

MongoDB Atlas Setup:

Ensure the MongoDB Atlas cluster (Cluster0) is active.
In Atlas, go to Network Access and add 0.0.0.0/0 (allow all) to the IP whitelist.
Verify credentials (sanandalshi:QOVH95S4KQ0ESu89) in Database Access.
Test connection:mongosh "mongodb+srv://sanandalshi:QOVH95S4KQ0ESu89@cluster0.znvpuws.mongodb.net/sanandalshi"




Run Locally:
npm run start-full


DNS server runs on localhost:1024 (UDP).
Web interface runs on http://localhost:8080.
Use npm run start-local for interactive setup with dns-starter.js.



Deployment on Render

Push to GitHub:Ensure your repository (https://github.com/sanandalshi/DNS) is up-to-date.

Create Render Services:

In Render, create a Web Service for web.js and a Worker Service for server.js.
Use the provided .render.yaml:services:
  - type: web
    name: dns-server
    env: node
    plan: free
    repo: https://github.com/sanandalshi/DNS
    branch: main
    buildCommand: npm install
    startCommand: node web.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: mongodb+srv://sanandalshi:QOVH95S4KQ0ESu89@cluster0.znvpuws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
      - key: DB_NAME
        value: sanandalshi
      - key: DB_USER
        value: sanandalshi
      - key: DB_PASSWORD
        value: QOVH95S4KQ0ESu89
      - key: DNS_PORT
        value: 1024
      - key: DNS_HOST
        value: localhost
      - key: PORT
        value: 8080
    ports:
      - port: 8080
        protocol: tcp
  - type: worker
    name: dns-worker
    env: node
    plan: free
    repo: https://github.com/sanandalshi/DNS
    branch: main
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: mongodb+srv://sanandalshi:QOVH95S4KQ0ESu89@cluster0.znvpuws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
      - key: DB_NAME
        value: sanandalshi
      - key: DB_USER
        value: sanandalshi
      - key: DB_PASSWORD
        value: QOVH95S4KQ0ESu89
      - key: DNS_PORT
        value: 1024
    ports:
      - port: 1024
        protocol: udp




Deploy:

Deploy via Render dashboard or CLI.
Monitor logs for:
Database connected successfully to sanandalshi
DNS server listening on port 1024
Web interface running on http://0.0.0.0:8080





Troubleshooting

MongoDB SSL Error:
If you see MongoServerSelectionError: tlsv1 alert internal error, check Atlas IP whitelist (0.0.0.0/0) and credentials.
Reset the Atlas user password if needed and update MONGODB_URI.


Port Issues:
Ensure DNS_PORT=1024 in server.js and environment variables.
If Render free tier limits UDP, use pm2 to run both servers in one service (see ecosystem.config.js).


Logs:
Check Render logs for database or server errors.
Test locally with npm run start-full.



Files

server.js: DNS server (UDP, port 1024).
web.js: Express web interface (TCP, port 8080).
database.js: MongoDB connection logic.
dns-starter.js: Local setup script (not used in production).
ecosystem.config.js: Optional pm2 configuration for single-service deployment.

Notes

Render’s free tier may limit UDP support or multiple services. Consider a paid tier for production.
For external DNS queries, update DNS_HOST to 8.8.8.8 (Google DNS) and DNS_PORT to 53 in web.js.

