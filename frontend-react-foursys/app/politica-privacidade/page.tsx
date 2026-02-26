'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import Link from 'next/link';

export default function PoliticaPrivacidadePage() {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Política de Privacidade
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Última atualização: 12/02/2026
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            1. Informações gerais
          </Typography>
          <Typography variant="body1" paragraph>
            A Alur Medical está comprometida com a proteção da sua privacidade. Esta política descreve
            como coletamos, usamos e protegemos suas informações pessoais na Plataforma de Gestão de Eventos.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. Dados coletados
          </Typography>
          <Typography variant="body1" paragraph>
            Coletamos informações que você fornece voluntariamente: nome, e-mail, telefone, CPF, data de
            nascimento e demais dados necessários para inscrição em eventos, cadastro como paciente modelo
            ou solicitação de eventos. A coleta obedece à Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Finalidade do tratamento
          </Typography>
          <Typography variant="body1" paragraph>
            Utilizamos seus dados para: gestão de eventos e inscrições; emissão de certificados;
            comunicação sobre eventos; atendimento a obrigações legais; e melhoria dos nossos serviços.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Segurança
          </Typography>
          <Typography variant="body1" paragraph>
            Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado,
            alteração, divulgação ou destruição indevida.
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. Seus direitos
          </Typography>
          <Typography variant="body1" paragraph>
            Você tem direito a acessar, corrigir, excluir ou solicitar a portabilidade dos seus dados.
            Também pode revogar o consentimento quando aplicável. Para exercer esses direitos, entre em contato
            conosco através dos canais indicados na plataforma.
          </Typography>

          <Typography variant="h6" gutterBottom>
            6. Contato
          </Typography>
          <Typography variant="body1" paragraph>
            Para dúvidas sobre esta política ou sobre o tratamento dos seus dados, entre em contato através
            da área de suporte da plataforma ou pelo e-mail de contato disponível.
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Voltar ao login
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
