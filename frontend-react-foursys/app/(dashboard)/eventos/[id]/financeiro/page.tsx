'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SaveIcon from '@mui/icons-material/Save';
import { httpClient } from '@/data/http/httpClient';

interface CustoItem {
  id: string;
  categoria: string;
  previsto: number;
  realizado: number;
}

const CUSTOS_INICIAIS: CustoItem[] = [
  { id: 'loc', categoria: 'Locação do espaço', previsto: 3500, realizado: 3200 },
  { id: 'equip', categoria: 'Equipamentos', previsto: 1800, realizado: 2100 },
  { id: 'coffee', categoria: 'Coffee break', previsto: 1200, realizado: 980 },
  { id: 'material', categoria: 'Materiais didáticos', previsto: 900, realizado: 760 },
  { id: 'divulg', categoria: 'Divulgação/marketing', previsto: 2200, realizado: 2400 },
  { id: 'cert', categoria: 'Certificados e brindes', previsto: 650, realizado: 720 },
];

function formatBRL(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function FinanceiroEventoPage() {
  const params = useParams();
  const id = params.id as string;
  const [itens, setItens] = useState<CustoItem[]>(CUSTOS_INICIAIS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    httpClient.get<{ itens: CustoItem[]; updatedAt?: string }>(`/eventos/${id}/financeiro`).then(
      (res) => {
        if (Array.isArray(res.data?.itens) && res.data.itens.length > 0) {
          setItens(res.data.itens);
        }
        setUltimaAtualizacao(res.data?.updatedAt ?? null);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, [id]);

  const totals = useMemo(() => {
    const previsto = itens.reduce((acc, i) => acc + i.previsto, 0);
    const realizado = itens.reduce((acc, i) => acc + i.realizado, 0);
    const variacao = realizado - previsto;
    const variacaoPct = previsto > 0 ? (variacao / previsto) * 100 : 0;
    return { previsto, realizado, variacao, variacaoPct };
  }, [itens]);

  const maxValorGrafico = useMemo(
    () => Math.max(1, ...itens.flatMap((i) => [i.previsto, i.realizado])),
    [itens]
  );

  const resumoExecutivo = useMemo(() => {
    const maioresDesvios = [...itens]
      .map((i) => ({ ...i, desvio: i.realizado - i.previsto }))
      .sort((a, b) => Math.abs(b.desvio) - Math.abs(a.desvio))
      .slice(0, 2);

    const tendencia =
      totals.variacao > 0
        ? 'acima do previsto'
        : totals.variacao < 0
          ? 'abaixo do previsto'
          : 'em linha com o previsto';

    return {
      tendencia,
      maioresDesvios,
    };
  }, [itens, totals.variacao]);

  const atualizarItem = (idItem: string, campo: 'previsto' | 'realizado', valorTexto: string) => {
    const valor = Number(valorTexto);
    setItens((prev) =>
      prev.map((i) =>
        i.id === idItem
          ? { ...i, [campo]: Number.isNaN(valor) ? 0 : Math.max(0, valor) }
          : i
      )
    );
  };

  const salvarFinanceiro = async () => {
    setSaving(true);
    setErroSalvar(null);
    try {
      const res = await httpClient.put<{ itens: CustoItem[]; updatedAt?: string }>(`/eventos/${id}/financeiro`, {
        itens,
      });
      setUltimaAtualizacao(res.data?.updatedAt ?? null);
    } catch {
      setErroSalvar('Não foi possível salvar os dados financeiros do evento.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
        <Typography>Carregando financeiro do evento...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 1.5, flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachMoneyIcon sx={{ color: '#16A34A' }} />
          Controle Financeiro do Evento
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={saving}
            onClick={() => { void salvarFinanceiro(); }}
            sx={{ borderRadius: 9999, bgcolor: '#16A34A', '&:hover': { bgcolor: '#15803D' } }}
          >
            {saving ? 'Salvando...' : 'Salvar dados'}
          </Button>
          <Button component={Link} href={`/eventos/${id}`} variant="outlined" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 9999 }}>
            Voltar ao evento
          </Button>
        </Box>
      </Box>

      {(ultimaAtualizacao || erroSalvar) && (
        <Alert severity={erroSalvar ? 'error' : 'info'} sx={{ mb: 2 }}>
          {erroSalvar
            ? erroSalvar
            : `Última atualização salva em ${new Date(ultimaAtualizacao as string).toLocaleString('pt-BR')}.`}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2.5 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">Custo previsto total</Typography>
            <Typography variant="h5" fontWeight={700}>{formatBRL(totals.previsto)}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">Custo realizado total</Typography>
            <Typography variant="h5" fontWeight={700}>{formatBRL(totals.realizado)}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">Variação</Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ color: totals.variacao > 0 ? '#DC2626' : totals.variacao < 0 ? '#16A34A' : '#0F172A' }}
            >
              {formatBRL(totals.variacao)} ({totals.variacaoPct.toFixed(1)}%)
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ borderRadius: 3, mb: 2.5 }}>
        <CardHeader title="Inputs parametrizados de custos (previsto x realizado)" titleTypographyProps={{ fontWeight: 700 }} />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            {itens.map((item) => (
              <Box key={item.id} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.6fr 0.6fr 0.6fr' }, gap: 1.2, alignItems: 'center' }}>
                <Typography variant="body2" fontWeight={600}>{item.categoria}</Typography>
                <TextField
                  label="Previsto (R$)"
                  size="small"
                  type="number"
                  value={item.previsto}
                  onChange={(e) => atualizarItem(item.id, 'previsto', e.target.value)}
                />
                <TextField
                  label="Realizado (R$)"
                  size="small"
                  type="number"
                  value={item.realizado}
                  onChange={(e) => atualizarItem(item.id, 'realizado', e.target.value)}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: item.realizado - item.previsto > 0 ? '#DC2626' : '#16A34A',
                    textAlign: { xs: 'left', md: 'right' },
                  }}
                >
                  {formatBRL(item.realizado - item.previsto)}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, mb: 2.5 }}>
        <CardHeader
          avatar={<InsightsIcon sx={{ color: '#4F46E5' }} />}
          title="Gráfico comparativo por categoria"
          titleTypographyProps={{ fontWeight: 700 }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {itens.map((item) => {
              const previstoWidth = (item.previsto / maxValorGrafico) * 100;
              const realizadoWidth = (item.realizado / maxValorGrafico) * 100;
              return (
                <Box key={item.id}>
                  <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600 }}>{item.categoria}</Typography>
                  <Box sx={{ mt: 0.4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 70, fontSize: '0.72rem', color: '#64748B' }}>Previsto</Box>
                      <Box sx={{ flex: 1, height: 10, borderRadius: 9999, bgcolor: '#EEF2FF', overflow: 'hidden' }}>
                        <Box sx={{ width: `${previstoWidth}%`, height: '100%', bgcolor: '#6366F1' }} />
                      </Box>
                      <Box sx={{ width: 90, textAlign: 'right', fontSize: '0.78rem', fontWeight: 600 }}>{formatBRL(item.previsto)}</Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.45 }}>
                      <Box sx={{ width: 70, fontSize: '0.72rem', color: '#64748B' }}>Realizado</Box>
                      <Box sx={{ flex: 1, height: 10, borderRadius: 9999, bgcolor: '#ECFDF3', overflow: 'hidden' }}>
                        <Box sx={{ width: `${realizadoWidth}%`, height: '100%', bgcolor: '#16A34A' }} />
                      </Box>
                      <Box sx={{ width: 90, textAlign: 'right', fontSize: '0.78rem', fontWeight: 600 }}>{formatBRL(item.realizado)}</Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardHeader title="Resumo executivo" titleTypographyProps={{ fontWeight: 700 }} />
        <CardContent>
          <Alert
            icon={totals.variacao > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            severity={totals.variacao > 0 ? 'warning' : 'success'}
            sx={{ mb: 2 }}
          >
            O evento está <strong>{resumoExecutivo.tendencia}</strong> em {Math.abs(totals.variacaoPct).toFixed(1)}% no comparativo entre previsto e realizado.
          </Alert>
          <Divider sx={{ mb: 1.5 }} />
          {resumoExecutivo.maioresDesvios.map((item) => (
            <Typography key={item.id} variant="body2" sx={{ mb: 0.6 }}>
              <strong>{item.categoria}:</strong> desvio de {formatBRL(item.desvio)} em relação ao previsto.
            </Typography>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
