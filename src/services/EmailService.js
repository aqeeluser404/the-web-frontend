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
  static async SendUserRequest(userId, message) {
    const ENDPOINT = `/user-request/${userId}`
    try {
      const response = await axiosInstance.post(ENDPOINT, message )
      return response.data
    } catch (error) {
      Logger.error('Error sending message: ', error.message)
    }
  }
  static async ApprovedRental(userId, unitId, rentalId) {
    const ENDPOINT = '/approved-rental'
    try {
      const response = await axiosInstance.post(ENDPOINT, { userId, unitId, rentalId})
      return response.data
    } catch (error) {
      Logger.error('Error sending message: ', error.message)
    }
  }
  static async RentalApplicationEmail(userId) {
    const ENDPOINT = '/create-rental-application'
    try {
      const response = await axiosInstance.post(ENDPOINT, { userId })
      return response.data
    } catch (error) {
      Logger.error('Error sending message: ', error.message)
    }
  }
  static async RentalApplicationToUserEmail(userId) {
    const ENDPOINT = '/create-rental-to-user-application'
    try {
      const response = await axiosInstance.post(ENDPOINT, { userId })
      return response.data
    } catch (error) {
      Logger.error('Error sending message: ', error.message)
    }
  }
  static async DocumentUploadToUserEmail(userId) {
    const ENDPOINT = '/document-upload-to-user-email'
    try {
      const response = await axiosInstance.post(ENDPOINT, { userId })
      return response.data
    } catch (error) {
      Logger.error('Error sending message: ', error.message)
    }
  }
  static async DocumentUploadEmail(userId) {
    const ENDPOINT = '/document-upload-email'
    try {
      const response = await axiosInstance.post(ENDPOINT, { userId })
      return response.data
    } catch (error) {
      Logger.error('Error sending message: ', error.message)
    }
  }

  // PHP VERSION
  static async RentalActionReminder(userId, message) {
    const ENDPOINT = '/rental-action-reminder'
    try {
      const response = await axiosInstance.post(ENDPOINT, { userId, message})
      return response.data
    } catch (error) {
      Logger.error('Error sending message: ', error.message)
    }
  }
  static async RejectedRental(userId, message) {
    const ENDPOINT = '/rejected-rental'
    try {
      const response = await axiosInstance.post(ENDPOINT, { userId, message})
      return response.data
    } catch (error) {
      Logger.error('Error sending message: ', error.message)
    }
  }
  static async SendExtendedDate(userId, message) {
    const ENDPOINT = `/extended-date/${userId}`
    try {
      const response = await axiosInstance.post(ENDPOINT, message )
      return response.data
    } catch (error) {
      Logger.error('Error sending message: ', error.message)
    }
  }
  // PHP VERSION
  static async SendVendorEmail(userId, callLogId) {
    const ENDPOINT = '/send-vendor-email'
    try {
      const response = await axiosInstance.post(ENDPOINT, { userId, callLogId })
      return response.data
    } catch (error) {
      Logger.error('Error sending message: ', error.message)
    }
  }
}
export default EmailService
