import axiosInstance from 'src/services/api/axiosInstance'
import Logger from 'src/services/helper/Logger'

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
  static async createUser(user) {
    const ENDPOINT = "/admin/users"
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
  static async validateSignerToken(userId, role, token) {
    try {
      const response = await axiosInstance.post('/auth/validate-signer', { userId, role, token });
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  }

  static async verifySignerEmail(data) {
    try {
      const response = await axiosInstance.post('/auth/verify-signer-email', data);
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      return { valid: false, message: 'Verification failed' };
    }
  }
  static async adminLogin(usernameOrEmail) {
    const ENDPOINT = "/auth/admin-login";
    try {
      const response = await axiosInstance.post(ENDPOINT, { username: usernameOrEmail, email: usernameOrEmail })
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  // static async login(usernameOrEmail, password) {
  //   const ENDPOINT = "/auth/login";
  //   try {
  //     const response = await axiosInstance.post(ENDPOINT, { username: usernameOrEmail, email: usernameOrEmail, password })
  //     return response.data
  //   } catch (error) {
  //     Logger.error(error);
  //     throw error.response?.data || { error: "Login failed" };
  //   }
  // }
  // static async verifyOtp(userId, otp) {
  //   const ENDPOINT = "/auth/verify-otp"
  //   try {
  //     const response = await axiosInstance.post(ENDPOINT, {userId, otp})
  //     return response.data
  //   } catch (error) {
  //     Logger.error(error)
  //   }
  // }
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
  static async findUsersByIds(userIds) {
    if (!userIds || userIds.length === 0) {
      return {};
    }

    const ENDPOINT = `/admin/users/batch`;
    try {
      const response = await axiosInstance.post(ENDPOINT, { userIds });
      return response.data;
    } catch (error) {
      Logger.error('Error fetching users by IDs:', error);
      throw error;
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

      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
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

  // user document routes

  static async uploadUserDocs(userId, documents) {
    const ENDPOINT = `/users/${userId}/documents`
    try {
      const response = await axiosInstance.post(ENDPOINT, documents)
      return response
    } catch (error) {
      Logger.error(error)
    }
  }
  static async clearAllUserDocs(userId) {
    const ENDPOINT = `/users/${userId}/documents`
    try {
      const response = await axiosInstance.delete(ENDPOINT)
      return response
    } catch (error) {
      Logger.error(error)
    }
  }
  static async removeUserDoc(userId, fileId) {
    const ENDPOINT = `/users/${userId}/documents/${fileId}`
    try {
      const response = await axiosInstance.delete(ENDPOINT)
      return response
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findDocsUserById(userId) {
    const ENDPOINT = `/docs/users/${userId}`
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      // Logger.error(error)
      throw error
    }
  }
}

export default UserService
