export const FormatPhoneNumber = (phone) => {
  if (!phone) return "";
  // Only keep numbers
  const cleaned = phone.toString().replace(/[^\d]/g, "");

  if (cleaned.length !== 10) return cleaned;

  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};
