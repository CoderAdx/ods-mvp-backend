import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  // Verifica se o token está presente no cabeçalho Authorization
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // O token geralmente vem no formato "Bearer <token>", então extraímos só o token
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token malformado' });
  }

  try {
    // Verifica se o token é válido e decodifica o payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Adiciona o userId decodificado ao objeto req para uso nas rotas
    req.userId = decoded.userId;
    next(); // Continua para a próxima função (a rota protegida)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};