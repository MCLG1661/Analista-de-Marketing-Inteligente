# 📊 MIA — Marketing Intelligence Analyst

### Marketing Analytics para transformar dados de campanhas em decisões

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](#)

> **Dados → KPIs → Diagnóstico → Recomendação → Decisão**

O **MIA — Marketing Intelligence Analyst** é um MVP de Marketing Analytics desenvolvido para transformar dados brutos de campanhas digitais em indicadores de performance, diagnósticos e recomendações acionáveis.

O projeto simula um fluxo de Marketing Intelligence no qual dados de diferentes canais são carregados a partir de um arquivo JSON, processados automaticamente em JavaScript e apresentados em um dashboard executivo orientado à tomada de decisão.

🌐 **Aplicação online:**  
https://analista-de-marketing-inteligente-t.vercel.app/

---

## 🎯 Problema de Negócio

Campanhas digitais produzem grandes volumes de dados.

Impressões, cliques, investimentos, conversões e receita são facilmente encontrados nas plataformas de mídia. O desafio está em transformar esses números em respostas para perguntas de negócio:

- A campanha atingiu as metas?
- Qual canal apresenta maior retorno?
- Onde o custo de aquisição está elevado?
- Qual canal merece receber mais investimento?
- Onde existem sinais de ineficiência?
- Como realocar orçamento sem aumentar o investimento total?

Um dashboard pode mostrar **o que aconteceu**.

O MIA foi desenvolvido para avançar uma etapa e ajudar a responder:

> **O que os indicadores sugerem que deveria ser feito a seguir?**

---

## 💡 Solução

O MIA executa um pipeline analítico simples e transparente:

```text
campaign_data.json
        ↓
    JavaScript
        ↓
    Agregação
        ↓
      KPIs
        ↓
     Regras
        ↓
  Recomendações
        ↓
Tomada de Decisão
```

A aplicação:

1. carrega os dados da campanha;
2. consolida os resultados dos canais;
3. calcula automaticamente os principais KPIs;
4. compara resultados realizados com metas planejadas;
5. identifica canais de maior e menor eficiência;
6. aplica regras analíticas determinísticas;
7. gera recomendações de otimização;
8. apresenta os resultados em uma interface executiva.

---

## 📊 Dashboard de Performance

O dashboard apresenta uma visão consolidada da campanha com os principais indicadores de Marketing.

### KPIs calculados

- Investimento
- Receita
- Impressões
- Cliques
- Conversões
- CTR
- CPC
- Taxa de Conversão
- CPA
- ROAS
- ROI

Os indicadores são calculados dinamicamente a partir dos dados carregados em `campaign_data.json`.

---

## 🧮 Fórmulas Utilizadas

### CTR — Click Through Rate

```text
CTR = Cliques ÷ Impressões × 100
```

### CPC — Cost per Click

```text
CPC = Investimento ÷ Cliques
```

### Taxa de Conversão

```text
Taxa de Conversão = Conversões ÷ Cliques × 100
```

### CPA — Cost per Acquisition

```text
CPA = Investimento ÷ Conversões
```

### ROAS — Return on Ad Spend

```text
ROAS = Receita ÷ Investimento
```

### ROI — Return on Investment

```text
ROI = (Receita - Investimento) ÷ Investimento × 100
```

---

## 📈 Cenário Demonstrativo

A versão atual utiliza um cenário simulado:

### Lançamento Festival SynthWave Brasil 2024

**Objetivo da campanha:**

> Gerar awareness, tráfego qualificado e vendas do primeiro lote de ingressos para o festival.

A campanha distribui investimento entre quatro canais:

| Canal | Investimento | Impressões | Cliques | Conversões |
|---|---:|---:|---:|---:|
| Instagram | R$ 238.000 | 6,2 mi | 198.400 | 3.100 |
| TikTok | R$ 158.000 | 5,1 mi | 127.500 | 1.450 |
| Email Marketing | R$ 42.000 | 520 mil | 41.600 | 980 |
| Influenciadores | R$ 52.000 | 1,5 mi | 36.250 | 570 |

### Resultado consolidado

| Indicador | Resultado |
|---|---:|
| Investimento | R$ 490.000 |
| Receita | R$ 1.510.900 |
| ROAS | 3,08x |
| ROI | 208,35% |
| Conversões | 6.100 |
| CPA médio | R$ 80,33 |
| Impressões | 13,3 mi |
| Cliques | 403,8 mil |
| CTR | 3,04% |
| CPC | R$ 1,21 |
| Taxa de Conversão | 1,51% |

> Os dados utilizados são simulados e possuem finalidade demonstrativa.

---

## 🔎 Performance por Canal

Além da visão consolidada, o MIA calcula os indicadores individualmente para cada canal.

| Canal | CTR | CPC | Conv. Rate | CPA | ROAS |
|---|---:|---:|---:|---:|---:|
| Instagram | 3,20% | R$ 1,20 | 1,56% | R$ 76,77 | 3,26x |
| TikTok | 2,50% | R$ 1,24 | 1,14% | R$ 108,97 | 2,02x |
| Email Marketing | 8,00% | R$ 1,01 | 2,36% | R$ 42,86 | 6,53x |
| Influenciadores | 2,50% | R$ 1,43 | 1,57% | R$ 91,23 | 2,74x |

Essa visão permite comparar eficiência de aquisição e retorno entre canais.

---

## 🎯 Planejado × Realizado

O MIA compara automaticamente os indicadores realizados com as metas definidas no planejamento.

Na campanha demonstrativa:

| Indicador | Realizado | Meta | Status |
|---|---:|---:|---|
| Receita | R$ 1.510.900 | R$ 1.500.000 | ✅ Atingida |
| Conversões | 6.100 | 6.000 | ✅ Atingida |
| CTR | 3,04% | 2,50% | ✅ Atingida |
| Taxa de Conversão | 1,51% | 4,00% | ⚠️ Abaixo da meta |
| CPA | R$ 80,33 | R$ 85,00 | ✅ Atingida |
| ROAS | 3,08x | 3,00x | ✅ Atingida |

A lógica considera a natureza de cada indicador.

Por exemplo:

- em **ROAS**, valores maiores são melhores;
- em **CPA**, valores menores são melhores.

Isso evita uma comparação genérica do tipo `real >= meta` para todos os KPIs.

---

## 🧠 Motor Analítico

Um dos principais diferenciais do projeto é o **Rule-based Analytics Engine**.

O motor compara KPIs, metas e limites configurados no dataset para identificar automaticamente situações que merecem atenção.

Entre as regras analisadas estão:

- ROAS abaixo da faixa esperada;
- ROAS significativamente acima da meta;
- CPA acima do limite de eficiência;
- CTR abaixo da faixa esperada;
- taxa de conversão em relação à meta;
- diferença de performance entre canais.

---

## 💡 Recomendações Automatizadas

A partir das regras analíticas, o MIA transforma indicadores em recomendações de negócio.

No cenário atual, o sistema identifica automaticamente:

### ⚠️ Revisar retorno de TikTok

O TikTok apresenta ROAS de **2,02x**, abaixo da faixa esperada.

O sistema recomenda revisar:

- segmentação;
- criativos;
- oferta;
- distribuição de verba.

### 📉 Reduzir CPA em TikTok

O CPA do canal está em **R$ 108,97**, acima da referência definida para a campanha.

O sistema sugere investigar:

- públicos;
- jornada pós-clique;
- criativos de menor eficiência.

### 🚀 Escalar Email Marketing

Email Marketing apresenta:

- **ROAS: 6,53x**
- **CPA: R$ 42,86**

O canal combina alto retorno com eficiência de aquisição e se torna candidato a aumento incremental controlado de investimento.

### 🔄 Avaliar realocação de orçamento

O motor compara os canais e identifica a diferença entre o maior e o menor ROAS.

Isso permite sugerir testes de realocação de verba entre canais sem necessariamente aumentar o orçamento total da campanha.

---

## ⚙️ Rule-based Analytics × Inteligência Artificial

A versão atual do MIA utiliza **regras determinísticas**, e não modelos de Inteligência Artificial.

Essa distinção é intencional.

O objetivo do MVP é construir primeiro uma camada analítica:

- transparente;
- auditável;
- reproduzível;
- baseada em regras de negócio.

Portanto:

```text
MIA v1.0
=
Marketing Analytics
+
Business Rules
+
Decision Support
```

A Inteligência Artificial aparece como uma **evolução futura da arquitetura**, não como uma funcionalidade já implementada.

---

## 🧭 Como o MIA Funciona

A metodologia do projeto está estruturada em cinco etapas.

### 01 — Dados

Planejamento e resultados realizados são carregados a partir de:

```text
campaign_data.json
```

### 02 — KPIs

O JavaScript calcula automaticamente:

- CTR
- CPC
- Taxa de Conversão
- CPA
- ROAS
- ROI

### 03 — Diagnóstico

Os indicadores realizados são comparados às metas e às regras da campanha.

### 04 — Recomendação

O motor analítico identifica:

- oportunidades;
- alertas;
- problemas de eficiência;
- possibilidades de otimização.

### 05 — Decisão

Os insights são apresentados de forma executiva para apoiar decisões relacionadas a investimento e performance.

---

## 🏗️ Arquitetura

```text
┌──────────────────────┐
│  campaign_data.json  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      JavaScript      │
│   Motor Analítico    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Agregação       │
│       de Dados       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│        KPIs          │
│ CTR CPC CPA ROAS ROI │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Business Rules     │
│ Diagnóstico / Metas  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Recomendações      │
│ Decision Support     │
└──────────────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

### Front-end

- **HTML5** — estrutura da aplicação
- **CSS3** — interface responsiva e dashboard
- **JavaScript ES6+** — cálculos, regras analíticas e renderização dinâmica

### Dados

- **JSON** — armazenamento estruturado dos dados da campanha

### Recursos do navegador

- Fetch API
- DOM API
- Intl API

### Deploy

- **Vercel**

### Versionamento

- **Git**
- **GitHub**

---

## 📂 Estrutura do Projeto

```text
Analista-de-Marketing-Inteligente/
│
├── index.html
│   └── Estrutura e componentes do dashboard
│
├── style.css
│   └── Interface, layout e responsividade
│
├── script.js
│   └── Motor analítico, cálculos, regras e renderização
│
├── campaign_data.json
│   └── Dataset demonstrativo da campanha
│
└── README.md
    └── Documentação do projeto
```

---

## ▶️ Executando o Projeto

Como a aplicação utiliza `fetch()` para carregar o arquivo JSON, o projeto deve ser executado através de um servidor HTTP.

A maneira mais simples de utilizar a aplicação é acessar o deploy:

https://analista-de-marketing-inteligente-t.vercel.app/

Também é possível clonar o repositório:

```bash
git clone https://github.com/MCLG1661/Analista-de-Marketing-Inteligente.git
```

Acesse a pasta:

```bash
cd Analista-de-Marketing-Inteligente
```

Depois execute o projeto através de um servidor HTTP local de sua preferência.

> Abrir apenas o `index.html` através de `file://` pode impedir o carregamento do `campaign_data.json` por restrições de segurança do navegador.

---

## 💼 Competências Demonstradas

O projeto combina competências de negócio, dados e desenvolvimento.

### Marketing & Business

- Marketing Intelligence
- Marketing Analytics
- Performance Marketing
- Planejamento de campanhas
- Gestão de KPIs
- Análise de ROI e ROAS
- Otimização de investimento
- Data-Driven Decision Making

### Analytics

- Definição e cálculo de KPIs
- Agregação de dados
- Análise comparativa
- Planejado × realizado
- Business Rules
- Rule-based Analytics
- Decision Support
- Geração de insights acionáveis

### Tecnologia

- JavaScript
- JSON
- HTML
- CSS
- DOM
- Fetch API
- Desenvolvimento Web
- Git
- GitHub
- Deploy com Vercel

---

## 🚀 Roadmap

O MVP estabelece uma base para evoluções futuras.

### v1.0 — MVP Analytics

- [x] Dataset estruturado em JSON
- [x] Dashboard executivo
- [x] KPIs consolidados
- [x] Performance por canal
- [x] Planejado × realizado
- [x] Motor analítico baseado em regras
- [x] Recomendações automatizadas
- [x] Resumo executivo dinâmico
- [x] Interface responsiva
- [x] Deploy em produção

### Próximas evoluções

- [ ] Upload de datasets
- [ ] Múltiplas campanhas
- [ ] Comparação entre períodos
- [ ] Visualizações gráficas interativas
- [ ] Persistência em banco de dados
- [ ] Integração com APIs de mídia
- [ ] Meta Ads
- [ ] Google Ads
- [ ] Google Analytics
- [ ] Detecção de anomalias
- [ ] Modelos preditivos
- [ ] Forecast de performance
- [ ] Inteligência Artificial para interpretação contextual
- [ ] Recomendações generativas
- [ ] Agente de Marketing Intelligence

---

## 🤖 Próxima Camada: Inteligência Artificial

Uma evolução futura poderá incorporar modelos de IA para:

- interpretação contextual dos resultados;
- análise de tendências;
- detecção de padrões;
- previsão de performance;
- geração de hipóteses;
- recomendações generativas;
- interação em linguagem natural com os dados.

A arquitetura pretendida pode evoluir de:

```text
Dados
  ↓
KPIs
  ↓
Regras
  ↓
Recomendações
```

para:

```text
Dados
  ↓
Analytics
  ↓
Business Rules
  ↓
Modelos de IA
  ↓
Insights Contextuais
  ↓
Recomendações
  ↓
Decisão
```

---

## 🧪 Natureza dos Dados

Os dados presentes em `campaign_data.json` são **simulados**.

Eles foram estruturados para reproduzir um cenário plausível de campanha de Marketing e permitir a demonstração das funcionalidades analíticas do projeto.

Nenhum dos resultados apresentados deve ser interpretado como dado real do Festival SynthWave Brasil 2024.

---

## 🤝 Contribuições

Contribuições são bem-vindas.

Para contribuir:

1. Faça um fork do repositório.
2. Crie uma nova branch:

```bash
git checkout -b feature/nova-funcionalidade
```

3. Faça suas alterações.
4. Registre o commit:

```bash
git commit -m "feat: adiciona nova funcionalidade"
```

5. Envie a branch:

```bash
git push origin feature/nova-funcionalidade
```

6. Abra um Pull Request descrevendo a melhoria implementada.

---

## 👨‍💻 Autor

**Marcus Guedes**

Marketing | Data Science | Inteligência Artificial | Gestão de Projetos

GitHub:  
https://github.com/MCLG1661

LinkedIn:  
https://www.linkedin.com/in/marcusguedes

---

## 🌐 Projeto Online

**MIA — Marketing Intelligence Analyst**

https://analista-de-marketing-inteligente-t.vercel.app/

---

## 📄 Licença

Este projeto foi desenvolvido para fins de estudo, demonstração técnica e portfólio profissional.

---

### MIA — Marketing Intelligence Analyst

> **Transformando métricas em contexto, contexto em insights e insights em decisões.**
