// JustDelivery - Sistema Android Compatível - Versão 2

// Variáveis globais
var pratos = [];
var tickets = [];
var adicionais = {
    refrigerante: { nome: 'Refrigerante', preco: 5.00 },
    sobremesa: { nome: 'Sobremesa', preco: 8.00 },
    batata: { nome: 'Batata Frita', preco: 6.00 }
};

// Função de log para debug
function debugLog(message) {
    console.log('[DEBUG] ' + message);
    try {
        var debugDiv = document.getElementById('debug');
        if (debugDiv) {
            debugDiv.innerHTML += new Date().toLocaleTimeString() + ': ' + message + '<br>';
            debugDiv.scrollTop = debugDiv.scrollHeight;
        }
    } catch (e) {
        // Ignora erro de debug
    }
}

// Polyfill para String.prototype.padStart (Android antigo)
if (!String.prototype.padStart) {
    String.prototype.padStart = function(targetLength, padString) {
        targetLength = targetLength >> 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

// Polyfill para Array.prototype.find
if (!Array.prototype.find) {
    Array.prototype.find = function(callback) {
        for (var i = 0; i < this.length; i++) {
            if (callback(this[i], i, this)) {
                return this[i];
            }
        }
        return undefined;
    };
}

// Verificar se localStorage está disponível
function storageAvailable() {
    try {
        var storage = window.localStorage;
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        debugLog('LocalStorage não disponível: ' + e.message);
        return false;
    }
}

// Salvar dados no localStorage
function salvarDados() {
    try {
        if (storageAvailable()) {
            localStorage.setItem('justdelivery_pratos', JSON.stringify(pratos));
            localStorage.setItem('justdelivery_tickets', JSON.stringify(tickets));
            debugLog('Dados salvos com sucesso');
        } else {
            debugLog('LocalStorage não disponível - dados não salvos');
        }
    } catch (e) {
        debugLog('Erro ao salvar dados: ' + e.message);
    }
}

// Carregar dados do localStorage
function carregarDados() {
    try {
        if (storageAvailable()) {
            var pratosData = localStorage.getItem('justdelivery_pratos');
            var ticketsData = localStorage.getItem('justdelivery_tickets');
            
            if (pratosData) {
                try {
                    pratos = JSON.parse(pratosData);
                    debugLog('Pratos carregados: ' + pratos.length);
                } catch (e) {
                    debugLog('Erro ao parsear pratos: ' + e.message);
                    pratos = [];
                }
            }
            
            if (ticketsData) {
                try {
                    tickets = JSON.parse(ticketsData);
                    debugLog('Tickets carregados: ' + tickets.length);
                } catch (e) {
                    debugLog('Erro ao parsear tickets: ' + e.message);
                    tickets = [];
                }
            }
        }
    } catch (e) {
        debugLog('Erro ao carregar dados: ' + e.message);
        pratos = [];
        tickets = [];
    }
}

// Atualizar lista de pratos no select
function atualizarSelectPratos() {
    try {
        debugLog('=== ATUALIZANDO SELECT PRATOS ===');
        
        var select = document.getElementById('pratoPrincipal');
        if (!select) {
            debugLog('ERRO: Select pratoPrincipal não encontrado');
            return;
        }
        
        debugLog('Select pratoPrincipal encontrado');
        debugLog('Opções atuais no select: ' + select.children.length);
        
        // Limpar opções existentes (exceto a primeira)
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
            debugLog('Opção removida do select');
        }
        
        debugLog('Select limpo, adicionando ' + pratos.length + ' pratos...');
        
        // Adicionar pratos
        for (var i = 0; i < pratos.length; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.textContent = pratos[i].nome + ' - R$ ' + pratos[i].preco.toFixed(2);
            select.appendChild(option);
            debugLog('Adicionada opção ' + i + ': ' + pratos[i].nome);
        }
        
        debugLog('Select finalizado com ' + select.children.length + ' opções totais');
        debugLog('=== SELECT ATUALIZADO ===');
        
    } catch (e) {
        debugLog('ERRO CRÍTICO ao atualizar select: ' + e.message);
        debugLog('Stack trace: ' + (e.stack || 'N/A'));
    }
}

// Renderizar lista de pratos
function renderizarPratos() {
    try {
        debugLog('=== RENDERIZANDO PRATOS ===');
        
        var container = document.getElementById('pratosList');
        if (!container) {
            debugLog('ERRO: Container pratosList não encontrado');
            return;
        }
        
        debugLog('Container pratosList encontrado');
        debugLog('Número de pratos a renderizar: ' + pratos.length);
        
        container.innerHTML = '';
        
        if (pratos.length === 0) {
            debugLog('Nenhum prato para mostrar');
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhum prato cadastrado</p>';
            return;
        }
        
        debugLog('Iniciando renderização dos ' + pratos.length + ' pratos...');
        
        for (var i = 0; i < pratos.length; i++) {
            debugLog('Renderizando prato ' + i + ': ' + pratos[i].nome);
            
            var pratoDiv = document.createElement('div');
            pratoDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px; margin-bottom: 10px; background: white;';
            
            pratoDiv.innerHTML = 
                '<span><strong>' + pratos[i].nome + '</strong><br>R$ ' + pratos[i].preco.toFixed(2) + '</span>' +
                '<button onclick="removerPrato(' + i + ')" style="background: #e53e3e; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Remover</button>';
            
            container.appendChild(pratoDiv);
            debugLog('Prato ' + i + ' adicionado ao DOM');
        }
        
        debugLog('=== PRATOS RENDERIZADOS COM SUCESSO ===');
        
    } catch (e) {
        debugLog('ERRO CRÍTICO ao renderizar pratos: ' + e.message);
        debugLog('Stack trace: ' + (e.stack || 'N/A'));
    }
}

// Adicionar prato
function adicionarPrato() {
    try {
        var nomeInput = document.getElementById('nomePrato');
        var precoInput = document.getElementById('precoPrato');
        
        if (!nomeInput || !precoInput) {
            debugLog('Inputs de prato não encontrados');
            return;
        }
        
        var nome = nomeInput.value.trim();
        var preco = parseFloat(precoInput.value);
        
        if (!nome || isNaN(preco) || preco <= 0) {
            alert('Por favor, preencha o nome e preço válidos do prato.');
            return;
        }
        
        pratos.push({
            id: Date.now(),
            nome: nome,
            preco: preco
        });
        
        nomeInput.value = '';
        precoInput.value = '';
        
        salvarDados();
        renderizarPratos();
        atualizarSelectPratos();
        
        debugLog('Prato adicionado: ' + nome);
    } catch (e) {
        debugLog('Erro ao adicionar prato: ' + e.message);
        alert('Erro ao adicionar prato');
    }
}

// Remover prato
function removerPrato(index) {
    try {
        if (index >= 0 && index < pratos.length) {
            var pratoNome = pratos[index].nome;
            pratos.splice(index, 1);
            salvarDados();
            renderizarPratos();
            atualizarSelectPratos();
            debugLog('Prato removido: ' + pratoNome);
        }
    } catch (e) {
        debugLog('Erro ao remover prato: ' + e.message);
    }
}

// Calcular valor total do ticket
function calcularValorTotal() {
    try {
        var pratoPrincipalSelect = document.getElementById('pratoPrincipal');
        var valorPratoInput = document.getElementById('valorPrato');
        
        if (!pratoPrincipalSelect || !valorPratoInput) return 0;
        
        var pratoIndex = parseInt(pratoPrincipalSelect.value);
        var valorTotal = 0;
        
        if (!isNaN(pratoIndex) && pratos[pratoIndex]) {
            valorTotal = pratos[pratoIndex].preco;
            valorPratoInput.value = 'R$ ' + valorTotal.toFixed(2);
        } else {
            valorPratoInput.value = '';
        }
        
        // Adicionar adicionais
        var checkboxes = ['refrigerante', 'sobremesa', 'batata'];
        for (var i = 0; i < checkboxes.length; i++) {
            var checkbox = document.getElementById(checkboxes[i]);
            if (checkbox && checkbox.checked && adicionais[checkboxes[i]]) {
                valorTotal += adicionais[checkboxes[i]].preco;
            }
        }
        
        return valorTotal;
    } catch (e) {
        debugLog('Erro ao calcular valor total: ' + e.message);
        return 0;
    }
}

// Criar ticket de entrega
function criarTicket() {
    try {
        debugLog('Iniciando criação de ticket...');
        
        var pratoPrincipalSelect = document.getElementById('pratoPrincipal');
        var entregadorSelect = document.getElementById('entregador');
        var dataInput = document.getElementById('dataEntrega');
        var horaInput = document.getElementById('horaEntrega');
        var enderecoInput = document.getElementById('enderecoEntrega');
        
        if (!pratoPrincipalSelect || !entregadorSelect || !dataInput || !horaInput || !enderecoInput) {
            alert('Erro: Campos do formulário não encontrados');
            debugLog('ERRO: Campos não encontrados');
            return;
        }
        
        var pratoIndex = parseInt(pratoPrincipalSelect.value);
        var entregador = entregadorSelect.value;
        var data = dataInput.value;
        var hora = horaInput.value;
        var endereco = enderecoInput.value.trim();
        
        debugLog('Dados do formulário: prato=' + pratoIndex + ', entregador=' + entregador + ', data=' + data);
        
        if (isNaN(pratoIndex) || !pratos[pratoIndex]) {
            alert('Por favor, selecione um prato principal.');
            return;
        }
        
        if (!entregador || !data || !hora || !endereco) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Coletar adicionais selecionados
        var adicionaisSelecionados = [];
        var checkboxes = ['refrigerante', 'sobremesa', 'batata'];
        for (var i = 0; i < checkboxes.length; i++) {
            var checkbox = document.getElementById(checkboxes[i]);
            if (checkbox && checkbox.checked && adicionais[checkboxes[i]]) {
                adicionaisSelecionados.push({
                    nome: adicionais[checkboxes[i]].nome,
                    preco: adicionais[checkboxes[i]].preco
                });
            }
        }
        
        var valorTotal = calcularValorTotal();
        
        var novoTicket = {
            id: Date.now(),
            pratoPrincipal: {
                nome: pratos[pratoIndex].nome,
                preco: pratos[pratoIndex].preco
            },
            adicionais: adicionaisSelecionados,
            valorTotal: valorTotal,
            entregador: entregador,
            dataEntrega: data,
            horaEntrega: hora,
            endereco: endereco,
            status: 'Pendente',
            dataCriacao: new Date().toLocaleString('pt-BR')
        };
        
        tickets.push(novoTicket);
        salvarDados();
        renderizarTickets();
        limparFormulario();
        
        debugLog('Ticket criado: #' + novoTicket.id);
        alert('Ticket de entrega criado com sucesso!');
        
    } catch (e) {
        debugLog('ERRO ao criar ticket: ' + e.message);
        alert('Erro ao criar ticket de entrega');
    }
}

// Limpar formulário
function limparFormulario() {
    try {
        var form = document.getElementById('deliveryForm');
        if (form) {
            form.reset();
        }
        
        var valorPratoInput = document.getElementById('valorPrato');
        if (valorPratoInput) {
            valorPratoInput.value = '';
        }
        
        // Definir data atual como padrão
        var dataInput = document.getElementById('dataEntrega');
        if (dataInput) {
            var hoje = new Date();
            var ano = hoje.getFullYear();
            var mes = String(hoje.getMonth() + 1).padStart(2, '0');
            var dia = String(hoje.getDate()).padStart(2, '0');
            dataInput.value = ano + '-' + mes + '-' + dia;
        }
        
        debugLog('Formulário limpo');
    } catch (e) {
        debugLog('Erro ao limpar formulário: ' + e.message);
    }
}

// Renderizar tickets
function renderizarTickets() {
    try {
        var container = document.getElementById('ticketsList');
        if (!container) {
            debugLog('Container ticketsList não encontrado');
            return;
        }
        
        container.innerHTML = '';
        
        if (tickets.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhum ticket de entrega</p>';
            return;
        }
        
        for (var i = tickets.length - 1; i >= 0; i--) {
            var ticket = tickets[i];
            var ticketDiv = document.createElement('div');
            ticketDiv.style.cssText = 'border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px; background: white;';
            
            var adicionaisHtml = '';
            if (ticket.adicionais && ticket.adicionais.length > 0) {
                adicionaisHtml = '<p><strong>Adicionais:</strong><br>';
                for (var j = 0; j < ticket.adicionais.length; j++) {
                    adicionaisHtml += '• ' + ticket.adicionais[j].nome + ' - R$ ' + ticket.adicionais[j].preco.toFixed(2) + '<br>';
                }
                adicionaisHtml += '</p>';
            }
            
            ticketDiv.innerHTML = 
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
                    '<h3 style="color: #4a5568; margin: 0;">Ticket #' + ticket.id + '</h3>' +
                    '<button onclick="removerTicket(' + i + ')" style="background: #e53e3e; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Remover</button>' +
                '</div>' +
                '<p><strong>Prato Principal:</strong> ' + ticket.pratoPrincipal.nome + ' - R$ ' + ticket.pratoPrincipal.preco.toFixed(2) + '</p>' +
                adicionaisHtml +
                '<p><strong>Valor Total:</strong> R$ ' + ticket.valorTotal.toFixed(2) + '</p>' +
                '<p><strong>Entregador:</strong> ' + ticket.entregador + '</p>' +
                '<p><strong>Data/Hora Prevista:</strong> ' + ticket.dataEntrega + ' às ' + ticket.horaEntrega + '</p>' +
                '<p><strong>Endereço:</strong> ' + ticket.endereco + '</p>' +
                '<p><strong>Status:</strong> <span style="color: #d69e2e; font-weight: bold;">' + ticket.status + '</span></p>' +
                '<p style="color: #666; font-size: 12px; margin-top: 10px;">Criado em: ' + ticket.dataCriacao + '</p>';
            
            container.appendChild(ticketDiv);
        }
        
        debugLog('Tickets renderizados: ' + tickets.length + ' itens');
    } catch (e) {
        debugLog('Erro ao renderizar tickets: ' + e.message);
    }
}

// Remover ticket
function removerTicket(index) {
    try {
        if (index >= 0 && index < tickets.length) {
            var ticketId = tickets[index].id;
            tickets.splice(index, 1);
            salvarDados();
            renderizarTickets();
            debugLog('Ticket removido: #' + ticketId);
        }
    } catch (e) {
        debugLog('Erro ao remover ticket: ' + e.message);
    }
}

// Configurar eventos
function configurarEventos() {
    try {
        debugLog('Configurando eventos...');
        
        // Formulário de pratos
        var pratoForm = document.getElementById('pratoForm');
        if (pratoForm) {
            pratoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                adicionarPrato();
            });
            debugLog('Evento pratoForm configurado');
        } else {
            debugLog('AVISO: pratoForm não encontrado');
        }
        
        // Formulário de delivery
        var deliveryForm = document.getElementById('deliveryForm');
        if (deliveryForm) {
            deliveryForm.addEventListener('submit', function(e) {
                e.preventDefault();
                criarTicket();
            });
            debugLog('Evento deliveryForm configurado');
        } else {
            debugLog('AVISO: deliveryForm não encontrado');
        }
        
        // Mudança no select de prato principal
        var pratoPrincipalSelect = document.getElementById('pratoPrincipal');
        if (pratoPrincipalSelect) {
            pratoPrincipalSelect.addEventListener('change', function() {
                calcularValorTotal();
            });
            debugLog('Evento pratoPrincipalSelect configurado');
        } else {
            debugLog('AVISO: pratoPrincipalSelect não encontrado');
        }
        
        // Mudança nos checkboxes de adicionais
        var checkboxes = ['refrigerante', 'sobremesa', 'batata'];
        for (var i = 0; i < checkboxes.length; i++) {
            var checkbox = document.getElementById(checkboxes[i]);
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    calcularValorTotal();
                });
                debugLog('Evento ' + checkboxes[i] + ' configurado');
            } else {
                debugLog('AVISO: checkbox ' + checkboxes[i] + ' não encontrado');
            }
        }
        
        debugLog('Todos os eventos configurados com sucesso');
        
    } catch (e) {
        debugLog('ERRO ao configurar eventos: ' + e.message);
    }
}

