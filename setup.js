// const mysql = require('mysql2/promise');
// const readline = require('readline');
// const fs = require('fs');
// const path = require('path');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// async function setupDatabase() {
//   console.log('=== DNS Server Database Setup ===');
  
//   const dbConfig = {
//     host: 'localhost',
//     user: '',
//     password: ''
//   };
  
//   // Collect database credentials
//   dbConfig.host = await new Promise(resolve => {
//     rl.question('Enter MySQL host [localhost]: ', (answer) => {
//       resolve(answer || 'localhost');
//     });
//   });
  
//   dbConfig.user = await new Promise(resolve => {
//     rl.question('Enter MySQL username [root]: ', (answer) => {
//       resolve(answer || 'root');
//     });
//   });
  
//   dbConfig.password = await new Promise(resolve => {
//     rl.question('Enter MySQL password: ', (answer) => {
//       resolve(answer || '');
//     });
//   });
  
//   const dbName = await new Promise(resolve => {
//     rl.question('Enter database name [dns_server]: ', (answer) => {
//       resolve(answer || 'dns_server');
//     });
//   });
  
//   try {
//     // Create connection without database selected
//     console.log('Connecting to MySQL server...');
//     const connection = await mysql.createConnection({
//       host: dbConfig.host,
//       user: dbConfig.user,
//       password: dbConfig.password
//     });
    
//     // Create database if it doesn't exist
//     console.log(`Creating database '${dbName}' if it doesn't exist...`);
//     await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
//     // Switch to the database
//     await connection.query(`USE ${dbName}`);
    
