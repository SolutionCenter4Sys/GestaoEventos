import { PrismaClient, PerfilUsuario, TipoTiming } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // ==========================================
  // 1. CRIAR ADMIN PADRÃO
  // ==========================================
  console.log('[1/3] Criando Admin padrão...');
  
  const adminSenhaHash = await bcrypt.hash('Admin123!@#', 12);
  
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@plataforma-eventos.com' },
    update: {},
    create: {
      nome: 'Administrador do Sistema',
      email: 'admin@plataforma-eventos.com',
      senhaHash: adminSenhaHash,
      perfil: PerfilUsuario.ADMIN,
      ativo: true,
    },
  });
  
  console.log('   ✅ Admin criado:', admin.email);
  console.log('   📧 Email: admin@plataforma-eventos.com');
  console.log('   🔑 Senha: Admin123!@#\n');

  // ==========================================
  // 2. CRIAR TEMPLATES DE E-MAIL
  // ==========================================
  console.log('[2/3] Criando templates de e-mail...');

  // 2.1. Template: Inscrição Confirmada
  const templateInscricao = await prisma.templateEmail.upsert({
    where: { nome: 'inscricao_confirmada' },
    update: {},
    create: {
      nome: 'inscricao_confirmada',
      descricao: 'E-mail de confirmação de inscrição em evento',
      assunto: '✅ Inscrição Confirmada - {{nomeEvento}}',
      corpo: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inscrição Confirmada</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="margin: 0;">✅ Inscrição Confirmada!</h1>
  </div>
  
  <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
    <p>Olá, <strong>{{nomeParticipante}}</strong>!</p>
    
    <p>Sua inscrição no evento foi confirmada com sucesso! 🎉</p>
    
    <div style="background-color: white; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #4CAF50;">Detalhes do Evento</h2>
      <p><strong>Evento:</strong> {{nomeEvento}}</p>
      <p><strong>Data:</strong> {{dataEvento}}</p>
      <p><strong>Horário:</strong> {{horaEvento}}</p>
      <p><strong>Local:</strong> {{localEvento}}</p>
      <p><strong>Endereço:</strong> {{enderecoEvento}}</p>
    </div>
    
    <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #856404;">📱 QR Code de Check-in</h3>
      <p>Apresente este QR Code no dia do evento para fazer check-in:</p>
      <div style="text-align: center; margin: 15px 0;">
        <img src="{{qrCodeUrl}}" alt="QR Code" style="max-width: 200px; border: 1px solid #ddd; padding: 10px; background: white;">
      </div>
      <p style="font-size: 12px; color: #856404;">💡 Salve esta imagem ou imprima para facilitar o acesso no dia do evento.</p>
    </div>
    
    {{#senhaGerada}}
    <div style="background-color: #e3f2fd; border: 1px solid #2196F3; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1565c0;">🔐 Acesso à Plataforma</h3>
      <p>Uma conta foi criada automaticamente para você. Use suas credenciais para acessar a área do participante:</p>
      <p><strong>E-mail:</strong> {{emailParticipante}}</p>
      <p><strong>Senha temporária:</strong> <code style="background: #fff; padding: 5px 10px; border-radius: 3px; font-size: 14px;">{{senhaGerada}}</code></p>
      <p style="font-size: 12px; color: #1565c0;">⚠️ Altere sua senha no primeiro acesso.</p>
    </div>
    {{/senhaGerada}}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{linkAreaParticipante}}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Acessar Área do Participante</a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Caso tenha dúvidas, entre em contato conosco através do e-mail: 
      <a href="mailto:suporte@plataforma-eventos.com" style="color: #4CAF50;">suporte@plataforma-eventos.com</a>
    </p>
    
    <p style="font-size: 12px; color: #999; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
      Este é um e-mail automático. Por favor, não responda diretamente a esta mensagem.
    </p>
  </div>
</body>
</html>
      `,
      variaveis: [
        'nomeParticipante',
        'nomeEvento',
        'dataEvento',
        'horaEvento',
        'localEvento',
        'enderecoEvento',
        'qrCodeUrl',
        'senhaGerada',
        'emailParticipante',
        'linkAreaParticipante',
      ],
      ativo: true,
    },
  });
  
  console.log('   ✅ Template criado: inscricao_confirmada');

  // 2.2. Template: Lembrete 7 dias antes
  const templateLembrete7d = await prisma.templateEmail.upsert({
    where: { nome: 'lembrete_7d_antes' },
    update: {},
    create: {
      nome: 'lembrete_7d_antes',
      descricao: 'Lembrete automático enviado 7 dias antes do evento',
      assunto: '⏰ Faltam 7 dias para {{nomeEvento}}!',
      corpo: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lembrete - Faltam 7 dias</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="margin: 0;">⏰ Lembrete: Faltam 7 dias!</h1>
  </div>
  
  <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
    <p>Olá, <strong>{{nomeParticipante}}</strong>!</p>
    
    <p>O evento <strong>{{nomeEvento}}</strong> está chegando! Faltam apenas <strong>7 dias</strong>. 🗓️</p>
    
    <div style="background-color: white; padding: 20px; border-left: 4px solid #2196F3; margin: 20px 0;">
      <p><strong>📅 Data:</strong> {{dataEvento}}</p>
      <p><strong>🕒 Horário:</strong> {{horaEvento}}</p>
      <p><strong>📍 Local:</strong> {{localEvento}}</p>
    </div>
    
    <p>📱 Não esqueça de ter seu QR Code de check-in em mãos no dia do evento!</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{linkDetalhesEvento}}" style="display: inline-block; background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver Detalhes do Evento</a>
    </div>
    
    <p style="font-size: 14px; color: #666;">Nos vemos em breve! 😊</p>
  </div>
</body>
</html>
      `,
      variaveis: [
        'nomeParticipante',
        'nomeEvento',
        'dataEvento',
        'horaEvento',
        'localEvento',
        'linkDetalhesEvento',
      ],
      ativo: true,
    },
  });
  
  console.log('   ✅ Template criado: lembrete_7d_antes');

  // 2.3. Template: Recuperação de Senha
  const templateRecuperacaoSenha = await prisma.templateEmail.upsert({
    where: { nome: 'recuperacao_senha' },
    update: {},
    create: {
      nome: 'recuperacao_senha',
      descricao: 'E-mail com link para redefinir senha',
      assunto: '🔐 Redefinição de Senha - Plataforma de Eventos',
      corpo: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ff9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="margin: 0;">🔐 Redefinição de Senha</h1>
  </div>
  
  <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
    <p>Olá, <strong>{{nomeUsuario}}</strong>!</p>
    
    <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
    
    <p>Se foi você quem solicitou, clique no botão abaixo para criar uma nova senha:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{linkRedefinicao}}" style="display: inline-block; background-color: #ff9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Senha</a>
    </div>
    
    <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #856404;">
        ⚠️ <strong>Este link expira em 1 hora.</strong><br>
        Por motivos de segurança, você precisará solicitar um novo link caso não redefina sua senha dentro deste prazo.
      </p>
    </div>
    
    <p style="font-size: 14px; color: #666;">
      <strong>Não solicitou esta redefinição?</strong><br>
      Ignore este e-mail. Sua senha permanecerá inalterada e ninguém terá acesso à sua conta.
    </p>
    
    <p style="font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      Solicitação realizada em: {{dataHoraSolicitacao}}<br>
      IP de origem: {{ipOrigem}}
    </p>
  </div>
</body>
</html>
      `,
      variaveis: [
        'nomeUsuario',
        'linkRedefinicao',
        'dataHoraSolicitacao',
        'ipOrigem',
      ],
      ativo: true,
    },
  });
  
  console.log('   ✅ Template criado: recuperacao_senha\n');

  // ==========================================
  // 3. CRIAR GATILHOS AUTOMÁTICOS
  // ==========================================
  console.log('[3/3] Criando gatilhos automáticos...');

  // 3.1. Gatilho: Inscrição confirmada (IMEDIATO)
  const gatilhoInscricao = await prisma.gatilhoConfig.upsert({
    where: { nome: 'inscricao_confirmada' },
    update: {},
    create: {
      nome: 'inscricao_confirmada',
      descricao: 'Enviado imediatamente após confirmação de inscrição',
      ativo: true,
      templateId: templateInscricao.id,
      timingTipo: TipoTiming.IMEDIATO,
    },
  });
  
  console.log('   ✅ Gatilho criado: inscricao_confirmada (IMEDIATO)');

  // 3.2. Gatilho: Lembrete 7 dias antes
  const gatilhoLembrete7d = await prisma.gatilhoConfig.upsert({
    where: { nome: 'lembrete_7d_antes' },
    update: {},
    create: {
      nome: 'lembrete_7d_antes',
      descricao: 'Lembrete automático enviado 7 dias antes do evento',
      ativo: true,
      templateId: templateLembrete7d.id,
      timingTipo: TipoTiming.DIAS_ANTES,
      timingValor: 7,
    },
  });
  
  console.log('   ✅ Gatilho criado: lembrete_7d_antes (7 DIAS ANTES)');

  // 3.3. Gatilho: Lembrete 3 dias antes
  const gatilhoLembrete3d = await prisma.gatilhoConfig.upsert({
    where: { nome: 'lembrete_3d_antes' },
    update: {},
    create: {
      nome: 'lembrete_3d_antes',
      descricao: 'Lembrete automático enviado 3 dias antes do evento',
      ativo: true,
      templateId: templateLembrete7d.id, // Reutiliza template
      timingTipo: TipoTiming.DIAS_ANTES,
      timingValor: 3,
    },
  });
  
  console.log('   ✅ Gatilho criado: lembrete_3d_antes (3 DIAS ANTES)');

  // 3.4. Gatilho: Lembrete 1 dia antes
  const gatilhoLembrete1d = await prisma.gatilhoConfig.upsert({
    where: { nome: 'lembrete_1d_antes' },
    update: {},
    create: {
      nome: 'lembrete_1d_antes',
      descricao: 'Lembrete automático enviado 1 dia antes do evento',
      ativo: true,
      templateId: templateLembrete7d.id, // Reutiliza template
      timingTipo: TipoTiming.DIAS_ANTES,
      timingValor: 1,
    },
  });
  
  console.log('   ✅ Gatilho criado: lembrete_1d_antes (1 DIA ANTES)\n');

  // ==========================================
  // RESUMO FINAL
  // ==========================================
  console.log('=' .repeat(60));
  console.log('✅ SEED CONCLUÍDO COM SUCESSO!');
  console.log('=' .repeat(60));
  console.log('\n📊 RESUMO:');
  console.log('  • 1 Admin criado');
  console.log('  • 3 Templates de e-mail criados');
  console.log('  • 4 Gatilhos automáticos configurados');
  console.log('\n🔑 CREDENCIAIS DO ADMIN:');
  console.log('  Email: admin@plataforma-eventos.com');
  console.log('  Senha: Admin123!@#');
  console.log('\n🚀 Próximo passo: npm run start:dev');
  console.log('=' .repeat(60));
}

main()
  .catch((e) => {
    console.error('\n❌ ERRO durante o seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
