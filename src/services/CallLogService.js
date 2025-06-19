import axiosInstance from "./axiosInstance";
import Logger from "./Logger"

class CallLogService {
  static async createCallLog(callLogDetails) {
    const ENDPOINT = "/call-log"
    try {
      const response = await axiosInstance.post(ENDPOINT, callLogDetails)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findCallLogById(callLogId) {
    const ENDPOINT = `/call-log/${callLogId}`
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findMyCallLogs(userId) {
    const ENDPOINT = `/users/${userId}/call-logs`
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async findAllCallLogs() {
    const ENDPOINT = "/call-logs"
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async updateCallLog(callLogId, callLogDetails) {
    const ENDPOINT = `/call-log/${callLogId}`
    try {
      const response = await axiosInstance.put(ENDPOINT, callLogDetails)
      return response.data
    } catch (error) {
      Logger.error(error)
    }
  }
  static async deleteCallLog(callLogId) {
    const ENDPOINT = `/call-log/${callLogId}`
    try {
      const response = await axiosInstance.delete(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  }
}

export default CallLogService
