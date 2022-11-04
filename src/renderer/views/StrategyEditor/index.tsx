import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

import {
  GameType,
  getMessageForGemeType,
  getMessageForTxSpeed,
  TxSpeed,
  useStrategyStore,
} from '@/store/strategy';
import { useWalletStore } from '@/store/wallet';
import { AnimateView } from '@/components/AnimateView';
import * as msgs from '@/messages';
import { range } from '@/utils';
import { useOrdinal } from 'renderer/hooks/useOrdinal';

export function StrategyEditor(props: any) {
  const wallet = useWalletStore((s) => s.wallet);
  const stra = useStrategyStore((s) => s.strategy);
  const setStrategy = useStrategyStore((s) => s.setStrategy);
  const minBetAmount = useStrategyStore((s) => s.minBetAmount);
  const maxBetAmount = useStrategyStore((s) => s.maxBetAmount);
  const ubalance = useWalletStore((s) => s.assets.usdt);
  const { $t, formatPlural } = useIntl();
  const getOrdinal = useOrdinal();

  const schema = {
    amount: {
      required: $t(msgs.common.isRequired),
      valueAsNumber: true,
      validate(value: any) {
        if (Number.isNaN(value)) {
          return $t(msgs.common.invalidFormat);
        }
        return true;
      },
    },
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      amount: 1,
      type: GameType.bigSmall,
      loops: 20,
      claimRound: 5,
      speed: TxSpeed.mid,
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!stra) {
      loadDefaultValues();
    } else {
      reset({
        ...stra,
        amount: Number(formatUnits(stra.amount, 6)),
      });
    }
  }, [stra]);

  const loadDefaultValues = async () => {
    if (wallet) {
      let loops = 20;
      let amount = ubalance.div(loops);
      if (amount.lt(minBetAmount)) {
        amount = minBetAmount;
        loops = ubalance.div(amount).toNumber();
      } else if (amount.gt(maxBetAmount)) {
        amount = maxBetAmount;
      }

      const defaultValues = {
        type: GameType.bigSmall,
        loops,
        claimRound: 5,
        amount: Number(formatUnits(amount, 6)),
        speed: TxSpeed.mid,
      };
      reset(defaultValues);
    }
  };

  const onSubmit = (data: any) => {
    const strategy = {
      type: data.type,
      amount: parseUnits(data.amount.toString(), 6),
      loops: parseInt(data.loops),
      claimRound: data.claimRound,
      speed: data.speed,
    };

    window.notify($t(msgs.strategy.updateStrategySuccess), {
      variant: 'success',
      autoHideDuration: 3000,
    });
    setStrategy(strategy);
    navigate(-1);
  };

  return (
    <Box component={AnimateView} sx={{ p: 2 }}>
      <Button component={Link} to="/">
        {$t(msgs.common.back)}
      </Button>
      <Box
        sx={{
          p: 2,
          '& h5': { fontSize: 24 },
          '& h6': {
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 2,
          },
          '& .title': {
            mt: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        }}
      >
        <Typography variant="h5">{$t(msgs.strategy.createStrategy)}</Typography>
        <Box
          component="form"
          sx={{
            flexDirection: 'column',
            display: 'flex',
            '& .MuiFormControl-root': { my: 2 },
          }}
        >
          <div className="title">
            <Typography variant="h6">{$t(msgs.strategy.gameType)}</Typography>
          </div>

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField select {...field} variant="filled">
                {[GameType.bigSmall, GameType.oddEven, GameType.random].map(
                  (t) => (
                    <MenuItem key={t} value={t}>
                      {getMessageForGemeType($t, t)}
                    </MenuItem>
                  )
                )}
              </TextField>
            )}
          />

          <div className="title">
            <Typography variant="h6">
              {$t(msgs.strategy.claimOnRoundHint)}
            </Typography>
          </div>

          <Controller
            name="claimRound"
            control={control}
            render={({ field }) => (
              <TextField select {...field} variant="filled">
                {range(5).map((i) => (
                  <MenuItem key={i} value={i + 1}>
                    {$t(msgs.strategy.claimOnRound, {
                      round: getOrdinal(i + 1),
                    })}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <div className="title">
            <Typography variant="h6">{$t(msgs.strategy.betAmount)}</Typography>
            <div className="tail" style={{ fontSize: 12, color: '#959595' }}>
              {$t(msgs.common.avaiableBalance)}{' '}
              <Typography
                sx={{
                  color: 'primary.main',
                  fontSize: 12,
                  display: 'inline',
                }}
              >
                {formatUnits(ubalance, 6)}
              </Typography>{' '}
              USDT{' '}
            </div>
          </div>

          <TextField
            {...register('amount', {
              ...schema.amount,
              min: {
                value: 1,
                message: $t(msgs.strategy.atLeastToBet, { value: '1U' }),
              },
              max: {
                value: 50,
                message: $t(msgs.strategy.shouldNotGreatThanValue, {
                  value: '50U',
                }),
              },
            })}
            helperText={errors.amount?.message as any}
            placeholder={$t(msgs.strategy.inputAmountEveryBet)}
            variant="filled"
            error={!!errors.amount}
            inputMode="decimal"
            InputProps={{
              endAdornment: 'USDT',
            }}
          />

          <div className="title">
            <Typography variant="h6">{$t(msgs.strategy.betTimes)}</Typography>
          </div>

          <TextField
            {...register('loops', {
              required: 'loop is required',
              valueAsNumber: true,
              validate(v: any) {
                if (isNaN(v)) {
                  return $t(msgs.common.shouldBeInteger);
                }
                return true;
              },
            })}
            helperText={errors.loops?.message || ('' as any)}
            error={!!errors.loops}
            variant="filled"
          />

          <div className="title">
            <Typography variant="h6">
              {$t(msgs.strategy.transactionSpeed)}
            </Typography>
            <div className="desc" style={{ fontSize: 12, color: '#959595' }}>
              {$t(msgs.strategy.moreFastMoreExpensive)}
            </div>
          </div>

          <Controller
            name="speed"
            control={control}
            render={({ field }) => (
              <TextField {...field} select variant="filled">
                {[TxSpeed.slow, TxSpeed.mid, TxSpeed.fast].map((t) => (
                  <MenuItem key={t} value={t}>
                    {getMessageForTxSpeed($t, t)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{ height: 50, my: 2 }}
          >
            {$t(msgs.strategy.saveStrategy)}
          </Button>
        </Box>

        <Box
          sx={{
            mt: 2,
            '& .body1': {
              fontSize: 12,
              color: '#c1c1c1',
              my: 1,
            },
          }}
        >
          <Typography variant="h6">{$t(msgs.strategy.instruction)}</Typography>
          <div className="body1">{$t(msgs.strategy.instructionDesc1)}</div>
          <div className="body1">{$t(msgs.strategy.instructionDesc2)}</div>
        </Box>
      </Box>
    </Box>
  );
}
