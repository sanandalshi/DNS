// Main application entry point
const dnsServer = require('./server');
const webServer = require('./web');

// Handle application shutdown gracefully
process.on('SIGINT', () => {
    console.log('Shutting down DNS server...');
    dnsServer.close();
    process.exit(0);
});

console.log('DNS server project running. Press Ctrl+C to exit.');