// api.ts
import axios from "axios";
import { Request } from "./interfaces";

const API_URL = "http://127.0.0.1:8080/api";

const getHeader = (token?: string) => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// GET
const get = async (request: Request) => {
  try {
    const response = await axios.get(`${API_URL}${request.route}`, {
      headers: getHeader(request.token),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// POST
const post = async (request: Request) => {
  try {
    const isFormData = request.body instanceof FormData;
    const headers = {
      ...getHeader(request.token),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    console.log(request.body);

    const response = await axios.post(
      `${API_URL}${request.route}`,
      request.body,
      {
        headers,
        responseType: request.responseType || "json",
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// DELETE
const del = async (request: Request) => {
  try {
    const response = await axios.delete(`${API_URL}${request.route}`, {
      headers: getHeader(request.token),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// PUT
const put = async (request: Request) => {
  try {
    const response = await axios.put(
      `${API_URL}${request.route}`,
      request.body,
      {
        headers: getHeader(request.token),
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    console.error(
      `Error: ${error.response.status} - ${error.response.statusText}`
    );
    throw error; // Rethrow the original error
  } else {
    console.error("Unexpected error:", error);
    throw error; // Rethrow the original error
  }
};
export { get, post, del, put };
