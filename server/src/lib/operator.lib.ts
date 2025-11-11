import crypto from "crypto";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/*
 * Generates a unique operator code in the format "OP-XXXXXXXX" where X is a hexadecimal character.
 *
 * @returns {string} 
 */
export const GenerateOperatorCode = () => {
    const LENGTH = 4; // 4 bytes = 8 hex characters

    return "OP-" + crypto.randomBytes(LENGTH).toString('hex').toUpperCase();
}

/**
 * Hashes a password using bcrypt with a defined number of salt rounds.
 *
 * @async
 * @param {string} password 
 * @returns {Promise<string>} 
 */
export const HashPassword = async(password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password with a hashed password to check for a match.
 *
 * @async
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>} 
 */
export const ComparePassword = async(password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}