//     // Create the DNS table
//     console.log('Creating DNS records table...');
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS dns (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         url VARCHAR(255) NOT NULL,
//         record ENUM('A', 'CNAME', 'MX', 'TXT') NOT NULL DEFAULT 'A',
//         data VARCHAR(255) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         INDEX (url)
//       )`);
      
//     // Check if there are any records
//     const [rows] = await connection.query('SELECT COUNT(*) as count FROM dns');
    
//     // Add sample data if table is empty
//     if (rows[0].count === 0) {
//       console.log('Adding sample DNS records...');
//       await connection.query(`
//         INSERT INTO dns (url, record, data) VALUES
//         ('example.com', 'A', '192.168.1.1'),
//         ('www.example.com', 'CNAME', 'example.com'),
//         ('mail.example.com', 'A', '192.168.1.2'),
//         ('example.com', 'MX', 'mail.example.com'),
//         ('example.com', 'TXT', 'v=spf1 mx -all')
//       `);
//     }
    
//     // Create database config file
//     const utilDir = path.join(__dirname, 'util');
//     if (!fs.existsSync(utilDir)) {
//       console.log('Creating util directory...');
//       fs.mkdirSync(utilDir, { recursive: true });
//     }
    
//     const dbConfigContent = `const mysql = require('mysql2/promise');

// // Create a pool of database connections
// const pool = mysql.createPool({
//     host: '${dbConfig.host}',
//     user: '${dbConfig.user}',
//     password: '${dbConfig.password}',
//     database: '${dbName}',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// // Test database connection and log success/failure
// pool.getConnection()
//     .then(conn => {
//         console.log('Database connected successfully');
//         conn.release();
//     })
//     .catch(err => {
//         console.error('Database connection failed:', err);
//     });

// module.exports = pool;`;

//     const dbConfigPath = path.join(utilDir, 'database.js');
//     console.log(`Creating database configuration file at ${dbConfigPath}...`);
//     fs.writeFileSync(dbConfigPath, dbConfigContent);
    
//     console.log('Database setup completed successfully!');
//     console.log('\nTo start the DNS server:');
//     console.log('1. Use "npm start" to launch both DNS and web servers');
//     console.log('   (You may need to run as administrator/sudo to bind to port 53)');
//     console.log('2. Or use "node dns-starter.js" for guided startup');
    
//     connection.end();
//     rl.close();
    
//   } catch (error) {
//     console.error('Error setting up database:', error);
//     console.error('\nTroubleshooting tips:');
//     console.error('1. Make sure MySQL server is running');
//     console.error('2. Verify your MySQL username and password');
//     console.error('3. Check that the MySQL user has sufficient privileges');
//     rl.close();
//     process.exit(1);
//   }
// }

// setupDatabase();
const { MongoClient } = require('mongodb');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupDatabase() {
  console.log('=== DNS Server Database Setup (MongoDB) ===');
  
  const dbConfig = {
    host: 'localhost',
    port: '27017',
    user: '',
    password: 'KRwm7Is3Fh01PqJu'
  };
  
  // Collect database credentials
  dbConfig.host = await new Promise(resolve => {
    rl.question('Enter MongoDB host [localhost]: ', (answer) => {
      resolve(answer || 'localhost');
    });
  });
  
  dbConfig.port = await new Promise(resolve => {
    rl.question('Enter MongoDB port [27017]: ', (answer) => {
      resolve(answer || '27017');
    });
  });
  
  dbConfig.user = await new Promise(resolve => {
    rl.question('Enter MongoDB username []: ', (answer) => {
      resolve(answer || '');
    });
  });
  
  dbConfig.password = await new Promise(resolve => {
    rl.question('Enter MongoDB password [KRwm7Is3Fh01PqJu]: ', (answer) => {
      resolve(answer || 'KRwm7Is3Fh01PqJu');
    });
  });
  
  const dbName = await new Promise(resolve => {
    rl.question('Enter database name [dns]: ', (answer) => {
      resolve(answer || 'dns');
    });
  });
  
  try {
    // Create MongoDB connection string
    let connectionString = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbName}`;
    
    // Add authentication if credentials are provided
    const auth = {};
    if (dbConfig.user) auth.username = dbConfig.user;
    if (dbConfig.password) auth.password = dbConfig.password;
    
    console.log('Connecting to MongoDB server...');
    const client = new MongoClient(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auth: Object.keys(auth).length > 0 ? auth : undefined
    });
    
    await client.connect();
    console.log(`Connected to MongoDB at ${dbConfig.host}:${dbConfig.port}`);
    
    const db = client.db(dbName);
    
    // Create collection if it doesn't exist
    console.log('Creating DNS records collection...');
    
    // Check if 'dns' collection exists, create it if not
    const collections = await db.listCollections({ name: 'dns' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('dns');
      console.log('DNS collection created');
    }
    
    // Create index on url and record fields
    await db.collection('dns').createIndex({ url: 1, record: 1 });
    
    // Check if there are any records
    const count = await db.collection('dns').countDocuments();
    
    // Add sample data if collection is empty
    if (count === 0) {
      console.log('Adding sample DNS records...');
      await db.collection('dns').insertMany([
        { url: 'example.com', record: 'A', data: '192.168.1.1', created_at: new Date(), updated_at: new Date() },
        { url: 'www.example.com', record: 'CNAME', data: 'example.com', created_at: new Date(), updated_at: new Date() },
        { url: 'mail.example.com', record: 'A', data: '192.168.1.2', created_at: new Date(), updated_at: new Date() },
        { url: 'example.com', record: 'MX', data: 'mail.example.com', created_at: new Date(), updated_at: new Date() },
        { url: 'example.com', record: 'TXT', data: 'v=spf1 mx -all', created_at: new Date(), updated_at: new Date() }
      ]);
    }
    
    // Create database config file
    const utilDir = path.join(__dirname, 'util');
    if (!fs.existsSync(utilDir)) {
      console.log('Creating util directory...');
      fs.mkdirSync(utilDir, { recursive: true });
    }
    
    const dbConfigContent = `const { MongoClient } = require('mongodb');

// MongoDB connection URL with credentials
const uri = process.env.MONGODB_URI || 'mongodb://${dbConfig.host}:${dbConfig.port}';
const dbName = process.env.DB_NAME || '${dbName}';
const username = process.env.DB_USER || '${dbConfig.user}';
const password = process.env.DB_PASSWORD || '${dbConfig.password}';

// Create a MongoDB client
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
        username: username,
        password: password
    }
});

// Connect to MongoDB
let db;
async function connectDB() {
    try {
        await client.connect();
        console.log('Database connected successfully');
        db = client.db(dbName);
        
        // Ensure collections exist
        await db.createCollection('dns');
        
        // Create indexes for better performance
        await db.collection('dns').createIndex({ url: 1, record: 1 });
        
        return db;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
}

// Connect to the database when this module is loaded
connectDB().catch(console.error);

// Handle application termination
process.on('SIGINT', async () => {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
    process.exit(0);
});

module.exports = {
    getDb: () => db,
    connectDB,
    client
};`;

    const dbConfigPath = path.join(utilDir, 'database.js');
    console.log(`Creating database configuration file at ${dbConfigPath}...`);
    fs.writeFileSync(dbConfigPath, dbConfigContent);
    
    console.log('Database setup completed successfully!');
    console.log('\nTo start the DNS server:');
    console.log('1. Use "npm start" to launch both DNS and web servers');
    console.log('   (You may need to run as administrator/sudo to bind to port 53)');
    console.log('2. Or use "node dns-starter.js" for guided startup');
    
    await client.close();
    rl.close();
    
  } catch (error) {
    console.error('Error setting up database:', error);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure MongoDB server is running');
    console.error('2. Verify your MongoDB username and password');
    console.error('3. Check that the MongoDB user has sufficient privileges');
    rl.close();
    process.exit(1);
  }
}

setupDatabase();