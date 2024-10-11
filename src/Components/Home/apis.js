import axios from "axios";
import { getHeaderWithToken } from "../utils";
import { baseUrl } from "../Auth/constants";

export const fetchList = async () => {
  try {
    const res = await axios.get(`${baseUrl}/list`, {
      headers: getHeaderWithToken(),
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const createList = async (longLatData) => {
  try {
    const res = await axios.post(
      `${baseUrl}/upload`,
      { longlat: longLatData },
      {
        headers: getHeaderWithToken(),
      }
    );
    return res;
  } catch (error) {
    return error;
  }
};

export const updateList = async (id, longLatData) => {
  try {
    const res = await axios.post(
      `${baseUrl}/update/${id}`,
      { longlat: longLatData },
      {
        headers: getHeaderWithToken(),
      }
    );
    return res;
  } catch (error) {
    return error;
  }
};
