const express = require('express');
const mercadopago = require('mercadopago');
const path = require('path');
const app = express();
const port = 3000;
mercadopago.configure({
    access_token: "SUA_CHAVE_DE_ACESSO_AQUI", 
});
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.post('/process_payment', async (req, res) => {
    const { items } = req.body;
    let preference = {
        items: items.map(item => ({
            title: item.nome,
            unit_price: item.preco,
            quantity: 1,
        })),
        back_urls: {
            success: "http://localhost:3000/success.html",
            failure: "http://localhost:3000/failure.html",
            pending: "http://localhost:3000/pending.html",
        },
        auto_return: "approved",
    };
    try {
        const response = await mercadopago.preferences.create(preference);
        res.json({ id: response.body.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao processar o pagamento." });
    }
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});