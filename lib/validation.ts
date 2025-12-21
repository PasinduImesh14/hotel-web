export function ensureNonEmptyString(value: string | undefined | null, name = 'value') {
  if (!value || !value.toString().trim()) {
    throw new Error(`${name} is required and cannot be empty`);
  }
  return value.toString();
}
