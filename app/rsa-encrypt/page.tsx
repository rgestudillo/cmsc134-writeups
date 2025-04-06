"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KeyRound, Lock, Unlock, RefreshCw, Copy, Check, FileText } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

interface KeyPair {
    publicKey: string
    privateKey: string
}

interface LogEntry {
    timestamp: string
    operation: string
    details: string
    type: "info" | "error" | "success"
}

export default function RSAEncryptPage() {
    const [encryptionKeys, setEncryptionKeys] = useState<KeyPair | null>(null)
    const [signingKeys, setSigningKeys] = useState<KeyPair | null>(null)
    const [message, setMessage] = useState("")
    const [encryptedMessage, setEncryptedMessage] = useState("")
    const [signature, setSignature] = useState("")
    const [decryptedMessage, setDecryptedMessage] = useState("")
    const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
    const [isGeneratingKeys, setIsGeneratingKeys] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [copied, setCopied] = useState<false | 'message' | 'signature'>(false)
    const [error, setError] = useState<string | null>(null)
    const [inputEncryptedMessage, setInputEncryptedMessage] = useState("")
    const [inputSignature, setInputSignature] = useState("")
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [tempEncryptionPublicKey, setTempEncryptionPublicKey] = useState("")
    const [tempEncryptionPrivateKey, setTempEncryptionPrivateKey] = useState("")
    const [tempSigningPublicKey, setTempSigningPublicKey] = useState("")
    const [tempSigningPrivateKey, setTempSigningPrivateKey] = useState("")
    const [keyImportError, setKeyImportError] = useState<string | null>(null)

    // Helper function to safely parse JSON
    const safeJsonParse = (value: string): boolean => {
        try {
            JSON.parse(value);
            return true;
        } catch {
            return false;
        }
    };

    // Add log entry helper function
    const addLog = (operation: string, details: string, type: "info" | "error" | "success" = "info") => {
        const now = new Date()
        const timestamp = now.toISOString()
        const newLog: LogEntry = {
            timestamp,
            operation,
            details,
            type
        }
        setLogs(prevLogs => [...prevLogs, newLog])
    }

    // Clear logs
    const clearLogs = () => setLogs([])

    // Generate RSA key pairs for encryption and signing
    const generateKeyPairs = async () => {
        try {
            setIsGeneratingKeys(true)
            setError(null)
            addLog("Key Generation", "Starting key generation process", "info")

            // We'll use the browser's Web Crypto API for key generation
            addLog("Key Generation", "Generating RSA-OAEP encryption key pair (2048 bits)", "info")
            const encryptionKeyPair = await window.crypto.subtle.generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]), // 65537
                    hash: "SHA-256",
                },
                true, // extractable
                ["encrypt", "decrypt"] // key usages
            )

            addLog("Key Generation", "Generating RSA-PSS signing key pair (2048 bits)", "info")
            const signingKeyPair = await window.crypto.subtle.generateKey(
                {
                    name: "RSA-PSS",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]), // 65537
                    hash: "SHA-256",
                },
                true, // extractable
                ["sign", "verify"] // key usages
            )

            // Export the keys to JWK format for display
            addLog("Key Generation", "Exporting keys to JWK format", "info")
            const encryptionPublicKey = await window.crypto.subtle.exportKey("jwk", encryptionKeyPair.publicKey)
            const encryptionPrivateKey = await window.crypto.subtle.exportKey("jwk", encryptionKeyPair.privateKey)
            const signingPublicKey = await window.crypto.subtle.exportKey("jwk", signingKeyPair.publicKey)
            const signingPrivateKey = await window.crypto.subtle.exportKey("jwk", signingKeyPair.privateKey)

            // Store keys in state
            setEncryptionKeys({
                publicKey: JSON.stringify(encryptionPublicKey, null, 2),
                privateKey: JSON.stringify(encryptionPrivateKey, null, 2)
            })

            setSigningKeys({
                publicKey: JSON.stringify(signingPublicKey, null, 2),
                privateKey: JSON.stringify(signingPrivateKey, null, 2)
            })

            addLog("Key Generation", "Key generation completed successfully", "success")
        } catch (err) {
            console.error("Error generating keys:", err)
            setError("Failed to generate keys. See console for details.")
            addLog("Key Generation", `Error: ${err instanceof Error ? err.message : String(err)}`, "error")
        } finally {
            setIsGeneratingKeys(false)
        }
    }

    // Encrypt and sign the message
    const encryptAndSign = async () => {
        if (!message) {
            setError("Please enter a message")
            addLog("Encrypt and Sign", "Error: No message provided", "error")
            return
        }

        if (!encryptionKeys || !signingKeys) {
            setError("Please generate keys first")
            addLog("Encrypt and Sign", "Error: Keys not generated", "error")
            return
        }

        if (message.length > 140) {
            setError("Message must not exceed 140 characters")
            addLog("Encrypt and Sign", "Error: Message exceeds 140 characters", "error")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            addLog("Encrypt and Sign", `Starting encrypt-then-sign process for message: "${message.substring(0, 20)}${message.length > 20 ? '...' : ''}"`, "info")

            // Convert keys from JWK format
            addLog("Encrypt and Sign", "Importing encryption public key from JWK format", "info")
            const encryptionPublicKey = await window.crypto.subtle.importKey(
                "jwk",
                JSON.parse(encryptionKeys.publicKey),
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256",
                },
                true,
                ["encrypt"]
            )

            addLog("Encrypt and Sign", "Importing signing private key from JWK format", "info")
            const signingPrivateKey = await window.crypto.subtle.importKey(
                "jwk",
                JSON.parse(signingKeys.privateKey),
                {
                    name: "RSA-PSS",
                    hash: "SHA-256",
                },
                true,
                ["sign"]
            )

            // Convert message to ArrayBuffer
            addLog("Encrypt and Sign", "Converting plaintext message to binary format (ArrayBuffer)", "info")
            const encoder = new TextEncoder()
            const messageBuffer = encoder.encode(message)
            addLog("Encrypt and Sign", `Message encoded to ${messageBuffer.byteLength} bytes`, "info")

            // Encrypt the message with RSA-OAEP
            addLog("Encrypt and Sign", "Encrypting message with RSA-OAEP", "info")
            const encryptedBuffer = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP"
                },
                encryptionPublicKey,
                messageBuffer
            )
            addLog("Encrypt and Sign", `Message encrypted successfully (${encryptedBuffer.byteLength} bytes)`, "success")

            // Convert encrypted data to base64 for display
            addLog("Encrypt and Sign", "Converting encrypted data to base64 format", "info")
            const encryptedArray = new Uint8Array(encryptedBuffer)
            let binaryString = '';
            for (let i = 0; i < encryptedArray.length; i++) {
                binaryString += String.fromCharCode(encryptedArray[i]);
            }
            const encryptedBase64 = btoa(binaryString)
            setEncryptedMessage(encryptedBase64)
            addLog("Encrypt and Sign", `Base64 encoding complete (${encryptedBase64.length} characters)`, "info")

            // Sign the encrypted message
            addLog("Encrypt and Sign", "Signing the encrypted data with RSA-PSS", "info")
            const signature = await window.crypto.subtle.sign(
                {
                    name: "RSA-PSS",
                    saltLength: 32,
                },
                signingPrivateKey,
                encryptedBuffer
            )
            addLog("Encrypt and Sign", `Message signed successfully (${signature.byteLength} bytes)`, "success")

            // Convert signature to base64 for display
            addLog("Encrypt and Sign", "Converting signature to base64 format", "info")
            const signatureArray = new Uint8Array(signature)
            let sigBinaryString = '';
            for (let i = 0; i < signatureArray.length; i++) {
                sigBinaryString += String.fromCharCode(signatureArray[i]);
            }
            const signatureBase64 = btoa(sigBinaryString)
            setSignature(signatureBase64)
            addLog("Encrypt and Sign", `Base64 encoding complete (${signatureBase64.length} characters)`, "info")

            setDecryptedMessage("")
            setVerificationResult(null)
            addLog("Encrypt and Sign", "Encrypt-then-sign process completed", "success")
        } catch (err) {
            console.error("Error encrypting and signing:", err)
            setError("Failed to encrypt and sign. See console for details.")
            addLog("Encrypt and Sign", `Error: ${err instanceof Error ? err.message : String(err)}`, "error")
        } finally {
            setIsProcessing(false)
        }
    }

    // Verify signature and decrypt the message
    const verifyAndDecrypt = async () => {
        if ((!encryptedMessage || !signature) && (!inputEncryptedMessage || !inputSignature)) {
            setError("Please provide encrypted message and signature")
            addLog("Verify and Decrypt", "Error: Missing encrypted message or signature", "error")
            return
        }

        if (!encryptionKeys || !signingKeys) {
            setError("Please generate keys first")
            addLog("Verify and Decrypt", "Error: Keys not generated", "error")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            addLog("Verify and Decrypt", "Starting verify-then-decrypt process", "info")

            // Use input values if provided, otherwise use state values
            const encryptedToVerify = inputEncryptedMessage || encryptedMessage
            const signatureToVerify = inputSignature || signature
            addLog("Verify and Decrypt", `Using ${inputEncryptedMessage ? 'manually entered' : 'generated'} encrypted message`, "info")
            addLog("Verify and Decrypt", `Using ${inputSignature ? 'manually entered' : 'generated'} signature`, "info")

            // Convert keys from JWK format
            addLog("Verify and Decrypt", "Importing encryption private key from JWK format", "info")
            const encryptionPrivateKey = await window.crypto.subtle.importKey(
                "jwk",
                JSON.parse(encryptionKeys.privateKey),
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256",
                },
                true,
                ["decrypt"]
            )

            addLog("Verify and Decrypt", "Importing signing public key from JWK format", "info")
            const signingPublicKey = await window.crypto.subtle.importKey(
                "jwk",
                JSON.parse(signingKeys.publicKey),
                {
                    name: "RSA-PSS",
                    hash: "SHA-256",
                },
                true,
                ["verify"]
            )

            // Convert base64 back to ArrayBuffer
            addLog("Verify and Decrypt", "Converting base64 encrypted message to binary format", "info")
            const encryptedBytes = new Uint8Array(atob(encryptedToVerify).split('').map(c => c.charCodeAt(0)))
            const encryptedBuffer = encryptedBytes.buffer
            addLog("Verify and Decrypt", `Encrypted data decoded (${encryptedBuffer.byteLength} bytes)`, "info")

            addLog("Verify and Decrypt", "Converting base64 signature to binary format", "info")
            const signatureBytes = new Uint8Array(atob(signatureToVerify).split('').map(c => c.charCodeAt(0)))
            const signatureBuffer = signatureBytes.buffer
            addLog("Verify and Decrypt", `Signature decoded (${signatureBuffer.byteLength} bytes)`, "info")

            // Verify the signature
            addLog("Verify and Decrypt", "Verifying signature with RSA-PSS", "info")
            const isValid = await window.crypto.subtle.verify(
                {
                    name: "RSA-PSS",
                    saltLength: 32,
                },
                signingPublicKey,
                signatureBuffer,
                encryptedBuffer
            )

            setVerificationResult(isValid)

            if (isValid) {
                addLog("Verify and Decrypt", "Signature verification successful", "success")

                // Decrypt the message
                addLog("Verify and Decrypt", "Decrypting message with RSA-OAEP", "info")
                const decryptedBuffer = await window.crypto.subtle.decrypt(
                    {
                        name: "RSA-OAEP"
                    },
                    encryptionPrivateKey,
                    encryptedBuffer
                )

                // Convert decrypted data to string
                addLog("Verify and Decrypt", "Converting decrypted data to text", "info")
                const decoder = new TextDecoder()
                const decryptedText = decoder.decode(decryptedBuffer)
                setDecryptedMessage(decryptedText)
                addLog("Verify and Decrypt", `Message decrypted successfully: "${decryptedText.substring(0, 20)}${decryptedText.length > 20 ? '...' : ''}"`, "success")
            } else {
                setDecryptedMessage("")
                setError("Signature verification failed")
                addLog("Verify and Decrypt", "Signature verification failed - cannot decrypt message", "error")
            }
        } catch (err) {
            console.error("Error verifying and decrypting:", err)
            setError("Failed to verify and decrypt. See console for details.")
            addLog("Verify and Decrypt", `Error: ${err instanceof Error ? err.message : String(err)}`, "error")
            setVerificationResult(false)
            setDecryptedMessage("")
        } finally {
            setIsProcessing(false)
        }
    }

    // Copy only encrypted message
    const copyEncryptedMessage = () => {
        navigator.clipboard.writeText(encryptedMessage)
        setCopied('message')
        setTimeout(() => setCopied(false), 2000)
        addLog("Clipboard", "Copied encrypted message to clipboard", "info")
    }

    // Copy only signature
    const copySignature = () => {
        navigator.clipboard.writeText(signature)
        setCopied('signature')
        setTimeout(() => setCopied(false), 2000)
        addLog("Clipboard", "Copied signature to clipboard", "info")
    }

    // Import existing keys
    const importKeys = () => {
        if (tempEncryptionPublicKey && tempEncryptionPrivateKey && tempSigningPublicKey && tempSigningPrivateKey) {
            setEncryptionKeys({
                publicKey: tempEncryptionPublicKey,
                privateKey: tempEncryptionPrivateKey
            })
            setSigningKeys({
                publicKey: tempSigningPublicKey,
                privateKey: tempSigningPrivateKey
            })
            setTempEncryptionPublicKey("")
            setTempEncryptionPrivateKey("")
            setTempSigningPublicKey("")
            setTempSigningPrivateKey("")
            setKeyImportError(null)
            addLog("Key Import", "Keys imported successfully", "success")
        } else {
            setKeyImportError("Please fill in all fields")
            addLog("Key Import", "Error: Missing fields", "error")
        }
    }

    // Check if keys can be imported
    const canImportKeys = () => {
        return tempEncryptionPublicKey && tempEncryptionPrivateKey && tempSigningPublicKey && tempSigningPrivateKey
    }

    useEffect(() => {
        // Reset state when component mounts
        setEncryptionKeys(null)
        setSigningKeys(null)
        setMessage("")
        setEncryptedMessage("")
        setSignature("")
        setDecryptedMessage("")
        setVerificationResult(null)
        setError(null)
        setInputEncryptedMessage("")
        setInputSignature("")
        setLogs([])
        setTempEncryptionPublicKey("")
        setTempEncryptionPrivateKey("")
        setTempSigningPublicKey("")
        setTempSigningPrivateKey("")
        setKeyImportError(null)
        addLog("Initialization", "Application initialized", "info")
    }, [])

    return (
        <div className="container mx-auto py-8 space-y-8 max-w-6xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">RSA-OAEP Encryption with Authentication</h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    This tool demonstrates RSA-OAEP encryption with authentication using the encrypt-then-sign scheme.
                    Separate key pairs are used for encryption and signing.
                </p>
                <div className="flex justify-center mt-4 space-x-6">
                    <a href="/rsa-encrypt/documentation"
                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                        target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Technical Documentation
                    </a>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                View Operation Logs
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-screen overflow-hidden flex flex-col">
                            <DialogHeader className="pb-2">
                                <DialogTitle>Operation Logs</DialogTitle>
                                <DialogDescription>
                                    View the behind-the-scenes details of cryptographic operations
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-auto my-4">
                                <div className="bg-black text-green-400 font-mono p-4 rounded h-[60vh] overflow-auto">
                                    {logs.length === 0 ? (
                                        <div className="text-gray-500">No operations performed yet.</div>
                                    ) : (
                                        logs.map((log, index) => (
                                            <div key={index} className="mb-1">
                                                <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                                <span className="text-yellow-400 ml-2">[{log.operation}]</span>
                                                <span className={`ml-2 ${log.type === 'error' ? 'text-red-400' :
                                                    log.type === 'success' ? 'text-green-400' :
                                                        'text-blue-300'
                                                    }`}>
                                                    {log.details}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={clearLogs}>Clear Logs</Button>
                                <DialogClose asChild>
                                    <Button>Close</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md relative mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-md">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b pb-3">
                        <CardTitle className="flex items-center text-xl">
                            <KeyRound className="mr-2 h-5 w-5" />
                            Key Management
                        </CardTitle>
                        <CardDescription>
                            Generate or import RSA key pairs for encryption and signing
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <Button
                                onClick={generateKeyPairs}
                                disabled={isGeneratingKeys}
                                className="w-full"
                            >
                                {isGeneratingKeys ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>Generate New Key Pairs</>
                                )}
                            </Button>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        Import Existing Keys
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                    <DialogHeader className="pb-2">
                                        <DialogTitle>Import Existing Keys</DialogTitle>
                                        <DialogDescription>
                                            Paste your encryption and signing keys in JWK format
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium mb-2">Encryption Public Key</h4>
                                                <textarea
                                                    className="w-full p-2 border rounded-md h-24 font-mono text-xs"
                                                    placeholder="Paste RSA-OAEP encryption public key (JWK format)"
                                                    onChange={(e) => {
                                                        const isValid = e.target.value ? safeJsonParse(e.target.value) : true;
                                                        if (isValid) {
                                                            setTempEncryptionPublicKey(e.target.value);
                                                            setKeyImportError(null);
                                                        } else {
                                                            setKeyImportError("Invalid JSON format for encryption public key");
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium mb-2">Encryption Private Key</h4>
                                                <textarea
                                                    className="w-full p-2 border rounded-md h-24 font-mono text-xs"
                                                    placeholder="Paste RSA-OAEP encryption private key (JWK format)"
                                                    onChange={(e) => {
                                                        const isValid = e.target.value ? safeJsonParse(e.target.value) : true;
                                                        if (isValid) {
                                                            setTempEncryptionPrivateKey(e.target.value);
                                                            setKeyImportError(null);
                                                        } else {
                                                            setKeyImportError("Invalid JSON format for encryption private key");
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium mb-2">Signing Public Key</h4>
                                                <textarea
                                                    className="w-full p-2 border rounded-md h-24 font-mono text-xs"
                                                    placeholder="Paste RSA-PSS signing public key (JWK format)"
                                                    onChange={(e) => {
                                                        const isValid = e.target.value ? safeJsonParse(e.target.value) : true;
                                                        if (isValid) {
                                                            setTempSigningPublicKey(e.target.value);
                                                            setKeyImportError(null);
                                                        } else {
                                                            setKeyImportError("Invalid JSON format for signing public key");
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium mb-2">Signing Private Key</h4>
                                                <textarea
                                                    className="w-full p-2 border rounded-md h-24 font-mono text-xs"
                                                    placeholder="Paste RSA-PSS signing private key (JWK format)"
                                                    onChange={(e) => {
                                                        const isValid = e.target.value ? safeJsonParse(e.target.value) : true;
                                                        if (isValid) {
                                                            setTempSigningPrivateKey(e.target.value);
                                                            setKeyImportError(null);
                                                        } else {
                                                            setKeyImportError("Invalid JSON format for signing private key");
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {keyImportError && (
                                            <div className="text-red-500 text-sm">{keyImportError}</div>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            onClick={importKeys}
                                            disabled={!canImportKeys()}
                                        >
                                            Import Keys
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {encryptionKeys && signingKeys && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-5">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-medium">Encryption Keys</h3>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                                                    View Keys
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                                                <DialogHeader className="pb-2">
                                                    <DialogTitle>Encryption Keys</DialogTitle>
                                                    <DialogDescription>
                                                        These keys are used for RSA-OAEP encryption and decryption
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="overflow-y-auto flex-1 py-4 pr-2 -mr-2">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h4 className="text-sm font-medium">Public Key (for encryption)</h4>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(encryptionKeys.publicKey);
                                                                        addLog("Clipboard", "Copied encryption public key to clipboard", "info");
                                                                    }}
                                                                    className="h-7 px-3 text-xs"
                                                                >
                                                                    <Copy className="h-3 w-3 mr-1" />
                                                                    Copy
                                                                </Button>
                                                            </div>
                                                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                                                <pre className="text-xs whitespace-pre-wrap break-all">
                                                                    {encryptionKeys.publicKey}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h4 className="text-sm font-medium">Private Key (for decryption)</h4>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(encryptionKeys.privateKey);
                                                                        addLog("Clipboard", "Copied encryption private key to clipboard", "info");
                                                                    }}
                                                                    className="h-7 px-3 text-xs"
                                                                >
                                                                    <Copy className="h-3 w-3 mr-1" />
                                                                    Copy
                                                                </Button>
                                                            </div>
                                                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                                                <pre className="text-xs whitespace-pre-wrap break-all">
                                                                    {encryptionKeys.privateKey}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                    <DialogClose asChild>
                                                        <Button>Close</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Public & Private Keys Available
                                    </div>
                                </div>

                                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-medium">Signing Keys</h3>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                                                    View Keys
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                                                <DialogHeader className="pb-2">
                                                    <DialogTitle>Signing Keys</DialogTitle>
                                                    <DialogDescription>
                                                        These keys are used for RSA-PSS signing and verification
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="overflow-y-auto flex-1 py-4 pr-2 -mr-2">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h4 className="text-sm font-medium">Public Key (for verification)</h4>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(signingKeys.publicKey);
                                                                        addLog("Clipboard", "Copied signing public key to clipboard", "info");
                                                                    }}
                                                                    className="h-7 px-3 text-xs"
                                                                >
                                                                    <Copy className="h-3 w-3 mr-1" />
                                                                    Copy
                                                                </Button>
                                                            </div>
                                                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                                                <pre className="text-xs whitespace-pre-wrap break-all">
                                                                    {signingKeys.publicKey}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h4 className="text-sm font-medium">Private Key (for signing)</h4>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(signingKeys.privateKey);
                                                                        addLog("Clipboard", "Copied signing private key to clipboard", "info");
                                                                    }}
                                                                    className="h-7 px-3 text-xs"
                                                                >
                                                                    <Copy className="h-3 w-3 mr-1" />
                                                                    Copy
                                                                </Button>
                                                            </div>
                                                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                                                <pre className="text-xs whitespace-pre-wrap break-all">
                                                                    {signingKeys.privateKey}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                    <DialogClose asChild>
                                                        <Button>Close</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Public & Private Keys Available
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b pb-3">
                        <CardTitle className="flex items-center text-xl">
                            <Lock className="mr-2 h-5 w-5" />
                            Encrypt and Sign
                        </CardTitle>
                        <CardDescription>
                            Enter a message (max 140 characters) to encrypt and sign
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
                                    rows={3}
                                    maxLength={140}
                                    placeholder="Enter your message (max 140 characters)"
                                />
                                <div className="text-xs text-right mt-1 text-gray-500">
                                    {message.length}/140 characters
                                </div>
                            </div>

                            <Button
                                onClick={encryptAndSign}
                                disabled={!encryptionKeys || !signingKeys || !message || isProcessing}
                                className="w-full"
                            >
                                {isProcessing ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>Encrypt and Sign</>
                                )}
                            </Button>
                        </div>

                        {encryptedMessage && signature && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-5">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-medium">Encrypted Message</h3>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={copyEncryptedMessage}
                                            className="h-7 px-3"
                                        >
                                            {copied === 'message' ? (
                                                <>
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3 w-3 mr-1" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="text-xs p-2 bg-gray-100 dark:bg-gray-800 rounded-md break-all max-h-32 overflow-auto">
                                        {encryptedMessage}
                                    </div>
                                </div>

                                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-medium">Signature</h3>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={copySignature}
                                            className="h-7 px-3"
                                        >
                                            {copied === 'signature' ? (
                                                <>
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3 w-3 mr-1" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="text-xs p-2 bg-gray-100 dark:bg-gray-800 rounded-md break-all max-h-32 overflow-auto">
                                        {signature}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-md lg:col-span-2">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b pb-3">
                        <CardTitle className="flex items-center text-xl">
                            <Unlock className="mr-2 h-5 w-5" />
                            Verify and Decrypt
                        </CardTitle>
                        <CardDescription>
                            Verify the signature and decrypt the message
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                                    <label htmlFor="encryptedMessage" className="block text-sm font-medium mb-2">
                                        Input Encrypted Message (Optional)
                                    </label>
                                    <textarea
                                        id="encryptedMessage"
                                        value={inputEncryptedMessage}
                                        onChange={(e) => setInputEncryptedMessage(e.target.value)}
                                        className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
                                        rows={3}
                                        placeholder="Paste encrypted message here if you have one"
                                    />
                                </div>
                                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                                    <label htmlFor="signature" className="block text-sm font-medium mb-2">
                                        Input Signature (Optional)
                                    </label>
                                    <textarea
                                        id="signature"
                                        value={inputSignature}
                                        onChange={(e) => setInputSignature(e.target.value)}
                                        className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
                                        rows={3}
                                        placeholder="Paste signature here if you have one"
                                    />
                                </div>
                            </div>

                            {(inputEncryptedMessage || inputSignature) && (
                                <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 p-2 rounded-md">
                                    Using manually entered encrypted message and signature for verification and decryption.
                                </div>
                            )}

                            <div className="flex justify-center">
                                <Button
                                    onClick={verifyAndDecrypt}
                                    disabled={(!encryptionKeys || !signingKeys ||
                                        ((!encryptedMessage || !signature) &&
                                            (!inputEncryptedMessage || !inputSignature))) ||
                                        isProcessing}
                                    className="w-full max-w-md"
                                >
                                    {isProcessing ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>Verify and Decrypt</>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {verificationResult !== null && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-5">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                                    <h3 className="text-sm font-medium mb-2">Signature Verification</h3>
                                    <div className={`p-3 rounded-md ${verificationResult
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                                        }`}>
                                        {verificationResult
                                            ? "✓ Signature verified successfully"
                                            : "× Signature verification failed"}
                                    </div>
                                </div>

                                {verificationResult && decryptedMessage && (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                                        <h3 className="text-sm font-medium mb-2">Decrypted Message</h3>
                                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md break-all">
                                            {decryptedMessage}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 