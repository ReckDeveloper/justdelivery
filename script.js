// Estrutura de dados para armazenar os tickets e pratos
var deliveryTickets = [];
var ticketIdCounter = 1;
var pratosDisponiveis = [];
var pratoIdCounter = 1;
var itensAdicionais = [];
var adicionalIdCounter = 1;

// Preços dos itens adicionais padrão
var PRECOS_ADICIONAIS_PADRAO = {
    refrigerante: 5.00,
    sobremesa: 8.00,
    batata: 6.00
};

// Variável global para controle de carregamento
var appLoaded = false;

// Inicialização da aplicação com verificações robustas
function initializeApp() {
    try {
        // Verificar se todos os elementos necessários existem
        var requiredElements = [
            'deliveryForm', 'pratoForm', 'adicionalForm', 'pratoPrincipal', 
            'filtroStatus', 'filtroEntregador', 'pratosList', 'adicionaisList', 'ticketsList'
        ];
        
        var missingElements = [];
        for (var i = 0; i < requiredElements.length; i++) {
            if (!document.getElementById(requiredElements[i])) {
                missingElements.push(requiredElements[i]);
            }
        }
        
        if (missingElements.length > 0) {
            console.error('Elementos não encontrados:', missingElements);
            setTimeout(initializeApp, 500); // Tentar novamente
            return;
        }

        // Carregar dados salvos do localStorage
        loadTicketsFromStorage();
        loadPratosFromStorage();
        loadItensAdicionaisFromStorage();
        
        // Configurar data e hora atuais por padrão
        setCurrentDateTime();
        
        // Event listeners com verificação de existência
        var deliveryForm = document.getElementById('deliveryForm');
        var pratoForm = document.getElementById('pratoForm');
        var adicionalForm = document.getElementById('adicionalForm');
        var pratoPrincipal = document.getElementById('pratoPrincipal');
        var filtroStatus = document.getElementById('filtroStatus');
        var filtroEntregador = document.getElementById('filtroEntregador');
        
        if (deliveryForm) {
            deliveryForm.addEventListener('submit', handleFormSubmit);
        }
        
        if (pratoForm) {
            pratoForm.addEventListener('submit', handlePratoSubmit);
        }
        
        if (adicionalForm) {
            adicionalForm.addEventListener('submit', handleAdicionalSubmit);
        }
        
        if (pratoPrincipal) {
            pratoPrincipal.addEventListener('change', handlePratoSelection);
        }
        
        if (filtroStatus) {
            filtroStatus.addEventListener('change', filterTickets);
        }
        
        if (filtroEntregador) {
            filtroEntregador.addEventListener('input', filterTickets);
        }
        
        // Renderizar dados iniciais
        renderPratos();
        renderItensAdicionais();
        renderTickets();
        
        // Carregar pratos padrão se não houver nenhum
        if (pratosDisponiveis.length === 0) {
            carregarPratosPadrao();
        }
        
        // Carregar itens adicionais padrão se não houver nenhum
        if (itensAdicionais.length === 0) {
            carregarItensAdicionaisPadrao();
        }
        
        // Melhorias para dispositivos móveis
        setupMobileOptimizations();
        
        // Marcar app como carregado
        appLoaded = true;
        
        // Esconder loading se existir
        var loading = document.getElementById('loadingFallback');
        if (loading) {
            loading.style.display = 'none';
        }
        
        console.log('App inicializado com sucesso');
        
    } catch (error) {
        console.error('Erro na inicialização:', error);
        // Tentar novamente após 1 segundo
        setTimeout(initializeApp, 1000);
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Fallback se DOMContentLoaded não funcionar
window.addEventListener('load', function() {
    if (!appLoaded) {
        initializeApp();
    }
});

// Fallback adicional
setTimeout(function() {
    if (!appLoaded) {
        console.log('Tentando inicialização forçada...');
        initializeApp();
    }
}, 2000);

/**
 * Configurações específicas para dispositivos móveis
 */
function setupMobileOptimizations() {
    // Detectar se é dispositivo móvel (método mais robusto)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (window.innerWidth <= 768);
    
    // Detectar especificamente Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Adicionar classe mobile ao body
        document.body.classList.add('mobile-device');
        
        // Adicionar classe específica para Android
        if (isAndroid) {
            document.body.classList.add('android-device');
        }
        
        // Otimizar scrolling
        document.body.style.webkitOverflowScrolling = 'touch';
        document.body.style.overflowScrolling = 'touch';
        
        // Prevenir zoom em inputs (importante para Android)
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(function(input) {
            if (input.type !== 'checkbox' && input.type !== 'radio') {
                var currentFontSize = window.getComputedStyle(input).fontSize;
                var fontSize = Math.max(16, parseInt(currentFontSize));
                input.style.fontSize = fontSize + 'px';
            }
        });
        
        // Corrigir viewport height em Android
        if (isAndroid) {
            function setViewportHeight() {
                var vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', vh + 'px');
            }
            setViewportHeight();
            window.addEventListener('resize', setViewportHeight);
            window.addEventListener('orientationchange', function() {
                setTimeout(setViewportHeight, 100);
            });
        }
    }
    
    // Melhorar performance em dispositivos com tela sensível ao toque
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
        
        // Usar event delegation para melhor performance
        document.addEventListener('touchstart', function(e) {
            if (e.target.matches('button, .btn-submit, .btn-add-prato, .btn-action, .btn-remove-prato')) {
                e.target.style.opacity = '0.8';
            }
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (e.target.matches('button, .btn-submit, .btn-add-prato, .btn-action, .btn-remove-prato')) {
                e.target.style.opacity = '1';
            }
        }, { passive: true });
    }
    
    // Otimizar renderização para telas de alta densidade
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
        document.body.classList.add('high-dpi');
    }
    
    // Forçar re-render em dispositivos problemáticos
    if (isAndroid) {
        setTimeout(function() {
            document.body.style.transform = 'translateZ(0)';
            document.body.offsetHeight; // Trigger reflow
            document.body.style.transform = '';
        }, 100);
    }
}

