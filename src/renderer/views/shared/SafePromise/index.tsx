import React from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import * as msgs from '@/messages';
import { Box, Typography } from '@mui/material';

import icon1 from './ico1.png';
import icon2 from './ico2.png';
import icon3 from './ico3.png';
import { motion } from 'framer-motion';

export function SafePromise(props: any) {
  const { $t } = useIntl();
  const list = [
    {
      key: 'audit',
      title: $t(msgs.home.safeAudit),
      icon: icon1,
    },
    {
      key: 'open',
      title: $t(msgs.home.openSource),
      icon: icon2,
    },
    {
      key: 'local',
      title: $t(msgs.home.keepInLocal),
      icon: icon3,
    },
  ];
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', ...props.sx }}>
      {list.map((item, i) => (
        <Box
          component={motion.div}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.2, duration: 0.3 }}
          key={item.key}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '33.3%',
          }}
        >
          <img src={item.icon} style={{ width: 45, height: 45 }} />
          <Typography sx={{ fontSize: 12, mt: 1, textAlign: 'center' }}>
            {item.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
