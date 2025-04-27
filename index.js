// Filename: ipTrieApp.js

import { readCfgFile } from "./read.js";

/**
 * Converts an IP address string to its 32-bit binary string representation.
 * @param {string} ip - The IP address (e.g., '1.11.128.0').
 * @returns {string} - The 32-bit binary string (e.g., '00000001000010111000000000000000').
 */
function ipToBinary(ip) {
    const octets = ip.split('.');
    if (octets.length !== 4) {
        throw new Error(`Invalid IP address format: ${ip}`);
    }
    return octets.map(octet => {
        const num = Number(octet);
        if (isNaN(num) || num < 0 || num > 255) {
            throw new Error(`Invalid octet in IP address: ${octet}`);
        }
        return num.toString(2).padStart(8, '0');
    }).join('');
}


/**
 * Validates the CIDR notation.
 * @param {string} cidr - The CIDR notation (e.g., '1.11.128.0/17').
 * @returns {Object} - An object containing the base IP and prefix length.
 */
function parseCIDR(cidr) {
    const parts = cidr.split('/');
    if (parts.length !== 2) {
        throw new Error(`Invalid CIDR format: ${cidr}`);
    }
    const [ip, prefixLengthStr] = parts;
    const prefixLength = Number(prefixLengthStr);
    if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 32) {
        throw new Error(`Invalid prefix length in CIDR: ${cidr}`);
    }
    // Validate IP
    ipToBinary(ip); // Will throw if invalid
    return { ip, prefixLength };
}

/**
 * Trie Node class representing each node in the trie.
 */
class TrieNode {
    constructor() {
        this.children = {}; // '0' or '1' as keys
        this.data = [];     // Array to store associated data if this node marks the end of CIDR blocks
    }
}

/**
 * Trie class for storing CIDR blocks.
 */
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    /**
     * Inserts a CIDR block into the trie with associated data.
     * @param {string} cidr - The CIDR notation (e.g., '1.11.128.0/17').
     * @param {Object} data - The associated data object.
     */
    insert(cidr, data) {
        const { ip, prefixLength } = parseCIDR(cidr);
        const binaryIp = ipToBinary(ip);
        let node = this.root;

        for (let i = 0; i < prefixLength; i++) {
            const bit = binaryIp[i];
            if (!node.children[bit]) {
                node.children[bit] = new TrieNode();
            }
            node = node.children[bit];
        }

        // Store the data in the node's data array
        node.data.push(data);
    }

    /**
     * Searches for all matching CIDR blocks that include the given IP.
     * @param {string} ip - The IP address to search for.
     * @returns {Object[]} - An array of associated data objects if found, else an empty array.
     */
    searchAll(ip) {
        const binaryIp = ipToBinary(ip);
        let node = this.root;
        const matches = [];

        for (let i = 0; i < 32; i++) {
            const bit = binaryIp[i];
            if (node.children[bit]) {
                node = node.children[bit];
                if (node.data.length > 0) {
                    matches.push(...node.data);
                }
            } else {
                break;
            }
        }

        return matches;
    }
}

/**
 * Main function to build the trie and search for the IP.
 * @param {Array} ipRanges - Array of objects with 'ipRange', 'description', 'number', 'country', 'status'.
 * @param {string} ipToFind - The IP address to search for.
 * @returns {Array} - An array of matching IP range details or an empty array if not found.
 */
function findAllIpsInTrie(ipRanges, ipToFind) {
    const trie = new Trie();

    // Populate the trie with CIDR blocks
    ipRanges.forEach(rangeObj => {
        const { ipRange, description, number, country, status } = rangeObj;
        try {
            trie.insert(ipRange, {
                ipRange,
                description,
                number: number || '',
                country: country || '',
                status: status || 'none'
            });
        } catch (error) {
            console.error(`Error inserting CIDR ${ipRange}: ${error.message}`);
        }
    });

    // Search for the IP
    try {
        const results = trie.searchAll(ipToFind);
        return results;
    } catch (error) {
        console.error(`Error searching IP ${ipToFind}: ${error.message}`);
        return [];
    }
}

/**
 * Example Usage
 */
async function main() {
    // Sample data array
    const firstTime = new Date().valueOf()
    
    const ipRanges = await readCfgFile("ita-finalv12.cfg")

    // IP address to search
    const ipToFind = '1.11.40.5'; // Change this IP to test different scenarios

    // Find all matching IP ranges in the trie
    const matches = findAllIpsInTrie(ipRanges, ipToFind);

    // Output the results
    if (matches.length > 0) {
        console.log(`IP Address ${ipToFind} Found in ${matches.length} Range(s):`);
        matches.forEach((match, index) => {
            console.log(`${index + 1}.`, match);
        });
        const secondTime = new Date().valueOf()
        console.log(secondTime - firstTime);
          
    } else {
        console.log('IP address not found in any range.');
    }
}

// Execute the main function
main();