/**
 * Define data e hora atuais nos campos do formulário
 */
function setCurrentDateTime() {
    try {
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString().padStart(2, '0');
        var day = now.getDate().toString().padStart(2, '0');
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        
        var dateString = year + '-' + month + '-' + day;
        var timeString = hours + ':' + minutes;
        
        var dataEntrega = document.getElementById('dataEntrega');
        var horaEntrega = document.getElementById('horaEntrega');
        
        if (dataEntrega) {
            dataEntrega.value = dateString;
        }
        
        if (horaEntrega) {
            horaEntrega.value = timeString;
        }
    } catch (error) {
        console.error('Erro ao definir data/hora:', error);
    }
}

/**
 * Carrega pratos padrão do sistema
 */
function carregarPratosPadrao() {
    try {
        var pratosPadrao = [
            { nome: "Arroz, feijão e frango à milanesa", preco: 18.50 },
            { nome: "Arroz, feijão e calabresa", preco: 16.90 },
            { nome: "Arroz, feijão e bife acebolado", preco: 19.90 },
            { nome: "Arroz, feijão e frango grelhado", preco: 17.50 },
            { nome: "Arroz, feijão e linguiça toscana", preco: 16.50 },
            { nome: "Arroz, feijão e peixe grelhado", preco: 22.90 },
            { nome: "Arroz, feijão e carne de porco", preco: 18.90 },
            { nome: "Feijoada completa", preco: 25.90 }
        ];
        
        for (var i = 0; i < pratosPadrao.length; i++) {
            var prato = pratosPadrao[i];
            pratosDisponiveis.push({
                id: pratoIdCounter++,
                nome: prato.nome,
                preco: prato.preco,
                disponivel: true,
                criadoEm: new Date().toISOString()
            });
        }
        
        savePratosToStorage();
        renderPratos();
        updatePratoSelect();
        
        console.log('Pratos padrão carregados');
    } catch (error) {
        console.error('Erro ao carregar pratos padrão:', error);
    }
}

/**
 * Carrega itens adicionais padrão do sistema
 */
