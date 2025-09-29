# 🚚 JustDelivery - Sistema de Controle de Entregas

## Visão Geral
O JustDelivery é um sistema web para controle e gestão de tickets de entrega de delivery. O sistema permite criar, acompanhar e gerenciar entregas de forma simples e intuitiva.

## 📋 Funcionalidades

### Principais Recursos:
- ✅ **Cadastro de pratos do dia** (novo!)
- ✅ Criação de tickets de entrega
- ✅ Seleção de pratos da lista cadastrada
- ✅ Controle de pratos principais e itens adicionais
- ✅ Gestão de entregadores
- ✅ Acompanhamento de status das entregas
- ✅ Filtros por status e entregador
- ✅ Armazenamento local dos dados
- ✅ Interface responsiva

### Dados do Sistema:
- **Pratos do Dia**: Lista cadastrável de pratos com preços
- **Prato Principal**: Selecionado da lista de pratos disponíveis
- **Itens Adicionais**: Refrigerante, Sobremesa, Batata Frita (com valores)
- **Entregador**: Nome do responsável pela entrega
- **Data e Hora**: Quando a entrega deve ser realizada
- **Endereço**: Local de entrega
- **Status**: Pendente, Em Trânsito, Entregue

## 🏗️ Arquitetura do Sistema

### Estrutura de Arquivos:
```
justdelivery/
├── index.html          # Interface principal
├── styles.css          # Estilos e design
├── script.js           # Lógica e funcionalidades
├── dados-exemplo.js    # Dados de exemplo e utilitários
├── diagrama.html      # Diagrama visual do sistema
└── README.md          # Documentação
```

### Tecnologias Utilizadas:
- **HTML5**: Estrutura da interface
- **CSS3**: Design e responsividade
- **JavaScript ES6+**: Lógica de negócio
- **LocalStorage**: Persistência de dados

## 📊 Estrutura de Dados JSON

### Ticket de Entrega:
```json
{
  "id": 1,
  "pratoId": 1,
  "pratoPrincipal": "Arroz, feijão e frango à milanesa",
  "valorPrato": 18.50,
  "itensAdicionais": [
    {
      "nome": "refrigerante",
      "preco": 5.00
    },
    {
      "nome": "sobremesa",
      "preco": 8.00
    }
  ],
  "valorTotal": 31.50,
  "entregador": "João Silva",
  "dataEntrega": "2025-09-28",
  "horaEntrega": "19:30",
  "enderecoEntrega": "Rua das Flores, 123 - Centro",
  "status": "pendente",
  "criadoEm": "2025-09-28T16:30:00.000Z",
  "atualizadoEm": "2025-09-28T16:30:00.000Z"
}
```

### Prato do Cardápio:
```json
{
  "id": 1,
  "nome": "Arroz, feijão e frango à milanesa",
  "preco": 18.50,
  "disponivel": true,
  "criadoEm": "2025-09-28T10:00:00.000Z"
}
```

### Estrutura de Armazenamento:
```json
{
  "tickets": [
    // Array de tickets de entrega
  ],
  "ticketIdCounter": 1,
  "pratos": [
    // Array de pratos do cardápio
  ],
  "pratoIdCounter": 1
}
```

## 🔄 Fluxo de Funcionamento

### 1. Cadastro de Pratos
```
Usuário acessa área de cadastro
    ↓
Preenche nome e preço do prato
    ↓
Sistema valida e adiciona ao cardápio
    ↓
Prato fica disponível para seleção
    ↓
Lista de pratos é atualizada
```

### 2. Criação de Ticket
```
Usuário seleciona prato da lista
    ↓
Sistema preenche automaticamente o valor
    ↓
Usuário adiciona itens extras e dados
    ↓
Sistema calcula valor total
    ↓
Ticket é criado e salvo
```

### 3. Acompanhamento de Status
```
Status Inicial: PENDENTE
    ↓
Botão "Iniciar Entrega" → EM TRÂNSITO
    ↓
Botão "Confirmar Entrega" → ENTREGUE
    ↓
Status final (não pode ser alterado)
```

## 🎯 Casos de Uso

### Caso 1: Cadastrar Novo Prato
1. **Ator**: Operador do delivery
2. **Objetivo**: Adicionar prato ao cardápio do dia
3. **Fluxo**:
   - Acessa seção "Pratos do Dia"
   - Preenche nome do prato (ex: "Arroz, feijão e frango à milanesa")
   - Define preço
   - Clica em "Adicionar"
   - Sistema valida e adiciona ao cardápio
4. **Resultado**: Prato disponível para seleção em novos tickets

### Caso 2: Criar Nova Entrega
1. **Ator**: Operador do delivery
2. **Objetivo**: Registrar novo pedido para entrega
3. **Fluxo**:
   - Seleciona prato da lista do cardápio
   - Sistema preenche automaticamente o valor
   - Seleciona itens adicionais (opcional)
   - Escolhe entregador
   - Define data/hora de entrega
   - Informa endereço
   - Clica em "Criar Ticket"
4. **Resultado**: Ticket criado com status "Pendente"

