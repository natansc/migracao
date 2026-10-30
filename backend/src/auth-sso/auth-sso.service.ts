import { Injectable, InternalServerErrorException } from '@nestjs/common';

export interface AzoAuthResult {
  autorizado: boolean;
  tokenAzo?: string;
}

interface AzoTokenResponse {
  access_token?: string;
}

/**
 * Serviço responsável por realizar a integração e autenticação via SSO na API do AZO.
 */
@Injectable()
export class AzoAuthService {
  private readonly baseUrl: string;
  private readonly tenantId: string;

  constructor() {
    // Carrega as variáveis de ambiente necessárias
    const baseUrl = process.env.AZO_BASE_URL || process.env.NEXT_PUBLIC_AZO_BASE_URL;
    const tenantId = process.env.AZO_TENANT_ID || process.env.NEXT_PUBLIC_AZO_TENANT_ID;

    // Valida se as variáveis de configuração existem na inicialização do serviço
    if (!baseUrl || !tenantId) {
      throw new InternalServerErrorException(
        'ERRO CRÍTICO DE CONFIGURAÇÃO: AZO_BASE_URL ou AZO_TENANT_ID não estão definidas no .env',
      );
    }

    // Normaliza a URL base removendo barras finais excedentes
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.tenantId = tenantId;
  }

  /**
  * Autentica as credenciais do usuário na API do AZO.
   * 
   * @param username - Nome de usuário/E-mail informado no formulário
   * @param pass - Senha informada no formulário
   * @returns O status da autorização e, em caso de sucesso, o token do AZO
   */
  async autenticar(username: string, pass: string): Promise<AzoAuthResult> {
    const tokenRes = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'x-tenant-id': this.tenantId,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ username, password: pass }),

    });

    if (!tokenRes.ok) {
      return { autorizado: false };
    }

    const { access_token: tokenAzo } = (await tokenRes.json()) as AzoTokenResponse;

    if (!tokenAzo) {
      return { autorizado: false };
    }

    return {
      autorizado: true,
      tokenAzo,
    };
  }
}