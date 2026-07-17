# AGENTS.md — Portal-Cavaleiros-de-Salomao (Frontend Angular)

## Projeto
Frontend Angular (standalone components) com Angular Material para gestão de uma loja maçônica "Cavaleiros de Salomão nº 7106".

## Ambientes
- **Produção**: `environment.ts` → apiUrl: `https://apiloja.claytonprebelli.com.br/`, fotosUrl: `https://prebellisolucoes.com/FotosUsers/`
- **Desenvolvimento**: `environment.development.ts` → apiUrl: `https://localhost:7130/`, fotosUrl: `https://localhost:7130/FotosUsers/`
- Troca automática via `fileReplacements` no `angular.json` (config `development`)
- `src/app/core/services/envs.ts` exporta `Envs.apiUrl` e `Envs.fotosUrl`
- **NUNCA** colocar URLs hardcoded nos componentes — usar sempre `Envs.apiUrl` / `Envs.fotosUrl`

## Estrutura
- **src/environments/** — Environment configs (production e development)
- **src/app/core/services/envs.ts** — Wrapper central de URLs (apiUrl, fotosUrl)
- **src/app/core/services/auth.service.ts** — Serviço principal (login, listar, cadastrar, fotos)
- **src/app/core/services/pdf-generator.service.ts** — Geração de PDFs (carteirinha, ficha)
- **src/app/core/interfaces/login.ts** — Interfaces principais (LoginResponse, UsuariosInterface, etc.)
- **src/app/pages/login/** — Tela de login
- **src/app/pages/painel/home-painel/** — Painel do Mestre (CRUD de maçons, aniversários)
- **src/app/pages/cadastros/macon/** — Cadastro/edição individual de maçom
- **src/app/pages/cadastros/macons/** — Listagem de maçons com filtros
- **src/app/pages/shared/header/** — Header/navbar (usado em todas as telas logadas)
- **src/app/pages/shared/ficha-macom/** — Ficha detalhada do maçom
- **src/app/pages/shared/modal-token/** — Modal de link de indicação
- **src/app/pages/home-logado/** — Tela inicial do maçom comum

## Entidade Principal: UsuariosInterface
Campos: id, nome, cim, cpf, rg, nascimento, naturalidade, estado, nacionalidade, estadoCivil, tipoSanguineo, cep, profissao, endereco, numero, cidade, bairro, email, fone, pai, mae, iniciacao, elevacao, exaltacao, observacoes, contatoEmergencia, foneEmergencia, isCandidato, isAprendiz, isCompanheiro, isMestre, isAdmin, isSuperAdmin, pass, dataAfiliacao, formaAfiliacao, **cargo** (string|null — nome do cargo vindo do join), **cargoId** (number|null — FK), statusId, status?, familiares?, documentos?, cobrancas?, foto?

## Alterações Recentes (Jul 2026)

### 1. Cargos (substitui Titulo)
- `UsuariosInterface`: removido `titulo`, adicionado `cargo: string | null` + `cargoId: number | null`
- `macon.component.ts`: select de cargo usando array hardcoded `listaCargos` (não busca da API)
- `macon.component.html`: cargo é `mat-select` com 3 opções + opção vazia
- Todos os templates que exibiam `titulo` agora não exibem mais

### 2. Remoção de Lojas
- **Deletados**: `src/app/core/interfaces/lojas.ts`, `src/app/core/services/lojas.service.ts`, `src/app/core/services/lojas.service.spec.ts`
- `login.ts`: removido `lojaId` do `LoginResponse`, removido `LojasInterface`
- `documentos.ts`: removido `LojaId`
- `auth.service.ts`: removido param `loja` do método `listarMacons()`
- `macon.component.ts`: removido `LojasService`, `listaLojas`, campo `lojaId` do form
- `macons.component.ts/html`: removido filtro e coluna de Loja
- `home-painel.component.ts/html`: loja hardcoded "Cavaleiros de Salomão", titulo removido
- `home-logado.component.ts/html`: removido colunas loja/oriente
- `ficha-macom.component.html`: loja/oriente hardcoded
- `pdf-generator.service.ts`: loja/oriente hardcoded, titulo removido
- `header.component.html`: removido menu "Lojas"

### 3. Environment configs
- Criados `src/environments/environment.ts` (produção) e `environment.development.ts` (dev)
- `angular.json`: `fileReplacements` na config `development` troca `environment.ts` por `environment.development.ts`
- `envs.ts`: importa de environment e exporta `Envs.apiUrl` + `Envs.fotosUrl`

### 4. Correção de bug: loop infinito de avatar
- `header.component.ts`: `setDefaultImage()` agora seta `img.onerror = null` antes de trocar src para SVG inline (evita loop infinito quando default-avatar.png não existe)
- SVG usa `fill="white"` para combinar com o header

### 5. Correção: request null.png na tela de login
- `header.component.html`: ambos os `<img>` do avatar envolvidos com `@if (currentUser)` para evitar request quando não há usuário logado

## Arquivos hardcoded com prebellisolucoes.com (PENDENTE)
Os seguintes arquivos ainda possuem `https://prebellisolucoes.com/FotosUsers/` hardcoded e precisam ser trocados para usar `Envs.fotosUrl`:
1. `header.component.html` — linhas 114, 136
2. `macons.component.html` — linha 90
3. `ficha-macom.component.html` — linha 13
4. `home-painel.component.html` — linhas 14, 127
5. `macon.component.ts` — linha 156
6. `pdf-generator.service.ts` — linha 47

**Para trocar**: adicionar `import { Envs } from '...envs'` no componente e usar `Envs.fotosUrl` no template/TS. Proteger contra `null` ids.

## Comandos Úteis
- `npx tsc --noEmit --project tsconfig.app.json` — Type check rápido
- `ng build` — Build de produção (lento, ~3min)
- `ng serve` — Dev server (porta 4200)
