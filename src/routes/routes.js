import express from 'express';
import { userController } from '../controllers/userController.js';
import { goalController } from '../controllers/goalController.js';
import { interactionHistoryController } from '../controllers/interactionHistoryController.js';
import { authMiddleware } from '../middleware/auth.js'; // Importa o middleware

const router = express.Router();

// Rotas para usuários (não protegidas, pois são para login e registro)
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.post('/users/verify-security-word', userController.verifySecurityWord);
router.post('/users/reset-password', userController.resetPassword);

// Rotas protegidas com authMiddleware
router.post('/interaction-history', authMiddleware, interactionHistoryController.saveInteraction);
router.get('/interaction-history', authMiddleware, interactionHistoryController.getInteractions); // Removido :userId
router.post('/goals', authMiddleware, goalController.saveGoal);
router.get('/goals', authMiddleware, goalController.getGoals); // Removido :userId
router.patch('/goals/:goalId', authMiddleware, goalController.updateGoalStatus);
router.delete('/goals/:goalId', authMiddleware, goalController.deleteGoal);

export default router;