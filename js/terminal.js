// Terminal Simulator for CyberEnough
class KaliTerminal {
    constructor() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.currentPath = '~';
        this.username = 'kali';
        this.hostname = 'kali';
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.init();
    }

    init() {
        if (!this.input) return;
        
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('input', () => this.updateCursor());
        
        // Focus input when clicking anywhere in terminal
        document.querySelector('.terminal-content')?.addEventListener('click', () => {
            this.input.focus();
        });

        // Keep input focused
        this.input.focus();
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.executeCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.handleTabCompletion();
        }
    }

    executeCommand() {
        const command = this.input.value.trim();
        if (command) {
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
        }

        // Display command
        this.addOutput(`┌──(${this.username}㉿${this.hostname})-[${this.currentPath}]`);
        this.addOutput(`└─$ ${command}`, 'terminal-command');

        // Execute command
        if (command) {
            this.processCommand(command);
        }

        // Add new prompt
        this.addOutput(`┌──(${this.username}㉿${this.hostname})-[${this.currentPath}]`);
        
        // Clear input
        this.input.value = '';
        this.updateCursor();
        this.scrollToBottom();
    }

    processCommand(command) {
        const args = command.toLowerCase().split(' ');
        const cmd = args[0];

        const commands = {
            'help': () => this.showHelp(),
            'clear': () => this.clearTerminal(),
            'ls': () => this.listDirectory(args),
            'pwd': () => this.printWorkingDirectory(),
            'whoami': () => this.showCurrentUser(),
            'uname': () => this.showSystemInfo(args),
            'cat': () => this.showFileContent(args),
            'ifconfig': () => this.showNetworkInterfaces(),
            'netstat': () => this.showNetworkConnections(args),
            'ps': () => this.showProcesses(args),
            'nmap': () => this.runNmap(args),
            'ping': () => this.runPing(args),
            'nikto': () => this.runNikto(args),
            'dirb': () => this.runDirb(args),
            'sqlmap': () => this.runSqlmap(args),
            'hydra': () => this.runHydra(args),
            'john': () => this.runJohn(args),
            'metasploit': () => this.startMetasploit(),
            'msfconsole': () => this.startMetasploit(),
            'aircrack-ng': () => this.runAircrack(args),
            'wpscan': () => this.runWPScan(args),
            'gobuster': () => this.runGobuster(args),
            'searchsploit': () => this.runSearchsploit(args)
        };

        if (commands[cmd]) {
            commands[cmd]();
        } else {
            this.addOutput(`bash: ${cmd}: command not found`, 'terminal-error');
        }
    }

    showHelp() {
        const helpText = `Available commands:

Basic Linux Commands:
  ls              - List directory contents
  pwd             - Print working directory  
  whoami          - Display current username
  uname -a        - Show system information
  cat [file]      - Display file contents
  clear           - Clear terminal screen

Network Commands:
  ifconfig        - Display network interfaces
  netstat         - Show network connections
  ping [host]     - Test network connectivity
  nmap [options]  - Network port scanner

Security Tools:
  nikto -h [url]  - Web vulnerability scanner
  dirb [url]      - Directory brute forcer
  sqlmap          - SQL injection testing tool
  hydra           - Password cracking tool
  john            - John the Ripper password cracker
  msfconsole      - Metasploit Framework
  aircrack-ng     - WiFi security testing
  wpscan          - WordPress security scanner
  gobuster        - Directory/file brute forcer
  searchsploit    - Exploit database search

Type any command to see simulated output.`;
        
        this.addOutput(helpText, 'terminal-output-text');
    }

    clearTerminal() {
        this.output.innerHTML = '';
    }

    listDirectory(args) {
        const files = [
            'Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos',
            'tools', 'wordlists', 'exploits', 'scripts', '.bashrc', '.profile'
        ];
        
        if (args.includes('-la') || args.includes('-l')) {
            const detailed = files.map(file => {
                const isDir = !file.startsWith('.');
                const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
                const size = Math.floor(Math.random() * 10000) + 1024;
                return `${perms} 1 kali kali ${size} Dec 15 10:30 ${file}`;
            }).join('\n');
            this.addOutput(detailed, 'terminal-output-text');
        } else {
            this.addOutput(files.join('  '), 'terminal-output-text');
        }
    }

    printWorkingDirectory() {
        this.addOutput(`/home/${this.username}`, 'terminal-output-text');
    }

    showCurrentUser() {
        this.addOutput(this.username, 'terminal-output-text');
    }

    showSystemInfo(args) {
        if (args.includes('-a')) {
            this.addOutput('Linux kali 5.14.0-kali2-amd64 #1 SMP Debian 5.14.9-2kali1 (2021-10-04) x86_64 GNU/Linux', 'terminal-output-text');
        } else {
            this.addOutput('Linux', 'terminal-output-text');
        }
    }

    showFileContent(args) {
        const filename = args[1];
        if (!filename) {
            this.addOutput('cat: missing file operand', 'terminal-error');
            return;
        }

        const files = {
            '/etc/passwd': `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
kali:x:1000:1000:,,,:/home/kali:/usr/bin/zsh`,
            'passwords.txt': `admin
password
123456
letmein
qwerty`,
            '.bashrc': `# ~/.bashrc: executed by bash(1) for non-login shells.
export PATH=$PATH:/usr/share/metasploit-framework/tools
alias ll='ls -alF'
alias la='ls -A'`
        };

        if (files[filename]) {
            this.addOutput(files[filename], 'terminal-output-text');
        } else {
            this.addOutput(`cat: ${filename}: No such file or directory`, 'terminal-error');
        }
    }

    showNetworkInterfaces() {
        const output = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)

