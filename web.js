// // const express = require('express');
// // const app = express();
// // const dgram = require('dgram');
// // const ejs = require('ejs');
// // const dnsPacket = require('dns-packet');
// // const bp = require('body-parser');

// // app.set('view engine', 'ejs');
// // app.use(bp.urlencoded({ extended: false }));

// // app.get('/', (req, res) => {
// //     res.render('index');
// // });

// // app.post('/dns', (req, res) => {
// //     const domain = req.body.url;

// //    const type = req.body.recordType;
// //     const socket = dgram.createSocket('udp4');

// //     const message = dnsPacket.encode({
// //         type: 'query',
// //         id: 1234, 
// //         flags: dnsPacket.RECURSION_DESIRED,
// //         questions: [{
// //             name: domain,
// //             type: type,  
// //             class: 'IN'
// //         }]
// //     });

 
// //     socket.send(message, 53, 'localhost', (err) => {
// //         if (err) {
// //             console.log('Error occurred:', err);
// //             res.status(500).send('Error occurred while sending DNS query');
// //             return;
// //         }
// //     });


// //     socket.on('message', (msg) => {
// //         const dnsRecord = dnsPacket.decode(msg);
// // console.log(msg);
// //         // if (dnsRecord.answers && dnsRecord.answers.length > 0) {
// //         //     console.log(dnsRecord.answers);
// //         //     const data = dnsRecord.answers[0].data;

            
// //         //     if (data === '0.0.0.0') {
// //         //         res.redirect('/');
// //         //     } else {
       
// //         //         res.send(`The data is: ${data}`);
// //         //     }
// //         // } else {
// //         //     res.send('No DNS record found.');
// //         // }

        
// //         socket.close();
// //     });
// // });

// // app.listen(8080, () => {
// //     console.log('Server is running on port 8080');
// // });
// const express = require('express');
// const app = express();
// const dgram = require('dgram');
// const ejs = require('ejs');
// const dnsPacket = require('dns-packet');
// const bp = require('body-parser');
// const db = require('./util/database');

// app.set('view engine', 'ejs');
// app.use(bp.urlencoded({ extended: false }));
// app.use(express.static('public'));

// // Home page - show form and list of records
// app.get('/', async (req, res) => {
//     try {
//         const [records] = await db.execute('SELECT * FROM dns ORDER BY url ASC');
//         res.render('index', { records: records, result: null });
//     } catch (err) {
//         console.error('Database error:', err);
//         res.render('index', { records: [], result: null, error: 'Database connection error' });
//     }
// });

// // Handle DNS lookup requests
// app.post('/lookup', (req, res) => {
//     const domain = req.body.url;
//     const type = req.body.recordType || 'A';
    
//     // Input validation
//     if (!domain || domain.trim() === '') {
//         return res.render('index', { records: [], result: null, error: 'Domain name is required' });
//     }
    
//     // Create a temporary UDP socket for this request
//     const socket = dgram.createSocket('udp4');
//     let timeout;
    
//     // Create DNS query packet
//     const message = dnsPacket.encode({
//         type: 'query',
//         id: Math.floor(Math.random() * 65535), // Random ID
//         flags: dnsPacket.RECURSION_DESIRED,
//         questions: [{
//             name: domain,
//             type: type,
//             class: 'IN'
//         }]
//     });
    
//     // Set up response handler
//     socket.on('message', async (msg) => {
//         clearTimeout(timeout);
//         const response = dnsPacket.decode(msg);
//         console.log('DNS lookup response:', JSON.stringify(response, null, 2));
        
//         try {
//             const [records] = await db.execute('SELECT * FROM dns ORDER BY url ASC');
            
//             if (response.answers && response.answers.length > 0) {
//                 res.render('index', { 
//                     records: records, 
//                     result: {
//                         domain: domain,
//                         type: type,
//                         answers: response.answers
//                     }
//                 });
//             } else {
//                 res.render('index', { 
//                     records: records, 
//                     result: {
//                         domain: domain,
//                         type: type,
//                         message: 'No records found'
//                     }
//                 });
//             }
            
//             socket.close();
//         } catch (err) {
//             console.error('Database error after DNS lookup:', err);
//             res.render('index', { 
//                 records: [], 
//                 result: {
//                     domain: domain,
//                     type: type,
//                     answers: response.answers
//                 },
//                 error: 'Database error retrieving records list'
//             });
//             socket.close();
//         }
//     });
    
