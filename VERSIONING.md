# Padrão de versionamento do Capoeira Performance

Fonte única: `package.json`.

- **1.0.1** = correção de bug sem recurso novo.
- **1.1.0** = recurso novo compatível com a versão atual.
- **2.0.0** = alteração estrutural grande ou incompatível.

## Regra de publicação

Nunca publique dois códigos diferentes usando o mesmo número de versão.

Fluxo:

1. Atualizar `package.json`.
2. Executar `npm run prepare:release`.
3. Verificar a versão exibida no topo do app.
4. Publicar a pasta completa.
5. Confirmar que `version.json` mostra a mesma versão.

## Cache

O Service Worker cria o cache:

`capoeira-performance-VERSAO`

Ao ativar uma versão nova, caches anteriores com esse prefixo são removidos automaticamente.
