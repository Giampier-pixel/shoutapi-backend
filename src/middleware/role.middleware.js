const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: true,
      message: 'Acceso denegado: se requiere rol de administrador',
      statusCode: 403,
    });
  }
  next();
};

module.exports = { isAdmin };