//     // Set up error handler
//     socket.on('error', async (err) => {
//         console.error('Socket error:', err);
//         try {
//             const [records] = await db.execute('SELECT * FROM dns ORDER BY url ASC');
//             res.render('index', { 
//                 records: records, 
//                 result: null,
//                 error: `DNS lookup error: ${err.message}`
//             });
//         } catch (dbErr) {
//             res.render('index', { 
//                 records: [], 
//                 result: null,
//                 error: `DNS lookup error: ${err.message}. Database error: ${dbErr.message}`
//             });
//         }
//         socket.close();
//     });
    
//     // Send the DNS query
//     socket.send(message, 53, 'localhost', (err) => {
//         if (err) {
//             console.error('Error sending query:', err);
//             res.render('index', { records: [], result: null, error: `Failed to send DNS query: ${err.message}` });
//             socket.close();
//             return;
//         }
        
//         // Set timeout for DNS query
//         timeout = setTimeout(() => {
//             res.render('index', { records: [], result: null, error: 'DNS query timed out' });
//             socket.close();
//         }, 5000);
//     });
// });

// // Add new DNS record
// app.post('/record/add', async (req, res) => {
//     const { url, record, data } = req.body;
    
//     if (!url || !record || !data) {
//         return res.redirect('/?error=All fields are required');
//     }
    
//     try {
//         await db.execute(
//             'INSERT INTO dns (url, record, data) VALUES (?, ?, ?)',
//             [url, record, data]
//         );
//         res.redirect('/');
//     } catch (err) {
//         console.error('Error adding record:', err);
//         res.redirect('/?error=Failed to add DNS record');
//     }
// });

// // Delete DNS record
// app.post('/record/delete', async (req, res) => {
//     const { id } = req.body;
    
//     if (!id) {
//         return res.redirect('/?error=Record ID is required');
//     }
    
//     try {
//         await db.execute('DELETE FROM dns WHERE id = ?', [id]);
//         res.redirect('/');
//     } catch (err) {
//         console.error('Error deleting record:', err);
//         res.redirect('/?error=Failed to delete DNS record');
//     }
// });

// // Update DNS record
// app.post('/record/update', async (req, res) => {
//     const { id, url, record, data } = req.body;
    
//     if (!id || !url || !record || !data) {
//         return res.redirect('/?error=All fields are required');
//     }
    
//     try {
//         await db.execute(
//             'UPDATE dns SET url = ?, record = ?, data = ? WHERE id = ?',
//             [url, record, data, id]
//         );
//         res.redirect('/');
//     } catch (err) {
//         console.error('Error updating record:', err);
//         res.redirect('/?error=Failed to update DNS record');
//     }
// });

// // Start the server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Web server is running on port ${PORT}`);
// });
// const express = require('express');
// const app = express();
// const dgram = require('dgram');
// const ejs = require('ejs');
// const dnsPacket = require('dns-packet');
// const bp = require('body-parser');
// const pool = require('./util/database');

// app.set('view engine', 'ejs');
// app.use(bp.urlencoded({ extended: false }));

// // Home page - DNS management
// app.get('/', async (req, res) => {
//   try {
//     const [records] = await pool.query('SELECT * FROM dns ORDER BY url, record');
//     res.render('index', { records, result: null, error: null });
//   } catch (error) {
//     console.error('Error fetching DNS records:', error);
//     res.render('index', { records: [], result: null, error: 'Failed to fetch DNS records' });
//   }
// });

// // DNS lookup with redirection support
// app.post('/lookup', (req, res) => {
//   const domain = req.body.url;
//   const type = req.body.recordType;
//   const socket = dgram.createSocket('udp4');
//   const redirectRequested = req.body.redirect === 'on';
  
//   // Create DNS query packet
//   const message = dnsPacket.encode({
//     type: 'query',
//     id: Math.floor(Math.random() * 65535),
//     flags: dnsPacket.RECURSION_DESIRED,
//     questions: [{
//       name: domain,
//       type: type,
//       class: 'IN'
//     }]
//   });
  
//   // Set timeout to avoid hanging
//   const timeout = setTimeout(() => {
//     socket.close();
//     res.render('index', { 
//       records: [], 
//       result: { domain, type, message: 'DNS lookup timed out' }, 
//       error: null 
//     });
//   }, 5000);
  
