import axiosInstance from "./axiosInstance"
import Logger from "./Logger"

class UserService {
  static async register(user) {
    const ENDPOINT = "/auth/register"
    try {
      const response = await axiosInstance.post(ENDPOINT, user)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async login(usernameOrEmail, password) {
    const ENDPOINT = "/auth/login";
    try {
      const response = await axiosInstance.post(ENDPOINT, { username: usernameOrEmail, email: usernameOrEmail, password })
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async logout(userId) {
    const ENDPOINT = `/auth/logout/${userId}`
    try {
      const response = await axiosInstance.post(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error);
    }
  }
  static async findAllUsers() {
    const ENDPOINT = "/admin/users"
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findUsersFrequentlyLoggedIn() {
    const ENDPOINT = "/admin/user/frequent"
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async FindUserByToken() {
    const ENDPOINT = "/users/profile"
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      // Logger.error(error)
      throw error
    }
  }
  static async findUserById(userId) {
    const ENDPOINT = `/users/${userId}`
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      // Logger.error(error)
      throw error
    }
  }
  static async updateUserDetails(userId, user) {
    const ENDPOINT = `/users/${userId}`
    try {
      const response = await axiosInstance.put(ENDPOINT, user);
      return response
    } catch (error) {
      Logger.error(error)
    }
  }
  static async deleteUser(userId) {
    const ENDPOINT = `/admin/users/${userId}`
    try {
      const response = await axiosInstance.delete(ENDPOINT)
      return response
    } catch (error) {
      Logger.error(error)
    }
  }
}

export default UserService
