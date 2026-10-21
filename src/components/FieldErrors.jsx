function FieldErrors({ errors }) {
  if (!errors) return null

  return <div className="invalid-feedback d-block">{errors.join(' ')}</div>
}

export default FieldErrors