//   // Send DNS query
//   socket.send(message, 53, 'localhost', (err) => {
//     if (err) {
//       clearTimeout(timeout);
//       console.error('Error sending DNS query:', err);
//       res.render('index', { 
//         records: [], 
//         result: { domain, type, message: 'Failed to send DNS query' }, 
//         error: 'Error occurred while sending DNS query' 
//       });
//       socket.close();
//       return;
//     }
//   });
  
//   // Handle response
//   socket.on('message', async (msg) => {
//     clearTimeout(timeout);
//     try {
//       const response = dnsPacket.decode(msg);
//       console.log('DNS Response:', response);
      
//       // Get all DNS records to display in the management panel
//       let records = [];
//       try {
//         [records] = await pool.query('SELECT * FROM dns ORDER BY url, record');
//       } catch (dbError) {
//         console.error('Error fetching DNS records:', dbError);
//       }
      
//       // Handle redirection for A records if redirect checkbox is checked
//       if (redirectRequested && 
//           type === 'A' && 
//           response.answers && 
//           response.answers.length > 0 && 
//           response.answers[0].type === 'A') {
        
//         const ipAddress = response.answers[0].data;
//         socket.close();
        
//         // Redirect to the IP address with HTTP protocol
//         return res.redirect(`http://${ipAddress}`);
//       }
      
//       // Otherwise, just display the results
//       res.render('index', { 
//         records, 
//         result: { 
//           domain, 
//           type, 
//           answers: response.answers || [],
//           message: response.answers && response.answers.length > 0 ? null : 'No records found'
//         }, 
//         error: null 
//       });
      
//     } catch (error) {
//       console.error('Error processing DNS response:', error);
//       res.render('index', { 
//         records: [], 
//         result: { domain, type, message: 'Error processing DNS response' },
//         error: 'Failed to process DNS lookup result' 
//       });
//     } finally {
//       socket.close();
//     }
//   });
  
//   // Handle errors
//   socket.on('error', (err) => {
//     clearTimeout(timeout);
//     console.error('Socket error:', err);
//     res.render('index', { 
//       records: [], 
//       result: { domain, type, message: 'DNS lookup failed' }, 
//       error: 'DNS server error: ' + err.message 
//     });
//     socket.close();
//   });
// });

// // Add a new DNS record
// app.post('/record/add', async (req, res) => {
//   const { url, record, data } = req.body;
  
//   try {
//     await pool.query(
//       'INSERT INTO dns (url, record, data) VALUES (?, ?, ?)',
//       [url, record, data]
//     );
//     res.redirect('/');
//   } catch (error) {
//     console.error('Error adding DNS record:', error);
//     const [records] = await pool.query('SELECT * FROM dns ORDER BY url, record');
//     res.render('index', { 
//       records, 
//       result: null, 
//       error: 'Failed to add DNS record: ' + error.message 
//     });
//   }
// });

// // Update an existing DNS record
// app.post('/record/update', async (req, res) => {
//   const { id, url, record, data } = req.body;
  
//   try {
//     await pool.query(
//       'UPDATE dns SET url = ?, record = ?, data = ? WHERE id = ?',
//       [url, record, data, id]
//     );
//     res.redirect('/');
//   } catch (error) {
//     console.error('Error updating DNS record:', error);
//     const [records] = await pool.query('SELECT * FROM dns ORDER BY url, record');
//     res.render('index', { 
//       records, 
//       result: null, 
//       error: 'Failed to update DNS record: ' + error.message 
//     });
//   }
// });

// // Delete a DNS record
// app.post('/record/delete', async (req, res) => {
//   const { id } = req.body;
  
//   try {
//     await pool.query('DELETE FROM dns WHERE id = ?', [id]);
//     res.redirect('/');
//   } catch (error) {
//     console.error('Error deleting DNS record:', error);
//     const [records] = await pool.query('SELECT * FROM dns ORDER BY url, record');
//     res.render('index', { 
//       records, 
//       result: null, 
//       error: 'Failed to delete DNS record: ' + error.message 
//     });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Web interface running on http://localhost:${PORT}`);
// });

