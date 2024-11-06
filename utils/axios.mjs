import axios from "axios";
import { logger } from "./logger.mjs";

const axiosCall = async (url) => {
  try {
    return (
      await axios.get(url, {
        timeout: 7000,
      })
    ).data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Ignore 404 errors
      return null; // or any other fallback value
    }
    logger.error(error);
  }
};

export default axiosCall;
