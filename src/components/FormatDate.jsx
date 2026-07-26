export const FormatDate = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};
