const { User } = require('../models');
const { success, successWithMeta } = require('../utils/response');

const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
    });
    return success(res, user, 'Perfil obtenido');
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByPk(req.user.id);

    if (email && email !== user.email) {
      const existing = await User.findOne({
        where: { email },
      });
      if (existing) {
        return res.status(409).json({
          error: true,
          message: 'El email ya está en uso',
          statusCode: 409,
        });
      }
    }

    await user.update({ name, email });

    const updated = user.toJSON();
    delete updated.password_hash;

    return success(res, updated, 'Perfil actualizado');
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password_hash'] },
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['created_at', 'DESC']],
    });

    return successWithMeta(
      res,
      rows,
      {
        total: count,
        page: parseInt(page, 10),
        totalPages: Math.ceil(count / limit),
      },
      'Usuarios obtenidos'
    );
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Usuario no encontrado',
        statusCode: 404,
      });
    }

    const { is_active } = req.body;
    await user.update({ is_active: is_active ? 1 : 0 });

    const updated = user.toJSON();
    delete updated.password_hash;

    return success(
      res,
      updated,
      is_active ? 'Usuario activado' : 'Usuario desactivado'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe, updateMe, getUsers, updateUserStatus };