function carregarItensAdicionaisPadrao() {
    try {
        var itensAdicionaisPadrao = [
            { nome: "Refrigerante", preco: 5.00 },
            { nome: "Sobremesa", preco: 8.00 },
            { nome: "Batata Frita", preco: 6.00 },
            { nome: "Suco Natural", preco: 4.50 },
            { nome: "Salada", preco: 3.50 }
        ];
        
        for (var i = 0; i < itensAdicionaisPadrao.length; i++) {
            var item = itensAdicionaisPadrao[i];
            itensAdicionais.push({
                id: adicionalIdCounter++,
                nome: item.nome,
                preco: item.preco,
                disponivel: true,
                criadoEm: new Date().toISOString()
            });
        }
        
        saveItensAdicionaisToStorage();
        renderItensAdicionais();
        updateItensAdicionaisForm();
        
        console.log('Itens adicionais padrão carregados');
    } catch (error) {
        console.error('Erro ao carregar itens adicionais padrão:', error);
    }
}

/**
 * Processa o envio do formulário de pratos
 */
function handlePratoSubmit(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    
    try {
        var nomePrato = '';
        var precoPrato = 0;
        
        var nomeInput = document.getElementById('nomePrato');
        var precoInput = document.getElementById('precoPrato');
        
        if (nomeInput) {
            nomePrato = nomeInput.value ? nomeInput.value.trim() : '';
        }
        
        if (precoInput) {
            precoPrato = precoInput.value ? parseFloat(precoInput.value) : 0;
        }
        
        if (!nomePrato) {
            showNotification('Nome do prato é obrigatório!', 'error');
            return;
        }
        
        if (precoPrato <= 0) {
            showNotification('Preço deve ser maior que zero!', 'error');
            return;
        }
        
        // Verificar se o prato já existe
        var pratoExistente = false;
        for (var i = 0; i < pratosDisponiveis.length; i++) {
            if (pratosDisponiveis[i].nome.toLowerCase() === nomePrato.toLowerCase()) {
                pratoExistente = true;
                break;
            }
        }
        
        if (pratoExistente) {
            showNotification('Este prato já existe no cardápio!', 'error');
            return;
        }
        
        // Criar novo prato
        var novoPrato = {
            id: pratoIdCounter++,
            nome: nomePrato,
            preco: precoPrato,
            disponivel: true,
            criadoEm: new Date().toISOString()
        };
        
        pratosDisponiveis.push(novoPrato);
        savePratosToStorage();
        
        // Limpar formulário
        if (nomeInput) nomeInput.value = '';
        if (precoInput) precoInput.value = '';
        
        // Renderizar pratos atualizados
        renderPratos();
        updatePratoSelect();
        
        showNotification('Prato adicionado ao cardápio!', 'success');
        
    } catch (error) {
        console.error('Erro ao adicionar prato:', error);
        showNotification('Erro ao adicionar prato: ' + error.message, 'error');
    }
}

/**
 * Processa o envio do formulário de itens adicionais
 */
function handleAdicionalSubmit(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    
    try {
        var nomeAdicional = '';
        var precoAdicional = 0;
        
        var nomeInput = document.getElementById('nomeAdicional');
        var precoInput = document.getElementById('precoAdicional');
        
        if (nomeInput) {
            nomeAdicional = nomeInput.value ? nomeInput.value.trim() : '';
        }
        
        if (precoInput) {
            precoAdicional = precoInput.value ? parseFloat(precoInput.value) : 0;
        }
        
        if (!nomeAdicional) {
            showNotification('Nome do item adicional é obrigatório!', 'error');
            return;
        }
        
        if (precoAdicional <= 0) {
            showNotification('Preço deve ser maior que zero!', 'error');
            return;
        }
        
        // Verificar se o item já existe
        var itemExistente = false;
        for (var i = 0; i < itensAdicionais.length; i++) {
            if (itensAdicionais[i].nome.toLowerCase() === nomeAdicional.toLowerCase()) {
                itemExistente = true;
                break;
            }
        }
        
        if (itemExistente) {
            showNotification('Este item adicional já existe!', 'error');
            return;
        }
        
        // Criar novo item adicional
        var novoAdicional = {
            id: adicionalIdCounter++,
            nome: nomeAdicional,
            preco: precoAdicional,
            disponivel: true,
            criadoEm: new Date().toISOString()
        };
        
        itensAdicionais.push(novoAdicional);
        saveItensAdicionaisToStorage();
        
        // Limpar formulário
        if (nomeInput) nomeInput.value = '';
        if (precoInput) precoInput.value = '';
        
        // Renderizar itens atualizados
        renderItensAdicionais();
        updateItensAdicionaisForm();
        
        showNotification('Item adicional adicionado!', 'success');
        
    } catch (error) {
        console.error('Erro ao adicionar item adicional:', error);
        showNotification('Erro ao adicionar item adicional: ' + error.message, 'error');
    }
}

