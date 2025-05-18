import { goalService } from '../services/goalService.js';

export const goalController = {
  // Salvar uma nova meta
  async saveGoal(req, res) {
    try {
      const userId = req.userId; // Usa o userId do token
      const { goalDescription, targetTime, status } = req.body;
      if (!goalDescription || !targetTime || !status) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
      }
      const goalId = await goalService.saveGoal(userId, goalDescription, targetTime, status);
      res.status(201).json({ message: 'Meta salva com sucesso', goalId });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Buscar metas de um usuário
  async getGoals(req, res) {
    try {
      const  userId  = req.userId; // Obtém o userId do token via middleware 
      const goals = await goalService.getGoalsByUserId(userId);
      if (!goals || goals.length === 0) {
        return res.status(404).json({ 
        error: 'Nenhuma meta encontrada para este usuário',
        data: []
      });
    }
      res.status(200).json({
        message: 'Metas recuperadas com sucesso',
        data: goals
    });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Atualizar o status de uma meta
  async updateGoalStatus(req, res) {
    try {
      const { goalId } = req.params;
      const { status } = req.body;
      const userId = req.userId; // Obtém o userId do token via
      if (!status) {
        return res.status(400).json({ error: 'Status é obrigatório' });
      }
      // Verifica se a meta pertence ao usuário autenticado
      const goal = await goalService.getGoalById(goalId);
      if (!goal || goal.user_id !== userId) {
        return res.status(403).json({ error: 'Acesso negado: Meta não pertence a este usuário' });
    }
      await goalService.updateGoalStatus(goalId, status);
      res.status(200).json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Deletar uma meta
  async deleteGoal(req, res) {
    try {
      const { goalId } = req.params;
      const userId = req.userId; // Obtém o userId do token via middleware
      // Verifica se a meta pertence ao usuário autenticado
      const goal = await goalService.getGoalById(goalId);
      if (!goal || goal.user_id !== userId) {
        return res.status(403).json({ error: 'Acesso negado: Meta não pertence a este usuário' });
    }
      await goalService.deleteGoal(goalId);
      res.status(200).json({ message: 'Meta deletada com sucesso' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};