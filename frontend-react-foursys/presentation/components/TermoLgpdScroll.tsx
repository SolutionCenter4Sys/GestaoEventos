'use client';

import { useState, useRef } from 'react';
import { Box, FormControlLabel, Checkbox, Typography } from '@mui/material';

const TERMO_LGPD = `
TERMO DE CONSENTIMENTO PARA USO DE DADOS PESSOAIS - LGPD

Este termo estabelece as condições para o tratamento dos seus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).

1. IDENTIFICAÇÃO DO CONTROLADOR
O controlador dos seus dados é a Alur Medical, responsável pelo tratamento das informações coletadas nesta plataforma.

2. DADOS COLETADOS
Coletamos os seguintes dados para fins de participação em eventos e procedimentos: nome completo, CPF, data de nascimento, e-mail, telefone, endereço, histórico de saúde e restrições ou alergias, quando informados.

3. FINALIDADE DO TRATAMENTO
Os dados serão utilizados exclusivamente para: (a) cadastro e gestão de participação em eventos; (b) comunicação sobre o evento; (c) atendimento a obrigações legais; (d) cuidados com a sua saúde durante a participação em procedimentos.

4. BASE LEGAL
O tratamento baseia-se no seu consentimento (Art. 7º, I, LGPD) e na execução de contrato ou procedimentos preliminares (Art. 7º, V, LGPD).

5. COMPARTILHAMENTO
Os dados poderão ser compartilhados apenas com profissionais diretamente envolvidos no evento e autoridades, quando exigido por lei.

6. SEUS DIREITOS
Você tem direito a: acesso, correção, exclusão, portabilidade, revogação do consentimento e informações sobre as entidades com as quais compartilhamos dados. Para exercê-los, entre em contato conosco.

7. ARMAZENAMENTO
Os dados serão mantidos pelo tempo necessário para cumprimento das finalidades ou prazo legal aplicável.

8. SEGURANÇA
Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou destruição.

Ao marcar a caixa abaixo, você declara ter lido e compreendido este termo na íntegra e consente com o tratamento dos seus dados pessoais conforme descrito.
`.trim();

interface TermoLgpdScrollProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function TermoLgpdScroll({ value, onChange, error }: TermoLgpdScrollProps) {
  const [termoScrolled, setTermoScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isAtBottom) {
      setTermoScrolled(true);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Termo de Consentimento LGPD
      </Typography>
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          maxHeight: 200,
          overflowY: 'auto',
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          mb: 2,
          bgcolor: 'grey.50',
        }}
      >
        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
          {TERMO_LGPD}
        </Typography>
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={!termoScrolled}
          />
        }
        label={
          termoScrolled
            ? 'Li e aceito o termo de consentimento LGPD'
            : 'Role até o final do termo para poder aceitar'
        }
      />
      {error && (
        <Typography color="error" variant="caption" display="block" sx={{ mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
