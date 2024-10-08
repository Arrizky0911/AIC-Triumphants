import { format, parseISO } from "date-fns";
const formatDate = (date) => {
  const parseDate = parseISO(date);
  const formattedDate = format(parseDate, "EEEE dd/MM/yyy");

  return formattedDate;
};

export default { formatDate };
