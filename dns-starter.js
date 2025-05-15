

// const { execSync, spawn } = require('child_process');
// const os = require('os');

// // Check if running as root/administrator
// const isRoot = process.getuid && process.getuid() === 0;
// const isWindows = os.platform() === 'win32';

// // Check if port 53 is available
// function checkPort53() {
//     try {
//         const command = isWindows ? 
//             'netstat -an | findstr :53' : 
//             'netstat -tuln | grep ":53 "';
        
//         const output = execSync(command, { encoding: 'utf8' });
//         return output.trim() === '';
//     } catch (error) {
//         // If the command fails or returns non-zero (no matches), port may be available
//         return true;
//     }
// }

// // Main function
// function startServer() {
//     console.log('=== DNS Server Project Launcher ===');
    
//     // Check if port 53 is in use
//     const port53Available = checkPort53();
    
//     if (!port53Available) {
//         console.log('\n⚠️ Warning: Port 53 appears to be in use by another service.');
//         console.log('   This might be a system DNS resolver or another DNS server.');
//         console.log('   You need to stop that service before running this DNS server.');
        
//         if (!isWindows) {
//             console.log('\n   On Linux/macOS, this is often systemd-resolved or dnsmasq.');
//             console.log('   You can try:');
//             console.log('     sudo systemctl stop systemd-resolved');
//             console.log('     sudo service dnsmasq stop');
//         } else {
//             console.log('\n   On Windows, this might be the DNS Client service.');
//         }
        
//         const proceed = readYesNo('\nDo you want to try starting anyway? (y/n): ');
//         if (!proceed) {
//             console.log('Exiting...');
//             process.exit(0);
//         }
//     }
    
//     // Check if we need elevated privileges
//     if (!isWindows && !isRoot) {
//         console.log('\n⚠️ Notice: DNS servers typically need to bind to port 53,');
//         console.log('   which requires root privileges on Linux/macOS.');
//         console.log('\n   You can:');
//         console.log('   1. Run this script with sudo');
//         console.log('   2. Continue without sudo (likely to fail)');
//         console.log('   3. Modify server.js to use a port above 1024');
        
//         const choice = readInput('\nEnter your choice (1-3): ');
        
//         if (choice === '1') {
//             console.log('\nRestarting with sudo...');
//             try {
//                 const sudoArgs = process.argv.slice(1);
//                 execSync(`sudo node ${sudoArgs.join(' ')}`, { stdio: 'inherit' });
//                 process.exit(0);
//             } catch (error) {
//                 console.error('Failed to restart with sudo:', error);
//                 process.exit(1);
//             }
//         } else if (choice === '3') {
//             console.log('\nPlease edit server.js to change the port, then run "npm start"');
//             process.exit(0);
//         }
//         // Option 2: continue without sudo
//     }
    
//     // Start the actual server
//     console.log('\nStarting DNS server...');
//     const serverProcess = spawn('node', ['index.js'], { stdio: 'inherit' });
    
//     serverProcess.on('error', (error) => {
//         console.error('Failed to start server:', error);
//     });
    
//     process.on('SIGINT', () => {
//         serverProcess.kill('SIGINT');
//     });
// }

// // Helper function to get yes/no input
// function readYesNo(question) {
//     const readline = require('readline').createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });
    
//     return new Promise((resolve) => {
//         readline.question(question, (answer) => {
//             readline.close();
//             resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
//         });
//     });
// }

// // Helper function to get text input
// function readInput(question) {
//     const readline = require('readline').createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });
    
//     return new Promise((resolve) => {
//         readline.question(question, (answer) => {
//             readline.close();
//             resolve(answer);
//         });
//     });
// }

// // Run the script
// startServer();
const { execSync, spawn } = require('child_process');
const os = require('os');

// Check if running as root/administrator
const isRoot = process.getuid && process.getuid() === 0;
const isWindows = os.platform() === 'win32';

// Check if port 53 is available
function checkPort53() {
    try {
        const command = isWindows ? 
            'netstat -an | findstr :53' : 
            'netstat -tuln | grep ":53 "';
        
        const output = execSync(command, { encoding: 'utf8' });
        return output.trim() === '';
    } catch (error) {
        // If the command fails or returns non-zero (no matches), port may be available
        return true;
    }
}

// Main function
async function startServer() {
    console.log('=== DNS Server Project Launcher (MongoDB) ===');
    
    // Check if port 53 is in use
    const port53Available = checkPort53();
    
    if (!port53Available) {
        console.log('\n⚠️ Warning: Port 53 appears to be in use by another service.');
        console.log('   This might be a system DNS resolver or another DNS server.');
        console.log('   You need to stop that service before running this DNS server.');
        
        if (!isWindows) {
            console.log('\n   On Linux/macOS, this is often systemd-resolved or dnsmasq.');
            console.log('   You can try:');
            console.log('     sudo systemctl stop systemd-resolved');
            console.log('     sudo service dnsmasq stop');
        } else {
            console.log('\n   On Windows, this might be the DNS Client service.');
        }
        
        const proceed = await readYesNo('\nDo you want to try starting anyway? (y/n): ');
        if (!proceed) {
            console.log('Exiting...');
            process.exit(0);
        }
    }
    
    // Check if we need elevated privileges
    if (!isWindows && !isRoot) {
        console.log('\n⚠️ Notice: DNS servers typically need to bind to port 53,');
        console.log('   which requires root privileges on Linux/macOS.');
        console.log('\n   You can:');
        console.log('   1. Run this script with sudo');
        console.log('   2. Continue without sudo (likely to fail)');
        console.log('   3. Modify server.js to use a port above 1024');
        
        const choice = await readInput('\nEnter your choice (1-3): ');
        
        if (choice === '1') {
            console.log('\nRestarting with sudo...');
            try {
                const sudoArgs = process.argv.slice(1);
                execSync(`sudo node ${sudoArgs.join(' ')}`, { stdio: 'inherit' });
                process.exit(0);
            } catch (error) {
                console.error('Failed to restart with sudo:', error);
                process.exit(1);
            }
        } else if (choice === '3') {
            console.log('\nPlease edit server.js to change the port, then run "npm start"');
            process.exit(0);
        }
        // Option 2: continue without sudo
    }
    
    // Start the actual server
    console.log('\nStarting DNS server...');
    const serverProcess = spawn('node', ['index.js'], { stdio: 'inherit' });
    
    serverProcess.on('error', (error) => {
        console.error('Failed to start server:', error);
    });
    
    process.on('SIGINT', () => {
        serverProcess.kill('SIGINT');
    });
}

// Helper function to get yes/no input
function readYesNo(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        readline.question(question, (answer) => {
            readline.close();
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}

// Helper function to get text input
function readInput(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        readline.question(question, (answer) => {
            readline.close();
            resolve(answer);
        });
    });
}

// Run the script
startServer();