// module.exports = app;
//ye naya hai
// const express = require('express');
// const app = express();
// const dgram = require('dgram');
// const ejs = require('ejs');
// const dnsPacket = require('dns-packet');
// const bp = require('body-parser');
// const { ObjectId } = require('mongodb');
// const { getDb, connectDB } = require('./util/database');

// app.set('view engine', 'ejs');
// app.use(bp.urlencoded({ extended: false }));

// // Initialize database connection
// connectDB().catch(console.error);

// // Home page - DNS management
// app.get('/', async (req, res) => {
//   try {
//     const db = getDb();
//     if (!db) {
//       throw new Error('Database connection not available');
//     }
    
//     const records = await db.collection('dns').find().sort({ url: 1, record: 1 }).toArray();
//     res.render('index', { records, result: null, error: null });
//   } catch (error) {
//     console.error('Error fetching DNS records:', error);
//     res.render('index', { records: [], result: null, error: 'Failed to fetch DNS records' });
//   }
// });

// // DNS lookup with redirection support
// app.post('/lookup', async (req, res) => {
//   const domain = req.body.url;
//   const type = req.body.recordType;
//   const socket = dgram.createSocket('udp4');
//   const redirectRequested = req.body.redirect === 'on';
  
//   // Create DNS query packet
//   const message = dnsPacket.encode({
//     type: 'query',
//     id: Math.floor(Math.random() * 65535),
//     flags: dnsPacket.RECURSION_DESIRED,
//     questions: [{
//       name: domain,
//       type: type,
//       class: 'IN'
//     }]
//   });
  
//   // Set timeout to avoid hanging
//   const timeout = setTimeout(() => {
//     socket.close();
//     res.render('index', { 
//       records: [], 
//       result: { domain, type, message: 'DNS lookup timed out' }, 
//       error: null 
//     });
//   }, 5000);
  
//   // Send DNS query
//   socket.send(message, 53, 'localhost', (err) => {
//     if (err) {
//       clearTimeout(timeout);
//       console.error('Error sending DNS query:', err);
//       res.render('index', { 
//         records: [], 
//         result: { domain, type, message: 'Failed to send DNS query' }, 
//         error: 'Error occurred while sending DNS query' 
//       });
//       socket.close();
//       return;
//     }
//   });
  
//   // Handle response
//   socket.on('message', async (msg) => {
//     clearTimeout(timeout);
//     try {
//       const response = dnsPacket.decode(msg);
//       console.log('DNS Response:', response);
      
//       // Get all DNS records to display in the management panel
//       let records = [];
//       try {
//         const db = getDb();
//         if (!db) {
//           throw new Error('Database connection not available');
//         }
//         records = await db.collection('dns').find().sort({ url: 1, record: 1 }).toArray();
//       } catch (dbError) {
//         console.error('Error fetching DNS records:', dbError);
//       }
      
//       // Handle redirection for A records if redirect checkbox is checked
//       if (redirectRequested && 
//           type === 'A' && 
//           response.answers && 
//           response.answers.length > 0 && 
//           response.answers[0].type === 'A') {
        
//         const ipAddress = response.answers[0].data;
//         socket.close();
        
//         // Redirect to the IP address with HTTP protocol
//         return res.redirect(`http://${ipAddress}`);
//       }
      
//       // Otherwise, just display the results
//       res.render('index', { 
//         records, 
//         result: { 
//           domain, 
//           type, 
//           answers: response.answers || [],
//           message: response.answers && response.answers.length > 0 ? null : 'No records found'
//         }, 
//         error: null 
//       });
      
//     } catch (error) {
//       console.error('Error processing DNS response:', error);
//       res.render('index', { 
//         records: [], 
//         result: { domain, type, message: 'Error processing DNS response' },
//         error: 'Failed to process DNS lookup result' 
//       });
//     } finally {
//       socket.close();
//     }
//   });
  
//   // Handle errors
//   socket.on('error', (err) => {
//     clearTimeout(timeout);
//     console.error('Socket error:', err);
//     res.render('index', { 
//       records: [], 
//       result: { domain, type, message: 'DNS lookup failed' }, 
//       error: 'DNS server error: ' + err.message 
//     });
//     socket.close();
//   });
// });

// // Add a new DNS record
// app.post('/record/add', async (req, res) => {
//   const { url, record, data } = req.body;
  
