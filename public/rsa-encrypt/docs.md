# RSA-OAEP Encryption with Authentication

This document explains the implementation of RSA-OAEP encryption with authentication using the encrypt-then-sign scheme.

## Overview

The implementation provides a web-based tool for:
1. Generating separate RSA key pairs for encryption and signing
2. Encrypting and signing messages (up to 140 characters)
3. Verifying signatures and decrypting messages

## Technical Implementation

### Cryptographic Libraries Used

This implementation uses the Web Crypto API, which is a native browser API that provides cryptographic functionality. It's a secure, standardized way to perform cryptographic operations in the browser without requiring external libraries.

### Key Generation

Two separate RSA key pairs are generated:
1. **Encryption Key Pair (RSA-OAEP)**
   - Used for encrypting and decrypting messages
   - 2048-bit RSA keys with SHA-256 hash function
   - Public key used for encryption, private key for decryption

2. **Signing Key Pair (RSA-PSS)**
   - Used for signing and verifying messages
   - 2048-bit RSA keys with SHA-256 hash function
   - Private key used for signing, public key for verification

The keys are stored in JavaScript Web Key (JWK) format, which is a standardized format for representing cryptographic keys using JSON.

### Encrypt-then-Sign Process

1. **Message Encryption**:
   - The message is first converted to a binary format (ArrayBuffer)
   - The message is encrypted using the recipient's public encryption key with RSA-OAEP
   - The encrypted message is converted to base64 format for display and transmission

2. **Message Signing**:
   - The encrypted message (ciphertext) is signed using the sender's private signing key with RSA-PSS
   - The signature is also converted to base64 format

This scheme provides both confidentiality (through encryption) and authenticity (through signing).

### Verify-then-Decrypt Process

1. **Signature Verification**:
   - The signature is verified using the sender's public signing key
   - If verification fails, the decryption process is not performed

2. **Message Decryption**:
   - If signature verification succeeds, the encrypted message is decrypted using the recipient's private encryption key
   - The decrypted message is displayed to the user

## Security Considerations

### Separation of Duties

The implementation uses separate key pairs for encryption and signing, following security best practices. This separation ensures that:
- Compromise of one key doesn't affect the security of the other
- Each key serves a specific cryptographic purpose (encryption or signing)

### Encrypt-then-Sign

The encrypt-then-sign approach is used where:
1. The message is first encrypted with the recipient's public key
2. The encrypted message is then signed with the sender's private key

This approach:
- Ensures only the intended recipient can read the message (confidentiality)
- Allows the recipient to verify who sent the message (authenticity)
- Prevents attackers from modifying the message (integrity)

### Key Storage

In this demonstration application, keys are only stored in browser memory (using React state) and are lost when the page refreshes. In a production application, keys would need to be securely stored with appropriate access controls.

## Using the Application

### Generating Key Pairs

1. Navigate to the RSA-OAEP encryption page
2. Click "Generate New Key Pairs"
3. The application will generate separate key pairs for encryption and signing

### Encrypting and Signing a Message

1. Enter a message (max 140 characters) in the text field
2. Click "Encrypt and Sign"
3. The encrypted message and signature will be displayed
4. You can copy both to share with the recipient

### Verifying and Decrypting a Message

There are two ways to verify and decrypt a message:

1. **Using the encrypted message and signature from the same session**:
   - After encrypting and signing a message, click "Verify and Decrypt"
   - The application will verify the signature and decrypt the message

2. **Using an encrypted message and signature from an external source**:
   - Paste the encrypted message in the "Input Encrypted Message" field
   - Paste the signature in the "Input Signature" field
   - Click "Verify and Decrypt" to verify the signature and decrypt the message
   - This allows you to decrypt messages encrypted by others using your keys

In both cases:
- The application will first verify the signature
- If verification succeeds, it will decrypt and display the original message
- If verification fails, an error message will be displayed

## Limitations

- The implementation is limited to messages of 140 characters or less
- Keys are not persisted and are lost on page refresh
- This is a demonstration application and not intended for production use

## Future Improvements

Potential improvements to this implementation could include:
- Adding support for storing keys securely
- Implementing key exchange protocols
- Supporting encryption of larger messages
- Adding support for multiple recipients
- Implementing a more complete public key infrastructure (PKI) 