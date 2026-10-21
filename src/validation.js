import Field from 'form-validation/src/Field.js'
import Validation from 'form-validation/src/Validation.js'
import {
  EmailRule,
  LowercaseRule,
  MatchingFieldsRule,
  MinLengthRule,
  RequiredRule,
  UppercaseRule,
} from 'form-validation/src/Rule.js'

const name = new Field('name')
name.addRule(new RequiredRule('Name is required.'))

const email = new Field('email')
email.addRule(new RequiredRule('Email address is required.'))
email.addRule(new EmailRule('Enter a valid email address.'))

const password = new Field('password')
password.addRule(new RequiredRule('Password is required.'))
password.addRule(
  new MinLengthRule(8, 'Password must be at least 8 characters.'),
)
password.addRule(
  new UppercaseRule('Password must contain an uppercase letter.'),
)
password.addRule(new LowercaseRule('Password must contain a lowercase letter.'))

const confirmPassword = new Field('confirmPassword')
confirmPassword.addRule(new RequiredRule('Please confirm the password.'))
confirmPassword.addRule(
  new MatchingFieldsRule('password', 'Passwords do not match.'),
)

const createUserValidation = new Validation()
createUserValidation.addField(name)
createUserValidation.addField(email)
createUserValidation.addField(password)
createUserValidation.addField(confirmPassword)

export default createUserValidation