//   try {
//     const db = getDb();
//     if (!db) {
//       throw new Error('Database connection not available');
//     }
    
//     await db.collection('dns').insertOne({
//       url,
//       record,
//       data,
//       created_at: new Date(),
//       updated_at: new Date()
//     });
    
//     res.redirect('/');
//   } catch (error) {
//     console.error('Error adding DNS record:', error);
    
//     const db = getDb();
//     const records = db ? await db.collection('dns').find().sort({ url: 1, record: 1 }).toArray() : [];
    
//     res.render('index', { 
//       records, 
//       result: null, 
//       error: 'Failed to add DNS record: ' + error.message 
//     });
//   }
// });

// // Update an existing DNS record
// app.post('/record/update', async (req, res) => {
//   const { id, url, record, data } = req.body;
  
//   try {
//     const db = getDb();
//     if (!db) {
//       throw new Error('Database connection not available');
//     }
    
//     await db.collection('dns').updateOne(
//       { _id: new ObjectId(id) },
//       { 
//         $set: {
//           url,
//           record,
//           data,
//           updated_at: new Date()
//         }
//       }
//     );
    
//     res.redirect('/');
//   } catch (error) {
//     console.error('Error updating DNS record:', error);
    
//     const db = getDb();
//     const records = db ? await db.collection('dns').find().sort({ url: 1, record: 1 }).toArray() : [];
    
//     res.render('index', { 
//       records, 
//       result: null, 
//       error: 'Failed to update DNS record: ' + error.message 
//     });
//   }
// });

// // Delete a DNS record
// app.post('/record/delete', async (req, res) => {
//   const { id } = req.body;
  
//   try {
//     const db = getDb();
//     if (!db) {
//       throw new Error('Database connection not available');
//     }
    
//     await db.collection('dns').deleteOne({ _id: new ObjectId(id) });
//     res.redirect('/');
//   } catch (error) {
//     console.error('Error deleting DNS record:', error);
    
//     const db = getDb();
//     const records = db ? await db.collection('dns').find().sort({ url: 1, record: 1 }).toArray() : [];
    
//     res.render('index', { 
//       records, 
//       result: null, 
//       error: 'Failed to delete DNS record: ' + error.message 
//     });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Web interface running on http://localhost:${PORT}`);
// });

// module.exports = app;
const express = require('express');
const app = express();
const dgram = require('dgram');
const ejs = require('ejs');
const dnsPacket = require('dns-packet');
const bp = require('body-parser');
const { ObjectId } = require('mongodb');
const { getDb, connectDB } = require('./util/database');

app.set('view engine', 'ejs');
app.use(bp.urlencoded({ extended: false }));

// Initialize database connection (non-blocking)
let dbPromise = connectDB().catch((err) => {
  console.error('Initial database connection failed:', err.message);
  return null; // Allow server to start even if DB fails
});

// Start the server immediately
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Web interface running on http://0.0.0.0:${PORT}`);
}).on('error', (err) => {
  console.error(`Failed to bind to port ${PORT}:`, err.message);
  process.exit(1);
});

// Home page - DNS management
app.get('/', async (req, res) => {
  try {
    const db = getDb() || (await dbPromise);
    if (!db) {
      throw new Error('Database connection not available');
    }
    const records = await db.collection('dns').find().sort({ url: 1, record: 1 }).toArray();
    res.render('index', { records, result: null, error: null });
  } catch (error) {
    console.error('Error fetching DNS records:', error.message);
    res.render('index', { records: [], result: null, error: 'Failed to fetch DNS records' });
  }
});

