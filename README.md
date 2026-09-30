# Capoeira Performance — v1.0.0

Primeira versão funcional e instalável como PWA.

## O que já funciona

- Tela inicial responsiva
- Treino do dia
- Adicionar, excluir e concluir exercícios
- Séries, repetições e carga
- Metas e desafios
- Peso corporal
- Metas de calorias, proteína e água
- Dados salvos no próprio celular/navegador com localStorage
- Manifest e Service Worker para instalação como PWA
- Cache versionado

## Como abrir para testar no computador

O Service Worker não funciona corretamente abrindo o arquivo diretamente com `file://`.
Use um servidor local. Exemplo com Python:

```bash
python -m http.server 8080
```

Depois abra:

```text
http://localhost:8080
```

## Como instalar no celular

Publique esta pasta em um endereço HTTPS. Depois:

- Android/Chrome: menu > **Instalar app** ou **Adicionar à tela inicial**.
- iPhone/Safari: Compartilhar > **Adicionar à Tela de Início**.

## Controle de versão

A única versão alterada manualmente fica em `package.json`.

Exemplo de correção:

```json
"version": "1.0.1"
```

Depois execute:

```bash
npm run prepare:release
```

Isso sincroniza automaticamente:

- `src/version.js`
- `version.json`
- `sw.js`

O cache usa a própria versão. Quando você publica uma versão nova, o Service Worker remove o cache antigo.