// Inicializar dados exemplo
function carregarDadosExemplo() {
    try {
        debugLog('=== CARREGANDO DADOS EXEMPLO ===');
        
        if (pratos.length === 0) {
            debugLog('Nenhum prato encontrado, carregando dados exemplo...');
            pratos = [
                { id: 1, nome: 'Arroz, feijão e frango grelhado', preco: 18.50 },
                { id: 2, nome: 'Lasanha à bolonhesa', preco: 22.00 },
                { id: 3, nome: 'Hambúrguer artesanal', preco: 25.00 },
                { id: 4, nome: 'Pizza margherita', preco: 28.00 },
                { id: 5, nome: 'Salada caesar', preco: 16.00 }
            ];
            
            debugLog('Pratos exemplo adicionados: ' + pratos.length);
            
            // Forçar salvamento
            salvarDados();
            debugLog('Dados exemplo salvos no localStorage');
        } else {
            debugLog('Pratos já existiam: ' + pratos.length + ' itens');
        }
        
        // Log detalhado dos pratos
        for (var i = 0; i < pratos.length; i++) {
            debugLog('Prato ' + i + ': ' + pratos[i].nome + ' - R$ ' + pratos[i].preco);
        }
        
        debugLog('=== FIM DADOS EXEMPLO ===');
        
    } catch (e) {
        debugLog('ERRO ao carregar dados exemplo: ' + e.message);
    }
}

