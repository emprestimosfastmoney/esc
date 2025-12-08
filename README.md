# ESC Landing Page - Funil de Qualificação de Leads

Landing page estilo funil interativo para Empresa Simples de Crédito (ESC), otimizada para conversão e tráfego pago.

## Estrutura do Projeto

```
landing-page/
├── index.html          # Página principal com todas as etapas do funil
├── css/
│   └── styles.css      # Estilos (design dark, mobile-first)
├── js/
│   └── app.js          # Lógica do funil, validação e integrações
├── assets/
│   └── images/         # Imagens e favicon
└── README.md           # Este arquivo
```

## Características

- **Funil Interativo**: 5 etapas com transições suaves
- **Mobile-First**: 100% responsivo, otimizado para touch
- **Design Dark**: Paleta moderna com acentos em dourado
- **Validação em Tempo Real**: Formulário com feedback instantâneo
- **Máscara de Telefone**: Formatação automática (XX) XXXXX-XXXX
- **Persistência Local**: Dados salvos no localStorage durante o fluxo
- **Tracking Completo**: Eventos para GTM e Facebook Pixel
- **Captura de UTMs**: Parâmetros de campanha rastreados automaticamente

## Configuração Rápida

### 1. Webhook (CRM)

Edite o arquivo `js/app.js` e configure o endpoint do webhook:

```javascript
const CONFIG = {
    webhookUrl: 'https://seu-webhook.com/endpoint', // Zapier, Make, ClickUp, etc.
    whatsappNumber: '5511999999999', // Número com código do país
    // ...
};
```

### 2. Google Tag Manager

No arquivo `index.html`, substitua `GTM-XXXXXX` pelo seu ID do container:

```html
<!-- Linha ~45 e ~60 -->
'https://www.googletagmanager.com/gtm.js?id='+'GTM-XXXXXX'
```

### 3. Facebook Pixel

No arquivo `index.html`, descomente e configure o Pixel ID:

```javascript
// Linha ~55
fbq('init', 'SEU_PIXEL_ID');
fbq('track', 'PageView');
```

### 4. WhatsApp

Configure o número de WhatsApp e mensagem padrão em `js/app.js`:

```javascript
const CONFIG = {
    // ...
    whatsappNumber: '5511999999999',
    whatsappMessage: 'Olá! Acabei de solicitar uma simulação de crédito.',
};
```

## Deploy

### Opção 1: Hospedagem Estática

Faça upload de todos os arquivos para qualquer serviço de hospedagem:

- **Netlify**: Arraste a pasta para [app.netlify.com](https://app.netlify.com)
- **Vercel**: `npx vercel` no terminal
- **GitHub Pages**: Push para branch `gh-pages`
- **Firebase Hosting**: `firebase deploy`

### Opção 2: Servidor Próprio

```bash
# Usando Python (para testes locais)
cd landing-page
python -m http.server 8000

# Usando Node.js
npx serve .
```

### Opção 3: Integração com WordPress

1. Crie uma página em branco no WordPress
2. Cole o conteúdo do `index.html` no editor de código
3. Adicione CSS e JS inline ou via tema filho

## Payload do Webhook

Quando o lead é convertido, os seguintes dados são enviados:

```json
{
    "tem_cnpj": "sim",
    "tem_fachada": "sim",
    "valor_credito": "3000",
    "nome": "João Silva",
    "whatsapp": "(11) 99999-9999",
    "cidade_estado": "São Paulo - SP",
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "credito-empresarial",
    "utm_term": "",
    "utm_content": "",
    "timestamp": "2024-01-15T14:30:00.000Z",
    "referrer": "https://facebook.com",
    "user_agent": "Mozilla/5.0..."
}
```

## Eventos de Tracking

Os seguintes eventos são disparados para GTM/Facebook:

| Evento | Descrição | Parâmetros |
|--------|-----------|------------|
| `funnel_start` | Início do funil | `page: 1` |
| `page_view` | Visualização de etapa | `page: N` |
| `option_selected` | Opção selecionada | `page, value` |
| `value_selected` | Valor de crédito escolhido | `value` |
| `lead_converted` | Conversão completa | `valor_credito, cidade` |
| `lead_rejected` | Lead sem CNPJ | `reason: no_cnpj` |
| `submission_error` | Erro no envio | - |

## URLs de Campanha

Use parâmetros UTM para rastrear suas campanhas:

```
https://seusite.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=credito-mei
```

Parâmetros suportados:
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

## Customização

### Alterar Cores

Edite as variáveis CSS no início de `css/styles.css`:

```css
:root {
    --accent-primary: #D4AF37;   /* Dourado - cor principal */
    --accent-secondary: #8B0000; /* Vermelho escuro */
    --bg-primary: #0d0d0d;       /* Fundo principal */
    /* ... */
}
```

### Alterar Valores de Crédito

Edite os cards de valor no `index.html` (Page 3):

```html
<button class="value-card" data-value="NOVO_VALOR" data-next="4">
    <span class="value-amount">R$ NOVO_VALOR</span>
</button>
```

### Adicionar Cidades

Edite a lista de cidades em `js/app.js`:

```javascript
const cidades = [
    'Sua Cidade - UF',
    // ...
];
```

## Performance

- **Tamanho total**: ~50KB (sem imagens)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 95+

## Compatibilidade

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- iOS Safari 13+
- Android Chrome 80+

## Checklist de Lançamento

- [ ] Configurar webhook do CRM
- [ ] Adicionar ID do Google Tag Manager
- [ ] Configurar Facebook Pixel
- [ ] Atualizar número do WhatsApp
- [ ] Adicionar logo personalizado
- [ ] Adicionar favicon
- [ ] Testar em dispositivos móveis
- [ ] Verificar tracking de eventos
- [ ] Configurar domínio personalizado
- [ ] Criar anúncios direcionando para a landing page

## Suporte

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.

---

**ESC - Empresa Simples de Crédito**
Crédito rápido e sem burocracia para pequenos comerciantes.
