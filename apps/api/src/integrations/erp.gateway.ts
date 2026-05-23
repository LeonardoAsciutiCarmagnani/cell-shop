import { Product } from '../schemas/product.js';

export interface ErpOrderPayload {
  orderId: string;
  customerId: string;
  items: Array<Product>;
}

export class ErpGateway {
  /**
   * Simula o envio de um pedido para o ERP de forma assíncrona.
   * O ERP da CaseCellShop é lento e falha as vezes.
   */
  async sendOrderToErp(payload: ErpOrderPayload): Promise<{ sucesso: boolean; mensagem: string }> {
    // 1. Simula a lentidão/timeout do ERP (ex: demora 3 segundos para responder)
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('[ERP] Pedido enviado para o ERP:', payload);

    // 2. Simula instabilidade (ex: 15% de chance de dar erro de rede/timeout no ERP)
    const random = Math.random();

    if (random < 0.15) {
      // Simula uma falha de comunicação ou timeout interno do ERP
      throw new Error('ERP_TIMEOUT_OR_INTERNAL_ERROR');
    }

    // 3. Simula uma rejeição de negócio por parte do ERP (ex: 5% de chance)
    if (random >= 0.15 && random < 0.2) {
      return { sucesso: false, mensagem: 'Pedido rejeitado pelo faturamento do ERP.' };
    }

    // 4. Sucesso (80% das vezes)
    return { sucesso: true, mensagem: 'Pedido faturado com sucesso no ERP.' };
  }
}
