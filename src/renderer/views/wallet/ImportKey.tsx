import { Box, TextField, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as ethers from 'ethers';
import { useState } from 'react';
import { useWalletStore } from '@/store/wallet';
import { Introduction } from './Introduction';
import { isDev } from '@/utils';
import { WalletLogo } from './Logo';
import { AnimateView } from '@/components/AnimateView';
import * as msgs from '@/messages';
import { useIntl } from 'react-intl';
import { SafePromise } from '../shared/SafePromise';

function verifyPrivateKey(key: string) {
  return ethers.utils.isHexString(key);
}

export function ImportKey(props: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      key: isDev ? process.env.TEST_PRI_KEY : undefined,
    },
  });

  const [showIntr, setShowIntr] = useState(true);
  const setPrivateKey = useWalletStore((s) => s.setPrivateKey);
  const { $t } = useIntl();

  const schema = {
    key: {
      required: $t(msgs.common.isRequired),
      validate(value: any) {
        let key = value.trim();
        key = key.length == 64 ? '0x' + key : key;
        if (!verifyPrivateKey(key)) {
          return $t(msgs.common.invalidFormat);
        }
        return true;
      },
    },
  };

  const onSubmit = (data: any) => {
    setPrivateKey(data.key);
    window.notify($t(msgs.wallet.importSuccess), { variant: 'success' });
  };

  if (showIntr)
    return <Introduction onNext={setShowIntr.bind(undefined, false)} />;

  return (
    <Box
      component={AnimateView}
      sx={{ padding: 4, display: 'flex', flexDirection: 'column' }}
    >
      <WalletLogo />
      <Typography variant="h5" sx={{ my: 2, mt: 5 }}>
        {$t(msgs.wallet.importKey)}
      </Typography>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { my: 3 },
        }}
      >
        <Typography variant="body1">
          {$t(msgs.wallet.importWalletKeyPls)}
        </Typography>

        <Box sx={{ my: 2 }}>
          <TextField
            placeholder={$t(msgs.wallet.inputPrivateKeyHint)}
            error={!!errors.key}
            helperText={(errors.key?.message || '') as string}
            variant="filled"
            {...register('key', schema.key)}
            sx={{
              width: '100%',
            }}
            inputMode="decimal"
          />
        </Box>

        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          {$t(msgs.wallet.importKey)}
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <SafePromise sx={{ width: 300, margin: [0, 'auto'] }} />
        </Box>
      </Box>
    </Box>
  );
}
