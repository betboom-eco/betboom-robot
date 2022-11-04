import { AnimateView } from '@/components/AnimateView';
import config from '@/config';
import contract from '@/contract';
import { mask } from '@/utils';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const { Scrollbars } = require('react-custom-scrollbars');

export function SettingView() {
  const defaultList = [
    { title: 'rpc', val: contract.provider.connection.url },
    {
      title: 'luckygame',
      val: mask(config.network.addresses.luckygame, 10, -10),
    },
    { title: 'usdt', val: mask(config.network.addresses.usdt, 10, -10) },
  ];
  const [list, setList] = useState(defaultList);

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    const nw = await contract.provider.getNetwork();
    setList([
      ...defaultList,
      {
        title: 'chainId',
        val: nw.chainId,
      },
      {
        title: 'name',
        val: nw.name,
      },
    ]);
  };

  return (
    <Box component={AnimateView} sx={{ p: 2, width: '100%', height: '100%' }}>
      <Scrollbars
        autoHide
        renderView={(props: any) => <div {...props} className="view" />}
      >
        <Button size="small" component={Link} to="/">
          Back
        </Button>
        {/* <Box
          component="form"
          sx={{
            p: 2,
            flexDirection: 'column',
            display: 'flex',
            '& .MuiFormControl-root': { my: 2 },
          }}
        >
          <div className="title">RPC</div>
          <TextField
            {...register('rpc', {
              validate(v) {
                return !!v.match(/^https:\/\//);
              },
            })}
            variant="filled"
            placeholder={contract.provider.connection.url}
          />

          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            submit
          </Button>
        </Box> */}
        <Box sx={{ p: 2 }}>
          {list.map((item) => (
            <Line key={item.title} item={item} />
          ))}
        </Box>
      </Scrollbars>
    </Box>
  );
}

function Line({ item }: any) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
      }}
    >
      <Box sx={{ width: 120 }}>{item.title}</Box>
      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.val}
      </Box>
    </Box>
  );
}
