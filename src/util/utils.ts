/**
 * A string of valid characters for an identifier.
 */
const characterIds: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
/**
 * The number of valid characters for an identifier.
 */
const characterCount: number = characterIds.length;

/**
 * Generates a random series of characters used to represent an identifier.
 * 
 * @param length The length of the generated id
 * @returns A generated id of the specified length
 */
export function generateId(length: number): string {
    let result: string = '';
    for (let i = 0; i < length; i++) {
        result += characterIds.charAt(Math.floor(Math.random() * characterCount));
    }
    return result;
}

/**
 * Generates a random series of 16 characters.
 * 
 * @returns a generated id of 16 characters
 */
export const generateId16 = () => generateId(16);
