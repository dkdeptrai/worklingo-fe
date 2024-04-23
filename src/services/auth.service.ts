// src/services/auth.service.ts
import { UserType } from "../models/UserType";
import axios, { AxiosResponse } from "axios";
const API_URL = "http://localhost:8080/api/v1/auth/";
const USER_API = "http://localhost:8080/api/v1/users/1";
const ALL_USERS_API = "http://localhost:8080/api/v1/users";
class AuthService {
  async login(username: string, password: string) {
    try {
      const response = await fetch(API_URL + "authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password: password }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      if (data) {
        console.log("Login successful", data.access_token);

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return localStorage.getItem("access_token");
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  }

  async logout() {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }

  async register(
    firstname: string,
    lastname: string,
    username: string,
    password: string
  ) {
    try {
      const response = await fetch(API_URL + "register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: firstname,
          lastname: lastname,
          email: username,
          password: password,
          role: "USER",
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      if (data) {
        console.log("Registration successful", data);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return localStorage.getItem("access_token");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async getUserDetails(): Promise<UserType[]> {
    try {
      const response = await fetch(ALL_USERS_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const data = await response.json();
      if (data) {
        console.log("User details fetched successfully", data);
        return data;
      }
    } catch (error) {
      console.error("User details fetch failed:", error);
      throw error;
    }
    return [];
  }

  async getCurrentUser(): Promise<UserType> {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return {} as UserType;
  }
}

export default new AuthService();
