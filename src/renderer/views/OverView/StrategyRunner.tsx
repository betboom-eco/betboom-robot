import { Box, Button, IconButton, Typography } from '@mui/material';
import { RunnerStatus, useRunnerStore } from 'renderer/store/runner';
import * as msgs from '@/messages';
import { useIntl } from 'react-intl';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingCircleIcon } from './LoadingCircleIcon';

export function StrategyRunner({ strategy }: any) {
  const status = useRunnerStore((s) => s.status);
  const start = useRunnerStore((s) => s.start);
  const pause = useRunnerStore((s) => s.pause);
  const loops = useRunnerStore((s) => s.loops);
  const currentLoop = useRunnerStore((s) => s.loopIndex);
  const { $t } = useIntl();

  if (!strategy) return null;
  const isFinished = currentLoop >= loops.length;
  const isInit = status === RunnerStatus.pending && currentLoop == 0;

  const onStartStrategy = async () => {
    try {
      await start();
    } catch (err) {
      console.error('[ERR]:', (err as any).message || err);
      window.notify((err as any).message || err, {
        variant: 'error',
        persist: true,
        action: (id) => (
          <IconButton onClick={() => window.hideToast(id)}>
            <CloseIcon />
          </IconButton>
        ),
      });
    }
  };

  return (
    <Box sx={{ p: 4, pt: 0 }}>
      {isFinished ? (
        <Typography sx={{ textAlign: 'center', my: 2, fontSize: 14 }}>
          {$t(msgs.strategy.finished)}
        </Typography>
      ) : (
        <Typography
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
          }}
        >
          {isInit ? null : (
            <>
              {$t(msgs.strategy.executeStatus)}
              <Typography component="span" sx={{ color: 'primary.main' }}>
                {currentLoop + 1}
              </Typography>
              {' /' + loops.length}
            </>
          )}
        </Typography>
      )}

      {status === RunnerStatus.pending ? (
        <Button
          variant="contained"
          onClick={onStartStrategy}
          sx={{
            width: '100%',
            height: 50,
            bgcolor: currentLoop > 0 ? '#FF7300' : undefined,
          }}
        >
          {isFinished ? (
            $t(msgs.strategy.restart)
          ) : currentLoop == 0 ? (
            $t(msgs.strategy.startStrategy)
          ) : (
            <>
              <RandomIcon style={{ marginRight: 12 }} />
              {$t(msgs.strategy.continueStrategy)}
            </>
          )}
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={pause}
          disabled={status !== RunnerStatus.running}
          sx={{
            fontSize: 16,
            width: '100%',
            height: 50,
          }}
        >
          <LoadingCircleIcon
            className="rotate"
            style={{ width: 22, marginRight: 12 }}
          />
          {status === RunnerStatus.running
            ? $t(msgs.strategy.pause)
            : $t(msgs.strategy.pausing)}
        </Button>
      )}
    </Box>
  );
}

