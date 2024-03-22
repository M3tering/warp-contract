export function base64ToBytes(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

export function hexToBase64(hexString: string): string {
  const [_, hex] = hexString.split("0x");

  // Ensure hex string is valid before converting to array
  if (!/^\w+$/.test(hex)) {
    throw new Error("Invalid hex string");
  }

  const bytes = hex
    .match(/\w{2}/g)! // Ensure result is not null or undefined
    .map((byteStr) => parseInt(byteStr, 16))
    .map((byte) => String.fromCharCode(byte));

  return btoa(bytes.join(""));
}
