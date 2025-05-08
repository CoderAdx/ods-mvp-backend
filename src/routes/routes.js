import express from 'express';
import { userController } from '../controllers/userController.js';
import { goalController } from '../controllers/goalController.js';
import { interactionHistoryController } from '../controllers/interactionHistoryController.js';

const router = express.Router();

// Rotas para usuários
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);

// Rotas para gerenciamento de histórico de interações (interaction-history)
router.post('/interaction-history', interactionHistoryController.saveInteraction);
router.get('/interaction-history/:userId', interactionHistoryController.getInteractions);

// Rotas para metas (goals)
router.post('/goals', goalController.saveGoal);
router.get('/goals/:userId', goalController.getGoals);
router.patch('/goals/:goalId', goalController.updateGoalStatus);
router.delete('/goals/:goalId', goalController.deleteGoal);

export default router;