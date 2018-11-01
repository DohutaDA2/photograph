import { auth } from "../../firebaseConfig";
import axios from "axios";
const EMAIL_EXISTS = "Email đã được đăng ký trước đó";
const INVALID_PASSWORD = "Sai mật khẩu. Vui lòng nhập lại";

const callServer = (type, requestData) =>
  new Promise((resolve, reject) => {
    const url = type === "si" ? auth.signInURL : auth.signUpURL;
    axios
      .post(url, requestData)
      .then(response => {
        const data = {
          userId: response.data.localId,
          idToken: response.data.idToken
        };
        resolve(data);
      })
      .catch(error => {
        // console.log(error.response.data.error.message)
        let message = error.response.data.error.message;
        if (error.response.data.error.message === "EMAIL_EXISTS")
          message = EMAIL_EXISTS;
        if (error.response.data.error.message === "INVALID_PASSWORD")
          message = INVALID_PASSWORD;

        reject({
          code: error.response.data.error.code,
          message: message
        });
      });
  });

export { callServer };