wlan0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether 02:00:00:00:01:00  txqueuelen 1000  (Ethernet)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>`;
        
        this.addOutput(output, 'terminal-output-text');
    }

    showNetworkConnections(args) {
        const output = `Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN     
tcp        0      0 192.168.1.105:51234     152.195.39.108:443      ESTABLISHED
udp        0      0 0.0.0.0:68              0.0.0.0:*                          
udp        0      0 0.0.0.0:631             0.0.0.0:*`;
        
        this.addOutput(output, 'terminal-output-text');
    }

    showProcesses(args) {
        const output = `  PID TTY          TIME CMD
 1234 pts/0    00:00:00 bash
 5678 pts/0    00:00:00 firefox
 9101 pts/0    00:00:00 metasploit
11213 pts/0    00:00:00 nmap
14151 pts/0    00:00:00 ps`;
        
        this.addOutput(output, 'terminal-output-text');
    }

    runNmap(args) {
        const target = args.find(arg => arg.includes('.') || arg.includes('/'));
        
        if (!target) {
            this.addOutput('Nmap 7.92 ( https://nmap.org )\nUsage: nmap [Scan Type(s)] [Options] {target specification}', 'terminal-output-text');
            return;
        }

        const output = `Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toLocaleString()}
Nmap scan report for ${target}
Host is up (0.0012s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
53/tcp   open  domain
80/tcp   open  http
443/tcp  open  https

Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds`;
        
        this.addOutput(output, 'terminal-success');
    }

    runPing(args) {
        const target = args[1] || 'google.com';
        const output = `PING ${target} (172.217.164.110) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=64 time=12.3 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=11.8 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=12.1 ms
^C
--- ${target} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 11.8/12.1/12.3/0.2 ms`;
        
        this.addOutput(output, 'terminal-success');
    }

    runNikto(args) {
        const target = args.find(arg => arg.startsWith('http') || args.indexOf(arg) > args.indexOf('-h'));
        
        if (!target) {
            this.addOutput('       -h [host]   Host to scan', 'terminal-output-text');
            return;
        }

        const output = `- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.1.100
+ Target Hostname:    ${target}
+ Target Port:        80
+ Start Time:         ${new Date().toLocaleString()}
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)
+ Retrieved x-powered-by header: PHP/7.4.3
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined.
+ Uncommon header 'x-ob_mode' found, with contents: 1
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ OSVDB-3233: /icons/README: Apache default file found.
+ /login.php: Admin login page/section found.
+ 7535 requests: 0 error(s) and 5 item(s) reported on remote host`;
        
        this.addOutput(output, 'terminal-success');
    }

    runDirb(args) {
        const target = args[1];
        if (!target) {
            this.addOutput('Usage: dirb <url_base>', 'terminal-error');
            return;
        }

        const output = `DIRB v2.22
