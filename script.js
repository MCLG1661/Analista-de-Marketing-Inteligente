// ==========================================================
// MIA — Marketing Intelligence Analyst
// Motor Analítico da Aplicação
// ==========================================================


// ==========================================================
// Configurações
// ==========================================================

const DATA_SOURCE = 'campaign_data.json';

let campaignData = null;
let campaignAnalysis = null;


// ==========================================================
// Inicialização
// ==========================================================

document.addEventListener('DOMContentLoaded', async () => {

    try {

        campaignData = await loadCampaignData();

        campaignAnalysis = analyzeCampaign(campaignData);

        renderDashboard(campaignAnalysis);

        initializeNavigation();
        initializeSearch();

        console.log(
            'MIA — análise carregada com sucesso.',
            campaignAnalysis
        );

    } catch (error) {

        console.error(
            'Erro ao inicializar o MIA:',
            error
        );

        showApplicationError(
            'Não foi possível carregar os dados da campanha.'
        );

    }

});


// ==========================================================
// Carregamento dos dados
// ==========================================================

async function loadCampaignData() {

    const response = await fetch(DATA_SOURCE);

    if (!response.ok) {

        throw new Error(
            `Erro HTTP ${response.status} ao carregar ${DATA_SOURCE}`
        );

    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {

        throw new Error(
            'O arquivo de dados não contém campanhas válidas.'
        );

    }

    return data[0];

}


// ==========================================================
// Funções matemáticas
// ==========================================================

function calculateCTR(clicks, impressions) {

    if (!impressions) {
        return 0;
    }

    return (clicks / impressions) * 100;

}


function calculateCPC(spend, clicks) {

    if (!clicks) {
        return 0;
    }

    return spend / clicks;

}


function calculateConversionRate(conversions, clicks) {

    if (!clicks) {
        return 0;
    }

    return (conversions / clicks) * 100;

}


function calculateCPA(spend, conversions) {

    if (!conversions) {
        return 0;
    }

    return spend / conversions;

}


function calculateROAS(revenue, spend) {

    if (!spend) {
        return 0;
    }

    return revenue / spend;

}


function calculateROI(revenue, spend) {

    if (!spend) {
        return 0;
    }

    return ((revenue - spend) / spend) * 100;

}


// ==========================================================
// Agregação dos dados
// ==========================================================

function aggregateCampaign(campaign) {

    return campaign.channels.reduce(

        (totals, channel) => {

            totals.plannedBudget +=
                Number(channel.planned_budget) || 0;

            totals.actualSpend +=
                Number(channel.actual_spend) || 0;

            totals.impressions +=
                Number(channel.impressions) || 0;

            totals.clicks +=
                Number(channel.clicks) || 0;

            totals.conversions +=
                Number(channel.conversions) || 0;

            totals.revenue +=
                Number(channel.revenue) || 0;

            totals.engagements +=
                Number(channel.engagements) || 0;

            return totals;

        },

        {
            plannedBudget: 0,
            actualSpend: 0,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0,
            engagements: 0
        }

    );

}


// ==========================================================
// Análise por canal
// ==========================================================

function analyzeChannel(channel, campaign) {

    const metrics = {

        ctr: calculateCTR(
            channel.clicks,
            channel.impressions
        ),

        cpc: calculateCPC(
            channel.actual_spend,
            channel.clicks
        ),

        conversionRate: calculateConversionRate(
            channel.conversions,
            channel.clicks
        ),

        cpa: calculateCPA(
            channel.actual_spend,
            channel.conversions
        ),

        roas: calculateROAS(
            channel.revenue,
            channel.actual_spend
        ),

        roi: calculateROI(
            channel.revenue,
            channel.actual_spend
        )

    };


    return {

        ...channel,

        metrics,

        diagnosis:
            diagnoseChannel(
                channel,
                metrics,
                campaign
            )

    };

}


// ==========================================================
// Diagnóstico por canal
// ==========================================================

function diagnoseChannel(
    channel,
    metrics,
    campaign
) {

    const planning =
        campaign.planning;

    const rules =
        campaign.analysis_rules;


    const highRoasThreshold =
        planning.target_roas *
        rules.high_performance_roas_multiplier;


    const lowRoasThreshold =
        planning.target_roas *
        rules.low_performance_roas_multiplier;


    const highCpaThreshold =
        planning.target_cpa *
        rules.high_cpa_multiplier;


    const lowCtrThreshold =
        planning.target_ctr *
        rules.low_ctr_multiplier;


    const findings = [];


    if (
        metrics.roas >=
        highRoasThreshold
    ) {

        findings.push({
            type: 'positive',
            code: 'HIGH_ROAS',
            message:
                'ROAS significativamente acima da meta.'
        });

    } else if (
        metrics.roas <
        lowRoasThreshold
    ) {

        findings.push({
            type: 'warning',
            code: 'LOW_ROAS',
            message:
                'ROAS abaixo da faixa esperada.'
        });

    }


    if (
        metrics.cpa >
        highCpaThreshold
    ) {

        findings.push({
            type: 'warning',
            code: 'HIGH_CPA',
            message:
                'CPA acima da faixa de eficiência definida.'
        });

    }


    if (
        metrics.ctr <
        lowCtrThreshold
    ) {

        findings.push({
            type: 'warning',
            code: 'LOW_CTR',
            message:
                'CTR abaixo da faixa esperada.'
        });

    }


    if (
        metrics.conversionRate >=
        planning.target_conversion_rate
    ) {

        findings.push({
            type: 'positive',
            code: 'GOOD_CONVERSION_RATE',
            message:
                'Taxa de conversão acima ou igual à meta.'
        });

    }


    return findings;

}


// ==========================================================
// Recomendações automatizadas
// ==========================================================

function generateRecommendations(
    channels,
    campaign
) {

    const recommendations = [];

    const planning =
        campaign.planning;

    const rules =
        campaign.analysis_rules;


    channels.forEach(channel => {

        const metrics =
            channel.metrics;


        const highRoasThreshold =
            planning.target_roas *
            rules.high_performance_roas_multiplier;


        const lowRoasThreshold =
            planning.target_roas *
            rules.low_performance_roas_multiplier;


        const highCpaThreshold =
            planning.target_cpa *
            rules.high_cpa_multiplier;


        const lowCtrThreshold =
            planning.target_ctr *
            rules.low_ctr_multiplier;


        if (
            metrics.roas >=
            highRoasThreshold &&
            metrics.cpa <=
            planning.target_cpa
        ) {

            recommendations.push({

                priority: 'Alta',

                type: 'Oportunidade',

                channel:
                    channel.name,

                title:
                    `Escalar ${channel.name}`,

                message:
                    `${channel.name} apresenta ROAS de ${formatROAS(metrics.roas)} e CPA de ${formatCurrency(metrics.cpa)}, combinando retorno acima da meta com eficiência de aquisição. Avaliar aumento incremental de até ${rules.budget_reallocation_percentage}% do investimento.`

            });

        }


        if (
            metrics.roas <
            lowRoasThreshold
        ) {

            recommendations.push({

                priority: 'Alta',

                type: 'Atenção',

                channel:
                    channel.name,

                title:
                    `Revisar retorno de ${channel.name}`,

                message:
                    `${channel.name} apresenta ROAS de ${formatROAS(metrics.roas)}, abaixo da faixa esperada. Revisar segmentação, criativos, oferta e distribuição de verba antes de ampliar investimento.`

            });

        }


        if (
            metrics.cpa >
            highCpaThreshold
        ) {

            recommendations.push({

                priority: 'Média',

                type: 'Eficiência',

                channel:
                    channel.name,

                title:
                    `Reduzir CPA em ${channel.name}`,

                message:
                    `O CPA de ${channel.name} está em ${formatCurrency(metrics.cpa)}, acima da referência definida para a campanha. Investigar públicos, jornada pós-clique e criativos com menor eficiência.`

            });

        }


        if (
            metrics.ctr <
            lowCtrThreshold
        ) {

            recommendations.push({

                priority: 'Média',

                type: 'Criativo',

                channel:
                    channel.name,

                title:
                    `Otimizar CTR de ${channel.name}`,

                message:
                    `O CTR de ${channel.name} está em ${formatPercent(metrics.ctr)}, indicando oportunidade de revisar mensagem, formato criativo, segmentação ou proposta de valor.`

            });

        }

    });


    const sortedByRoas =
        [...channels].sort(
            (a, b) =>
                b.metrics.roas -
                a.metrics.roas
        );


    if (sortedByRoas.length >= 2) {

        const best =
            sortedByRoas[0];

        const worst =
            sortedByRoas[
                sortedByRoas.length - 1
            ];


        if (
            best.metrics.roas >
            worst.metrics.roas
        ) {

            recommendations.push({

                priority: 'Estratégica',

                type: 'Realocação',

                channel:
                    'Cross-channel',

                title:
                    'Avaliar realocação de orçamento',

                message:
                    `${best.name} apresenta o maior ROAS da campanha (${formatROAS(best.metrics.roas)}), enquanto ${worst.name} registra ${formatROAS(worst.metrics.roas)}. Testar realocação controlada de verba entre canais pode aumentar a eficiência global sem ampliar o orçamento total.`

            });

        }

    }


    return recommendations;

}


// ==========================================================
// Análise completa
// ==========================================================

function analyzeCampaign(campaign) {

    const totals =
        aggregateCampaign(campaign);


    const metrics = {

        ctr: calculateCTR(
            totals.clicks,
            totals.impressions
        ),

        cpc: calculateCPC(
            totals.actualSpend,
            totals.clicks
        ),

        conversionRate:
            calculateConversionRate(
                totals.conversions,
                totals.clicks
            ),

        cpa: calculateCPA(
            totals.actualSpend,
            totals.conversions
        ),

        roas: calculateROAS(
            totals.revenue,
            totals.actualSpend
        ),

        roi: calculateROI(
            totals.revenue,
            totals.actualSpend
        )

    };


    const channels =
        campaign.channels.map(
            channel =>
                analyzeChannel(
                    channel,
                    campaign
                )
        );


    const recommendations =
        generateRecommendations(
            channels,
            campaign
        );


    return {

        campaign,

        totals,

        metrics,

        channels,

        recommendations,

        goalStatus:
            evaluateCampaignGoals(
                campaign,
                totals,
                metrics
            )

    };

}


// ==========================================================
// Avaliação das metas
// ==========================================================

function evaluateCampaignGoals(
    campaign,
    totals,
    metrics
) {

    const planning =
        campaign.planning;


    return {

        revenue: {
            target:
                planning.revenue_target,

            actual:
                totals.revenue,

            achieved:
                totals.revenue >=
                planning.revenue_target,

            percentage:
                planning.revenue_target
                    ? (
                        totals.revenue /
                        planning.revenue_target
                    ) * 100
                    : 0
        },


        conversions: {
            target:
                planning.conversion_target,

            actual:
                totals.conversions,

            achieved:
                totals.conversions >=
                planning.conversion_target,

            percentage:
                planning.conversion_target
                    ? (
                        totals.conversions /
                        planning.conversion_target
                    ) * 100
                    : 0
        },


        ctr: {
            target:
                planning.target_ctr,

            actual:
                metrics.ctr,

            achieved:
                metrics.ctr >=
                planning.target_ctr
        },


        conversionRate: {
            target:
                planning.target_conversion_rate,

            actual:
                metrics.conversionRate,

            achieved:
                metrics.conversionRate >=
                planning.target_conversion_rate
        },


        cpa: {
            target:
                planning.target_cpa,

            actual:
                metrics.cpa,

            achieved:
                metrics.cpa <=
                planning.target_cpa
        },


        roas: {
            target:
                planning.target_roas,

            actual:
                metrics.roas,

            achieved:
                metrics.roas >=
                planning.target_roas
        }

    };

}


// ==========================================================
// Formatação
// ==========================================================

function formatCurrency(value) {

    return new Intl.NumberFormat(
        'pt-BR',
        {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(value || 0);

}


function formatCompactCurrency(value) {

    return new Intl.NumberFormat(
        'pt-BR',
        {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact',
            maximumFractionDigits: 1
        }
    ).format(value || 0);

}


function formatNumber(value) {

    return new Intl.NumberFormat(
        'pt-BR'
    ).format(value || 0);

}


function formatCompactNumber(value) {

    return new Intl.NumberFormat(
        'pt-BR',
        {
            notation: 'compact',
            maximumFractionDigits: 1
        }
    ).format(value || 0);

}


function formatPercent(value) {

    return `${Number(value || 0).toFixed(2)}%`;

}


function formatROAS(value) {

    return `${Number(value || 0).toFixed(2)}x`;

}


// ==========================================================
// Helpers de DOM
// ==========================================================

function setTextById(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


function setTextBySelector(
    selector,
    value
) {

    const element =
        document.querySelector(selector);

    if (element) {
        element.textContent = value;
    }

}


// ==========================================================
// Renderização principal
// ==========================================================

function renderDashboard(analysis) {

    renderCampaignHeader(analysis);

    renderMainKPIs(analysis);

    renderChannelTable(analysis);

    renderRecommendations(analysis);

    renderGoalStatus(analysis);

    renderCampaignSummary(analysis);

}


// ==========================================================
// Cabeçalho da campanha
// ==========================================================

function renderCampaignHeader(
    analysis
) {

    const campaign =
        analysis.campaign;


    const selectors = [
        '[data-campaign-name]',
        '.campaign-name'
    ];


    selectors.forEach(selector => {

        document
            .querySelectorAll(selector)
            .forEach(element => {

                element.textContent =
                    campaign.campaign_name;

            });

    });


    document
        .querySelectorAll(
            '[data-campaign-objective]'
        )
        .forEach(element => {

            element.textContent =
                campaign.objective;

        });

}


// ==========================================================
// KPIs principais
// ==========================================================

function renderMainKPIs(
    analysis
) {

    const totals =
        analysis.totals;

    const metrics =
        analysis.metrics;


    const values = {

        totalSpend:
            formatCompactCurrency(
                totals.actualSpend
            ),

        totalRevenue:
            formatCompactCurrency(
                totals.revenue
            ),

        impressions:
            formatCompactNumber(
                totals.impressions
            ),

        clicks:
            formatCompactNumber(
                totals.clicks
            ),

        conversions:
            formatNumber(
                totals.conversions
            ),

        ctr:
            formatPercent(
                metrics.ctr
            ),

        cpc:
            formatCurrency(
                metrics.cpc
            ),

        conversionRate:
            formatPercent(
                metrics.conversionRate
            ),

        cpa:
            formatCurrency(
                metrics.cpa
            ),

        roas:
            formatROAS(
                metrics.roas
            ),

        roi:
            formatPercent(
                metrics.roi
            )

    };


    Object.entries(values)
        .forEach(
            ([key, value]) => {

                document
                    .querySelectorAll(
                        `[data-kpi="${key}"]`
                    )
                    .forEach(
                        element => {

                            element.textContent =
                                value;

                        }
                    );

            }
        );

}


// ==========================================================
// Tabela de canais
// ==========================================================

function renderChannelTable(
    analysis
) {

    const container =
        document.getElementById(
            'channelPerformance'
        );


    if (!container) {
        return;
    }


    container.innerHTML = '';


    analysis.channels
        .forEach(channel => {

            const row =
                document.createElement(
                    'tr'
                );


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(channel.name)}
                    </strong>
                </td>

                <td>
                    ${formatCurrency(channel.actual_spend)}
                </td>

                <td>
                    ${formatCompactNumber(channel.impressions)}
                </td>

                <td>
                    ${formatNumber(channel.clicks)}
                </td>

                <td>
                    ${formatNumber(channel.conversions)}
                </td>

                <td>
                    ${formatPercent(channel.metrics.ctr)}
                </td>

                <td>
                    ${formatCurrency(channel.metrics.cpc)}
                </td>

                <td>
                    ${formatPercent(channel.metrics.conversionRate)}
                </td>

                <td>
                    ${formatCurrency(channel.metrics.cpa)}
                </td>

                <td>
                    ${formatROAS(channel.metrics.roas)}
                </td>

            `;


            container.appendChild(
                row
            );

        });

}


// ==========================================================
// Recomendações
// ==========================================================

function renderRecommendations(
    analysis
) {

    const container =
        document.getElementById(
            'recommendationsContainer'
        );


    if (!container) {
        return;
    }


    container.innerHTML = '';


    if (
        analysis.recommendations.length ===
        0
    ) {

        container.innerHTML = `
            <div class="recommendation-card">
                <h4>
                    Nenhuma ação crítica identificada
                </h4>

                <p>
                    Os principais indicadores estão dentro
                    das faixas definidas para a campanha.
                </p>
            </div>
        `;

        return;

    }


    analysis.recommendations
        .forEach(
            recommendation => {

                const card =
                    document.createElement(
                        'article'
                    );


                card.className =
                    'recommendation-card';


                card.innerHTML = `

                    <div class="recommendation-meta">

                        <span>
                            ${escapeHTML(recommendation.priority)}
                        </span>

                        <span>
                            ${escapeHTML(recommendation.type)}
                        </span>

                    </div>

                    <h4>
                        ${escapeHTML(recommendation.title)}
                    </h4>

                    <p>
                        ${escapeHTML(recommendation.message)}
                    </p>

                `;


                container.appendChild(
                    card
                );

            }
        );

}


// ==========================================================
// Status das metas
// ==========================================================

function renderGoalStatus(
    analysis
) {

    const container =
        document.getElementById(
            'goalStatus'
        );


    if (!container) {
        return;
    }


    const goals =
        analysis.goalStatus;


    const goalItems = [

        {
            label: 'Receita',
            actual:
                formatCurrency(
                    goals.revenue.actual
                ),
            target:
                formatCurrency(
                    goals.revenue.target
                ),
            achieved:
                goals.revenue.achieved
        },

        {
            label: 'Conversões',
            actual:
                formatNumber(
                    goals.conversions.actual
                ),
            target:
                formatNumber(
                    goals.conversions.target
                ),
            achieved:
                goals.conversions.achieved
        },

        {
            label: 'CTR',
            actual:
                formatPercent(
                    goals.ctr.actual
                ),
            target:
                formatPercent(
                    goals.ctr.target
                ),
            achieved:
                goals.ctr.achieved
        },

        {
            label: 'Taxa de Conversão',
            actual:
                formatPercent(
                    goals.conversionRate.actual
                ),
            target:
                formatPercent(
                    goals.conversionRate.target
                ),
            achieved:
                goals.conversionRate.achieved
        },

        {
            label: 'CPA',
            actual:
                formatCurrency(
                    goals.cpa.actual
                ),
            target:
                formatCurrency(
                    goals.cpa.target
                ),
            achieved:
                goals.cpa.achieved
        },

        {
            label: 'ROAS',
            actual:
                formatROAS(
                    goals.roas.actual
                ),
            target:
                formatROAS(
                    goals.roas.target
                ),
            achieved:
                goals.roas.achieved
        }

    ];


    container.innerHTML = '';


    goalItems.forEach(goal => {

        const item =
            document.createElement(
                'div'
            );


        item.className =
            `goal-item ${
                goal.achieved
                    ? 'goal-achieved'
                    : 'goal-not-achieved'
            }`;


        item.innerHTML = `

            <div>
                <strong>
                    ${escapeHTML(goal.label)}
                </strong>
            </div>

            <div>
                Real:
                <strong>
                    ${goal.actual}
                </strong>
            </div>

            <div>
                Meta:
                <strong>
                    ${goal.target}
                </strong>
            </div>

            <div>
                ${
                    goal.achieved
                        ? '✓ Meta atingida'
                        : '⚠ Abaixo da meta'
                }
            </div>

        `;


        container.appendChild(
            item
        );

    });

}


// ==========================================================
// Resumo executivo
// ==========================================================

function renderCampaignSummary(
    analysis
) {

    const container =
        document.getElementById(
            'campaignSummary'
        );


    if (!container) {
        return;
    }


    const totals =
        analysis.totals;

    const metrics =
        analysis.metrics;


    const bestChannel =
        [...analysis.channels]
            .sort(
                (a, b) =>
                    b.metrics.roas -
                    a.metrics.roas
            )[0];


    const lowestCPAChannel =
        [...analysis.channels]
            .sort(
                (a, b) =>
                    a.metrics.cpa -
                    b.metrics.cpa
            )[0];


    container.innerHTML = `

        <p>
            A campanha gerou
            <strong>
                ${formatCurrency(totals.revenue)}
            </strong>
            em receita a partir de
            <strong>
                ${formatCurrency(totals.actualSpend)}
            </strong>
            de investimento.
        </p>

        <p>
            O ROAS consolidado foi de
            <strong>
                ${formatROAS(metrics.roas)}
            </strong>
            e o ROI estimado atingiu
            <strong>
                ${formatPercent(metrics.roi)}
            </strong>.
        </p>

        <p>
            Foram registradas
            <strong>
                ${formatNumber(totals.conversions)}
            </strong>
            conversões, com CPA médio de
            <strong>
                ${formatCurrency(metrics.cpa)}
            </strong>.
        </p>

        <p>
            O canal com maior ROAS foi
            <strong>
                ${escapeHTML(bestChannel.name)}
            </strong>
            (${formatROAS(bestChannel.metrics.roas)}),
            enquanto
            <strong>
                ${escapeHTML(lowestCPAChannel.name)}
            </strong>
            apresentou o menor CPA
            (${formatCurrency(lowestCPAChannel.metrics.cpa)}).
        </p>

    `;

}


// ==========================================================
// Busca
// ==========================================================

function initializeSearch() {

    const searchInput =
        document.querySelector(
            '.search-bar input'
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        'input',
        event => {

            const term =
                event.target.value
                    .trim()
                    .toLowerCase();


            document
                .querySelectorAll(
                    '.recommendation-card'
                )
                .forEach(card => {

                    const content =
                        card.textContent
                            .toLowerCase();


                    card.style.display =
                        !term ||
                        content.includes(term)
                            ? ''
                            : 'none';

                });

        }
    );

}


// ==========================================================
// Navegação
// ==========================================================

function initializeNavigation() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(anchor => {

            anchor.addEventListener(
                'click',
                event => {

                    const targetId =
                        anchor.getAttribute(
                            'href'
                        );


                    if (
                        !targetId ||
                        targetId === '#'
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                }
            );

        });

}


// ==========================================================
// Erro da aplicação
// ==========================================================

function showApplicationError(
    message
) {

    const dashboard =
        document.querySelector(
            '.dashboard-content'
        ) ||
        document.querySelector(
            'main'
        );


    if (!dashboard) {

        window.alert(message);

        return;

    }


    const errorBox =
        document.createElement(
            'div'
        );


    errorBox.className =
        'application-error';


    errorBox.innerHTML = `

        <strong>
            Não foi possível carregar a análise.
        </strong>

        <p>
            ${escapeHTML(message)}
        </p>

    `;


    dashboard.prepend(
        errorBox
    );

}


// ==========================================================
// Segurança básica na renderização
// ==========================================================

function escapeHTML(value) {

    const element =
        document.createElement(
            'div'
        );


    element.textContent =
        value ?? '';


    return element.innerHTML;

}
