'use client';

import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function InscricaoConfirmadaPage() {
  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom color="success.main">
            Inscrição confirmada!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Você receberá um e-mail de confirmação em breve.
          </Typography>
          <Button component={Link} href="/login" variant="contained" color="primary">
            Ir para o login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
