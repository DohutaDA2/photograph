const formatNum = num => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const toShortDate = date => {
  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
};
export { formatNum, toShortDate };
