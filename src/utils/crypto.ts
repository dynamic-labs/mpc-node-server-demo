// Takes a base64url-encoded string (e.g. "nMueRPiAm51YXEjRtka8S_8Ura3HaqbmqDqMJCZmvkM")
// and return the corresponding bytes, as an array buffer.
export const base64urlDecode = (str: string): Uint8Array => {
  // Go from base64url encoding to base64 encoding
  const parsedStr = str.replace(/-/g, '+').replace(/_/g, '/');
  // use `atob` to decode base64
  return Uint8Array.from(atob(parsedStr), (c) => c.charCodeAt(0));
};

// Accepts a public key array buffer, and returns a buffer with the compressed version of the public key
export const compressRawPublicKey = (rawPublicKey: ArrayBuffer) => {
  const rawPublicKeyBytes = new Uint8Array(rawPublicKey);
  const len = rawPublicKeyBytes.byteLength;

  // Drop the y coordinate
  // eslint-disable-next-line no-bitwise
  const compressedBytes = rawPublicKeyBytes.slice(0, (1 + len) >>> 1);

  // Encode the parity of `y` in first bit
  // eslint-disable-next-line no-bitwise
  compressedBytes[0] = 0x2 | (rawPublicKeyBytes[len - 1] & 0x01);
  return compressedBytes.buffer;
};

// Converts an ArrayBuffer to a hex-encoded string
export const buf2hex = (buffer: ArrayBuffer): string =>
  [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