// Teste de funcionalidades
function testarFuncionalidades() {
    debugLog('=== TESTE DE FUNCIONALIDADES ===');
    debugLog('Pratos disponíveis: ' + pratos.length);
    debugLog('Tickets criados: ' + tickets.length);
    debugLog('LocalStorage disponível: ' + storageAvailable());
    
    var elementos = [
        'pratoForm', 'deliveryForm', 'pratoPrincipal', 
        'nomePrato', 'precoPrato', 'entregador',
        'dataEntrega', 'horaEntrega', 'enderecoEntrega',
        'pratosList', 'ticketsList'
    ];
    
    for (var i = 0; i < elementos.length; i++) {
        var elemento = document.getElementById(elementos[i]);
        debugLog('Elemento ' + elementos[i] + ': ' + (elemento ? 'OK' : 'FALTANDO'));
    }
    
    debugLog('=== FIM DO TESTE ===');
}

// Inicialização principal
function initApp() {
    debugLog('=== INICIANDO JUSTDELIVERY ANDROID ===');
    
    try {
        debugLog('1. Carregando dados...');
        carregarDados();
        
        debugLog('2. Carregando dados exemplo...');
        carregarDadosExemplo();
        
        debugLog('3. Renderizando interface...');
        renderizarPratos();
        atualizarSelectPratos();
        renderizarTickets();
        
        debugLog('4. Configurando eventos...');
        configurarEventos();
        
        debugLog('5. Limpando formulário...');
        limparFormulario();
        
        debugLog('6. Testando funcionalidades...');
        testarFuncionalidades();
        
        debugLog('=== APLICAÇÃO INICIADA COM SUCESSO! ===');
        
        // Ocultar debug após 5 segundos
        setTimeout(function() {
            try {
                var debugDiv = document.getElementById('debug');
                if (debugDiv) {
                    debugDiv.style.display = 'none';
                }
            } catch (e) {
                // Ignora erro
            }
        }, 5000);
        
    } catch (e) {
        debugLog('=== ERRO CRÍTICO NA INICIALIZAÇÃO ===');
        debugLog('Erro: ' + e.message);
        debugLog('Stack: ' + (e.stack || 'N/A'));
        
        alert('Erro ao inicializar a aplicação. Verifique o console.');
    }
}

