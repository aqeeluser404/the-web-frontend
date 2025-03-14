import axiosInstance from "./axiosInstance"
import Logger from "./Logger"

class RentalService {
  static async createRental(rentalDetails) {
    const ENDPOINT = "/rentals"
    try {
      const response = await axiosInstance.post(ENDPOINT, rentalDetails)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findRentalById(rentalId) {
    const ENDPOINT = `/rentals/${rentalId}`
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findAllRentals() {
    const ENDPOINT = "/admin/rentals"
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findMyRentals(userId) {
    const ENDPOINT = `/users/${userId}/rentals`
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async deleteRental(rentalId) {
    const ENDPOINT = `/rentals/${rentalId}`
    try {
      const response = await axiosInstance.delete(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  }
  static async updateRental(rentalId, rentalDetails) {
    const ENDPOINT = `/admin/rentals/${rentalId}`
    try {
      const response = await axiosInstance.put(ENDPOINT, rentalDetails)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async verifyAndSavePayer(rentalId, payerData) {
    const ENDPOINT = `/rentals/${rentalId}/payer`
    try {
      const response = await axiosInstance.put(ENDPOINT, payerData)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async endRental(rentalId) {
    const ENDPOINT = `/admin/rentals/${rentalId}/end`
    try {
      const response = await axiosInstance.put(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  }
}

export default RentalService