// DNS lookup with redirection support
app.post('/lookup', async (req, res) => {
  const domain = req.body.url;
  const type = req.body.recordType;
  const redirectRequested = req.body.redirect === 'on';
  const socket = dgram.createSocket('udp4');

  // Use environment variable for DNS server address and port
  const dnsHost = process.env.DNS_HOST || 'localhost';
  const dnsPort = process.env.DNS_PORT || 1024; // Match server.js port

  // Create DNS query packet
  const message = dnsPacket.encode({
    type: 'query',
    id: Math.floor(Math.random() * 65535),
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [{
      name: domain,
      type: type,
      class: 'IN'
    }]
  });

  // Set timeout to avoid hanging
  const timeout = setTimeout(() => {
    socket.close();
    res.render('index', {
      records: [],
      result: { domain, type, message: 'DNS lookup timed out' },
      error: null
    });
  }, 5000);

  // Send DNS query
  socket.send(message, dnsPort, dnsHost, (err) => {
    if (err) {
      clearTimeout(timeout);
      console.error(`Error sending DNS query to ${dnsHost}:${dnsPort}:`, err.message);
      res.render('index', {
        records: [],
        result: { domain, type, message: 'Failed to send DNS query' },
        error: 'Error occurred while sending DNS query'
      });
      socket.close();
      return;
    }
  });

  // Handle response
  socket.on('message', async (msg) => {
    clearTimeout(timeout);
    try {
      const response = dnsPacket.decode(msg);
      console.log('DNS Response:', response);

      // Get all DNS records to display in the management panel
      let records = [];
      try {
        const db = getDb() || (await dbPromise);
        if (!db) {
          throw new Error('Database connection not available');
        }
        records = await db.collection('dns').find().sort({ url: 1, record: 1 }).toArray();
      } catch (dbError) {
        console.error('Error fetching DNS records:', dbError.message);
      }

      // Handle redirection for A records if redirect checkbox is checked
      if (redirectRequested &&
          type === 'A' &&
          response.answers &&
          response.answers.length > 0 &&
          response.answers[0].type === 'A') {
        const ipAddress = response.answers[0].data;
        socket.close();
        return res.redirect(`http://${ipAddress}`);
      }

      // Otherwise, just display the results
      res.render('index', {
        records,
        result: {
          domain,
          type,
          answers: response.answers || [],
          message: response.answers && response.answers.length > 0 ? null : 'No records found'
        },
        error: null
      });
    } catch (error) {
      console.error('Error processing DNS response:', error.message);
      res.render('index', {
        records: [],
        result: { domain, type, message: 'Error processing DNS response' },
        error: 'Failed to process DNS lookup result'
      });
    } finally {
      socket.close();
    }
  });

  // Handle errors
  socket.on('error', (err) => {
    clearTimeout(timeout);
    console.error('Socket error:', err.message);
    res.render('index', {
      records: [],
      result: { domain, type, message: 'DNS lookup failed' },
      error: 'DNS server error: ' + err.message
    });
    socket.close();
  });
});

// Add a new DNS record
app.post('/record/add', async (req, res) => {
  const { url, record, data } = req.body;
  try {
    const db = getDb() || (await dbPromise);
    if (!db) {
      throw new Error('Database connection not available');
    }
    await db.collection('dns').insertOne({
      url,
      record,
      data,
      created_at: new Date(),
      updated_at: new Date()
    });
    res.redirect('/');
  } catch (error) {
    console.error('Error adding DNS record:', error.message);
    const db = getDb() || (await dbPromise);
    const records = db ? await db.collection('dns').find().sort({ url: 1, record: 1 }).toArray() : [];
    res.render('index', {
      records,
      result: null,
      error: 'Failed to add DNS record: ' + error.message
    });
  }
});

// Update an existing DNS record
app.post('/record/update', async (req, res) => {
  const { id, url, record, data } = req.body;
  try {
    const db = getDb() || (await dbPromise);
    if (!db) {
      throw new Error('Database connection not available');
    }
    await db.collection('dns').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          url,
          record,
          data,
          updated_at: new Date()
        }
      }
    );
    res.redirect('/');
  } catch (error) {
    console.error('Error updating DNS record:', error.message);
    const db = getDb() || (await dbPromise);
    const records = db ? await db.collection('dns').find().sort({ url: 1, record: 1 }).toArray() : [];
    res.render('index', {
      records,
      result: null,
      error: 'Failed to update DNS record: ' + error.message
    });
  }
});

// Delete a DNS record
app.post('/record/delete', async (req, res) => {
  const { id } = req.body;
  try {
    const db = getDb() || (await dbPromise);
    if (!db) {
      throw new Error('Database connection not available');
    }
    await db.collection('dns').deleteOne({ _id: new ObjectId(id) });
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting DNS record:', error.message);
    const db = getDb() || (await dbPromise);
    const records = db ? await db.collection('dns').find().sort({ url: 1, record: 1 }).toArray() : [];
    res.render('index', {
      records,
      result: null,
      error: 'Failed to delete DNS record: ' + error.message
    });
  }
});

module.exports = app;
