// JustDelivery - Versão Compatível Android
// Estrutura de dados global
var deliveryTickets = [];
var ticketIdCounter = 1;
var pratosDisponiveis = [];
var pratoIdCounter = 1;
var appLoaded = false;

// Preços fixos dos itens adicionais
var PRECOS_ADICIONAIS = {
    refrigerante: 5.00,
    sobremesa: 8.00,
    batata: 6.00
};

// Polyfills básicos
if (!Array.prototype.filter) {
    Array.prototype.filter = function(callback) {
        var filtered = [];
        for (var i = 0; i < this.length; i++) {
            if (callback.call(this, this[i], i, this)) {
                filtered.push(this[i]);
            }
        }
        return filtered;
    };
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this, this[i], i, this);
        }
    };
}

// Função de debug
function debugLog(msg) {
    if (console && console.log) {
        console.log('[JustDelivery] ' + msg);
    }
}

// Função segura para obter elementos
function getElement(id) {
    try {
        return document.getElementById(id);
    } catch (e) {
        debugLog('Erro ao obter elemento: ' + id);
        return null;
    }
}

// Notificação compatível
function showNotification(message, type) {
    try {
        type = type || 'info';
        debugLog('Notificação: ' + message + ' (' + type + ')');
        
        var notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';
        notification.style.fontSize = '14px';
        notification.style.maxWidth = '300px';
        notification.style.wordWrap = 'break-word';
        
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#48bb78';
                break;
            case 'error':
                notification.style.backgroundColor = '#e53e3e';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ed8936';
                break;
            default:
                notification.style.backgroundColor = '#4299e1';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
        
    } catch (e) {
        debugLog('Erro na notificação: ' + e.message);
        if (window.alert) {
            alert(message);
        }
    }
}

// Função para definir data/hora prevista atual
function definirDataHoraAtual() {
    try {
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString();
        var day = now.getDate().toString();
        var hours = now.getHours().toString();
        var minutes = now.getMinutes().toString();
        
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;
        
        var dateStr = year + '-' + month + '-' + day;
        var timeStr = hours + ':' + minutes;
        
        var dataInput = getElement('dataEntrega');
        var horaInput = getElement('horaEntrega');
        
        if (dataInput) dataInput.value = dateStr;
        if (horaInput) horaInput.value = timeStr;
        
        debugLog('Data/hora definidas: ' + dateStr + ' ' + timeStr);
        
    } catch (e) {
        debugLog('Erro ao definir data/hora: ' + e.message);
    }
}

// Carregamento de pratos padrão
function carregarPratosPadrao() {
    try {
        var pratos = [
            { nome: "Arroz, feijão e frango à milanesa", preco: 18.50 },
            { nome: "Arroz, feijão e calabresa", preco: 16.90 },
            { nome: "Arroz, feijão e bife acebolado", preco: 19.90 },
            { nome: "Arroz, feijão e frango grelhado", preco: 17.50 }
        ];
        
        for (var i = 0; i < pratos.length; i++) {
            pratosDisponiveis.push({
                id: pratoIdCounter++,
                nome: pratos[i].nome,
                preco: pratos[i].preco,
                disponivel: true,
                criadoEm: new Date().toISOString()
            });
        }
        
        savePratosToStorage();
        renderPratos();
        updatePratoSelect();
        
        debugLog('Pratos padrão carregados: ' + pratos.length);
        
    } catch (e) {
        debugLog('Erro ao carregar pratos: ' + e.message);
    }
}

// Renderização de pratos
function renderPratos() {
    try {
        var container = getElement('pratosList');
        if (!container) {
            debugLog('Container de pratos não encontrado');
            return;
        }
        
        if (pratosDisponiveis.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhum prato cadastrado.</p>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < pratosDisponiveis.length; i++) {
            var prato = pratosDisponiveis[i];
            html += '<div class="prato-card" style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #ddd;">';
            html += '<div style="font-weight: bold; margin-bottom: 8px;">' + prato.nome + '</div>';
            html += '<div style="color: #38a169; font-size: 18px; font-weight: bold;">R$ ' + prato.preco.toFixed(2) + '</div>';
            html += '<button onclick="removePrato(' + prato.id + ')" style="background: #e53e3e; color: white; border: none; padding: 8px 12px; border-radius: 4px; margin-top: 8px; cursor: pointer;">Remover</button>';
            html += '</div>';
        }
        
        container.innerHTML = html;
        debugLog('Pratos renderizados: ' + pratosDisponiveis.length);
        
    } catch (e) {
        debugLog('Erro ao renderizar pratos: ' + e.message);
    }
}

