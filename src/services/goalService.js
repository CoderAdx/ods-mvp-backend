import pool from '../config/database.js';

export const goalService = {
  // Salvar uma nova meta
  async saveGoal(userId, goalDescription, targetTime, status) {
    try {
      const [result] = await pool.query(
        'INSERT INTO goals (user_id, goal_description, target_time, status) VALUES (?, ?, ?, ?)',
        [userId, goalDescription, targetTime, status]
      );
      return result.insertId; // Retorna o ID da meta criada
    } catch (error) {
      throw new Error(`Erro ao salvar meta: ${error.message}`);
    }
  },

  // Buscar metas de um usuário
  async getGoalsByUserId(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT id, user_id, goal_description, target_time, status FROM goals WHERE user_id = ?',
        [userId]
      );
      return rows.length > 0 ? rows : null;
    } catch (error) {
      throw new Error(`Erro ao buscar metas: ${error.message}`);
    }
  },

  // Atualizar o status de uma meta
  async updateGoalStatus(goalId, status) {
    try {
      await pool.query(
        'UPDATE goals SET status = ? WHERE id = ?',
        [status, goalId]
      );
    } catch (error) {
      throw new Error(`Erro ao atualizar status da meta: ${error.message}`);
    }
  },

  // Deletar uma meta
  async deleteGoal(goalId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM goals WHERE id = ?',
        [goalId]
      );
      if (result.affectedRows === 0) {
        throw new Error('Meta não encontrada');
      }
    } catch (error) {
      throw new Error(`Erro ao deletar meta: ${error.message}`);
    }
  },

  //Buscar uma meta específica pelo ID
  async getGoalById(goalId) {
  try {
    const [rows] = await pool.query(
      'SELECT id, user_id FROM goals WHERE id = ?',
      [goalId]
    );
    return rows[0];
  } catch (error) {
    throw new Error(`Erro ao buscar meta: ${error.message}`);
  }
}
};