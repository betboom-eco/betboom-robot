import c2c from 'copy-to-clipboard';

export function copy(text: string, options: any = { format: 'text/plain' }) {
  return c2c(text, options);
}
