import React from 'react';
import clsx from 'clsx';
import { Box, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

export function AppTop(props: any) {
  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
      }}
    >
      <Box></Box>
      <IconButton component={Link} to="/setting">
        <SettingsIcon />
      </IconButton>
    </Box>
  );
}
