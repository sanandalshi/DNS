

// // const dgram = require('dgram');
// // const db = require('./util/database');
// // const dnsPacket = require('dns-packet');
// // const socket = dgram.createSocket('udp4');

// // socket.on('message', async (msg, rinfo) => {
// //     const query = dnsPacket.decode(msg);
// //     console.log('Received DNS query:', query);

// //     const name = query.questions[0].name;
// //     const type = query.questions[0].type;
// //     console.log('Received name:', name);
// //     console.log('Received type:', type);

// //     // Query the database to get all DNS records
// //     try {
// //         const [rows] = await db.execute('SELECT * FROM dns');
// //         let found = false;
// //         let data = null;
// //         let record = null;

// //         // Search for the DNS record in the database
// //         for (let row of rows) {
// //             if (row.url === name) {
// //                 found = true;
// //                 data = row.data;
// //                 record = row.record;
// //                 break;
// //             }
// //         }

// //         if (found) {
// //             if (record === 'A') {
// //                 // Handle 'A' record
// //                 const answer = dnsPacket.encode({
// //                     id: query.id,
// //                     type: 'response',
// //                     flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
// //                     questions: query.questions,
// //                     answers: [{
// //                         name: name,
// //                         type: 'A',
// //                         class: 'IN',
// //                         data: data
// //                     }]
// //                 });

// //                 socket.send(answer, rinfo.port, rinfo.address, (err) => {
// //                     if (err) {
// //                         console.log('Error sending response:', err);
// //                     }
// //                 });

// //             } else if (record === 'CNAME') {
// //                 // Handle 'CNAME' record, perform second lookup
// //                 let cnameFound = false;
// //                 let cnameData = null;
// //                 let cnameRecord = null;

// //                 for (let row of rows) {
// //                     if (row.url === data) {  // `data` contains the CNAME target
// //                         cnameFound = true;
// //                         cnameData = row.data;
// //                         cnameRecord = row.record;
// //                         break;
// //                     }
// //                 }

// //                 if (cnameFound && cnameRecord === 'A') {
// //                     const answer = dnsPacket.encode({
// //                         id: query.id,
// //                         type: 'response',
// //                         flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
// //                         questions: query.questions,
// //                         answers: [{
// //                             name: name,  // Original query name
// //                             type: 'A',
// //                             class: 'IN',
// //                             data: cnameData
// //                         }]
// //                     });

// //                     socket.send(answer, rinfo.port, rinfo.address, (err) => {
// //                         if (err) {
// //                             console.log('Error sending CNAME response:', err);
// //                         }
// //                     });
// //                 } else {
// //                     // No matching CNAME record found, respond with fallback
// //                     const fallbackAnswer = dnsPacket.encode({
// //                         id: query.id,
// //                         type: 'response',
// //                         flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
// //                         questions: query.questions,
// //                         answers: [{
// //                             name: name,
// //                             type: 'A',
// //                             class: 'IN',
// //                             data: '0.0.0.0'
// //                         }]
// //                     });

// //                     socket.send(fallbackAnswer, rinfo.port, rinfo.address, (err) => {
// //                         if (err) {
// //                             console.log('Error sending fallback response:', err);
// //                         }
// //                     });
// //                 }
// //             }

// //         } else {
// //             // No DNS record found, send fallback response
// //             const noDataAnswer = dnsPacket.encode({
// //                 id: query.id,
// //                 type: 'response',
// //                 flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
// //                 questions: query.questions,
// //                 answers: [{
// //                     name: name,
// //                     type: type,
// //                     class: 'IN',
// //                     data: '0.0.0.0'
// //                 }]
// //             });

// //             socket.send(noDataAnswer, rinfo.port, rinfo.address, (err) => {
// //                 if (err) {
// //                     console.log('Error sending no data response:', err);
// //                 }
// //             });
// //         }

// //     } catch (err) {
// //         console.log('Error querying the database:', err);
// //     }
// // });

// // socket.bind(53, () => {
// //     console.log('DNS server is running on port 53');
// // });
// const dgram = require('dgram');
// const db = require('./util/database');
// const dnsPacket = require('dns-packet');
// const socket = dgram.createSocket('udp4');

// // Handle incoming DNS queries
// socket.on('message', async (msg, rinfo) => {
//     const query = dnsPacket.decode(msg);
//     console.log('Received DNS query:', query);