function RandomIcon(props: any) {
  return (
    <svg width="22px" height="22px" viewBox="0 0 22 22" {...props}>
      <path
        d="M12.2861926,0.419932805 C11.3195914,-0.114101212 9.73784091,-0.114101212 8.77123971,0.419932805 L1.81494494,4.26319161 C0.848343744,4.79722563 0.0574684918,6.10808045 0.0574684918,7.17614849 L0.0574684918,14.8626661 C0.0574684918,15.9307341 0.848343744,17.241589 1.81494494,17.775623 L8.77123971,21.6188818 C9.73784091,22.1529158 11.3195914,22.1529158 12.2862288,21.6188818 L19.2425236,17.775623 C20.2091247,17.241589 21,15.9307687 21,14.8626661 L21,7.17614849 C21,6.10808045 20.2091247,4.79722563 19.2425236,4.26319161 L12.2861926,0.419932805 Z"
        fill="#212121"
      ></path>
      <path
        d="M10.4222668,1.63653394 C10.9325962,1.63653394 11.423421,1.73999622 11.769127,1.92025012 L18,5.17111468 C18.2682705,5.31085025 18.42204,5.4806818 18.4222668,5.63646075 C18.4222668,5.79264956 18.2682705,5.96227618 18,6.10221668 L11.769127,9.3526421 C11.423421,9.53307166 10.9325962,9.63653394 10.4222668,9.63653394 C9.91193731,9.63653394 9.42111253,9.53307166 9.07540652,9.35281776 L2.84453354,6.1021874 C2.57626309,5.96224691 2.42226677,5.79262029 2.42226677,5.63643147 C2.42249357,5.48065252 2.57626309,5.31082097 2.84453354,5.17108541 L9.07540652,1.92042578 C9.42111253,1.73996694 9.91193731,1.63653394 10.4222668,1.63653394 Z M10.4222668,4.77261363 C9.56851568,4.77261363 8.84698098,5.16842542 8.84698098,5.63664977 C8.84698098,6.10487412 9.56851568,6.50042497 10.4222668,6.50042497 C11.2759697,6.50042497 11.9975526,6.10483063 11.9975526,5.63664977 C11.9975526,5.16846892 11.2759697,4.77261363 10.4222668,4.77261363 Z"
        fill="#FF7300"
      ></path>
      <path
        d="M2.06153553,7.14825511 C2.18999625,7.14825511 2.34425316,7.19748701 2.5075066,7.29057456 L8.39234178,10.6439918 C9.08180068,11.0370012 9.66440279,12.0329656 9.66440279,12.8188033 L9.66440279,19.5258491 C9.66440279,19.744916 9.61642128,19.9246577 9.52902637,20.0320014 C9.46442881,20.1114369 9.38122616,20.1482551 9.26745366,20.1482551 C9.13877874,20.1482551 8.98455243,20.0992346 8.82148259,20.0063585 L2.93667802,16.6525185 C2.2470049,16.2597204 1.66440279,15.2637259 1.66440279,14.4777069 L1.66440279,7.77087251 C1.66440279,7.58367048 1.70317357,7.14825511 2.06153553,7.14825511 Z M7.89948711,16.0251235 C7.47799462,16.0251235 7.12192235,16.5406933 7.12192235,17.1507443 C7.12192235,17.7607953 7.47799462,18.276365 7.89948711,18.276365 C8.32097959,18.276365 8.67728677,17.7607953 8.67728677,17.1507443 C8.67728677,16.5406933 8.32097959,16.0251235 7.89948711,16.0251235 Z M3.4935424,13.5108697 C3.07198625,13.5108697 2.71586019,14.026556 2.71586019,14.6366605 C2.71586019,15.2468037 3.07198625,15.7622194 3.4935424,15.7622194 C3.91509855,15.7622194 4.27122462,15.2468037 4.27122462,14.6366605 C4.27122462,14.0265174 3.91509855,13.5108697 3.4935424,13.5108697 Z M7.89936966,11.7202804 C7.47787717,11.7202804 7.12180489,12.2358888 7.12180489,12.8459012 C7.12180489,13.4559522 7.47787717,13.9715219 7.89936966,13.9715219 C8.32086214,13.9715219 8.67720847,13.4559522 8.67716932,12.8459012 C8.67716932,12.2358502 8.32086214,11.7202804 7.89936966,11.7202804 Z M3.4935424,9.00362581 C3.07198625,9.00362581 2.71586019,9.51931212 2.71586019,10.1294166 C2.71586019,10.7395597 3.07198625,11.2549755 3.4935424,11.2549755 C3.91509855,11.2549755 4.27122462,10.7395597 4.27122462,10.1294166 C4.27122462,9.51927347 3.91509855,9.00362581 3.4935424,9.00362581 Z"
        fill="#FF7300"
      ></path>
      <path
        d="M19.0102439,7.05597117 C19.3686059,7.05597117 19.4073767,7.49138654 19.4073767,7.67858857 L19.4073767,14.385423 C19.4073767,15.1714419 18.8247745,16.1674063 18.1351014,16.5602345 L12.2502663,19.9138631 C12.087227,20.0069507 11.9329701,20.0559712 11.8045094,20.0559712 C11.4461474,20.0559712 11.4073767,19.6207672 11.4073767,19.4335652 L11.4073767,12.7265194 C11.4073767,11.9407118 11.9899788,10.9447173 12.6794377,10.5514964 L18.5642728,7.19829063 C18.7275263,7.10520307 18.8817526,7.05597117 19.0102439,7.05597117 Z M17.6698258,13.2936268 C17.2014301,13.2936268 16.8057345,13.8666115 16.8057345,14.5445054 C16.8057345,15.2224422 17.2014301,15.7951264 17.6698258,15.7951264 C18.1381781,15.7951264 18.5338737,15.2224422 18.5339172,14.5445054 C18.5339172,13.8665686 18.1382216,13.2936268 17.6698258,13.2936268 Z M13.362611,11.8643269 C12.894286,11.8643269 12.4986502,12.4372251 12.4986502,13.1150166 C12.4986502,13.7928511 12.894286,14.3657064 13.362611,14.3657064 C13.830936,14.3657064 14.2268764,13.7928511 14.2268329,13.1150166 C14.2268329,12.4371822 13.830936,11.8643269 13.362611,11.8643269 Z"
        fill="#FF7300"
      ></path>
    </svg>
  );
}
