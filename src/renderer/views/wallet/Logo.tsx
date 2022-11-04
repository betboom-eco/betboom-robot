import { Logo } from '@/components/Logo';
import { Box } from '@mui/material';

export function WalletLogo(props: any) {
  return (
    <Box
      component={Logo}
      sx={{
        mt: 1,
        display: 'flex',
        alignItems: 'center',
        '& .logo-graphy': {
          color: 'primary.main',
        },
        '& .logo-text': {
          ml: 1,
          mt: 1,
        },
      }}
    />
  );
}