//     const name = query.questions[0].name;
//     const type = query.questions[0].type;
//     console.log('Received name:', name);
//     console.log('Received type:', type);

//     // Query the database to get all DNS records
//     try {
//         const [rows] = await db.execute('SELECT * FROM dns');
//         let found = false;
//         let data = null;
//         let record = null;

//         // Search for the DNS record in the database
//         for (let row of rows) {
//             if (row.url === name) {
//                 found = true;
//                 data = row.data;
//                 record = row.record;
//                 break;
//             }
//         }

//         if (found) {
//             if (record === 'A') {
//                 // Handle 'A' record
//                 const answer = dnsPacket.encode({
//                     id: query.id,
//                     type: 'response',
//                     flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                     questions: query.questions,
//                     answers: [{
//                         name: name,
//                         type: 'A',
//                         class: 'IN',
//                         ttl: 300,
//                         data: data
//                     }]
//                 });

//                 socket.send(answer, rinfo.port, rinfo.address, (err) => {
//                     if (err) {
//                         console.log('Error sending response:', err);
//                     } else {
//                         console.log(`Sent A record response for ${name}: ${data}`);
//                     }
//                 });

//             } else if (record === 'CNAME') {
//                 // Handle 'CNAME' record, perform second lookup
//                 let cnameFound = false;
//                 let cnameData = null;
//                 let cnameRecord = null;

//                 for (let row of rows) {
//                     if (row.url === data) {  // `data` contains the CNAME target
//                         cnameFound = true;
//                         cnameData = row.data;
//                         cnameRecord = row.record;
//                         break;
//                     }
//                 }

//                 if (cnameFound && cnameRecord === 'A') {
//                     const answer = dnsPacket.encode({
//                         id: query.id,
//                         type: 'response',
//                         flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                         questions: query.questions,
//                         answers: [
//                             {
//                                 name: name,  // Original query name
//                                 type: 'CNAME',
//                                 class: 'IN',
//                                 ttl: 300,
//                                 data: data
//                             },
//                             {
//                                 name: data,  // CNAME target
//                                 type: 'A',
//                                 class: 'IN',
//                                 ttl: 300,
//                                 data: cnameData
//                             }
//                         ]
//                     });

//                     socket.send(answer, rinfo.port, rinfo.address, (err) => {
//                         if (err) {
//                             console.log('Error sending CNAME response:', err);
//                         } else {
//                             console.log(`Sent CNAME response for ${name} -> ${data}: ${cnameData}`);
//                         }
//                     });
//                 } else {
//                     // No matching CNAME record found, respond with CNAME only
//                     const cnameAnswer = dnsPacket.encode({
//                         id: query.id,
//                         type: 'response',
//                         flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                         questions: query.questions,
//                         answers: [{
//                             name: name,
//                             type: 'CNAME',
//                             class: 'IN',
//                             ttl: 300,
//                             data: data
//                         }]
//                     });

//                     socket.send(cnameAnswer, rinfo.port, rinfo.address, (err) => {
//                         if (err) {
//                             console.log('Error sending CNAME-only response:', err);
//                         } else {
//                             console.log(`Sent CNAME-only response for ${name} -> ${data}`);
//                         }
//                     });
//                 }
//             } else if (record === 'MX') {
//                 // Handle MX record
//                 const answer = dnsPacket.encode({
//                     id: query.id,
//                     type: 'response',
//                     flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                     questions: query.questions,
//                     answers: [{
//                         name: name,
//                         type: 'MX',
//                         class: 'IN',
//                         ttl: 300,
//                         data: {
//                             preference: 10,
//                             exchange: data
//                         }
//                     }]
//                 });

//                 socket.send(answer, rinfo.port, rinfo.address, (err) => {
//                     if (err) {
//                         console.log('Error sending MX response:', err);
//                     } else {
//                         console.log(`Sent MX record response for ${name}: ${data}`);
//                     }
//                 });
//             } else if (record === 'TXT') {
//                 // Handle TXT record
//                 const answer = dnsPacket.encode({
//                     id: query.id,
//                     type: 'response',
//                     flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                     questions: query.questions,
//                     answers: [{
//                         name: name,
//                         type: 'TXT',
//                         class: 'IN',
//                         ttl: 300,
//                         data: [data]
//                     }]
//                 });

