document.addEventListener('DOMContentLoaded', function() {
    fetch('campaign_data.json')
        .then(response => response.json())
        .then(data => {
            // Assumindo que estamos lidando com a primeira campanha do array
            const campaign = data[0];
            const metrics = campaign.financial_metrics;
            const budget = campaign.budget;
            globalCampaignData = campaign; // Armazena para uso global (PDF, Gráficos)

            // Função auxiliar para formatar moeda em BRL
            const formatCurrency = (value) => {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value);
            };

            // Cálculos
            // Receita Estimada = Orçamento * (ROI + 1)
            // Ex: Se invisto 100 e tenho ROI de 4.5, recuperei os 100 + 450 de lucro = 550 de receita.
            const roiValue = parseFloat(metrics.roi);
            const revenue = budget * (roiValue + 1);

            // Atualização do DOM
            updateElement('metric-ebitda', formatCurrency(metrics.ebitda));
            updateElement('metric-margin', metrics.margin);
            updateElement('metric-roi', metrics.roi);
            updateElement('metric-flow', formatCurrency(metrics.flow));
            
            // Novas métricas calculadas/extraídas
            updateElement('metric-revenue', formatCurrency(revenue));
            updateElement('metric-budget', formatCurrency(budget));
        })
        .catch(error => console.error('Erro ao carregar dados da campanha:', error));

    // Lógica de Navegação Lateral
    setupNavigation();

    // Event Listeners para Botões
    document.getElementById('btn-calc-roi').addEventListener('click', calculateROI);
    document.getElementById('btn-calc-cpa').addEventListener('click', calculateCPA);
    document.getElementById('btn-calc-cpc').addEventListener('click', calculateCPC);
    document.getElementById('btn-analyze-campaign').addEventListener('click', analyzeNewCampaign);
    document.getElementById('btn-download-pdf').addEventListener('click', generatePDF);
    
    // Evento específico para renderizar gráfico ao clicar na aba
    document.getElementById('nav-reports').addEventListener('click', renderReportChart);
});

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function setupNavigation() {
    const navMap = {
        'nav-dashboard': ['dashboard-welcome', 'dashboard-metrics'],
        'nav-reports': ['view-reports'],
        'nav-campaign': ['view-campaign'],
        'nav-calc': ['view-calc'],
        'nav-sources': ['view-sources']
    };

    // Lista de todos os IDs de visualização para poder esconder todos antes de mostrar o desejado
    const allViewIds = ['dashboard-welcome', 'dashboard-metrics', 'view-reports', 'view-campaign', 'view-calc', 'view-sources'];

    Object.keys(navMap).forEach(navId => {
        const navItem = document.getElementById(navId);
        if (navItem) {
            navItem.addEventListener('click', () => {
                // 1. Esconder todas as views
                allViewIds.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = 'none';
                });

                // 2. Mostrar apenas as views associadas ao botão clicado
                navMap[navId].forEach(viewId => {
                    const el = document.getElementById(viewId);
                    if (el) {
                        // Se for o grid de métricas, restaura como grid, senão block
                        if (viewId === 'dashboard-metrics') {
                            el.style.display = 'grid';
                        } else {
                            el.style.display = 'block';
                        }
                    }
                });
            });
        }
    });
}

// --- Funções de Cálculo ---
function calculateROI() {
    const revenue = parseFloat(document.getElementById('roi-revenue').value) || 0;
    const cost = parseFloat(document.getElementById('roi-cost').value) || 0;
    if(cost > 0) {
        const roi = ((revenue - cost) / cost) * 100;
        document.getElementById('roi-result').innerText = roi.toFixed(2) + '%';
    } else {
        document.getElementById('roi-result').innerText = '0%';
    }
}

function calculateCPA() {
    const cost = parseFloat(document.getElementById('cpa-cost').value) || 0;
    const conversions = parseFloat(document.getElementById('cpa-conversions').value) || 0;
    if(conversions > 0) {
        const cpa = cost / conversions;
        document.getElementById('cpa-result').innerText = 'R$ ' + cpa.toFixed(2);
    } else {
        document.getElementById('cpa-result').innerText = 'R$ 0,00';
    }
}

function calculateCPC() {
    const cost = parseFloat(document.getElementById('cpc-cost').value) || 0;
    const clicks = parseFloat(document.getElementById('cpc-clicks').value) || 0;
    if(clicks > 0) {
        const cpc = cost / clicks;
        document.getElementById('cpc-result').innerText = 'R$ ' + cpc.toFixed(2);
    } else {
        document.getElementById('cpc-result').innerText = 'R$ 0,00';
    }
}

// --- Simulação de IA ---
function analyzeNewCampaign() {
    const name = document.getElementById('source-campaign-name').value;
    const objective = document.getElementById('source-campaign-objective').value;
    const btn = document.getElementById('btn-analyze-campaign');
    
    if(name && objective) {
        const originalText = btn.innerText;
        btn.innerText = "Analisando...";
        btn.disabled = true;
        btn.style.opacity = "0.7";

        setTimeout(() => {
            alert(`Análise concluída para: ${name}\n\nInsight IA: O objetivo "${objective}" tem alta probabilidade de sucesso se focado em canais de vídeo curto.`);
            btn.innerText = originalText;
            btn.disabled = false;
            btn.style.opacity = "1";
        }, 2000);
    } else {
        alert('Por favor, preencha pelo menos o nome e o objetivo da campanha.');
    }
}

// --- Gráficos e Relatórios ---
let reportChartInstance = null;

function renderReportChart() {
    if (!globalCampaignData) return;

    setTimeout(() => {
        const ctx = document.getElementById('reportChart');
        if(!ctx) return;

        if (reportChartInstance) {
            reportChartInstance.destroy();
        }

        // Extrair dados do JSON global
        const labels = globalCampaignData.channels.map(c => c.name);
        const budgets = globalCampaignData.channels.map(c => c.budget_allocation);
        // Simulando conversões proporcionais ao budget para demonstração
        const conversions = budgets.map(b => Math.floor(b / 150)); 

        reportChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Orçamento (R$)',
                    data: budgets,
                    backgroundColor: '#38bdf8'
                }, {
                    label: 'Conversões Est.',
                    data: conversions,
                    backgroundColor: '#28a745'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#e2e8f0' } }
                },
                scales: {
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                }
            }
        });
    }, 100);
}

async function generatePDF() {
    if (!globalCampaignData) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Relatório MIA - " + globalCampaignData.campaign_name, 20, 20);
    
    doc.setFontSize(12);
    doc.text("Gerado em: " + new Date().toLocaleDateString(), 20, 30);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(14);
    doc.text("Resumo Financeiro:", 20, 50);
    doc.setFontSize(12);
    doc.text(`Orçamento Total: R$ ${globalCampaignData.budget}`, 20, 60);
    doc.text(`ROI: ${globalCampaignData.financial_metrics.roi}`, 20, 70);
    doc.text(`EBITDA: R$ ${globalCampaignData.financial_metrics.ebitda}`, 20, 80);

    doc.save("relatorio_MIA.pdf");
}
