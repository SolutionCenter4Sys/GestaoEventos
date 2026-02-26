'use client';

import { useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Box, Card, CardContent, Typography, Button, Slider } from '@mui/material';

export default function ComparadorFotosPacientePage() {
  const params = useParams();
  const id = params.id as string;
  const pacienteId = params.pacienteId as string;
  const [divider, setDivider] = useState(50);
  const [fotoAntesUpload, setFotoAntesUpload] = useState<string | null>(null);
  const [fotoDepoisUpload, setFotoDepoisUpload] = useState<string | null>(null);
  const inputAntesRef = useRef<HTMLInputElement>(null);
  const inputDepoisRef = useRef<HTMLInputElement>(null);

  // Mock visual para demonstração no frontend
  const fotoAntesPadrao = useMemo(
    () => 'https://images.unsplash.com/photo-1594824388853-2df32f5fdb6d?auto=format&fit=crop&w=1200&q=80',
    []
  );
  const fotoDepoisPadrao = useMemo(
    () => 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    []
  );
  const fotoAntes = fotoAntesUpload ?? fotoAntesPadrao;
  const fotoDepois = fotoDepoisUpload ?? fotoDepoisPadrao;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 1.5, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4">Comparador de Fotos (Antes e Depois)</Typography>
          <Typography variant="body2" color="text.secondary">
            Paciente: {pacienteId}
          </Typography>
        </Box>
        <Button component={Link} href={`/eventos/${id}/pacientes-modelo`} variant="outlined">
          Voltar para pacientes modelo
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Arraste o controle para comparar as fotos de antes e depois.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <input
              ref={inputAntesRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setFotoAntesUpload(URL.createObjectURL(file));
                e.currentTarget.value = '';
              }}
            />
            <input
              ref={inputDepoisRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setFotoDepoisUpload(URL.createObjectURL(file));
                e.currentTarget.value = '';
              }}
            />
            <Button variant="contained" onClick={() => inputAntesRef.current?.click()}>
              Adicionar foto antes
            </Button>
            <Button variant="contained" onClick={() => inputDepoisRef.current?.click()}>
              Adicionar foto depois
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setFotoAntesUpload(null);
                setFotoDepoisUpload(null);
              }}
            >
              Limpar fotos
            </Button>
          </Box>

          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 260, sm: 360, md: 440 },
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              backgroundImage: `url(${fotoDepois})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                width: `${divider}%`,
                backgroundImage: `url(${fotoAntes})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${divider}%`,
                width: 2,
                bgcolor: '#fff',
                boxShadow: '0 0 0 1px rgba(15,23,42,0.2)',
              }}
            />

            <Typography
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                px: 1.2,
                py: 0.4,
                borderRadius: 1,
                bgcolor: 'rgba(15,23,42,0.7)',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              Antes
            </Typography>
            <Typography
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                px: 1.2,
                py: 0.4,
                borderRadius: 1,
                bgcolor: 'rgba(15,23,42,0.7)',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              Depois
            </Typography>
          </Box>

          <Box sx={{ px: 1, mt: 2.5 }}>
            <Slider value={divider} min={0} max={100} onChange={(_, value) => setDivider(value as number)} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
