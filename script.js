document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');

    // --- Objeto de Ícones SVG ---
    const ICONS = {
        zap: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
        clipboard: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
        barChart: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>`,
        layoutDashboard: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
        table: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"></path><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 12h18"></path></svg>`,
        lightbulb: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>`,
        fileDown: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
        plus: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
        trash: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    };

    let performanceChartInstance = null;

    // --- Estado da Aplicação ---
    let state = {
        currentPhase: 1,
        campaign: null,
        performanceData: [],
    };

    // --- Funções de Ajuda (Helpers) ---
    const formatCurrency = (amount) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
    const formatPercentage = (value) => (value * 100).toFixed(2) + '%';

    // --- Lógica de Persistência com localStorage ---
    function saveState() {
        localStorage.setItem('miaState', JSON.stringify(state));
    }

    function loadState() {
        const savedState = localStorage.getItem('miaState');
        if (savedState) {
            state = JSON.parse(savedState);
        }
    }

    // --- Lógica Central do MIA (Análise) ---
    const analyzePerformance = (performanceData, setup) => {
        if (!performanceData || performanceData.length === 0) {
            return { analysis: "Aguardando dados de performance para iniciar a análise.", recommendation: "Aguardando dados de performance para iniciar a análise." };
        }

        let winnerAd = null;
        let bestCtr = -1;
        let totalCost = 0;
        let totalConversions = 0;

        performanceData.forEach(ad => {
            const ctr = (ad.clicks / ad.impressions) || 0;
            const cpl = (ad.conversions > 0) ? (ad.cost / ad.conversions) : Infinity;
            ad.ctr = ctr;
            ad.cpl = cpl;
            totalCost += ad.cost;
            totalConversions += ad.conversions;
            if (ctr > bestCtr) {
                bestCtr = ctr;
                winnerAd = ad;
            }
        });

        let analysis = [];
        let recommendation = [];

        if (winnerAd) {
            analysis.push(`O criativo "${winnerAd.creative}" no canal ${winnerAd.channel} é o líder, com um CTR de ${formatPercentage(winnerAd.ctr)}.`);
            const underperformingAds = performanceData.filter(ad => ad.id !== winnerAd.id && ad.ctr < winnerAd.ctr * 0.5);
            if (underperformingAds.length > 0) {
                const names = underperformingAds.map(ad => ad.creative).join(', ');
                analysis.push(`Os criativos (${names}) estão com performance significativamente abaixo do líder.`);
                recommendation.push(`**Ação Imediata:** Pausar os anúncios de baixo desempenho (${names}) e realocar seu orçamento para o criativo "${winnerAd.creative}".`);
            } else {
                recommendation.push('A diferença de performance não é extrema. Manter o orçamento atual por mais 24h para coletar mais dados.');
            }
        }

        const overallCPL = totalConversions > 0 ? totalCost / totalConversions : Infinity;
        if (setup && setup.expectedCPL) {
            if (overallCPL === Infinity) {
                analysis.push(`Ainda não houve conversões para calcular o CPL.`);
                recommendation.push(`**Foco:** Otimizar a landing page para melhorar a taxa de conversão.`);
            } else if (overallCPL > setup.expectedCPL * 1.2) {
                analysis.push(`A CPL geral (${formatCurrency(overallCPL)}) está acima da meta (${formatCurrency(setup.expectedCPL)}).`);
                recommendation.push(`**Ação de Refino:** Revisar a segmentação do público para reduzir custos.`);
            } else if (overallCPL < setup.expectedCPL * 0.8) {
                analysis.push(`A CPL geral (${formatCurrency(overallCPL)}) está bem abaixo da meta. Excelente!`);
                recommendation.push(`**Ação de Escala:** Aumentar o investimento no criativo de melhor performance para maximizar o volume.`);
            } else {
                analysis.push(`A CPL geral (${formatCurrency(overallCPL)}) está dentro da meta (${formatCurrency(setup.expectedCPL)}).`);
            }
        }

        return { analysis: analysis.join('\n\n'), recommendation: recommendation.join('\n\n') };
    };

    // --- Funções de Renderização ---

    function renderHeader() {
        return `
            <div class="header">
                <h1 style="display: flex; justify-content: center; align-items: center; gap: 0.5rem;">${ICONS.zap} MIA - Marketing Intelligence Analyst</h1>
                <p>Transformando dados brutos em decisões inteligentes.</p>
            </div>
        `;
    }

    function renderPhase1() {
        const formData = state.campaign || {
            objective: 'Gerar leads qualificados para o time de vendas',
            targetLeads: 500,
            timeBound: '30 dias',
            budgetTotal: 10000,
            persona: 'Gestor de Marketing, 30-45 anos, ativo no LinkedIn',
        };

        appContainer.innerHTML = `
            ${renderHeader()}
            <div class="card">
                <h2 class="card-title">${ICONS.clipboard} Fase 1: Planejamento e Estratégia</h2>
                <p style="color: var(--text-secondary-color); margin-bottom: 1.5rem;">Defina seus objetivos SMART e o escopo da campanha.</p>
                <form id="phase1-form" class="space-y-6">
                    <div>
                        <label class="form-label" for="objective">1.1 Objetivo SMART</label>
                        <input type="text" id="objective" name="objective" value="${formData.objective}" required class="form-input">
                    </div>
                    <div class="grid grid-cols-2">
                        <div>
                            <label class="form-label" for="targetLeads">Meta (Leads/Vendas)</label>
                            <input type="number" id="targetLeads" name="targetLeads" value="${formData.targetLeads}" required min="1" class="form-input">
                        </div>
                        <div>
                            <label class="form-label" for="timeBound">Prazo (Temporal)</label>
                            <input type="text" id="timeBound" name="timeBound" value="${formData.timeBound}" required class="form-input">
                        </div>
                    </div>
                    <div>
                        <label class="form-label" for="budgetTotal">1.2 Orçamento Total (R$)</label>
                        <input type="number" id="budgetTotal" name="budgetTotal" value="${formData.budgetTotal}" required min="1" step="any" class="form-input">
                    </div>
                    <div>
                        <label class="form-label" for="persona">1.3 Persona/Público-Alvo</label>
                        <textarea id="persona" name="persona" required rows="2" class="form-textarea">${formData.persona}</textarea>
                    </div>
                    <button type="submit" class="btn btn-indigo">Salvar e Iniciar Monitoramento (Fase 2)</button>
                </form>
            </div>
        `;

        document.getElementById('phase1-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const newCampaign = {
                objective: form.objective.value,
                targetLeads: parseInt(form.targetLeads.value, 10),
                timeBound: form.timeBound.value,
                budgetTotal: parseFloat(form.budgetTotal.value),
                persona: form.persona.value,
            };
            newCampaign.expectedCPL = newCampaign.targetLeads > 0 ? newCampaign.budgetTotal / newCampaign.targetLeads : Infinity;

            state.campaign = newCampaign;
            state.currentPhase = 2;
            saveState();
            renderApp();
        });
    }

    function renderPhase2() {
        if (state.performanceData.length === 0) {
            state.performanceData = [
                { id: 'ad1', channel: 'Meta Ads', creative: 'Foto Fundo Branco', impressions: 50000, clicks: 500, cost: 500, conversions: 10 },
                { id: 'ad2', channel: 'Meta Ads', creative: 'Vídeo Pessoa Correndo', impressions: 40000, clicks: 1200, cost: 600, conversions: 30 },
                { id: 'ad3', channel: 'Google Search', creative: 'Anúncio de Texto Título A', impressions: 8000, clicks: 300, cost: 400, conversions: 8 },
            ];
        }

        const totalMetrics = state.performanceData.reduce((acc, ad) => ({
            totalImpressions: acc.totalImpressions + ad.impressions,
            totalClicks: acc.totalClicks + ad.clicks,
            totalConversions: acc.totalConversions + ad.conversions,
            totalCost: acc.totalCost + ad.cost,
        }), { totalImpressions: 0, totalClicks: 0, totalConversions: 0, totalCost: 0 });

        const overallCTR = totalMetrics.totalImpressions > 0 ? totalMetrics.totalClicks / totalMetrics.totalImpressions : 0;
        const miaAnalysis = analyzePerformance(state.performanceData, state.campaign);

        if (performanceChartInstance) {
            performanceChartInstance.destroy();
            performanceChartInstance = null;
        }

        const tableRows = state.performanceData.map((ad, index) => {
            const ctr = (ad.clicks / ad.impressions) || 0;
            const cpl = (ad.conversions > 0) ? (ad.cost / ad.conversions) : Infinity;
            const isCplGood = cpl !== Infinity && cpl <= state.campaign.expectedCPL * 1.1;
            return `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td style="min-width: 150px;">
                        <div style="font-weight: 600;">${ad.creative}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary-color);">${ad.channel}</div>
                    </td>
                    <td class="text-right"><input type="number" class="form-input" data-id="${ad.id}" data-field="impressions" value="${ad.impressions}"></td>
                    <td class="text-right"><input type="number" class="form-input" data-id="${ad.id}" data-field="clicks" value="${ad.clicks}"></td>
                    <td class="text-right"><input type="number" class="form-input" data-id="${ad.id}" data-field="cost" value="${ad.cost}" step="any"></td>
                    <td class="text-right"><input type="number" class="form-input" data-id="${ad.id}" data-field="conversions" value="${ad.conversions}"></td>
                    <td class="text-right font-bold ${ctr > overallCTR ? 'text-green' : 'text-yellow'}">${formatPercentage(ctr)}</td>
                    <td class="text-right font-bold ${isCplGood ? 'text-green' : (cpl === Infinity ? '' : 'text-red')}">${cpl === Infinity ? 'N/A' : formatCurrency(cpl)}</td>
                    <td class="text-center" style="width: 50px;">
                        <button class="btn-remove" data-id="${ad.id}" title="Remover Criativo">${ICONS.trash}</button>
                    </td>
                </tr>
            `;
        }).join('');

        appContainer.innerHTML = `
            ${renderHeader()}
            <div class="space-y-6">
                <div class="card">
                    <h2 class="card-title">${ICONS.barChart} Visão Geral do Custo por Lead (CPL)</h2>
                    <div class="chart-container" style="position: relative; height:300px; width:100%;">
                        <canvas id="performanceChart"></canvas>
                    </div>
                </div>

                <div class="card">
                    <h2 class="card-title">${ICONS.layoutDashboard} 1. KPIs Consolidados</h2>
                    <div class="grid grid-cols-4">
                        <div><h3 class="card-title">Custo Total</h3><p class="card-value">${formatCurrency(totalMetrics.totalCost)}</p></div>
                        <div><h3 class="card-title">Impressões</h3><p class="card-value">${totalMetrics.totalImpressions.toLocaleString('pt-BR')}</p></div>
                        <div><h3 class="card-title">Cliques (CTR)</h3><p class="card-value">${totalMetrics.totalClicks.toLocaleString('pt-BR')}</p><p style="color: var(--indigo-400); font-size: 0.8rem;">CTR: ${formatPercentage(overallCTR)}</p></div>
                        <div><h3 class="card-title">Conversões</h3><p class="card-value">${totalMetrics.totalConversions.toLocaleString('pt-BR')}</p><p style="color: var(--indigo-400); font-size: 0.8rem;">CPL Meta: ${formatCurrency(state.campaign.expectedCPL)}</p></div>
                    </div>
                </div>

                <div class="card">
                    <h2 class="card-title">${ICONS.table} 2. Desempenho por Criativo (Dados Vivos)</h2>
                    <div class="table-container">
                        <table class="performance-table">
                            <thead><tr><th>#</th><th>Criativo/Canal</th><th class="text-right">Impressões</th><th class="text-right">Cliques</th><th class="text-right">Custo (R$)</th><th class="text-right">Conversões</th><th class="text-right">CTR</th><th class="text-right">CPL</th><th class="text-center">Ações</th></tr></thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                    </div>
                    <button id="save-performance" class="btn btn-indigo" style="width: auto; padding: 0.5rem 1rem; margin-right: 1rem;">Atualizar Análise</button>
                    <button id="advance-phase3" class="btn btn-yellow" style="width: auto; padding: 0.5rem 1rem;">Finalizar Campanha</button>
                    <button id="add-creative" class="btn btn-green" style="width: auto; padding: 0.5rem 1rem; margin-left: 1rem; float: right;">${ICONS.plus} Adicionar Criativo</button>
                </div>

                <div class="card" style="border-color: var(--green-500);">
                    <h2 class="card-title">${ICONS.lightbulb} 3. Análise e Otimização do MIA</h2>
                    <h4 style="font-weight: 700; margin-top: 1rem;">Análise Contínua:</h4>
                    <pre class="analysis-block">${miaAnalysis.analysis}</pre>
                    <h4 style="font-weight: 700; margin-top: 1rem;">Decisão Auxiliada (Recomendação):</h4>
                    <pre class="analysis-block text-yellow">${miaAnalysis.recommendation}</pre>
                </div>
            </div>
        `;

        renderPerformanceChart();

        document.querySelector('.performance-table tbody').addEventListener('click', handleTableActions);
        document.getElementById('add-creative').addEventListener('click', handleAddCreative);
        document.getElementById('save-performance').addEventListener('click', () => {
            document.querySelectorAll('.performance-table input').forEach(input => {
                const { id, field } = input.dataset;
                const value = parseFloat(input.value) || 0;
                const ad = state.performanceData.find(ad => ad.id === id);
                if (ad) {
                    ad[field] = value;
                }
            });
            saveState();
            renderApp(); // Re-render to update calculations
        });

        document.getElementById('advance-phase3').addEventListener('click', () => {
            state.currentPhase = 3;
            saveState();
            renderApp();
        });
    }

    function handleAddCreative() {
        const creativeName = prompt("Digite o nome do novo criativo:", `Novo Criativo ${state.performanceData.length + 1}`);
        if (creativeName) {
            const newCreative = {
                id: `ad${Date.now()}`, // ID único baseado no timestamp
                channel: 'Não definido',
                creative: creativeName,
                impressions: 0,
                clicks: 0,
                cost: 0,
                conversions: 0
            };
            state.performanceData.push(newCreative);
            saveState();
            renderApp();
        }
    }

    function handleTableActions(event) {
        if (event.target.classList.contains('btn-remove')) {
            const adId = event.target.dataset.id;
            if (confirm('Tem certeza que deseja remover este criativo?')) {
                state.performanceData = state.performanceData.filter(ad => ad.id !== adId);
                saveState();
                renderApp();
            }
        }
    }


    function renderPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        const labels = state.performanceData.map(ad => ad.creative);
        const cplData = state.performanceData.map(ad => {
            const cpl = (ad.conversions > 0) ? (ad.cost / ad.conversions) : 0; // Usamos 0 para o gráfico se não houver conversão
            return cpl;
        });

        const expectedCPL = state.campaign.expectedCPL;

        performanceChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'CPL Real',
                    data: cplData,
                    backgroundColor: cplData.map(cpl => cpl > expectedCPL * 1.1 ? '#ef4444' : '#4ade80'), // Vermelho se acima da meta, verde se abaixo
                    borderColor: cplData.map(cpl => cpl > expectedCPL * 1.1 ? '#ef4444' : '#4ade80'),
                    borderWidth: 1
                },
                {
                    label: 'CPL Meta',
                    data: Array(labels.length).fill(expectedCPL),
                    type: 'line',
                    borderColor: '#fcd34d',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) { return 'R$ ' + value; },
                            color: '#9ca3af'
                        }
                    },
                    x: { ticks: { color: '#9ca3af' } }
                }
            }
        });
    }

    function renderPhase3() {
        const totalMetrics = state.performanceData.reduce((acc, ad) => ({
            totalImpressions: acc.totalImpressions + ad.impressions,
            totalClicks: acc.totalClicks + ad.clicks,
            totalConversions: acc.totalConversions + ad.conversions,
            totalCost: acc.totalCost + ad.cost,
        }), { totalImpressions: 0, totalClicks: 0, totalConversions: 0, totalCost: 0 });

        const revenuePerConversion = 100; // Valor hipotético
        const totalRevenue = totalMetrics.totalConversions * revenuePerConversion;
        const roi = totalMetrics.totalCost > 0 ? (totalRevenue - totalMetrics.totalCost) / totalMetrics.totalCost : (totalRevenue > 0 ? Infinity : 0);
        const actualCPL = totalMetrics.totalConversions > 0 ? totalMetrics.totalCost / totalMetrics.totalConversions : Infinity;

        const conversionAchieved = totalMetrics.totalConversions;
        const conversionTarget = state.campaign.targetLeads;
        const targetAchieved = conversionTarget > 0 ? conversionAchieved / conversionTarget : 0;
        const isCplGood = actualCPL !== Infinity && actualCPL <= state.campaign.expectedCPL * 1.1;

        const miaAnalysis = analyzePerformance(state.performanceData, state.campaign);
        const recommendationText = miaAnalysis.recommendation + "\n\n" +
            (targetAchieved >= 1 ?
                "**O objetivo foi superado!**\n**REPETIR:** A estratégia de alocação no criativo vencedor.\n**TESTAR:** Aplicar a mesma lógica em um novo canal."
                :
                "**O objetivo não foi atingido.**\n**EVITAR:** A segmentação que gerou o CPL mais alto.\n**REPETIR:** A mensagem do criativo com melhor CTR em um canal de custo mais baixo."
            );

        appContainer.innerHTML = `
            ${renderHeader()}
            <div class="space-y-6">
                <div class="card">
                    <h2 class="card-title">${ICONS.layoutDashboard} 1. Relatório Final de Performance</h2>
                    <div class="grid grid-cols-2">
                        <div>
                            <h3 class="card-title">Meta vs. Realizado (Leads)</h3>
                            <p class="card-value">${conversionAchieved} de ${conversionTarget}</p>
                            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${Math.min(targetAchieved * 100, 100)}%; background-color: ${targetAchieved >= 1 ? 'var(--green-500)' : 'var(--red-500)'};"></div></div>
                            <p style="font-size: 0.8rem; margin-top: 0.25rem;">${formatPercentage(targetAchieved)} do Alvo Atingido</p>
                        </div>
                        <div>
                            <h3 class="card-title">Custo por Lead (CPL) Final</h3>
                            <p class="card-value ${isCplGood ? 'text-green' : 'text-red'}">${actualCPL === Infinity ? 'N/A' : formatCurrency(actualCPL)}</p>
                            <p style="font-size: 0.8rem;">Meta: ${formatCurrency(state.campaign.expectedCPL)}</p>
                        </div>
                    </div>
                     <div class="grid grid-cols-2" style="margin-top: 1.5rem;">
                        <div>
                            <h3 class="card-title">Receita Gerada (Estimada)</h3>
                            <p class="card-value">${formatCurrency(totalRevenue)}</p>
                        </div>
                        <div>
                            <h3 class="card-title">ROI Final</h3>
                            <p class="card-value ${roi > 0 ? 'text-green' : 'text-red'}">${roi === Infinity ? 'Infinito' : formatPercentage(roi)}</p>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h2 class="card-title">${ICONS.lightbulb} 2. Insights e Próximas Ações</h2>
                    <h4 style="font-weight: 700; margin-top: 1rem;">O que Aprendemos (Insights)</h4>
                    <pre class="analysis-block">${miaAnalysis.analysis}</pre>
                    <h4 style="font-weight: 700; margin-top: 1.5rem;">Próximas Ações (Repetir, Evitar, Testar)</h4>
                    <pre class="analysis-block text-yellow">${recommendationText}</pre>
                    <div class="action-buttons">
                        <button id="export-pdf" class="btn btn-indigo" style="flex-grow: 1;">${ICONS.fileDown} Exportar para PDF</button>
                        <button id="export-csv" class="btn btn-green" style="flex-grow: 1;">${ICONS.fileDown} Exportar para CSV</button>
                        <button id="reset-campaign" class="btn btn-red" style="width: 100%; margin-top: 1rem;">Limpar Dados e Iniciar Nova Campanha</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('export-pdf').addEventListener('click', exportToPDF);
        document.getElementById('export-csv').addEventListener('click', exportToCSV);
        document.getElementById('reset-campaign').addEventListener('click', () => {
            if (confirm('Tem certeza que deseja apagar todos os dados e iniciar uma nova campanha?')) {
                state.currentPhase = 1;
                state.campaign = null;
                state.performanceData = [];
                saveState();
                renderApp();
            }
        });
    }

    function exportToCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Cabeçalhos da tabela
        const headers = ["Criativo", "Canal", "Impressões", "Cliques", "Custo (R$)", "Conversões", "CTR (%)", "CPL (R$)"];
        csvContent += headers.join(";") + "\r\n";

        // Linhas da tabela
        state.performanceData.forEach(ad => {
            const ctr = (ad.clicks / ad.impressions) || 0;
            const cpl = (ad.conversions > 0) ? (ad.cost / ad.conversions) : 0;
            const row = [
                ad.creative,
                ad.channel,
                ad.impressions,
                ad.clicks,
                ad.cost.toFixed(2).replace('.', ','),
                ad.conversions,
                (ctr * 100).toFixed(2).replace('.', ','),
                cpl.toFixed(2).replace('.', ',')
            ];
            csvContent += row.join(";") + "\r\n";
        });

        // Adiciona um resumo
        csvContent += "\r\n";
        csvContent += "Resumo da Campanha\r\n";
        csvContent += `Objetivo;${state.campaign.objective}\r\n`;
        const totalCost = state.performanceData.reduce((sum, ad) => sum + ad.cost, 0);
        const totalConversions = state.performanceData.reduce((sum, ad) => sum + ad.conversions, 0);
        const finalCPL = totalConversions > 0 ? totalCost / totalConversions : 0;
        csvContent += `Custo Total;${formatCurrency(totalCost)}\r\n`;
        csvContent += `Conversões Totais;${totalConversions}\r\n`;
        csvContent += `CPL Final;${formatCurrency(finalCPL)}\r\n`;

        // Cria o link para download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "relatorio_mia_campanha.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const miaAnalysis = analyzePerformance(state.performanceData, state.campaign);

        // Título
        doc.setFontSize(18);
        doc.text("MIA - Relatório Final de Campanha", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Objetivo: ${state.campaign.objective}`, 14, 32);

        // KPIs
        const totalCost = state.performanceData.reduce((sum, ad) => sum + ad.cost, 0);
        const totalConversions = state.performanceData.reduce((sum, ad) => sum + ad.conversions, 0);
        const finalCPL = totalConversions > 0 ? totalCost / totalConversions : 0;

        doc.autoTable({
            startY: 40,
            body: [
                ['Custo Total', formatCurrency(totalCost)],
                ['Conversões Totais', totalConversions],
                ['Meta de Leads', state.campaign.targetLeads],
                ['CPL Final', formatCurrency(finalCPL)],
                ['CPL Meta', formatCurrency(state.campaign.expectedCPL)],
            ],
            theme: 'striped',
            styles: { fontSize: 10 },
        });

        // Tabela de Performance
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 10,
            head: [['#', 'Criativo', 'Custo (R$)', 'Conversões', 'CTR', 'CPL (R$)']],
            body: state.performanceData.map((ad, i) => [
                i + 1,
                ad.creative,
                formatCurrency(ad.cost),
                ad.conversions,
                formatPercentage((ad.clicks / ad.impressions) || 0),
                formatCurrency((ad.conversions > 0) ? (ad.cost / ad.conversions) : 0)
            ]),
            theme: 'grid',
            headStyles: { fillColor: [31, 41, 55] }
        });

        // Insights e Recomendações
        doc.setFontSize(12).text("Insights e Recomendações", 14, doc.autoTable.previous.finalY + 15);
        doc.setFontSize(10).setTextColor(0).text(miaAnalysis.analysis + "\n\n" + miaAnalysis.recommendation, 14, doc.autoTable.previous.finalY + 22, { maxWidth: 180 });

        doc.save('relatorio_mia_campanha.pdf');
    }

    function renderApp() {
        appContainer.innerHTML = `<div class="loading-container"><span>Carregando MIA...</span></div>`; // Loading state

        // Um pequeno delay para simular carregamento e evitar piscar a tela
        setTimeout(() => {
            switch (state.currentPhase) {
                case 1:
                    renderPhase1();
                    break;
                case 2:
                    if (state.campaign) {
                        renderPhase2();
                    } else {
                        // Fallback se algo der errado
                        state.currentPhase = 1;
                        renderPhase1();
                    }
                    break;
                case 3:
                    if (state.campaign && state.performanceData.length > 0) {
                        renderPhase3();
                    } else {
                        // Fallback
                        state.currentPhase = 1;
                        renderPhase1();
                    }
                    break;
                default:
                    renderPhase1();
            }
        }, 100);
    }

    // --- Inicialização ---
    loadState();
    renderApp();
});