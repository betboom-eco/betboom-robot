import { Box } from '@mui/material';
import { LogoGraphy } from './LogoGraphy';
import { LogoText } from './LogoText';

export function Logo(props: any) {
  return (
    <Box {...props}>
      <Box className="logo-graphy" component={LogoGraphy} />
      <Box className="logo-text" component={LogoText} />
    </Box>
  );
}
