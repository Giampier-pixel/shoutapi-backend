const success = (res, data, message = 'OK', statusCode = 200) => {
  return res.status(statusCode).json({
    data,
    message,
  });
};

const successWithMeta = (
  res, data, meta, message = 'OK', statusCode = 200
) => {
  return res.status(statusCode).json({
    data,
    meta,
    message,
  });
};

const error = (
  res,
  message = 'Error interno del servidor',
  statusCode = 500
) => {
  return res.status(statusCode).json({
    error: true,
    message,
    statusCode,
  });
};

module.exports = { success, successWithMeta, error };
