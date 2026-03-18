const { verifyAccessToken } = require('../utils/jwt');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: true,
        message: 'Token de acceso requerido',
        statusCode: 401,
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        error: true,
        message: 'Usuario no encontrado o desactivado',
        statusCode: 401,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: 'Token inválido o expirado',
      statusCode: 401,
    });
  }
};

module.exports = { verifyToken };
