// TODO make an environemt variable
// Does not have a trailing slash
export function serverUrl() {
  return 'http://localhost:3000';
}

export function getImageUrl(imagename: string) {
  return `${serverUrl()}/image/${imagename}`;
}
