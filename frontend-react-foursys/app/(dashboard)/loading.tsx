'use client';

import { Box, CircularProgress, Typography } from '@mui/material';

export default function DashboardLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary">
        Carregando...
      </Typography>
    </Box>
  );
}
