import { LOGIN_URL, LOGOUT_URL } from ".";
import { API_HOST } from "../../../configs"
import axios from "axios";
import {createClient} from '../../../plugins/axios'

export const login = (username, password) => {
  console.log(API_HOST)
  console.log(`${API_HOST}/${LOGIN_URL}`)
  return axios.post(
    `${API_HOST}/${LOGIN_URL}`,
    {username, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const logout_api_call = ( refresh_token ) => {
  return createClient().post(
    LOGOUT_URL,
    { "refresh":refresh_token },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};