//                 socket.send(answer, rinfo.port, rinfo.address, (err) => {
//                     if (err) {
//                         console.log('Error sending TXT response:', err);
//                     } else {
//                         console.log(`Sent TXT record response for ${name}: ${data}`);
//                     }
//                 });
//             }
//         } else {
//             // No DNS record found, send NXDOMAIN response
//             const noDataAnswer = dnsPacket.encode({
//                 id: query.id,
//                 type: 'response',
//                 flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                 rcode: 'NXDOMAIN',
//                 questions: query.questions
//             });

//             socket.send(noDataAnswer, rinfo.port, rinfo.address, (err) => {
//                 if (err) {
//                     console.log('Error sending NXDOMAIN response:', err);
//                 } else {
//                     console.log(`Sent NXDOMAIN response for ${name}`);
//                 }
//             });
//         }

//     } catch (err) {
//         console.log('Error querying the database:', err);
        
//         // Send server failure response
//         const errorAnswer = dnsPacket.encode({
//             id: query.id,
//             type: 'response',
//             flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//             rcode: 'SERVFAIL',
//             questions: query.questions
//         });

//         socket.send(errorAnswer, rinfo.port, rinfo.address);
//     }
// });

// socket.on('error', (err) => {
//     console.log('DNS server error:', err);
// });

// // Bind to port 53 with error handling
// socket.bind(53, () => {
//     console.log('DNS server is running on port 53');
// });

// module.exports = { 
//     socket, // Export socket for potential use in web server
//     close: () => socket.close()
// };
// const dgram = require('dgram');
// const db = require('./util/database');
// const dnsPacket = require('dns-packet');
// const socket = dgram.createSocket('udp4');

// // Handle incoming DNS queries
// socket.on('message', async (msg, rinfo) => {
//     const query = dnsPacket.decode(msg);
//     console.log('Received DNS query:', query);

//     const name = query.questions[0].name;
//     const type = query.questions[0].type;
//     console.log('Received name:', name);
//     console.log('Received type:', type);

//     // Query the database to get all DNS records
//     try {
//         const [rows] = await db.execute('SELECT * FROM dns');
//         let found = false;
//         let data = null;
//         let record = null;

//         // Search for the DNS record in the database
//         for (let row of rows) {
//             if (row.url === name) {
//                 found = true;
//                 data = row.data;
//                 record = row.record;
//                 break;
//             }
//         }

//         if (found) {
//             if (record === 'A') {
//                 // Handle 'A' record
//                 const answer = dnsPacket.encode({
//                     id: query.id,
//                     type: 'response',
//                     flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                     questions: query.questions,
//                     answers: [{
//                         name: name,
//                         type: 'A',
//                         class: 'IN',
//                         ttl: 300,
//                         data: data
//                     }]
//                 });

//                 socket.send(answer, rinfo.port, rinfo.address, (err) => {
//                     if (err) {
//                         console.log('Error sending response:', err);
//                     } else {
//                         console.log(`Sent A record response for ${name}: ${data}`);
//                     }
//                 });

//             } else if (record === 'CNAME') {
//                 // Handle 'CNAME' record, perform second lookup
//                 let cnameFound = false;
//                 let cnameData = null;
//                 let cnameRecord = null;

//                 for (let row of rows) {
//                     if (row.url === data) {  // `data` contains the CNAME target
//                         cnameFound = true;
//                         cnameData = row.data;
//                         cnameRecord = row.record;
//                         break;
//                     }
//                 }

//                 if (cnameFound && cnameRecord === 'A') {
//                     const answer = dnsPacket.encode({
//                         id: query.id,
//                         type: 'response',
//                         flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                         questions: query.questions,
//                         answers: [
//                             {
//                                 name: name,  // Original query name
//                                 type: 'CNAME',
//                                 class: 'IN',
//                                 ttl: 300,
//                                 data: data
//                             },
//                             {
//                                 name: data,  // CNAME target
//                                 type: 'A',
//                                 class: 'IN',
//                                 ttl: 300,
//                                 data: cnameData
//                             }
//                         ]
//                     });