// Aguardar DOM estar pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM já carregado
    setTimeout(initApp, 100);
}

// Expor função globalmente para debug
window.initApp = initApp;

// === FUNÇÕES DE TESTE DE EMERGÊNCIA ===

// Função de teste de emergência
function testeEmergencia() {
    debugLog('=== TESTE DE EMERGÊNCIA INICIADO ===');
    
    try {
        // Limpar dados atuais
        pratos = [];
        tickets = [];
        
        // Forçar carregamento de dados exemplo
        carregarDadosExemplo();
        
        // Forçar renderização
        debugLog('Forçando renderização...');
        renderizarPratos();
        atualizarSelectPratos();
        renderizarTickets();
        
        debugLog('=== TESTE DE EMERGÊNCIA CONCLUÍDO ===');
        alert('Teste de emergência executado! Verifique os logs.');
        
    } catch (e) {
        debugLog('ERRO no teste de emergência: ' + e.message);
        alert('ERRO no teste de emergência: ' + e.message);
    }
}

// Limpar todo o localStorage
function limparTudo() {
    try {
        debugLog('Limpando localStorage...');
        localStorage.removeItem('justdelivery_pratos');
        localStorage.removeItem('justdelivery_tickets');
        
        pratos = [];
        tickets = [];
        
        renderizarPratos();
        atualizarSelectPratos();
        renderizarTickets();
        
        debugLog('Storage limpo!');
        alert('LocalStorage limpo!');
        
    } catch (e) {
        debugLog('ERRO ao limpar: ' + e.message);
        alert('ERRO ao limpar: ' + e.message);
    }
}