/**
 * Renderiza a lista de pratos disponíveis
 */
function renderPratos() {
    var pratosList = document.getElementById('pratosList');
    
    if (!pratosList) {
        console.error('Elemento pratosList não encontrado');
        return;
    }
    
    if (pratosDisponiveis.length === 0) {
        pratosList.innerHTML = '<div class="empty-pratos">Nenhum prato cadastrado. Adicione pratos ao cardápio.</div>';
        return;
    }
    
    // Ordenar pratos por nome usando método compatível
    var pratosOrdenados = pratosDisponiveis.slice().sort(function(a, b) {
        return a.nome.localeCompare(b.nome);
    });
    
    // Renderizar usando método mais compatível
    var html = '';
    for (var i = 0; i < pratosOrdenados.length; i++) {
        var prato = pratosOrdenados[i];
        var statusClass = prato.disponivel ? 'prato-disponivel' : 'prato-indisponivel';
        
        html += '<div class="prato-card ' + statusClass + '">';
        html += '<div class="prato-nome">' + prato.nome + '</div>';
        html += '<div class="prato-preco">R$ ' + prato.preco.toFixed(2) + '</div>';
        html += '<div class="prato-actions">';
        html += '<button class="btn-remove-prato" onclick="removePrato(' + prato.id + ')">';
        html += '🗑️ Remover';
        html += '</button>';
        html += '</div>';
        html += '</div>';
    }
    
    pratosList.innerHTML = html;
}

/**
 * Renderiza a lista de itens adicionais disponíveis
 */
function renderItensAdicionais() {
    var adicionaisList = document.getElementById('adicionaisList');
    
    if (!adicionaisList) {
        console.error('Elemento adicionaisList não encontrado');
        return;
    }
    
    if (itensAdicionais.length === 0) {
        adicionaisList.innerHTML = '<div class="empty-adicionais">Nenhum item adicional cadastrado. Adicione itens ao menu.</div>';
        return;
    }
    
    // Ordenar itens por nome
    var itensOrdenados = itensAdicionais.slice().sort(function(a, b) {
        return a.nome.localeCompare(b.nome);
    });
    
    var html = '';
    for (var i = 0; i < itensOrdenados.length; i++) {
        var item = itensOrdenados[i];
        var statusClass = item.disponivel ? 'adicional-disponivel' : 'adicional-indisponivel';
        
        html += '<div class="adicional-card ' + statusClass + '">';
        html += '<div class="adicional-nome">' + item.nome + '</div>';
        html += '<div class="adicional-preco">R$ ' + item.preco.toFixed(2) + '</div>';
        html += '<div class="adicional-actions">';
        html += '<button class="btn-remove-adicional" onclick="removeAdicional(' + item.id + ')">';
        html += '🗑️ Remover';
        html += '</button>';
        html += '</div>';
        html += '</div>';
    }
    
    adicionaisList.innerHTML = html;
}

/**
 * Remove um prato do cardápio
 */
function removePrato(pratoId) {
    // Usar função nativa para melhor compatibilidade
    var confirmacao = window.confirm('Tem certeza que deseja remover este prato do cardápio?');
    
    if (confirmacao) {
        pratosDisponiveis = pratosDisponiveis.filter(function(prato) {
            return prato.id !== pratoId;
        });
        savePratosToStorage();
        renderPratos();
        updatePratoSelect();
        
        showNotification('Prato removido do cardápio!', 'success');
    }
}

/**
 * Remove um item adicional
 */
function removeAdicional(adicionalId) {
    var confirmacao = window.confirm('Tem certeza que deseja remover este item adicional?');
    
    if (confirmacao) {
        itensAdicionais = itensAdicionais.filter(function(item) {
            return item.id !== adicionalId;
        });
        saveItensAdicionaisToStorage();
        renderItensAdicionais();
        updateItensAdicionaisForm();
        
        showNotification('Item adicional removido!', 'success');
    }
}

