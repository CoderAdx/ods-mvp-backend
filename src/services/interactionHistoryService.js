import pool from '../config/database.js';

// Exporta o serviço como um objeto com métodos
export const interactionHistoryService = {
  // Salva uma nova interação no banco
  async saveInteraction(userId, responseText) {
    try {
      const [result] = await pool.query(
        'INSERT INTO interaction_history (user_id, response_text, generated_at) VALUES (?, ?, NOW())',
        [userId, responseText]
      );
      return result.insertId; // Retorna o ID da nova interação
    } catch (error) {
      throw new Error(`Erro ao salvar interação: ${error.message}`);
    }
  },

  // Busca as interações de um usuário
  async getInteractions(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT response_text, generated_at FROM interaction_history WHERE user_id = ? ORDER BY generated_at DESC',
        [userId]
      );
      return rows; // Retorna a lista de interações (ou array vazio)
    } catch (error) {
      throw new Error(`Erro ao buscar interações: ${error.message}`);
    }
  },
};