// Atualizar select de pratos
function updatePratoSelect() {
    try {
        var select = getElement('pratoPrincipal');
        if (!select) {
            debugLog('Select de pratos não encontrado');
            return;
        }
        
        select.innerHTML = '<option value="">Selecione um prato</option>';
        
        for (var i = 0; i < pratosDisponiveis.length; i++) {
            var prato = pratosDisponiveis[i];
            if (prato.disponivel) {
                var option = document.createElement('option');
                option.value = prato.id;
                option.textContent = prato.nome + ' - R$ ' + prato.preco.toFixed(2);
                option.setAttribute('data-preco', prato.preco);
                select.appendChild(option);
            }
        }
        
        debugLog('Select atualizado com ' + pratosDisponiveis.length + ' pratos');
        
    } catch (e) {
        debugLog('Erro ao atualizar select: ' + e.message);
    }
}

// Remover prato
function removePrato(id) {
    try {
        if (confirm('Remover este prato?')) {
            pratosDisponiveis = pratosDisponiveis.filter(function(p) { return p.id !== id; });
            savePratosToStorage();
            renderPratos();
            updatePratoSelect();
            showNotification('Prato removido!', 'success');
        }
    } catch (e) {
        debugLog('Erro ao remover prato: ' + e.message);
    }
}

// Salvar pratos no localStorage
function savePratosToStorage() {
    try {
        if (typeof(Storage) !== "undefined") {
            var data = {
                pratos: pratosDisponiveis,
                pratoIdCounter: pratoIdCounter
            };
            localStorage.setItem('justdelivery_pratos', JSON.stringify(data));
            debugLog('Pratos salvos no storage');
        }
    } catch (e) {
        debugLog('Erro ao salvar pratos: ' + e.message);
    }
}

// Carregar pratos do localStorage
function loadPratosFromStorage() {
    try {
        if (typeof(Storage) !== "undefined") {
            var data = localStorage.getItem('justdelivery_pratos');
            if (data) {
                var parsed = JSON.parse(data);
                pratosDisponiveis = parsed.pratos || [];
                pratoIdCounter = parsed.pratoIdCounter || 1;
                debugLog('Pratos carregados do storage: ' + pratosDisponiveis.length);
            }
        }
    } catch (e) {
        debugLog('Erro ao carregar pratos: ' + e.message);
    }
}

// Inicialização segura
function initApp() {
    try {
        debugLog('Iniciando aplicação...');
        
        // Verificar elementos essenciais
        var elementos = ['pratoForm', 'pratoPrincipal', 'pratosList'];
        var faltando = [];
        
        for (var i = 0; i < elementos.length; i++) {
            if (!getElement(elementos[i])) {
                faltando.push(elementos[i]);
            }
        }
        
        if (faltando.length > 0) {
            debugLog('Elementos faltando: ' + faltando.join(', '));
            setTimeout(initApp, 500);
            return;
        }
        
        // Carregar dados
        loadPratosFromStorage();
        
        // Configurar eventos
        var pratoForm = getElement('pratoForm');
        if (pratoForm) {
            pratoForm.addEventListener('submit', function(e) {
                if (e.preventDefault) e.preventDefault();
                
                var nome = getElement('nomePrato');
                var preco = getElement('precoPrato');
                
                if (!nome || !preco || !nome.value || !preco.value) {
                    showNotification('Preencha todos os campos!', 'error');
                    return;
                }
                
                var novoPrato = {
                    id: pratoIdCounter++,
                    nome: nome.value,
                    preco: parseFloat(preco.value),
                    disponivel: true,
                    criadoEm: new Date().toISOString()
                };
                
                pratosDisponiveis.push(novoPrato);
                savePratosToStorage();
                renderPratos();
                updatePratoSelect();
                
                nome.value = '';
                preco.value = '';
                
                showNotification('Prato adicionado!', 'success');
            });
        }
        
        var pratoSelect = getElement('pratoPrincipal');
        if (pratoSelect) {
            pratoSelect.addEventListener('change', function() {
                var valorInput = getElement('valorPrato');
                if (valorInput && this.selectedIndex > 0) {
                    var option = this.options[this.selectedIndex];
                    var preco = option.getAttribute('data-preco');
                    valorInput.value = 'R$ ' + parseFloat(preco).toFixed(2);
                }
            });
        }
        
        // Configurar data/hora
        setCurrentDateTime();
        
        // Renderizar
        renderPratos();
        updatePratoSelect();
        
        // Carregar pratos padrão se necessário
        if (pratosDisponiveis.length === 0) {
            carregarPratosPadrao();
        }
        
        appLoaded = true;
        debugLog('Aplicação inicializada com sucesso!');
        
        // Esconder loading
        var loading = getElement('loadingFallback');
        if (loading) {
            loading.style.display = 'none';
        }
        
    } catch (e) {
        debugLog('Erro na inicialização: ' + e.message);
        setTimeout(initApp, 1000);
    }
}

// Event listeners para inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

window.addEventListener('load', function() {
    if (!appLoaded) {
        initApp();
    }
});

setTimeout(function() {
    if (!appLoaded) {
        debugLog('Inicialização forçada após timeout');
        initApp();
    }
}, 3000);