/**
 * Atualiza o select de pratos no formulário de tickets
 */
function updatePratoSelect() {
    var select = document.getElementById('pratoPrincipal');
    var currentValue = select.value;
    
    // Limpar opções existentes (exceto a primeira)
    select.innerHTML = '<option value="">Selecione um prato do cardápio</option>';
    
    // Adicionar pratos disponíveis usando método compatível
    var pratosDisponiveis_filtered = pratosDisponiveis.filter(function(prato) {
        return prato.disponivel;
    });
    
    pratosDisponiveis_filtered
        .sort(function(a, b) {
            return a.nome.localeCompare(b.nome);
        })
        .forEach(function(prato) {
            var option = document.createElement('option');
            option.value = prato.id;
            option.textContent = prato.nome + ' - R$ ' + prato.preco.toFixed(2);
            option.setAttribute('data-preco', prato.preco);
            option.setAttribute('data-nome', prato.nome);
            select.appendChild(option);
        });
    
    // Restaurar valor selecionado se ainda existir
    if (currentValue && select.querySelector('option[value="' + currentValue + '"]')) {
        select.value = currentValue;
    }
}

/**
 * Processa a seleção de um prato
 */
function handlePratoSelection(event) {
    var select = event.target;
    var selectedOption = select.options[select.selectedIndex];
    var valorPrato = document.getElementById('valorPrato');
    
    if (selectedOption.value) {
        var preco = parseFloat(selectedOption.getAttribute('data-preco'));
        valorPrato.value = 'R$ ' + preco.toFixed(2);
    } else {
        valorPrato.value = '';
    }
}

/**
 * Processa o envio do formulário e cria novo ticket
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const ticket = createTicketFromForm(formData);
        
        // Adicionar ticket ao array
        deliveryTickets.push(ticket);
        
        // Salvar no localStorage
        saveTicketsToStorage();
        
        // Limpar formulário
        event.target.reset();
        setCurrentDateTime();
        
        // Renderizar tickets atualizados
        renderTickets();
        
        // Feedback visual
        showNotification('Ticket criado com sucesso!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

/**
 * Cria objeto ticket a partir dos dados do formulário
 */
function createTicketFromForm(formData) {
    const pratoSelect = document.getElementById('pratoPrincipal');
    const selectedOption = pratoSelect.options[pratoSelect.selectedIndex];
    
    if (!selectedOption.value) {
        throw new Error('Selecione um prato do cardápio');
    }
    
    const pratoId = parseInt(selectedOption.value);
    const prato = pratosDisponiveis.find(p => p.id === pratoId);
    
    if (!prato) {
        throw new Error('Prato selecionado não encontrado');
    }
    
    const pratoPrincipal = prato.nome;
    const valorPrato = prato.preco;
    const entregador = document.getElementById('entregador').value;
    const dataEntrega = document.getElementById('dataEntrega').value;
    const horaEntrega = document.getElementById('horaEntrega').value;
    const enderecoEntrega = document.getElementById('enderecoEntrega').value;
    
    // Coletar itens adicionais selecionados
    const itensAdicionais = [];
    let valorAdicional = 0;
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        const item = checkbox.value;
        itensAdicionais.push({
            nome: item,
            preco: PRECOS_ADICIONAIS[item]
        });
        valorAdicional += PRECOS_ADICIONAIS[item];
    });
    
    return {
        id: ticketIdCounter++,
        pratoId: pratoId,
        pratoPrincipal: pratoPrincipal,
        valorPrato: valorPrato,
        itensAdicionais: itensAdicionais,
        valorTotal: valorPrato + valorAdicional,
        entregador: entregador,
        dataEntrega: dataEntrega,
        horaEntrega: horaEntrega,
        enderecoEntrega: enderecoEntrega,
        status: 'pendente',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
    };
}

/**
 * Renderiza todos os tickets na tela com otimização para performance
 */
