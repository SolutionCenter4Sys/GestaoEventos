'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';
import { httpClient } from '@/data/http/httpClient';

interface PacienteModelo {
  id: string;
  nome: string;
  email: string;
  cpf: string;
}

export default function ListaPacientesModeloPage() {
  const params = useParams();
  const id = params.id as string;
  const [pacientes, setPacientes] = useState<PacienteModelo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      httpClient.get<PacienteModelo[]>(`/eventos/${id}/pacientes-modelo`).then(
        (res) => { setPacientes(res.data || []); setLoading(false); },
        () => setLoading(false)
      );
    }
  }, [id]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Pacientes modelo</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} href={`/eventos/${id}`}>Voltar</Button>
          <Button component={Link} href={`/eventos/${id}/pacientes-modelo/novo`} variant="contained">
            Novo paciente
          </Button>
        </Box>
      </Box>
      <Card>
        <CardContent>
          {loading ? (
            <CircularProgress />
          ) : pacientes.length === 0 ? (
            <Typography color="text.secondary">Nenhum paciente modelo cadastrado.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pacientes.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.nome}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.cpf}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button component={Link} href={`/eventos/${id}/pacientes-modelo/${p.id}/comparador-fotos`} size="small" variant="outlined">
                          Comparador de fotos
                        </Button>
                        <Button component={Link} href={`/eventos/${id}/pacientes-modelo/${p.id}/editar`} size="small">
                          Editar
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