//                     socket.send(answer, rinfo.port, rinfo.address, (err) => {
//                         if (err) {
//                             console.log('Error sending CNAME response:', err);
//                         } else {
//                             console.log(`Sent CNAME response for ${name} -> ${data}: ${cnameData}`);
//                         }
//                     });
//                 } else {
//                     // No matching CNAME record found, respond with CNAME only
//                     const cnameAnswer = dnsPacket.encode({
//                         id: query.id,
//                         type: 'response',
//                         flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                         questions: query.questions,
//                         answers: [{
//                             name: name,
//                             type: 'CNAME',
//                             class: 'IN',
//                             ttl: 300,
//                             data: data
//                         }]
//                     });

//                     socket.send(cnameAnswer, rinfo.port, rinfo.address, (err) => {
//                         if (err) {
//                             console.log('Error sending CNAME-only response:', err);
//                         } else {
//                             console.log(`Sent CNAME-only response for ${name} -> ${data}`);
//                         }
//                     });
//                 }
//             } else if (record === 'MX') {
//                 // Handle MX record
//                 const answer = dnsPacket.encode({
//                     id: query.id,
//                     type: 'response',
//                     flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                     questions: query.questions,
//                     answers: [{
//                         name: name,
//                         type: 'MX',
//                         class: 'IN',
//                         ttl: 300,
//                         data: {
//                             preference: 10,
//                             exchange: data
//                         }
//                     }]
//                 });

//                 socket.send(answer, rinfo.port, rinfo.address, (err) => {
//                     if (err) {
//                         console.log('Error sending MX response:', err);
//                     } else {
//                         console.log(`Sent MX record response for ${name}: ${data}`);
//                     }
//                 });
//             } else if (record === 'TXT') {
//                 // Handle TXT record
//                 const answer = dnsPacket.encode({
//                     id: query.id,
//                     type: 'response',
//                     flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                     questions: query.questions,
//                     answers: [{
//                         name: name,
//                         type: 'TXT',
//                         class: 'IN',
//                         ttl: 300,
//                         data: [data]
//                     }]
//                 });

//                 socket.send(answer, rinfo.port, rinfo.address, (err) => {
//                     if (err) {
//                         console.log('Error sending TXT response:', err);
//                     } else {
//                         console.log(`Sent TXT record response for ${name}: ${data}`);
//                     }
//                 });
//             }
//         } else {
//             // No DNS record found, send NXDOMAIN response
//             const noDataAnswer = dnsPacket.encode({
//                 id: query.id,
//                 type: 'response',
//                 flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//                 rcode: 'NXDOMAIN',
//                 questions: query.questions
//             });

//             socket.send(noDataAnswer, rinfo.port, rinfo.address, (err) => {
//                 if (err) {
//                     console.log('Error sending NXDOMAIN response:', err);
//                 } else {
//                     console.log(`Sent NXDOMAIN response for ${name}`);
//                 }
//             });
//         }

//     } catch (err) {
//         console.log('Error querying the database:', err);
        
//         // Send server failure response
//         const errorAnswer = dnsPacket.encode({
//             id: query.id,
//             type: 'response',
//             flags: dnsPacket.RECURSION_AVAILABLE | dnsPacket.RESPONSE,
//             rcode: 'SERVFAIL',
//             questions: query.questions
//         });

//         socket.send(errorAnswer, rinfo.port, rinfo.address);
//     }
// });

// socket.on('error', (err) => {
//     console.log('DNS server error:', err);
//     if (err.code === 'EACCES') {
//         console.error('Permission denied to bind to port 53.');
//         console.error('Try running with sudo or use a port above 1024 by modifying the code.');
//         process.exit(1);
//     }
// });

// // Bind to port 53 with error handling
// socket.bind(53, () => {
//     console.log('DNS server is running on port 53');
// });

// module.exports = { 
//     socket, // Export socket for potential use in web server
//     close: () => socket.close()
// };
// const dgram = require('dgram');
// const dnsPacket = require('dns-packet');
// const pool = require('./util/database');

// // Create UDP socket for DNS server
// const socket = dgram.createSocket('udp4');

// // Track active queries to prevent duplicate responses
// const activeQueries = new Map();

// // Handle incoming DNS query packets
// socket.on('message', async (msg, rinfo) => {
//   try {
//     // Decode the DNS query packet
//     const query = dnsPacket.decode(msg);
    
//     // Log the incoming query
//     console.log(`Received DNS query from ${rinfo.address}:${rinfo.port}`);
//     console.log('Query ID:', query.id);
//     console.log('Questions:', JSON.stringify(query.questions));
    