function renderTickets(ticketsToRender = null) {
    const ticketsList = document.getElementById('ticketsList');
    const tickets = ticketsToRender || deliveryTickets;
    
    if (tickets.length === 0) {
        ticketsList.innerHTML = '<div class="empty-state">Nenhum ticket de entrega encontrado.</div>';
        return;
    }
    
    // Mostrar estado de carregamento em dispositivos mais lentos
    const isMobile = document.body.classList.contains('mobile-device');
    if (isMobile && tickets.length > 10) {
        ticketsList.classList.add('loading');
    }
    
    // Usar requestAnimationFrame para melhor performance
    requestAnimationFrame(() => {
        // Ordenar tickets por data/hora de entrega
        const sortedTickets = [...tickets].sort((a, b) => {
            const dateTimeA = new Date(`${a.dataEntrega}T${a.horaEntrega}`);
            const dateTimeB = new Date(`${b.dataEntrega}T${b.horaEntrega}`);
            return dateTimeA - dateTimeB;
        });
        
        // Renderização otimizada com fragments
        const fragment = document.createDocumentFragment();
        
        sortedTickets.forEach(ticket => {
            const div = document.createElement('div');
            div.innerHTML = createTicketHTML(ticket);
            fragment.appendChild(div.firstElementChild);
        });
        
        ticketsList.innerHTML = '';
        ticketsList.appendChild(fragment);
        
        // Remover estado de carregamento
        ticketsList.classList.remove('loading');
        
        // Adicionar event listeners aos botões de ação
        addActionButtonListeners();
    });
}

/**
 * Cria HTML para um ticket individual
 */
function createTicketHTML(ticket) {
    const statusClass = `status-${ticket.status}`;
    const dataFormatada = formatDate(ticket.dataEntrega);
    const horaFormatada = ticket.horaEntrega;
    
    const itensAdicionaisHTML = ticket.itensAdicionais.length > 0 
        ? `<div class="itens-adicionais">
             ${ticket.itensAdicionais.map(item => 
                `<span class="item-adicional">${formatItemName(item.nome)} (+R$ ${item.preco.toFixed(2)})</span>`
             ).join('')}
           </div>`
        : '';
    
    const actionsHTML = createActionButtons(ticket);
    
    return `
        <div class="ticket-card" data-ticket-id="${ticket.id}">
            <div class="ticket-header">
                <span class="ticket-id">Ticket #${ticket.id.toString().padStart(3, '0')}</span>
                <span class="status-badge ${statusClass}">${formatStatus(ticket.status)}</span>
            </div>
            
            <div class="ticket-details">
                <div class="detail-item">
                    <span class="detail-label">Prato Principal</span>
                    <span class="detail-value">${ticket.pratoPrincipal}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Valor Total</span>
                    <span class="detail-value valor-total">R$ ${ticket.valorTotal.toFixed(2)}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Entregador</span>
                    <span class="detail-value">${ticket.entregador}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Data/Hora Prevista</span>
                    <span class="detail-value">${dataFormatada} às ${horaFormatada}</span>
                </div>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Endereço</span>
                <span class="detail-value">${ticket.enderecoEntrega}</span>
            </div>
            
            ${itensAdicionaisHTML}
            
            <div class="ticket-actions">
                ${actionsHTML}
            </div>
        </div>
    `;
}

/**
 * Cria botões de ação baseados no status do ticket
 */
function createActionButtons(ticket) {
    switch (ticket.status) {
        case 'pendente':
            return `<button class="btn-action btn-transito" onclick="updateTicketStatus(${ticket.id}, 'em-transito')">
                        🚚 Iniciar Entrega
                    </button>`;
        case 'em-transito':
            return `<button class="btn-action btn-entregar" onclick="updateTicketStatus(${ticket.id}, 'entregue')">
                        ✅ Confirmar Entrega
                    </button>`;
        case 'entregue':
            return `<span style="color: #38a169; font-weight: 600;">✅ Entrega Concluída</span>`;
        default:
            return '';
    }
}

/**
 * Adiciona event listeners aos botões de ação
 */
function addActionButtonListeners() {
    // Os event listeners são adicionados diretamente no HTML via onclick
    // Esta função pode ser expandida para funcionalidades adicionais
}

/**
 * Atualiza o status de um ticket
 */
