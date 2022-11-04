import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fc0',
    },
    success: {
      main: '#00a776',
    },
    error: {
      main: '#FF4B00',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'DIN Alternate',
      'PingFang SC',
      '-apple-system',
      'Helvetica Neue',
      'Helvetica',
      'Arial',
      'Hiragino Sans GB',
      'Microsoft Yahei',
      'Microsoft Jhenghei',
    ].join(','),
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: ({ theme: { spacing, palette } }) => ({
          '& .MuiFilledInput-root': {
            borderRadius: '40px !important',
            overflow: 'hidden',
            background: '#000',
            fontSize: 14,
            '&::before,&::after': {
              display: 'none',
            },
            '&.Mui-focused': {
              background: '#020202',
            },
            '& input.MuiInputBase-input, .MuiSelect-select.MuiSelect-filled': {
              padding: spacing(2, 3),
            },
            '& .MuiSelect-icon': {
              color: palette.primary.main,
              right: spacing(2),
            },
            '&.MuiInputBase-adornedEnd': {
              paddingRight: spacing(3),
            },
          },
        }),
      },
    },
    MuiButton: {
      variants: [
        {
          props: {
            variant: 'contained',
          },
          style: ({ theme: { palette } }) => ({
            width: '100%',
            background: palette.primary.main,
            height: 48,
            fontSize: 18,
            fontWeight: 'bold',
            borderRadius: 40,
          }),
        },
      ],
    },
  },
});

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true;
  }
}
