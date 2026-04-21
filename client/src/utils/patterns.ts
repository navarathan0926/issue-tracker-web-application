export const passwordPattern = {
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
};
