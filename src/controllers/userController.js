import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userService } from '../services/userService.js';

export const userController = {
  async register(req, res) {
    try {
      const { name, email, password, security_word } = req.body;
      if (!name || !email || !password || !security_word) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
      }
      const userId = await userService.createUser(
        name,
        email,
        password,
        security_word
      );
      res.status(201).json({ message: 'Usuário criado com sucesso', userId });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Email e senha são obrigatórios' });
      }

      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Compara a senha fornecida com o hash armazenado
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      // Gera o token JWT com o userId como payload
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expira em 1 hora
      );

      res.status(200).json({
        message: 'Login bem-sucedido',
        userId: user.id,
        token: token // Retorna o token para o frontend
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async verifySecurityWord(req, res) {
    try {
      const { security_word } = req.body;
      if (!security_word) {
        return res.status(400).json({ error: 'Palavra de segurança é obrigatória' });
      }
      const user = await userService.findUserBySecurityWord(security_word);
      if (!user) {
        return res.status(404).json({ error: 'Palavra de segurança não encontrada' });
      }
      res.status(200).json({ userId: user.id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const { userId, newPassword } = req.body;
      if (!userId || !newPassword) {
        return res.status(400).json({ error: 'Usuário ou nova senha não fornecidos' });
      }
      await userService.updateUserPassword(userId, newPassword);
      res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};