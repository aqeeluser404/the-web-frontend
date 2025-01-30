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
  static async deleteRental(rentalId) {
    const ENDPOINT = `admin/rentals/${rentalId}`
    try {
      const response = await axiosInstance.delete(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findMyRentals(userId) {
    const ENDPOINT = `users/${userId}/rentals`
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async deleteRental(rentalId) {
    const ENDPOINT = `rentals/${rentalId}`
    try {
      const response = await axiosInstance.delete(ENDPOINT)
      return response
    } catch (error) {
      Logger.error(error)
    }
  }
}

export default RentalService