By The Dark Raver
-----------------

START_TIME: ${new Date().toLocaleString()}
URL_BASE: ${target}
WORDLIST_FILE: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612

---- Scanning URL: ${target} ----
+ ${target}/admin (CODE:200|SIZE:1234)
+ ${target}/backup (CODE:200|SIZE:567)  
+ ${target}/config (CODE:403|SIZE:278)
+ ${target}/images (CODE:200|SIZE:890)
+ ${target}/index (CODE:200|SIZE:4567)
+ ${target}/login (CODE:200|SIZE:2345)

-----------------
END_TIME: ${new Date().toLocaleString()}
DOWNLOADED: 4612 - FOUND: 6`;
        
        this.addOutput(output, 'terminal-success');
    }

    runSqlmap(args) {
        if (args.includes('--help')) {
            this.addOutput(`Usage: python sqlmap.py [options]

Options:
  -h, --help            Show basic help message and exit
  -u URL, --url=URL     Target URL (e.g. "http://www.site.com/vuln.php?id=1")
  --data=DATA           Data string to be sent through POST
  --dbs                 Enumerate DBMS databases
  --tables              Enumerate DBMS database tables
  --dump                Dump DBMS database table entries`, 'terminal-output-text');
        } else {
            this.addOutput(`        ___
       __H__
 ___ ___[']_____ ___ ___  {1.6.12#stable}
|_ -| . [)]     | .'| . |
|___|_  [(]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] Legal disclaimer: Usage for attacking targets without consent is illegal
[*] Starting at ${new Date().toLocaleString()}`, 'terminal-success');
        }
    }

    runHydra(args) {
        const output = `Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military
