import { EyeIcon, EyeSlashIcon } from './Icons.jsx'
import FieldErrors from './FieldErrors.jsx'
import inputClassName from './inputClassName.js'

function PasswordField({
  value,
  onChange,
  errors,
  visible,
  onToggleVisible,
  onGenerate,
  onGenerateStrong,
}) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-end mb-2">
        <label htmlFor="password" className="form-label mb-0">
          Password
        </label>
        <div className="d-flex flex-wrap justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onGenerate}
          >
            Generate password
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onGenerateStrong}
          >
            Generate strong password
          </button>
        </div>
      </div>
      <div className="input-group">
        <input
          id="password"
          className={inputClassName(errors)}
          type={visible ? 'text' : 'password'}
          name="password"
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={onToggleVisible}
        >
          {visible ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>
      <FieldErrors errors={errors} />
    </div>
  )
}

export default PasswordField