//     // Skip if we don't have any questions
//     if (!query.questions || query.questions.length === 0) {
//       console.log('Query contains no questions, ignoring');
//       return;
//     }
    
//     // Get the first question (most DNS queries only have one)
//     const question = query.questions[0];
//     const { name, type } = question;
    
//     // Generate a unique key for this query
//     const queryKey = `${query.id}-${name}-${type}-${rinfo.address}-${rinfo.port}`;
    
//     // Skip if we've already processed this query
//     if (activeQueries.has(queryKey)) {
//       console.log('Duplicate query detected, ignoring');
//       return;
//     }
    
//     // Mark this query as active
//     activeQueries.set(queryKey, true);
    
//     // Clean up query after processing or timeout
//     setTimeout(() => {
//       activeQueries.delete(queryKey);
//     }, 5000); // 5 seconds timeout
    
//     // Look up the answer in our database
//     console.log(`Looking up ${type} record for ${name} in database`);
//     let [records] = await pool.query(
//       'SELECT * FROM dns WHERE url = ? AND record = ?',
//       [name, type]
//     );
    
//     // If no exact match, try to find CNAME records (for A record queries)
//     if (records.length === 0 && type === 'A') {
//       console.log(`No A record found for ${name}, looking for CNAME`);
//       const [cnameRecords] = await pool.query(
//         'SELECT * FROM dns WHERE url = ? AND record = ?',
//         [name, 'CNAME']
//       );
      
//       // If found a CNAME, do another query for the target of the CNAME
//       if (cnameRecords.length > 0) {
//         const cnameTarget = cnameRecords[0].data;
//         console.log(`Found CNAME record pointing to ${cnameTarget}, looking up A record`);
        
//         [records] = await pool.query(
//           'SELECT * FROM dns WHERE url = ? AND record = ?',
//           [cnameTarget, 'A']
//         );
        
//         // Add the CNAME record to our results
//         if (records.length > 0) {
//           records.unshift(cnameRecords[0]);
//         }
//       }
//     }
    
//     console.log(`Found ${records.length} matching records in database`);
    
//     // Prepare DNS response packet
//     const response = {
//       type: 'response',
//       id: query.id,
//       flags: dnsPacket.RECURSION_DESIRED | dnsPacket.RECURSION_AVAILABLE,
//       questions: query.questions,
//       answers: []
//     };
    
//     // Convert database records to DNS answer format
//     records.forEach(record => {
//       let answer = {
//         name: record.url,
//         type: record.record,
//         ttl: 300, // 5 minutes TTL
//         class: 'IN'
//       };
      
//       // Format the data based on record type
//       switch (record.record) {
//         case 'A':
//           answer.data = record.data; // IP address
//           break;
//         case 'CNAME':
//           answer.data = record.data; // Target domain
//           break;
//         case 'MX':
//           answer.data = {
//             preference: 10,
//             exchange: record.data
//           };
//           break;
//         case 'TXT':
//           answer.data = [record.data]; // TXT records are arrays of strings
//           break;
//         default:
//           answer.data = record.data;
//       }
      
//       response.answers.push(answer);
//     });
    
//     // If no answers found, set response code to NXDOMAIN (3)
//     if (response.answers.length === 0) {
//       response.flags = dnsPacket.RECURSION_DESIRED;
//       response.rcode = 'NXDOMAIN';
//     }
    
//     // Encode and send the response
//     const responseBuffer = dnsPacket.encode(response);
//     socket.send(responseBuffer, 0, responseBuffer.length, rinfo.port, rinfo.address, (err) => {
//       if (err) {
//         console.error('Error sending DNS response:', err);
//       } else {
//         console.log(`DNS response sent to ${rinfo.address}:${rinfo.port} with ${response.answers.length} answers`);
//       }
//     });
    
//   } catch (error) {
//     console.error('Error processing DNS query:', error);
//   }
// });

// // Handle DNS server errors
// socket.on('error', (err) => {
//   console.error('DNS server error:', err);
// });

// // Start DNS server on port 53
// socket.bind(53, () => {
//   console.log('DNS server listening on port 53');
// });

// module.exports = socket;
const dgram = require('dgram');
const dnsPacket = require('dns-packet');
const { getDb, connectDB } = require('./util/database');

// Create UDP socket for DNS server
const socket = dgram.createSocket('udp4');