// Mostrar status atual
function mostrarStatus() {
    try {
        var status = '';
        status += 'Pratos em memória: ' + pratos.length + '\n';
        status += 'Tickets em memória: ' + tickets.length + '\n';
        status += 'LocalStorage disponível: ' + storageAvailable() + '\n';
        
        var pratosStorage = localStorage.getItem('justdelivery_pratos');
        var ticketsStorage = localStorage.getItem('justdelivery_tickets');
        
        status += 'Pratos no storage: ' + (pratosStorage ? JSON.parse(pratosStorage).length : 0) + '\n';
        status += 'Tickets no storage: ' + (ticketsStorage ? JSON.parse(ticketsStorage).length : 0) + '\n';
        
        // Verificar elementos DOM
        status += '\nElementos DOM:\n';
        status += 'pratosList: ' + (document.getElementById('pratosList') ? 'OK' : 'FALTANDO') + '\n';
        status += 'pratoPrincipal: ' + (document.getElementById('pratoPrincipal') ? 'OK' : 'FALTANDO') + '\n';
        status += 'ticketsList: ' + (document.getElementById('ticketsList') ? 'OK' : 'FALTANDO') + '\n';
        
        debugLog('Status atual:\n' + status);
        alert('Status atual:\n' + status);
        
    } catch (e) {
        debugLog('ERRO ao mostrar status: ' + e.message);
        alert('ERRO ao mostrar status: ' + e.message);
    }
}

// Expor funções globalmente
window.testeEmergencia = testeEmergencia;
window.limparTudo = limparTudo;
window.mostrarStatus = mostrarStatus;