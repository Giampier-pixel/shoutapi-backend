const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { success } = require('../utils/response');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production'
    ? 'none'
    : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({
      where: { email },
    });
    if (existing) {
      return res.status(409).json({
        error: true,
        message: 'El email ya está registrado',
        statusCode: 409,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password_hash: passwordHash,
    });

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return success(res, userData, 'Usuario registrado', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Credenciales inválidas',
        statusCode: 401,
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        error: true,
        message: 'Cuenta desactivada',
        statusCode: 403,
      });
    }

    const valid = await bcrypt.compare(
      password, user.password_hash
    );
    if (!valid) {
      return res.status(401).json({
        error: true,
        message: 'Credenciales inválidas',
        statusCode: 401,
      });
    }

    const tokenPayload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    return success(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    }, 'Inicio de sesión exitoso');
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({
        error: true,
        message: 'Refresh token requerido',
        statusCode: 401,
      });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.is_active) {
      return res.status(401).json({
        error: true,
        message: 'Usuario no válido',
        statusCode: 401,
      });
    }

    const tokenPayload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);

    return success(res, { accessToken }, 'Token renovado');
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: 'Refresh token inválido o expirado',
      statusCode: 401,
    });
  }
};

const logout = async (_req, res, _next) => {
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  return success(res, null, 'Sesión cerrada');
};

module.exports = { register, login, refresh, logout };
