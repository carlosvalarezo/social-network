const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';

    if(Validator.isEmpty(data.school)){
        errors.school = 'school field is required';
    }
    if(Validator.isEmpty(data.degree)){
        errors.degree = 'degree field is required';
    }

    if(Validator.isEmpty(data.fieldOfStudy)){
        errors.fieldOfStudy = 'fieldOfStudy field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}