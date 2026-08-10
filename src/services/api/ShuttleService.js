import axiosInstance from 'src/services/api/axiosInstance'
import Logger from 'src/services/helper/Logger'

class ShutttleService {
  static async createShuttle(shuttleDetails) {
    const ENDPOINT = "/shuttle"
    try {
      const response = await axiosInstance.post(ENDPOINT, shuttleDetails)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findShuttleById(shuttleId) {
    const ENDPOINT = `/shuttle/${shuttleId}`
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findMyShuttles(userId) {
    const ENDPOINT = `/users/${userId}/shuttles`
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findAllShuttles() {
    const ENDPOINT = "/shuttles"
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async updateShuttle(shuttleId, shuttleDetails) {
    const ENDPOINT = `/shuttle/${shuttleId}`
    try {
      const response = await axiosInstance.put(ENDPOINT, shuttleDetails)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async deleteShuttle(shuttleId) {
    const ENDPOINT = `/shuttle/${shuttleId}`
    try {
      const response = await axiosInstance.delete(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  }
}

export default ShutttleService
