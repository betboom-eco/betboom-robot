import { useMemo } from 'react';
import { useIntl } from 'react-intl';

function getEnSuffix(n: number) {
  switch (n % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function useOrdinal() {
  const intl = useIntl();

  const getOrdinal = useMemo(
    () => (n: number) => {
      const suffix = intl.locale == 'en' ? getEnSuffix(n) : '';
      return n + suffix;
    },
    [intl.locale]
  );

  return getOrdinal;
}
