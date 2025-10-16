// PHP CODE
import axiosInstance from "./axiosInstance";
import Logger from "./Logger"

class ExportDataService {
  static async exportData() {
    const ENDPOINT = "/admin/export-data";
    try {
      const response = await axiosInstance.get(ENDPOINT, { responseType: 'blob' }); // Ensure binary response
      return response;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
  static async exportCalllogData() {
    const ENDPOINT = "/admin/export-calllog-data";
    try {
      const response = await axiosInstance.get(ENDPOINT, { responseType: 'blob' }); // Ensure binary response
      return response;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
  static async exportUserData() {
    const ENDPOINT = "/admin/export-user-data";
    try {
      const response = await axiosInstance.get(ENDPOINT, { responseType: 'blob' }); // Ensure binary response
      return response;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
  static async exportUnitData() {
    const ENDPOINT = "/admin/export-unit-data";
    try {
      const response = await axiosInstance.get(ENDPOINT, { responseType: 'blob' }); // Ensure binary response
      return response;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
  static async exportRentalData() {
    const ENDPOINT = "/admin/export-rental-data";
    try {
      const response = await axiosInstance.get(ENDPOINT, { responseType: 'blob' }); // Ensure binary response
      return response;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

}

export default ExportDataService
