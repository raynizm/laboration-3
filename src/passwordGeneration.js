import { PasswordGenerator } from 'laboration-2'

const SIMPLE_PASSWORD_LENGTH = 8
const STRONG_PASSWORD_LENGTH = 18
const STRONG_PASSWORD_GROUP_SIZE = 6

const generator = new PasswordGenerator()

export function generateSimplePassword() {
  return generator.generate(SIMPLE_PASSWORD_LENGTH)
}

/** A longer password split into dash-separated groups. */
export function generateStrongPassword() {
  return generator.generate(STRONG_PASSWORD_LENGTH, {
    pattern: true,
    groupSize: STRONG_PASSWORD_GROUP_SIZE,
  })
}
