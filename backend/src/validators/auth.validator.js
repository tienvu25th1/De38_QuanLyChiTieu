const { body } = require('express-validator');

const registerValidator = [
  body('username')
    .isString()
    .withMessage('username must be a string.')
    .bail()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('username must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('username may contain letters, numbers, dot, underscore, and hyphen.'),
  body('full_name')
    .isString()
    .withMessage('full_name must be a string.')
    .bail()
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage('full_name is required and must be at most 150 characters.'),
  body('email')
    .isString()
    .withMessage('email must be a string.')
    .bail()
    .trim()
    .isEmail()
    .withMessage('email must be a valid email address.')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('password must be a string.')
    .bail()
    .isLength({ min: 8, max: 72 })
    .withMessage('password must be between 8 and 72 characters.')
    .custom((password) => Buffer.byteLength(password, 'utf8') <= 72)
    .withMessage('password must not exceed 72 UTF-8 bytes.'),
  body('avatar')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 2048 })
    .withMessage('avatar must be a string of at most 2048 characters.'),
];

const loginValidator = [
  body('email')
    .isString()
    .withMessage('email must be a string.')
    .bail()
    .trim()
    .isEmail()
    .withMessage('email must be a valid email address.')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('password must be a string.')
    .bail()
    .notEmpty()
    .withMessage('password is required.')
    .custom((password) => Buffer.byteLength(password, 'utf8') <= 72)
    .withMessage('password must not exceed 72 UTF-8 bytes.'),
];

module.exports = { registerValidator, loginValidator };