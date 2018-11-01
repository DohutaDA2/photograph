import moment from "moment";

const checkValidityLogin = (name, value, rules) => {
  let isValid = true;
  let errorMessage = [];
  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
    if (!isValid) errorMessage.push("Bắt buộc phải có " + name.toUpperCase());
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
    if (!isValid)
      errorMessage.push(
        name.toUpperCase() + " phải có ít nhất " + rules.minLength + " ký tự"
      );
  }

  if (rules.isEmail) {
    const pattern = /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/;
    isValid = pattern.test(value) && isValid;
    if (
      !isValid &&
      !errorMessage.includes("Nhập sai định dạng " + name.toUpperCase())
    )
      errorMessage.push("Nhập sai định dạng " + name.toUpperCase());
  }

  if (rules.isRequireLetterNumberSymbol) {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    isValid = pattern.test(value) && isValid;
    if (
      !isValid &&
      !errorMessage.includes("Nhập sai định dạng " + name.toUpperCase())
    )
      errorMessage.push("Nhập sai định dạng " + name.toUpperCase());
  }
  return { isValid, errorMessage };
};

const checkValidityForm = (name, value, rules) => {
  let isValid = true;
  let errorMessage = [];

  if (!rules) {
    return { isValid: true, errorMessage: [] };
  }

  if (name === "opendate") {
    if (!value.isValid())
      return {
        isValid: false,
        errorMessage: ["Ngày mở sổ không đúng định dạng"]
      };
    else if (
      value < moment().subtract(12, "month") ||
      value > moment().add(1, "week")
    )
      return {
        isValid: false,
        errorMessage: ["Ngày mở sổ nằm ngoài khoản cho phép"]
      };
    else return { isValid: true, errorMessage: [] };
  }

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
    if (!isValid) errorMessage.push("Bắt buộc phải có " + name.toUpperCase());
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
    if (!isValid)
      errorMessage.push(
        name.toUpperCase() + " phải có ít nhất " + rules.minLength + " ký tự"
      );
  }

  if (rules.isGreaterThan0) {
    isValid = value > 0 && isValid;
    if (!isValid)
      errorMessage.push(
        (name === "interestRate" ? "Lãi suất" : "Tiền gốc") + " phải lớn hơn 0."
      );
  }

  return { isValid, errorMessage };
};

export { checkValidityLogin, checkValidityForm };
