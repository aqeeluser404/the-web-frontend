import axiosInstance from 'src/services/api/axiosInstance'
import Logger from './Logger';

class VisitorService {
  static async createVisitor(visitorDetails) {
    const ENDPOINT = "/visitor";
    try {
      const response = await axiosInstance.post(ENDPOINT, visitorDetails);
      return response.data;
    } catch (error) {
      Logger.error(error);
    }
  }

  static async findVisitorById(visitorId) {
    const ENDPOINT = `/visitor/${visitorId}`;
    try {
      const response = await axiosInstance.get(ENDPOINT);
      return response.data;
    } catch (error) {
      Logger.error(error);
    }
  }

  static async findMyVisitors(userId) {
    const ENDPOINT = `/users/${userId}/visitors`;
    try {
      const response = await axiosInstance.get(ENDPOINT);
      return response.data;
    } catch (error) {
      Logger.error(error);
    }
  }

  static async findAllVisitors() {
    const ENDPOINT = "/visitors";
    try {
      const response = await axiosInstance.get(ENDPOINT);
      return response.data;
    } catch (error) {
      Logger.error(error);
    }
  }

  static async updateVisitor(visitorId, visitorDetails) {
    const ENDPOINT = `/visitor/${visitorId}`;
    try {
      const response = await axiosInstance.put(ENDPOINT, visitorDetails);
      return response.data;
    } catch (error) {
      Logger.error(error);
    }
  }

  static async deleteVisitor(visitorId) {
    const ENDPOINT = `/visitor/${visitorId}`;
    try {
      const response = await axiosInstance.delete(ENDPOINT);
      return response.data;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}

export default VisitorService;
