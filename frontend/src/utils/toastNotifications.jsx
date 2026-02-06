import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Zoom,
  theme: "light", // matches blue–white SaaS theme
};

export const successMessageToastNotificaton = (message) => {
  return toast.success(message, {
    ...baseConfig,
    style: {
      background: "#ffffff",
      color: "#0f172a",
      borderLeft: "4px solid #2563eb", // blue brand accent
    },
    progressStyle: {
      background: "#2563eb",
    },
  });
};

export const errorMessageToastNotificaton = (
  message = "Something went wrong!"
) => {
  return toast.error(message, {
    ...baseConfig,
    style: {
      background: "#ffffff",
      color: "#0f172a",
      borderLeft: "4px solid #ef4444", // red-500
    },
    progressStyle: {
      background: "#ef4444",
    },
  });
};
