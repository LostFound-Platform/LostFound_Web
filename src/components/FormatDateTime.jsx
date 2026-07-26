export const FormatDateTime = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // To display AM/PM
  })
    .format(date)
    .replace(",", " at");
};
