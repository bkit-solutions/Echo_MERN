import axiosInstance from "./axiosInstance";
import {
  successMessageToastNotificaton,
  errorMessageToastNotificaton,
} from "../../utils/toastNotifications";
import { BASE_URL } from "../../constants";

// REGISTER
export function registerUser(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosInstance.post(`/auth/register`, {
        email,
        password,
      });

      if (response.data.success) {
        successMessageToastNotificaton(response.data.message);
      }
      resolve(response.data);
    } catch (error) {
      console.log("error during sign up ", error);

      if (error.response) {
        const errorCode = error.response.status;
        if (errorCode === 409) {
          errorMessageToastNotificaton("User already exists with this email");
        } else {
          errorMessageToastNotificaton("Something went wrong!!");
        }
        return reject(error.response.data.message);
      }
      reject(error.message);
    }
  });
}

// LOGIN
export function loginUser(email, password, navigate) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosInstance.post(`/auth/login`, {
        email,
        password,
      });

      console.log({ response });

      if (response.data.success) {
        successMessageToastNotificaton(response.data.message);
        navigate("/");
      }

      resolve(response.data);
    } catch (error) {
      console.log("Error while login", { error });

      if (error.response) {
        const errorCode = error.response.status;

        if (errorCode === 401) {
          errorMessageToastNotificaton("Invalid Credentials");
        } else {
          errorMessageToastNotificaton("Something went wrong!!");
        }
        return reject(error.response.data.message);
      }

      reject(error.message);
    }
  });
}

// LOGOUT
export function logoutUser() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosInstance.post(`/auth/logout`);

      if (response.data.success) {
        successMessageToastNotificaton(response.data.message);
      }

      resolve(response.data);
    } catch (error) {
      if (error.response) {
        errorMessageToastNotificaton("Something went wrong!!");
        return reject(error.response.data.message);
      }
      reject(error.message);
    }
  });
}

// RESET PASSWORD REQUEST
export function resetPasswordRequest(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosInstance.post(
        `/auth/reset-password-request`,
        { email }
      );

      if (response.data.success) {
        successMessageToastNotificaton("Mail Sent !! ");
      }

      resolve(response.data);
    } catch (error) {
      console.log("error during generating password reset request ", error);

      if (error.response?.data?.statusCode === 400) {
        errorMessageToastNotificaton("User not found");
      } else {
        errorMessageToastNotificaton("Something went wrong!");
      }
      reject(error);
    }
  });
}

// RESET PASSWORD
export function resetPassword({ password, token, email }) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosInstance.post(`/auth/reset-password`, {
        password,
        token,
        email,
      });

      console.log({ response });

      if (response.data.success) {
        successMessageToastNotificaton("Password Updated !! ");
      }

      resolve(response.data);
    } catch (error) {
      console.log("error during password reset", error);

      if (error.response?.data?.statusCode === 401) {
        errorMessageToastNotificaton("Token Invalid");
      } else {
        errorMessageToastNotificaton("Something went wrong");
      }

      reject(error);
    }
  });
}
