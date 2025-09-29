// Dados de exemplo para demonstração do sistema
const DADOS_EXEMPLO = {
  tickets: [
    {
      id: 1,
      pratoId: 1,
      pratoPrincipal: "Arroz, feijão e frango à milanesa",
      valorPrato: 18.50,
      itensAdicionais: [
        { id: 1, nome: "Refrigerante", preco: 5.00 },
        { id: 2, nome: "Sobremesa", preco: 8.00 }
      ],
      valorTotal: 31.50,
      entregador: "João Silva",
      dataEntrega: "2025-09-28",
      horaEntrega: "19:30",
      enderecoEntrega: "Rua das Flores, 123 - Centro - São Paulo/SP",
      status: "pendente",
      criadoEm: "2025-09-28T16:30:00.000Z",
      atualizadoEm: "2025-09-28T16:30:00.000Z"
    },
    {
      id: 2,
      pratoId: 2,
      pratoPrincipal: "Arroz, feijão e calabresa",
      valorPrato: 16.90,
      itensAdicionais: [
        { id: 3, nome: "Batata Frita", preco: 6.00 },
        { id: 1, nome: "Refrigerante", preco: 5.00 }
      ],
      valorTotal: 27.90,
      entregador: "Maria Santos",
      dataEntrega: "2025-09-28",
      horaEntrega: "20:15",
      enderecoEntrega: "Av. Paulista, 456 - Bela Vista - São Paulo/SP",
      status: "em-transito",
      criadoEm: "2025-09-28T17:15:00.000Z",
      atualizadoEm: "2025-09-28T18:00:00.000Z"
    },
    {
      id: 3,
      pratoId: 8,
      pratoPrincipal: "Feijoada completa",
      valorPrato: 25.90,
      itensAdicionais: [
        { id: 2, nome: "Sobremesa", preco: 8.00 }
      ],
      valorTotal: 33.90,
      entregador: "Pedro Costa",
      dataEntrega: "2025-09-28",
      horaEntrega: "18:45",
      enderecoEntrega: "Rua Augusta, 789 - Consolação - São Paulo/SP",
      status: "entregue",
      criadoEm: "2025-09-28T15:45:00.000Z",
      atualizadoEm: "2025-09-28T18:45:00.000Z"
    }
  ],
  ticketIdCounter: 4,
  pratos: [
    { id: 1, nome: "Arroz, feijão e frango à milanesa", preco: 18.50, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 2, nome: "Arroz, feijão e calabresa", preco: 16.90, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 3, nome: "Arroz, feijão e bife acebolado", preco: 19.90, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 4, nome: "Arroz, feijão e frango grelhado", preco: 17.50, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 5, nome: "Arroz, feijão e linguiça toscana", preco: 16.50, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 6, nome: "Arroz, feijão e peixe grelhado", preco: 22.90, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 7, nome: "Arroz, feijão e carne de porco", preco: 18.90, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 8, nome: "Feijoada completa", preco: 25.90, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" }
  ],
  pratoIdCounter: 9,
  itensAdicionais: [
    { id: 1, nome: "Refrigerante", preco: 5.00, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 2, nome: "Sobremesa", preco: 8.00, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 3, nome: "Batata Frita", preco: 6.00, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 4, nome: "Suco Natural", preco: 4.50, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 5, nome: "Salada", preco: 3.50, disponivel: true, criadoEm: "2025-09-28T10:00:00.000Z" }
  ],
  adicionalIdCounter: 6,
  entregadores: [
    { id: 1, nome: "João Silva", ativo: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 2, nome: "Maria Santos", ativo: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 3, nome: "Pedro Costa", ativo: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 4, nome: "Ana Oliveira", ativo: true, criadoEm: "2025-09-28T10:00:00.000Z" },
    { id: 5, nome: "Carlos Ferreira", ativo: true, criadoEm: "2025-09-28T10:00:00.000Z" }
  ],
  entregadorIdCounter: 6
};

// Entregadores disponíveis
const ENTREGADORES = [
  { nome: "João Silva", veiculo: "Moto", telefone: "(11) 99999-1111" },
  { nome: "Maria Santos", veiculo: "Bicicleta", telefone: "(11) 99999-2222" },
  { nome: "Pedro Costa", veiculo: "Moto", telefone: "(11) 99999-3333" },
  { nome: "Ana Oliveira", veiculo: "Carro", telefone: "(11) 99999-4444" }
];

// Pratos populares para sugestão
const PRATOS_POPULARES = [
  { nome: "Pizza Margherita", preco: 25.90, categoria: "Pizza" },
  { nome: "Pizza Calabresa", preco: 27.90, categoria: "Pizza" },
  { nome: "Hambúrguer Artesanal", preco: 18.50, categoria: "Lanche" },
  { nome: "X-Bacon", preco: 16.90, categoria: "Lanche" },
  { nome: "Sushi Combo", preco: 45.00, categoria: "Japonês" },
  { nome: "Temaki Salmão", preco: 12.50, categoria: "Japonês" },
  { nome: "Lasanha Bolonhesa", preco: 22.90, categoria: "Italiana" },
  { nome: "Nhoque à Gorgonzola", preco: 19.90, categoria: "Italiana" }
];

// Relatórios e estatísticas
const RELATORIOS = {
  totalEntregas: () => deliveryTickets.length,
  entregasHoje: () => {
    const hoje = new Date().toISOString().split('T')[0];
    return deliveryTickets.filter(ticket => ticket.dataEntrega === hoje).length;
  },
  valorTotalDia: () => {
    const hoje = new Date().toISOString().split('T')[0];
    return deliveryTickets
      .filter(ticket => ticket.dataEntrega === hoje)
      .reduce((total, ticket) => total + ticket.valorTotal, 0);
  },
  entregasPorStatus: () => {
    return {
      pendente: deliveryTickets.filter(t => t.status === 'pendente').length,
      emTransito: deliveryTickets.filter(t => t.status === 'em-transito').length,
      entregue: deliveryTickets.filter(t => t.status === 'entregue').length
    };
  },
  entregasPorEntregador: () => {
    const contadores = {};
    deliveryTickets.forEach(ticket => {
      contadores[ticket.entregador] = (contadores[ticket.entregador] || 0) + 1;
    });
    return contadores;
  }
};

// Função para carregar dados de exemplo
function carregarDadosExemplo() {
  const confirmacao = confirm(
    "Deseja carregar dados de exemplo?\n\n" +
    "Isso irá substituir todos os dados atuais.\n" +
    "Esta ação não pode ser desfeita."
  );
  
  if (confirmacao) {
    deliveryTickets = DADOS_EXEMPLO.tickets;
    ticketIdCounter = DADOS_EXEMPLO.ticketIdCounter;
    pratosDisponiveis = DADOS_EXEMPLO.pratos;
    pratoIdCounter = DADOS_EXEMPLO.pratoIdCounter;
    itensAdicionais = DADOS_EXEMPLO.itensAdicionais;
    adicionalIdCounter = DADOS_EXEMPLO.adicionalIdCounter;
    entregadoresDisponiveis = DADOS_EXEMPLO.entregadores;
    entregadorIdCounter = DADOS_EXEMPLO.entregadorIdCounter;
    
    saveTicketsToStorage();
    savePratosToStorage();
    saveItensAdicionaisToStorage();
    saveEntregadoresToStorage();
    renderPratos();
    renderItensAdicionais();
    renderEntregadores();
    updateItensAdicionaisForm();
    updateEntregadorSelect();
    renderTickets();
    updatePratoSelect();
    
    showNotification('Dados de exemplo carregados com sucesso!', 'success');
  }
}

// Função para limpar todos os dados
function limparTodosOsDados() {
  const confirmacao = confirm(
    "Tem certeza que deseja limpar todos os dados?\n\n" +
    "Todos os tickets de entrega e pratos serão removidos permanentemente.\n" +
    "Esta ação não pode ser desfeita."
  );
  
  if (confirmacao) {
    deliveryTickets = [];
    ticketIdCounter = 1;
    pratosDisponiveis = [];
    pratoIdCounter = 1;
    itensAdicionais = [];
    adicionalIdCounter = 1;
    entregadoresDisponiveis = [];
    entregadorIdCounter = 1;
    
    localStorage.removeItem('justdelivery_tickets');
    localStorage.removeItem('justdelivery_pratos');
    localStorage.removeItem('justdelivery_itens_adicionais');
    localStorage.removeItem('justdelivery_entregadores');
    renderPratos();
    renderItensAdicionais();
    renderEntregadores();
    updateItensAdicionaisForm();
    updateEntregadorSelect();
    renderTickets();
    updatePratoSelect();
    
    showNotification('Todos os dados foram removidos.', 'info');
  }
}

// Função para exportar dados como JSON
function exportarDados() {
  const dados = {
    tickets: deliveryTickets,
    ticketIdCounter: ticketIdCounter,
    pratos: pratosDisponiveis,
    pratoIdCounter: pratoIdCounter,
    itensAdicionais: itensAdicionais,
    adicionalIdCounter: adicionalIdCounter,
    entregadores: entregadoresDisponiveis,
    entregadorIdCounter: entregadorIdCounter,
    exportadoEm: new Date().toISOString(),
    versao: "2.0"
  };
  
  const jsonString = JSON.stringify(dados, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `justdelivery-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showNotification('Dados exportados com sucesso!', 'success');
}

// Função para gerar relatório simples
function gerarRelatorio() {
  const stats = RELATORIOS.entregasPorStatus();
  const entregadoresStats = RELATORIOS.entregasPorEntregador();
  
  const relatorio = `
=== RELATÓRIO JUSTDELIVERY ===
Gerado em: ${new Date().toLocaleString('pt-BR')}

RESUMO GERAL:
• Total de entregas: ${RELATORIOS.totalEntregas()}
• Entregas hoje: ${RELATORIOS.entregasHoje()}
• Valor total do dia: R$ ${RELATORIOS.valorTotalDia().toFixed(2)}

STATUS DAS ENTREGAS:
• Pendentes: ${stats.pendente}
• Em Trânsito: ${stats.emTransito}
• Entregues: ${stats.entregue}

ENTREGAS POR ENTREGADOR:
${Object.entries(entregadoresStats)
  .map(([nome, quantidade]) => `• ${nome}: ${quantidade} entregas`)
  .join('\n')}

=== FIM DO RELATÓRIO ===
  `.trim();
  
  console.log(relatorio);
  
  // Criar modal ou nova janela para exibir o relatório
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  `;
  
  const conteudo = document.createElement('div');
  conteudo.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 10px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  conteudo.innerHTML = `
    <h2>📊 Relatório de Entregas</h2>
    <pre style="background: #f5f5f5; padding: 20px; border-radius: 5px; font-size: 12px; white-space: pre-wrap;">${relatorio}</pre>
    <div style="text-align: center; margin-top: 20px;">
      <button onclick="this.closest('.modal').remove()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Fechar</button>
    </div>
  `;
  
  modal.className = 'modal';
  modal.appendChild(conteudo);
  document.body.appendChild(modal);
  
  // Fechar modal clicando fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Adicionar botões de utilidades ao HTML (será inserido dinamicamente)
function adicionarBotoesUtilidades() {
  const utilidades = document.createElement('div');
  utilidades.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1000;
  `;
  
  const botoes = [
    { texto: '📊 Relatório', acao: 'gerarRelatorio()' },
    { texto: '💾 Exportar', acao: 'exportarDados()' },
    { texto: '🔄 Exemplo', acao: 'carregarDadosExemplo()' },
    { texto: '🗑️ Limpar', acao: 'limparTodosOsDados()' }
  ];
  
  botoes.forEach(botao => {
    const btn = document.createElement('button');
    btn.innerHTML = botao.texto;
    btn.setAttribute('onclick', botao.acao);
    btn.style.cssText = `
      padding: 8px 12px;
      background: rgba(255,255,255,0.9);
      border: 2px solid #667eea;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
    `;
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#667eea';
      btn.style.color = 'white';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(255,255,255,0.9)';
      btn.style.color = 'black';
    });
    utilidades.appendChild(btn);
  });
  
  document.body.appendChild(utilidades);
}

// Adicionar utilidades quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(adicionarBotoesUtilidades, 1000);
});