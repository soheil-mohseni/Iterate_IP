# IP Range Lookup with Trie

This repository contains a Node.js application that implements a Trie-based IP lookup system. It reads IP ranges and their metadata from a configuration file (`ita.cfg`), builds a Trie data structure, and allows efficient searching for IP addresses to identify all matching CIDR ranges. The project is designed for network analysis, IP classification, or geolocation tasks, enabling users to determine the organization, country, and other details associated with an IP address.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)

## Features
- Parses a configuration file (`ita.cfg`) containing IP ranges in CIDR notation with metadata (e.g., description, AS number, country).
- Builds a Trie data structure for efficient IP range lookups.
- Supports searching for an IP address to find all matching CIDR ranges (including overlapping ranges).
- Validates IP addresses and CIDR notations, handling errors gracefully.
- Logs configuration options, such as enabling/disabling rule integrity checks or logging settings.
- Lightweight and extensible for integration into larger network monitoring systems.

## Prerequisites
- **Node.js**: Version 14 or higher.
- A configuration file (`ita.cfg`) with IP ranges and metadata (included in the repository as `ita-finalv12.cfg`).

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/ip-range-lookup.git
   cd ip-range-lookup
   ```

2. **Install Dependencies**:
   - The project uses Node.js built-in modules (`fs/promises`), so no external dependencies are required.
   - Ensure Node.js is installed:
     ```bash
     node --version
     ```
     If not installed, download it from [nodejs.org](https://nodejs.org/).

3. **Prepare the Configuration File**:
   - The repository includes `ita-finalv12.cfg`. Ensure it is in the project root directory or update the file path in `index.js` if using a different file.

## Configuration
1. **Configuration File (`ita.cfg`)**:
   - The configuration file is divided into sections: `[settings]`, `[log]`, and `[rules]`.
   - **Settings**:
     - `check-rules-integrity`: Validates the integrity of rules (default: `true`).
     - `log-mac-addr`: Logs MAC addresses (default: `false`).
     - `send-to-log-server`: Sends logs to a server (default: `false`).
     - `log-stats`: Logs statistics (default: `false`).
     - `on-demand-lookup`: Enables on-demand lookups (default: `true`).
   - **Log**:
     - `log-template`: Defines the logging format (e.g., `"GENERAL TEMPLATE", "any", "any", asample:1`).
   - **Rules**:
     - Lists IP ranges in CIDR notation with metadata:
       ```
       <CIDR>, "<Description>", <AS Number>, "<Country Code>", <Status>
       ```
       Example:
       ```
       1.0.0.0/24, "Cloudflare", 13335, "AU", none
       ```
     - Private IP ranges (e.g., `10.0.0.0/8`) are marked as `"Private-Ip"`.
     - The file includes a separator (`##########################`) to distinguish private IPs from public IPs.

2. **Customizing the Configuration**:
   - Edit `ita-finalv12.cfg` to add or modify IP ranges and metadata.
   - Ensure the file follows the expected format to avoid parsing errors.
   - Update the file path in `index.js` if using a different configuration file:
     ```javascript
     const ipRanges = await readCfgFile("ita-finalv12.cfg"); // Change filename if needed
     ```

3. **IP to Search**:
   - In `index.js`, modify the `ipToFind` variable to test different IP addresses:
     ```javascript
     const ipToFind = '1.11.40.5'; // Update this IP
     ```

## Usage
1. **Run the Application**:
   ```bash
   node index.js
   ```
   - The application reads the `ita-finalv12.cfg` file, builds the Trie, and searches for the specified IP address.
   - Example output for `ipToFind = '1.11.40.5'`:
     ```
     IP Address 1.11.40.5 Found in 1 Range(s):
     1. {
         ipRange: '1.11.40.0/21',
         description: 'LG',
         number: '18313',
         country: 'KR',
         status: 'none'
     }
     12
     ```
     - The final number (e.g., `12`) is the execution time in milliseconds.

2. **Interpret Results**:
   - The output lists all CIDR ranges that include the searched IP, along with their metadata (description, AS number, country, status).
   - If no matches are found, it outputs:
     ```
     IP address not found in any range.
     ```

3. **Error Handling**:
   - Invalid IP addresses or CIDR notations are caught and logged:
     ```
     Error inserting CIDR <invalid-cidr>: Invalid CIDR format
     ```
   - File reading errors are logged:
     ```
     Error reading file: <error-message>
     ```

## Project Structure
```
ip-range-lookup/
├── index.js              # Main script to build Trie and search IPs
├── read.js               # Module to read and parse the .cfg file
├── ita-finalv12.cfg      # Configuration file with IP ranges and metadata
├── README.md             # Project documentation
```

- **`index.js`**: Implements the Trie data structure, IP-to-binary conversion, CIDR parsing, and IP lookup logic.
- **`read.js`**: Reads and parses the `ita.cfg` file, extracting IP ranges and metadata.
- **`ita-finalv12.cfg`**: Contains IP ranges (private and public) with metadata for lookup.

## Dependencies
- None (uses Node.js built-in `fs/promises` module).
- Requires Node.js 14+ for ES module support (`import` syntax).

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the existing style and handles edge cases (e.g., invalid IPs, malformed config files).

