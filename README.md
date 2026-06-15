# CV Analyzer — Análise de Currículos com IA (OpenAI)

App Flask que recebe vários currículos (PDF/DOCX/TXT), o perfil da vaga, e
usa a OpenAI para classificar candidatos por grau de compatibilidade.

## Funcionalidades
- Upload em massa de currículos
- Análise via OpenAI (`gpt-4o-mini` por padrão) com JSON estruturado
- Score 0-100 com pesos configuráveis (experiência, técnicas, formação...)
- Resultados com filtros, busca, etapa do funil e exportação Excel
- Banco PostgreSQL no Render (dados persistem) ou SQLite local

## Deploy no Render.com (passo a passo)

1. **Suba este projeto para um repositório GitHub.**
2. No Render: **New + → Blueprint** → conecte o repositório.
   - O `render.yaml` cria o Web Service **e** um Postgres free automaticamente.
3. Quando o Render perguntar pela variável `OPENAI_API_KEY`, cole sua chave
   da OpenAI (https://platform.openai.com/api-keys). Sem ela a análise NÃO
   funciona — o app retornará erro claro.
4. Clique em **Apply**. Em poucos minutos seu app estará em
   `https://cv-analyzer-xxxx.onrender.com`.

### Verificar saúde
Acesse `/healthz`. Deve retornar:
```json
{"status":"ok","openai_configured":true,"model":"gpt-4o-mini","database":"postgres"}
```

Se `openai_configured` vier `false`, sua chave não está configurada.
Se `database` vier `sqlite`, o Postgres não está conectado (dados serão
perdidos no próximo deploy).

## Rodar local
```bash
pip install -r requirements.txt
export OPENAI_API_KEY=sk-...
python app.py
```
Acesse http://localhost:5000

## Trocar modelo OpenAI
Defina a env var `OPENAI_MODEL` (ex.: `gpt-4o`, `gpt-4o-mini`).