function updateTicketStatus(ticketId, newStatus) {
    const ticket = deliveryTickets.find(t => t.id === ticketId);
    if (ticket) {
        ticket.status = newStatus;
        ticket.atualizadoEm = new Date().toISOString();
        
        saveTicketsToStorage();
        renderTickets();
        
        const statusMessages = {
            'em-transito': 'Entrega iniciada!',
            'entregue': 'Entrega confirmada com sucesso!'
        };
        
        showNotification(statusMessages[newStatus], 'success');
    }
}

/**
 * Filtra tickets baseado nos critérios selecionados
 */
function filterTickets() {
    const statusFilter = document.getElementById('filtroStatus').value;
    const entregadorFilter = document.getElementById('filtroEntregador').value.toLowerCase();
    
    let filteredTickets = deliveryTickets;
    
    // Filtro por status
    if (statusFilter) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === statusFilter);
    }
    
    // Filtro por entregador
    if (entregadorFilter) {
        filteredTickets = filteredTickets.filter(ticket => 
            ticket.entregador.toLowerCase().includes(entregadorFilter)
        );
    }
    
    renderTickets(filteredTickets);
}

/**
 * Salva tickets no localStorage
 */
function saveTicketsToStorage() {
    const dataToSave = {
        tickets: deliveryTickets,
        ticketIdCounter: ticketIdCounter
    };
    localStorage.setItem('justdelivery_tickets', JSON.stringify(dataToSave));
}

/**
 * Carrega tickets do localStorage
 */
function loadTicketsFromStorage() {
    const savedData = localStorage.getItem('justdelivery_tickets');
    if (savedData) {
        const data = JSON.parse(savedData);
        deliveryTickets = data.tickets || [];
        ticketIdCounter = data.ticketIdCounter || 1;
    }
}

/**
 * Salva pratos no localStorage
 */
function savePratosToStorage() {
    const dataToSave = {
        pratos: pratosDisponiveis,
        pratoIdCounter: pratoIdCounter
    };
    localStorage.setItem('justdelivery_pratos', JSON.stringify(dataToSave));
}

/**
 * Carrega pratos do localStorage
 */
function loadPratosFromStorage() {
    const savedData = localStorage.getItem('justdelivery_pratos');
    if (savedData) {
        const data = JSON.parse(savedData);
        pratosDisponiveis = data.pratos || [];
        pratoIdCounter = data.pratoIdCounter || 1;
    }
}

/**
 * Formata data para exibição
 */
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

/**
 * Formata nome do item adicional
 */
function formatItemName(itemName) {
    const names = {
        refrigerante: 'Refrigerante',
        sobremesa: 'Sobremesa',
        batata: 'Batata Frita'
    };
    return names[itemName] || itemName;
}

/**
 * Formata status para exibição
 */
function formatStatus(status) {
    const statusNames = {
        pendente: 'Pendente',
        'em-transito': 'Em Trânsito',
        entregue: 'Entregue'
    };
    return statusNames[status] || status;
}

/**
 * Exibe notificação para o usuário
 */
/**
 * Exibe notificação para o usuário (versão compatível)
 */
function showNotification(message, type) {
    try {
        if (!message) return;
        
        type = type || 'info';
        
        // Criar elemento de notificação
        var notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        
        var backgroundColor;
        switch (type) {
            case 'success': backgroundColor = '#48bb78'; break;
            case 'error': backgroundColor = '#e53e3e'; break;
            case 'warning': backgroundColor = '#ed8936'; break;
            default: backgroundColor = '#4299e1';
        }
        
        // Estilos inline para garantir funcionamento
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.background = backgroundColor;
        notification.style.color = 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        notification.style.zIndex = '1000';
        notification.style.fontWeight = '600';
        notification.style.maxWidth = '300px';
        notification.style.fontSize = '14px';
        notification.style.lineHeight = '1.4';
        
        // Adicionar texto
        if (notification.textContent !== undefined) {
            notification.textContent = message;
        } else {
            notification.innerText = message;
        }
        
        // Adicionar ao body
        document.body.appendChild(notification);
        
        // Remover após tempo determinado
        var duration = type === 'error' ? 4000 : 3000;
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
        
    } catch (error) {
        console.error('Erro na notificação:', error);
        // Fallback para alert
        if (window.alert) {
            alert(message);
        }
    }
}

// Adicionar estilos de animação para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);