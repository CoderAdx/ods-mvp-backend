import { interactionHistoryService } from '../services/interactionHistoryService.js';

// Exporta o controller como um objeto com métodos
export const interactionHistoryController = {
  // Salva uma nova interação
  async saveInteraction(req, res) {
    try {
      const userId = req.userId; // Usa o userId do token
      const { responseText } = req.body;
      if (!responseText) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes (userId e responseText)' });
      }
      const interactionId = await interactionHistoryService.saveInteraction(userId, responseText);
      res.status(201).json({ message: 'Interação salva com sucesso', id: interactionId });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Busca as interações de um usuário
  async getInteractions(req, res) {
    try {
      const userId  = req.userId; // Usa o userID do token
      const interactions = await interactionHistoryService.getInteractions(userId);
      res.status(200).json(interactions.length > 0 ? interactions : []);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};