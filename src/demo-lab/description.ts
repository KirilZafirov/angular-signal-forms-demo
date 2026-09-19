export interface FieldDefinition {
  key: string;
  label: string;
  kind: 'text' | 'email' | 'textarea' | 'select';
  options?: {value: string; label: string}[]; required: boolean;
}
export interface FormDefinition {
  fields: FieldDefinition[];
}
// Deliberately bounded offline interpreter. No generated code is executed.
const catalog = [
  ['name', 'Full name', 'text', /\b(?:full name|name)\b/i],
  ['email', 'Email', 'email', /\bemail(?: address)?\b/i],
  ['company', 'Company', 'text', /\bcompany\b/i],
  ['phone', 'Phone', 'text', /\bphone(?: number)?\b/i],
  ['city', 'City', 'text', /\bcity\b/i],
  ['notes', 'Notes', 'textarea', /\b(?:notes|message|comments)\b/i],
] as const;
export function interpretDescription(text: string): FormDefinition {
  if (!text.trim()) throw new Error('Describe the fields you want first.');
  if (text.length > 1200) throw new Error('Keep the description under 1,200 characters.');
  const clauses = text.split(/[,;.\n]|\band\b/i);
  const fields: FieldDefinition[] = [];
  for (const [key, label, kind, pattern] of catalog) {
    const matches = clauses.filter((c) => pattern.test(c));
    if (!matches.length) continue;
    const optional = matches.some((c) => /\boptional\b/i.test(c));
    fields.push({ key, label, kind, required: !optional });
  }
  if (!fields.length)
    throw new Error('No supported fields found. Try name, email, company, phone, city or notes.');
  return { fields };
}
