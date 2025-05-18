import bcrypt from 'bcrypt';
import pool from '../config/database.js';

// Exporta o serviço como um objeto com métodos
export const userService = {
  // Cria um novo usuário no banco
  async createUser(name, email, password, securityWord) {
    try {
      //// Faz o hash da senha com bcrypt (10 é o número de rounds de salt)
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, security_word) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, securityWord]
      );
      return result.insertId; //// Retorna o ID do novo usuário
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  },

  // Busca um usuário por email (pra login, vamos usar depois)
  async findUserByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [
        email,
      ]);
      return rows[0]; // Retorna o primeiro usuário encontrado (ou undefined)
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  },

  async findUserBySecurityWord(securityWord) {
    try {
      const [rows] = await pool.query(
        'SELECT id FROM users WHERE security_word = ?',
        [securityWord]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar usuário pela palavra de segurança: ${error.message}`);
    }
  },

  async updateUserPassword(userId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const [result] = await pool.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
      );
      if (result.affectedRows === 0) {
        throw new Error('Usuário não encontrado');
      }
      return true;
    } catch (error) {
      throw new Error(`Erro ao atualizar a senha: ${error.message}`);
    }
  },
};