# Auth SSO

Este modulo sera responsavel por validar o token emitido pelo provedor SSO/AD.

Nao existe cadastro local de usuarios. O contexto do usuario sera extraido do token:
- `subject`: identificador no provedor SSO
- `email` e `name`: dados de exibicao/auditoria
- `groups`: grupos usados para autorizacao