### Caso 2: Acompanhar Entrega
1. **Ator**: Entregador ou Operador
2. **Objetivo**: Atualizar status da entrega
3. **Fluxo**:
   - Localiza ticket na lista
   - Clica em "Iniciar Entrega" (se pendente)
   - Sistema atualiza para "Em Trânsito"
   - Após entrega, clica em "Confirmar Entrega"
   - Sistema atualiza para "Entregue"
4. **Resultado**: Status atualizado e histórico mantido

### Caso 3: Filtrar Entregas
1. **Ator**: Operador ou Gerente
2. **Objetivo**: Visualizar entregas específicas
3. **Fluxo**:
   - Seleciona filtro de status desejado
   - Ou digita nome do entregador
   - Sistema filtra tickets automaticamente
4. **Resultado**: Lista filtrada exibida

## 💾 Persistência de Dados

### LocalStorage:
- **Chave**: `justdelivery_tickets`
- **Dados**: Array de tickets + contador de IDs
- **Sincronização**: Automática a cada operação
- **Recuperação**: Carregamento automático na inicialização

### Estrutura de Dados:
```javascript
// Variáveis globais
let deliveryTickets = [];     // Array de tickets
let ticketIdCounter = 1;      // Contador de IDs únicos
let pratosDisponiveis = [];   // Array de pratos do cardápio
let pratoIdCounter = 1;       // Contador de IDs de pratos

// Preços fixos para itens adicionais
const PRECOS_ADICIONAIS = {
  refrigerante: 5.00,
  sobremesa: 8.00,
  batata: 6.00
};
```

## 🎨 Design e UX

### Características Visuais:
- **Cores**: Gradient azul-roxo (moderno)
- **Layout**: Grid responsivo (2 colunas)
- **Tipografia**: Segoe UI (clean e legível)
- **Animações**: Transições suaves
- **Responsividade**: Mobile-first

### Estados Visuais:
- **Pendente**: Badge vermelho
- **Em Trânsito**: Badge laranja
- **Entregue**: Badge verde

### Feedback ao Usuário:
- Notificações de sucesso
- Hover effects nos cards
- Validação de formulário
- Estados vazios informativos

## 🚀 Como Usar

### 1. Executar o Sistema:
```bash
# Abrir no navegador
open index.html
```

### 2. Criar Primeiro Ticket:
- Primeiro cadastre alguns pratos na seção "Pratos do Dia"
- Selecione um prato da lista no formulário à direita
- Adicione itens adicionais (opcional)
- Defina data/hora e entregador
- Clique em "Criar Ticket"

### 3. Gerenciar Entregas:
- Use os botões de ação nos tickets
- Aplique filtros conforme necessário
- Acompanhe o status em tempo real

## 📱 Responsividade e Compatibilidade

### Breakpoints Implementados:
- **Desktop**: > 1024px (layout em 2 colunas)
- **Tablet**: 768px - 1024px (layout em 1 coluna)
- **Mobile**: < 768px (otimizado para touch)
- **Mobile Pequeno**: < 480px (compacto)
- **Landscape Mobile**: orientação paisagem

### Otimizações Mobile:
- **Touch-friendly**: Botões com 44px+ de altura
- **Zoom Prevention**: Font-size 16px+ em inputs (iOS)
- **Smooth Scrolling**: Scroll suave em listas
- **Tap Feedback**: Feedback visual em botões touch
- **Safe Areas**: Respeitando áreas seguras de dispositivos

### Acessibilidade:
- **Reduced Motion**: Suporte a `prefers-reduced-motion`
- **High Contrast**: Suporte a `prefers-contrast: high`
- **Dark Mode**: Suporte a `prefers-color-scheme: dark`
- **Screen Readers**: ARIA labels adequadas
- **Keyboard Navigation**: Navegação por teclado completa

### Navegadores Suportados:
- Chrome 60+ (Desktop/Mobile)
- Firefox 55+ (Desktop/Mobile)
- Safari 12+ (Desktop/Mobile/iOS)
- Edge 79+ (Desktop/Mobile)
- Samsung Internet 7.2+
- UC Browser 12.12+

### Dispositivos Testados:
- **iOS**: iPhone SE, iPhone 12/13/14, iPad
- **Android**: Galaxy S20+, Pixel 5, tablets
- **Desktop**: 1920x1080, 2560x1440, 4K
- **Orientações**: Portrait e Landscape

## 🔧 Extensibilidade

### Possíveis Melhorias:
- Integração com APIs externas
- Notificações push
- Relatórios e estatísticas
- Sistema de usuários
- Integração com mapas
- Histórico completo de alterações
- Backup em nuvem

## 📈 Métricas e Analytics

### Dados Coletados:
- Número total de entregas
- Status das entregas
- Performance por entregador
- Tempo médio de entrega
- Valor médio dos pedidos

### Visualizações Disponíveis:
- Lista de tickets ordenada por data
- Filtros dinâmicos
- Status badges coloridos
- Valores totais destacados

## 🔒 Considerações de Segurança

### Dados Locais:
- Armazenamento apenas no navegador
- Sem transmissão de dados sensíveis
- Limpeza automática se necessário

### Validações:
- Campos obrigatórios no formulário
- Validação de tipos de dados
- Prevenção de IDs duplicados

---

**Sistema desenvolvido para controle eficiente de entregas de delivery com foco na simplicidade e usabilidade.**