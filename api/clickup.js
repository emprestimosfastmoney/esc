// Vercel Serverless Function - ClickUp Integration (Dual)

module.exports = async (req, res) => {
    // Configurar CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Apenas aceitar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Configurações dos dois ClickUps
    const CLICKUP_ACCOUNTS = [
        {
            name: 'Secundário',
            apiToken: 'pk_266436457_M9444FL2XTIR2RNATHFMHXHSERGDV4N2',
            listId: '901323280543'
        }
    ];

    try {
        const data = req.body;

        // Validar dados obrigatórios
        if (!data.nome || !data.whatsapp) {
            return res.status(400).json({ error: 'Nome e WhatsApp são obrigatórios' });
        }

        // Formatar valor do crédito
        const valorFormatado = parseInt(data.valor_credito || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        // Criar descrição detalhada da task
        const descricao = `## Dados do Lead

**Nome:** ${data.nome}
**WhatsApp:** ${data.whatsapp}
**Localização:** ${data.cidade || '-'} - ${data.estado || '-'}

---

## Solicitação

**Valor do Crédito:** ${valorFormatado}
**Tem CNPJ:** ${data.tem_cnpj === 'sim' ? 'Sim' : 'Não'}
**Tem Fachada:** ${data.tem_fachada === 'sim' ? 'Sim' : 'Não'}

---

## Rastreamento

**Origem:** ${data.utm_source || data.referrer || 'Acesso direto'}
**Mídia:** ${data.utm_medium || '-'}
**Campanha:** ${data.utm_campaign || '-'}
**Data/Hora:** ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;

        // Criar tags baseadas nas respostas
        const tags = [];
        if (data.tem_cnpj === 'sim') tags.push('tem-cnpj');
        if (data.tem_fachada === 'sim') tags.push('tem-fachada');

        // Tag de valor
        const valor = parseInt(data.valor_credito || 0);
        if (valor <= 2000) tags.push('valor-baixo');
        else if (valor <= 5000) tags.push('valor-medio');
        else tags.push('valor-alto');

        // Payload para o ClickUp
        const payload = {
            name: `Lead: ${data.nome} - ${valorFormatado}`,
            description: descricao,
            tags: tags,
            priority: 2,
            notify_all: true
        };

        // Enviar para ambos os ClickUps em paralelo
        const results = await Promise.allSettled(
            CLICKUP_ACCOUNTS.map(account =>
                fetch(`https://api.clickup.com/api/v2/list/${account.listId}/task`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': account.apiToken
                    },
                    body: JSON.stringify(payload)
                }).then(r => r.json())
            )
        );

        // Verificar se pelo menos um funcionou
        const successCount = results.filter(r => r.status === 'fulfilled' && r.value.id).length;

        if (successCount === 0) {
            return res.status(500).json({
                error: 'Erro ao criar tasks no ClickUp',
                details: results
            });
        }

        return res.status(200).json({
            success: true,
            message: `Task criada em ${successCount} de ${CLICKUP_ACCOUNTS.length} ClickUps`
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
};
