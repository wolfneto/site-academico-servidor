module.exports = (app) => {
    const pedido = app.controller.pedido;

    const middleWare = app.utils.middleWare

    // pedido
    app.post('/pedido', (req, res) => pedido.salvar(res, req));
    app.post('/pedidoOutros', (req, res) => pedido.salvar_outros(res, req));
    app.get('/pedidos', middleWare.isAuthenticated, (req, res) => pedido.getPedidos(res, req));
    app.get('/pedido', middleWare.isAuthenticated, (req, res) => pedido.getPedido(res, req));
    app.get('/pagamentoPedido', middleWare.isAuthenticated, (req, res) => pedido.getPedidoCheckout(res, req));
    app.get('/pagamentoPedidoItens', middleWare.isAuthenticated, (req, res) => pedido.getPedidoCheckoutItens(res, req));
    app.post('/pagamentoSucesso', (req, res) => pedido.sendEmailPagamentoSucesso(res, req));
    app.put('/listasVendidas', (req, res) => pedido.updateListasVendidas(res, req));
    app.put('/PedidoTemDesconto', (req, res) => pedido.updatePedidoDesconto(res, req));
    app.post('/checarPedido', middleWare.isAuthenticated, (req, res) => pedido.checarPedido(res, req));
    app.put('/descontoUsado', (req, res) => pedido.updateDescontoRepresentante(res, req));
    app.post('/criarPix', (req, res) => pedido.criarPix(res, req))

    return this;
}