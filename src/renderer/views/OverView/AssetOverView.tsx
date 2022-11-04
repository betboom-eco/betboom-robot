import { useEffect, useState } from 'react';
import { Wallet } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useWalletStore } from 'renderer/store/wallet';
import { createPricef } from 'renderer/utils';
import config from '@/config';
import { copy } from 'renderer/utils/copy';
import SyncIcon from '@mui/icons-material/Sync';
import { Avatar, IconButton, Typography } from '@mui/material';
import { Ethereum as EthIcon } from '@/components/crypto/Ethereum';
import { Polygon as PolygonIcon } from '@/components/crypto/Polygon';
import { Tether as UsdtIcon } from '@/components/crypto/Tether';
import { useRunnerStore } from '@/store/runner';
import { Link } from 'react-router-dom';
import * as msgs from '@/messages';
import { useIntl } from 'react-intl';
import { CopyIcon } from './CopyIcon';

type PropsType = {
  wallet: Wallet;
  readonly?: boolean;
};

const pricef = createPricef(2);

export function AssetOverView({ wallet, readonly = false }: PropsType) {
  const setPrivateKey = useWalletStore((s) => s.setPrivateKey);
  const roundIndex = useRunnerStore((s) => s.roundIndex);
  const assets = useWalletStore((s) => s.assets);
  const loadBalance = useWalletStore((s) => s.loadBalance);
  const loading = useWalletStore((s) => s.balanceLoading);
  const { $t } = useIntl();

  useEffect(() => {
    loadBalance();
  }, [wallet, roundIndex]);

  const onRemoveWallet = async () => {
    if (
      await window.rusure({
        title: $t(msgs.wallet.deleteWarn),
        message: $t(msgs.wallet.confirmToRemoveWallet),
      })
    ) {
      setPrivateKey();
    }
  };

  const onCopyWalletAddress = () => {
    copy(wallet.address);
    window.notify($t(msgs.common.copied));
  };

  const mainSymbol = config.network.symbol.toLowerCase();

  return (
    <Box sx={{ padding: 3, bgcolor: '#212121', m: 4, borderRadius: 5, mb: 0 }}>
      <Box
        className="head"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">{$t(msgs.wallet.myAsset)}</Typography>
          {/* <Typography variant="h6" sx={{ textTransform: 'capitalize', ml: 1 }}>
            ({config.defaultNetwork})
          </Typography> */}
        </Box>
        <Button
          className="action"
          variant="text"
          size="small"
          disabled={readonly}
          onClick={onRemoveWallet}
        >
          {$t(msgs.wallet.deleteWallet)}
        </Button>
      </Box>
      <Box className="list" sx={{ my: 2 }}>
        <AssetItem
          Icon={mainSymbol === 'matic' ? PolygonIcon : EthIcon}
          color={mainSymbol === 'matic' ? '#8247E5' : 'white'}
          balance={assets.eth}
          loading={loading && assets.eth.isZero()}
          symbol={config.network.symbol || 'ETH'}
        />
        <AssetItem
          Icon={UsdtIcon}
          balance={assets.usdt}
          color="#50AF95"
          decimals={6}
          loading={loading && assets.usdt.isZero()}
          symbol="USDT"
        />
      </Box>
      <Box
        className="foot"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {$t(msgs.wallet.walletAddress)} {mask(wallet?.address)}
          </Typography>
          <IconButton onClick={onCopyWalletAddress}>
            <CopyIcon />
          </IconButton>
        </Box>
        <Button
          variant="contained"
          sx={{
            width: 'auto',
            height: 26,
            fontSize: 12,
          }}
          disabled={loading}
          onClick={() => loadBalance()}
        >
          {$t(loading ? msgs.common.refreshing : msgs.common.refresh)}
        </Button>
      </Box>
    </Box>
  );
}

function AssetItem({
  Icon,
  balance,
  symbol,
  color,
  decimals = 18,
  loading,
}: any) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        my: 3,
      }}
    >
      <Avatar sx={{ bgcolor: color, width: 32, height: 32 }}>
        <Icon style={{ fill: '#fff' }} />
      </Avatar>
      <Typography sx={{ flex: 1, ml: 2 }}>{symbol}</Typography>
      <Typography>
        {loading ? (
          <SyncIcon className="rotate" sx={{ color: '#444' }} />
        ) : (
          pricef(formatUnits(balance, decimals))
        )}
      </Typography>
    </Box>
  );
}

function mask(address: string) {
  if (!address) return '';
  return [address.slice(0, 6), '...', address.slice(-4)].join('');
}
