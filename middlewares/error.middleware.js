export default function errorMiddleware(err, req, res, next) {
  console.error(err); 

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found';
  }

  if (err.code === 11000) {
    statusCode = 400;
    const fields = err.keyValue ? Object.keys(err.keyValue).join(', ') : 'field';
    message = `Duplicate value for ${fields}`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const msgs = Object.values(err.errors || {}).map(e => e.message);
    message = msgs.length ? msgs.join(', ') : 'Validation failed';
  }

  const payload = { success: false, message };
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}
