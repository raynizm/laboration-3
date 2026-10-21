import FieldErrors from './FieldErrors.jsx'
import inputClassName from './inputClassName.js'

function TextField({ label, name, type = 'text', value, onChange, errors }) {
  return (
    <label className="form-label w-100">
      {label}
      <input
        className={inputClassName(errors)}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
      <FieldErrors errors={errors} />
    </label>
  )
}

export default TextField