// Track active queries to prevent duplicate responses
const activeQueries = new Map();

// Initialize database connection
connectDB().catch(console.error);

// Handle incoming DNS query packets
socket.on('message', async (msg, rinfo) => {
  try {
    // Decode the DNS query packet
    const query = dnsPacket.decode(msg);
    
    // Log the incoming query
    console.log(`Received DNS query from ${rinfo.address}:${rinfo.port}`);
    console.log('Query ID:', query.id);
    console.log('Questions:', JSON.stringify(query.questions));
    
    // Skip if we don't have any questions
    if (!query.questions || query.questions.length === 0) {
      console.log('Query contains no questions, ignoring');
      return;
    }
    
    // Get the first question (most DNS queries only have one)
    const question = query.questions[0];
    const { name, type } = question;
    
    // Generate a unique key for this query
    const queryKey = `${query.id}-${name}-${type}-${rinfo.address}-${rinfo.port}`;
    
    // Skip if we've already processed this query
    if (activeQueries.has(queryKey)) {
      console.log('Duplicate query detected, ignoring');
      return;
    }
    
    // Mark this query as active
    activeQueries.set(queryKey, true);
    
    // Clean up query after processing or timeout
    setTimeout(() => {
      activeQueries.delete(queryKey);
    }, 5000); // 5 seconds timeout
    
    // Get the database instance
    const db = getDb();
    if (!db) {
      throw new Error('Database connection not available');
    }
    
    // Look up the answer in our database
    console.log(`Looking up ${type} record for ${name} in database`);
    let records = await db.collection('dns').find({
      url: name,
      record: type
    }).toArray();
    
    // If no exact match, try to find CNAME records (for A record queries)
    if (records.length === 0 && type === 'A') {
      console.log(`No A record found for ${name}, looking for CNAME`);
      const cnameRecords = await db.collection('dns').find({
        url: name,
        record: 'CNAME'
      }).toArray();
      
      // If found a CNAME, do another query for the target of the CNAME
      if (cnameRecords.length > 0) {
        const cnameTarget = cnameRecords[0].data;
        console.log(`Found CNAME record pointing to ${cnameTarget}, looking up A record`);
        
        const aRecords = await db.collection('dns').find({
          url: cnameTarget,
          record: 'A'
        }).toArray();
        
        // Add the CNAME record to our results
        if (aRecords.length > 0) {
          records = [...cnameRecords, ...aRecords];
        }
      }
    }
    
    console.log(`Found ${records.length} matching records in database`);
    
    // Prepare DNS response packet
    const response = {
      type: 'response',
      id: query.id,
      flags: dnsPacket.RECURSION_DESIRED | dnsPacket.RECURSION_AVAILABLE,
      questions: query.questions,
      answers: []
    };
    
    // Convert database records to DNS answer format
    records.forEach(record => {
      let answer = {
        name: record.url,
        type: record.record,
        ttl: 300, // 5 minutes TTL
        class: 'IN'
      };
      
      // Format the data based on record type
      switch (record.record) {
        case 'A':
          answer.data = record.data; // IP address
          break;
        case 'CNAME':
          answer.data = record.data; // Target domain
          break;
        case 'MX':
          answer.data = {
            preference: 10,
            exchange: record.data
          };
          break;
        case 'TXT':
          answer.data = [record.data]; // TXT records are arrays of strings
          break;
        default:
          answer.data = record.data;
      }
      
      response.answers.push(answer);
    });
    
    // If no answers found, set response code to NXDOMAIN (3)
    if (response.answers.length === 0) {
      response.flags = dnsPacket.RECURSION_DESIRED;
      response.rcode = 'NXDOMAIN';
    }
    
    // Encode and send the response
    const responseBuffer = dnsPacket.encode(response);
    socket.send(responseBuffer, 0, responseBuffer.length, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error('Error sending DNS response:', err);
      } else {
        console.log(`DNS response sent to ${rinfo.address}:${rinfo.port} with ${response.answers.length} answers`);
      }
    });
    
  } catch (error) {
    console.error('Error processing DNS query:', error);
  }
});

// Handle DNS server errors
socket.on('error', (err) => {
  console.error('DNS server error:', err);
});

// Start DNS server on port 53
socket.bind(5353, () => {
  console.log('DNS server listening on port 53');
});

module.exports = socket;
