export function getBase64StringFromDataURL(dataURL: string) {
  return dataURL.replace("data:", "").replace(/^.+,/, "");
}
