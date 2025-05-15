// const mysql = require('mysql2/promise');

// // Create a pool of database connections
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'Wj28@krhps',
//     database: 'dns_server',
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

// module.exports = pool;
// const mysql = require('mysql2/promise');

// // Create a pool of database connections using environment variables
// const pool = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || 'Wj28@krhps',
//     database: process.env.DB_NAME || 'dns_server',
//     waitForConnections: true,
//     connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
//     queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0
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

// module.exports = pool;
const { MongoClient } = require('mongodb');

// // MongoDB connection URL with credentials
// const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
// const dbName = process.env.DB_NAME || 'dns server';
// const username = process.env.DB_USER || 'KRwm7Is3Fh01PqJu';
// const password = process.env.DB_PASSWORD || 'KRwm7Is3Fh01PqJu';
const dbName = process.env.DB_NAME || 'sanandalshi';
const username = process.env.DB_USER || 'sanandalshi';
const password = process.env.DB_PASSWORD || 'QOVH95S4KQ0ESu89';
const uri = process.env.MONGODB_URI || `mongodb+srv://sanandalshi:${password}@cluster0.znvpuws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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
};
