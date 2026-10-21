import { useState } from 'react'
import {
  generateSimplePassword,
  generateStrongPassword,
} from '../passwordGeneration.js'
import { validateUser } from '../validation.js'
import PasswordField from './PasswordField.jsx'
import TextField from './TextField.jsx'

const EMPTY_FORM = { name: '', email: '', password: '', confirmPassword: '' }

/**
 * @param {Object} props
 * @param {(user: Object) => Promise<boolean>} props.onCreate
 *   Resolves to true if the user was created, so the form knows to clear itself.
 */
function CreateUserForm({ onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [passwordVisible, setPasswordVisible] = useState(false)

  const passwordInputType = passwordVisible ? 'text' : 'password'

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const fillPassword = (password) => {
    setForm((current) => ({
      ...current,
      password,
      confirmPassword: password,
    }))
  }

  const handleClear = () => {
    setForm(EMPTY_FORM)
    setErrors({})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validation = validateUser(form)
    setErrors(validation.errors)
    if (!validation.isValid) return

    const { name, email, password } = form
    const created = await onCreate({ name, email, password })
    if (created) setForm(EMPTY_FORM)
  }

  return (
    <form className="d-grid gap-3" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        errors={errors.name}
      />
      <TextField
        label="Email address"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        errors={errors.email}
      />
      <PasswordField
        value={form.password}
        onChange={handleChange}
        errors={errors.password}
        visible={passwordVisible}
        onToggleVisible={() => setPasswordVisible(!passwordVisible)}
        onGenerate={() => fillPassword(generateSimplePassword())}
        onGenerateStrong={() => fillPassword(generateStrongPassword())}
      />
      <TextField
        label="Confirm password"
        name="confirmPassword"
        type={passwordInputType}
        value={form.confirmPassword}
        onChange={handleChange}
        errors={errors.confirmPassword}
      />
      <div className="d-flex justify-content-between gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClear}
        >
          Clear
        </button>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </div>
    </form>
  )
}

export default CreateUserForm
