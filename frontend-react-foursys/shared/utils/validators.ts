export function validarCPF(cpf: string): boolean {
  const numeros = cpf.replace(/\D/g, '');
  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros[i], 10) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(numeros[9], 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros[i], 10) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(numeros[10], 10)) return false;

  return true;
}

export function mascaraCPF(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 3) return nums.replace(/(\d{3})/, '$1.');
  if (nums.length <= 6) return nums.replace(/(\d{3})(\d{1,3})/, '$1.$2.');
  return nums.replace(/(\d{3})(\d{3})(\d{1,3})(\d{0,2})/, '$1.$2.$3-$4');
}

export function mascaraTelefone(valor: string): string {
  const nums = valor.replace(/\D/g, '');
  if (nums.length <= 2) return nums.length ? `(${nums}` : '';
  if (nums.length <= 6) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`;
}

export function mascaraCEP(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 8);
  if (nums.length <= 5) return nums;
  return `${nums.slice(0, 5)}-${nums.slice(5, 8)}`;
}

export interface EnderecoPorCep {
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  complemento: string;
}

export async function buscarEnderecoPorCEP(cep: string): Promise<EnderecoPorCep | null> {
  const cepNumerico = cep.replace(/\D/g, '');
  if (cepNumerico.length !== 8) return null;

  const res = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
  if (!res.ok) return null;

  const data = await res.json() as {
    erro?: boolean;
    cep?: string;
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    complemento?: string;
  };

  if (data.erro) return null;

  return {
    cep: data.cep ?? mascaraCEP(cepNumerico),
    rua: data.logradouro ?? '',
    bairro: data.bairro ?? '',
    cidade: data.localidade && data.uf ? `${data.localidade}/${data.uf}` : (data.localidade ?? ''),
    complemento: data.complemento ?? '',
  };
}
