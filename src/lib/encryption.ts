// ============================================
// TOOLVAULT PRO — AES-256-GCM ENCRYPTION
// ============================================
import { serverEnv } from './env'

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12
const TAG_LENGTH = 128

// Convert hex string to CryptoKey
async function getKey(): Promise<CryptoKey> {
  const keyBuffer = Buffer.from(serverEnv.encryptionKey, 'hex')
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

// ============================================
// ENCRYPT
// ============================================
export async function encrypt(plaintext: string): Promise<string> {
  try {
    const key = await getKey()
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
    const encoded = new TextEncoder().encode(plaintext)

    const ciphertext = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
      key,
      encoded
    )

    // Combine iv + ciphertext → base64
    const combined = new Uint8Array(iv.length + ciphertext.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(ciphertext), iv.length)

    return Buffer.from(combined).toString('base64')
  } catch (error) {
    throw new Error(`Encryption failed: ${error}`)
  }
}

// ============================================
// DECRYPT
// ============================================
export async function decrypt(ciphertext: string): Promise<string> {
  try {
    const key = await getKey()
    const combined = Buffer.from(ciphertext, 'base64')

    const iv = combined.subarray(0, IV_LENGTH)
    const encrypted = combined.subarray(IV_LENGTH)

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
      key,
      encrypted
    )

    return new TextDecoder().decode(decrypted)
  } catch (error) {
    throw new Error(`Decryption failed: ${error}`)
  }
}

// ============================================
// HASH (one-way — for IP, passwords check)
// ============================================
export async function hash(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  return Buffer.from(hashBuffer).toString('hex')
}

// ============================================
// COMPARE HASH
// ============================================
export async function compareHash(
  value: string,
  hashedValue: string
): Promise<boolean> {
  const hashed = await hash(value)
  return hashed === hashedValue
}

// ============================================
// ENCRYPT OBJECT (for storing sensitive JSON)
// ============================================
export async function encryptObject<T>(obj: T): Promise<string> {
  return await encrypt(JSON.stringify(obj))
}

// ============================================
// DECRYPT OBJECT
// ============================================
export async function decryptObject<T>(ciphertext: string): Promise<T> {
  const decrypted = await decrypt(ciphertext)
  return JSON.parse(decrypted) as T
}

// ============================================
// GENERATE SECURE TOKEN
// ============================================
export function generateSecureToken(length: number = 32): string {
  const array = crypto.getRandomValues(new Uint8Array(length))
  return Buffer.from(array).toString('hex')
}

// ============================================
// MASK SENSITIVE DATA (for logs)
// ============================================
export function maskSensitive(value: string): string {
  if (value.length <= 8) return '****'
  return value.substring(0, 4) + '****' + value.substring(value.length - 4)
}
