import axios from "axios";

export const handleApiError = (error: any, message: string) => {
  if (axios.isAxiosError(error) && error.response) {
    console.error(message, error.response.data.error);
  } else {
    console.error(message, error);
  }
};
