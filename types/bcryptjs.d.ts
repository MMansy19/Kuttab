declare module 'bcryptjs' {
  /**
   * Synchronously generates a hash for the given string.
   * @param s The string to hash
   * @param salt The salt to use, or the number of rounds to generate a salt
   * @returns The hashed string
   */
  export function hashSync(s: string, salt: string | number): string;

  /**
   * Synchronously tests a string against a hash.
   * @param s The string to compare
   * @param hash The hash to test against
   * @returns true if matching, false otherwise
   */
  export function compareSync(s: string, hash: string): boolean;

  /**
   * Generates a salt synchronously.
   * @param rounds The number of rounds to use, defaults to 10 if omitted
   * @returns The generated salt
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Asynchronously generates a hash for the given string.
   * @param s The string to hash
   * @param salt The salt to use, or the number of rounds to generate a salt
   * @param callback A callback to be fired once the hash has been generated
   */
  export function hash(s: string, salt: string | number, callback?: (err: Error | null, hash: string) => void): Promise<string>;

  /**
   * Asynchronously tests a string against a hash.
   * @param s The string to compare
   * @param hash The hash to test against
   * @param callback A callback to be fired once the comparison has completed
   */
  export function compare(s: string, hash: string, callback?: (err: Error | null, result: boolean) => void): Promise<boolean>;

  /**
   * Asynchronously generates a salt.
   * @param rounds The number of rounds to use, defaults to 10 if omitted
   * @param callback A callback to be fired once the salt has been generated
   */
  export function genSalt(rounds?: number, callback?: (err: Error | null, salt: string) => void): Promise<string>;
}