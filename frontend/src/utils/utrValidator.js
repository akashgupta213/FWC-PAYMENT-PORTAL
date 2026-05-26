// Standard Indian IMPS/NEFT UTR — exactly 12 digits
export const UTR_REGEX = /^[0-9]{12}$/;

export const validateUTR = (value) => {
  if (!value) return 'UTR is required.';
  if (!UTR_REGEX.test(value.trim())) return 'UTR must be exactly 12 digits (e.g. 407612345678).';
  return null;
};