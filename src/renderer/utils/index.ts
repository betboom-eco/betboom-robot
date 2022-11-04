export function delay(ms: number = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function range(length: number) {
  if (length < 0) throw 'length should be greater than 0';
  return Array.from({ length }).map((_, i) => i);
}

export function createPricef(fraction: number = 1) {
  const formattor = Intl.NumberFormat('en', {
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction,
  });
  return (v: any) => {
    if (typeof v !== 'number') {
      v = Number(v) || 0;
    }
    return formattor.format(v);
  };
}

export const noop = () => void 0;

export const isDev = process.env.NODE_ENV === 'development';

export function mask(str?: string, start = 6, end = -4) {
  if (!str) return '';
  return [str.slice(0, start), '...', str.slice(end)].join('');
}

export function mapBy(obj: any, mapper: (value: any, key: string) => any) {
  const out: any = {};
  for (const key in obj) {
    out[key] = mapper(obj[key], key);
  }

  return out;
}

export function pick(obj: any, ...keys: string[]) {
  const out: any = {};
  for (const key of keys) {
    out[key] = obj[key];
  }
  return out;
}
