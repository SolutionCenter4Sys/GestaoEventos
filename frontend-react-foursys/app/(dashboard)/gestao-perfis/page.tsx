'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import { httpClient } from '@/data/http/httpClient';

interface Perfil {
  id: string;
  nome: string;
  descricao: string;
  permissoes: string[];
  usuarios: number;
  ativo: boolean;
}

interface UsuarioPerfil {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  perfilId: string;
  ativo: boolean;
}

export default function GestaoPerfisPage() {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioPerfil[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      httpClient.get<Perfil[]>('/perfis'),
      httpClient.get<UsuarioPerfil[]>('/perfis?usuarios=1'),
    ]).then(
      ([resPerfis, resUsuarios]) => {
        setPerfis(resPerfis.data || []);
        setUsuarios(resUsuarios.data || []);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const formatPermissao = (p: string) => {
    const [recurso, acao] = p.split('.');
    if (acao === '*') return `${recurso} (todos)`;
    return `${recurso}.${acao}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestão de perfis
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Perfis e permissões (RBAC). Organizador, Marketing, Vendas, Professor, Participante, Paciente Modelo.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {perfis.map((p) => (
          <Card key={p.id} sx={{ minWidth: 200 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PeopleIcon color="primary" />
                <Typography variant="h6">{p.nome}</Typography>
                <Chip label={p.usuarios} size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary">{p.descricao}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card>
        <CardHeader title="Perfis e permissões" />
        <CardContent>
          {perfis.map((perfil) => (
            <Accordion key={perfil.id} defaultExpanded={perfil.id === 'perf-001'}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography fontWeight={600}>{perfil.nome}</Typography>
                  <Chip label={`${perfil.usuarios} usuários`} size="small" />
                  {perfil.ativo && <Chip label="Ativo" size="small" color="success" />}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {perfil.descricao}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Permissões:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {perfil.permissoes.map((perm) => (
                    <Chip key={perm} label={formatPermissao(perm)} size="small" variant="outlined" />
                  ))}
                </Box>
                {usuarios.filter((u) => u.perfilId === perfil.id).length > 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Usuários:</Typography>
                    <List dense>
                      {usuarios
                        .filter((u) => u.perfilId === perfil.id)
                        .map((u) => (
                          <ListItem key={u.id}>
                            <ListItemText primary={u.nome} secondary={u.email} />
                            <Chip label={u.ativo ? 'Ativo' : 'Inativo'} size="small" color={u.ativo ? 'success' : 'default'} />
                          </ListItem>
                        ))}
                    </List>
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
