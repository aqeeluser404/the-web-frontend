import axiosInstance from 'src/services/api/axiosInstance'
import Logger from 'src/services/helper/Logger'

class IncidentService {
  static async createIncident(incidentDetails) {
    const ENDPOINT = "/incident"
    try {
      const response = await axiosInstance.post(ENDPOINT, incidentDetails)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findIncidentById(incidentId) {
    const ENDPOINT = `/incident/${incidentId}`
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findAllIncidents() {
    const ENDPOINT = "/incident"
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async updateIncident(incidentId, incidentDetails) {
    const ENDPOINT = `/incident/${incidentId}`
    try {
      const response = await axiosInstance.put(ENDPOINT, incidentDetails)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async deleteIncident(incidentId) {
    const ENDPOINT = `/incident/${incidentId}`
    try {
      const response = await axiosInstance.delete(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  }
}

export default IncidentService
