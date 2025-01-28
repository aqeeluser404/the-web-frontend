import axiosInstance from "./axiosInstance"
import Logger from "./Logger"

class EmailService {
  static async verifyEmail(token) {
    const ENDPOINT = '/verify-email'
    try {
      const response = await axiosInstance.get(ENDPOINT, {
        params: { token }
      })
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async resendVerificationEmail(email) {
    const ENDPOINT = '/resend-verification-email'
    try {
      const response = await axiosInstance.post(ENDPOINT, { email })
      return response.data
    } catch (error) {
      Logger.error('Error resending verification email: ', error.message);

    }
  }
  static async ForgotPassword(email) {
    const ENDPOINT = '/forgot-password'
    try {
      const response = await axiosInstance.post(ENDPOINT, { email })
      return response.data
    } catch (error) {
      Logger.error('Error resetting password: ', error.message)
    }
  }
  static async ResetPassword(token, password) {
    const ENDPOINT = '/reset-password'
    try {
      const response = await axiosInstance.post(ENDPOINT, { token, password } )
      return response.data
    } catch (error) {
      Logger.error('Error resetting password: ', error.message)
    }
  }
  static async GetInContact(userContact, message) {
    const ENDPOINT = '/contact'
    try {
      const response = await axiosInstance.post(ENDPOINT, { userContact, message } )
      return response.data
    } catch (error) {
      Logger.error('Error sending message: ', error.message)
    }
  }
}
export default EmailService