Hydra (https://github.com/vanhauser-thc/thc-hydra)

[WARNING] Restorefile (you have 10 seconds to abort... (use option -I to skip waiting))
[DATA] max 1 task per 1 server, overall 1 task, 100 login tries (l:1/p:100), ~100 tries per task
[DATA] attacking ssh://192.168.1.100:22/
[22][ssh] host: 192.168.1.100   login: admin   password: password123
[STATUS] 1.00 tries/min, 100 tries in 00:01h, 0 to do in 00:00h
1 of 1 target successfully completed, 1 valid password found`;
        
        this.addOutput(output, 'terminal-success');
    }

    runJohn(args) {
        const output = `John the Ripper 1.9.0-jumbo-1+bleeding-2021-02-20
Created: 1996-2021 by Solar Designer and others
Homepage: https://www.openwall.com/john/

Loaded 3 password hashes with 3 different salts (sha512crypt, crypt(3) $6$ [SHA512 128/128 SSE2 2x])
Cost 1 (iteration count) is 5000 for all loaded hashes
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
password123      (user1)
letmein          (user2)
admin            (user3)
3g 0:00:00:23 DONE (${new Date().toLocaleString()}) 0.1304g/s 531.3p/s 1594c/s 1594C/s`;
        
        this.addOutput(output, 'terminal-success');
    }

    startMetasploit() {
        const output = `
    =[ metasploit v6.1.14-dev                          ]
+ -- --=[ 2180 exploits - 1155 auxiliary - 399 post       ]
+ -- --=[ 596 payloads - 45 encoders - 10 nops            ]
+ -- --=[ 9 evasion                                        ]

Metasploit tip: Use the edit command to open the 
currently active module in your editor

msf6 > `;
        
        this.addOutput(output, 'terminal-success');
    }

    runAircrack(args) {
        const output = `Aircrack-ng 1.6 

                   [00:01:23] 1834 keys tested (23.45 k/s)

   Time left: 2 hours, 15 minutes                          78.23%

                        KEY FOUND! [ WEP_KEY_123 ]

   Master Key     : CD 69 0D 11 8E AC 3A 9F 87 6B 69 73 67 AD 5B 72 
                    F4 58 07 39 11 45 AB 22 DD 13 F2 8D 42 9A FF CA 

   Transient Key  : 1B 2C 4F 8D 9E 2A 7C 6B 88 91 43 65 F2 A9 C7 E4 
                    DE 7F 22 90 8C F1 B5 67 34 EA DD CC 19 2F AF 78 

   EAPOL HMAC     : F8 1B 2D 6A 9C 3E 4F A2 7B CC 67 89 DE F1 23 AA`;
        
        this.addOutput(output, 'terminal-success');
    }

    runWPScan(args) {
        const output = `_______________________________________________________________
         __          _______   _____
         \\ \\        / /  __ \\ / ____|
          \\ \\  /\\  / /| |__) | (___   ___  __ _ _ __ ®
           \\ \\/  \\/ / |  ___/ \\___ \\ / __|/ _\` | '_ \\
            \\  /\\  /  | |     ____) | (__| (_| | | | |
             \\/  \\/   |_|    |_____/ \\___|\\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.22

[+] URL: http://target.com/ [192.168.1.100]
[+] Started: ${new Date().toLocaleString()}

[+] WordPress version 5.8 identified
[!] 3 vulnerabilities identified:
[!] Title: WordPress 5.8 - Cross-Site Scripting
[!] Title: WordPress 5.8 - SQL Injection
[!] Title: WordPress 5.8 - Privilege Escalation`;
        
        this.addOutput(output, 'terminal-success');
    }

    runGobuster(args) {
        const output = `===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://target.com
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
Starting gobuster scan
===============================================================
/admin                (Status: 200) [Size: 1234]
/backup               (Status: 200) [Size: 567]
/config               (Status: 403) [Size: 278]
/login                (Status: 200) [Size: 2345]
===============================================================
Finished
===============================================================`;
        
        this.addOutput(output, 'terminal-success');
    }

    runSearchsploit(args) {
        const query = args.slice(1).join(' ') || 'apache';
        const output = `----------------------------------------- ---------------------------------
 Exploit Title                           |  Path
----------------------------------------- ---------------------------------
Apache 2.4.49 - Path Traversal          | linux/remote/50383.sh
Apache HTTP Server 2.4.50 - RCE         | multiple/remote/50406.py
Apache Tomcat - AJP 'Ghostcat' RCE      | multiple/webapps/48143.py
Apache Struts 2 - Remote Code Execution | linux/remote/41570.py
----------------------------------------- ---------------------------------
Shellcodes: No Results
Papers: No Results`;
        
        this.addOutput(output, 'terminal-success');
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }

        this.input.value = this.commandHistory[this.historyIndex] || '';
        this.updateCursor();
    }

    handleTabCompletion() {
        const value = this.input.value;
        const commands = [
            'help', 'clear', 'ls', 'pwd', 'whoami', 'uname', 'cat', 'ifconfig', 
            'netstat', 'ps', 'nmap', 'ping', 'nikto', 'dirb', 'sqlmap', 'hydra',
            'john', 'msfconsole', 'aircrack-ng', 'wpscan', 'gobuster', 'searchsploit'
        ];

        const matches = commands.filter(cmd => cmd.startsWith(value));
        if (matches.length === 1) {
            this.input.value = matches[0] + ' ';
            this.updateCursor();
        }
    }

    addOutput(text, className = 'terminal-prompt') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        const span = document.createElement('span');
        span.className = className;
        span.textContent = text;
        
        line.appendChild(span);
        this.output.appendChild(line);
    }

    updateCursor() {
        const cursor = document.querySelector('.terminal-cursor');
        if (cursor) {
            cursor.style.left = `${this.input.offsetLeft + this.input.value.length * 9}px`;
        }
    }

    scrollToBottom() {
        const terminalContent = document.querySelector('.terminal-content');
        if (terminalContent) {
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }
    }
}

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('terminal-input')) {
        new KaliTerminal();
    }
});