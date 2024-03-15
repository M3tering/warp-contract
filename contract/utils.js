export function base64ToBytes(base64) {
  return Uint8Array.from(atob(base64), (m) => m.codePointAt(0));
}

export function hexToBase64(hexString) {
  const [_, hex] = hexString.split("0x");
  return btoa(
    hex
      .match(/\w{2}/g)
      .map(function (a) {
        return String.fromCharCode(parseInt(a, 16));
      })
      .join("")
  );
}
