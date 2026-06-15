# Analisador de Currículos com IA

App Flask que recebe múltiplos currículos (PDF/DOCX/TXT), o perfil da vaga e usa **OpenAI** para classificar cada candidato por grau de compatibilidade.

## Funcionalidades

- Upload múltiplo de currículos (PDF, DOC, DOCX, TXT)
- Formulário completo da vaga (título, requisitos, escolaridade, hard/soft skills, etc.)
- Pesos configuráveis da avaliação (soma = 100%)
- Análise via OpenAI (modelo configurável, padrão `gpt-4o-mini`)
- Tela de resultados com filtros (vaga, nível de aderência, etapa do funil) e busca
- Atualização de etapa do funil (Novo, Triagem, Entrevista, etc.)
- Exportação para Excel (.xlsx)
- Banco SQLite local

## Rodar localmente

```bash
pip install -r requirements.txt
export OPENAI_API_KEY=sk-...
python app.py
```

Acesse http://localhost:5000

## Deploy no Render.com

1. Suba este repositório no GitHub
2. No Render: **New +** → **Blueprint** → conecte o repo (ele lê `render.yaml`)
   - ou: **New +** → **Web Service** → Python → Build: `pip install -r requirements.txt` → Start: `gunicorn app:app`
3. Em **Environment**, adicione:
   - `OPENAI_API_KEY` = sua chave OpenAI
   - `OPENAI_MODEL` = `gpt-4o-mini` (ou `gpt-4o`)

> O plano free do Render usa filesystem efêmero — o `data.db` é resetado a cada deploy. Para produção, troque por Postgres (Render oferece grátis) ou monte um disco persistente.

## Endpoints

- `/nova` — formulário de nova análise
- `/resultados` — tabela de candidatos com filtros
- `/export.xlsx` — download em Excel
- `/healthz` — health check
