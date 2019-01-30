const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    if (!Validator.isLength(data.text, {min: 10, max: 40})){
        errors.text = 'Post must be between 10 and 40 chars';
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = 'text is invalid';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}