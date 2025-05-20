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
}

export default ExportDataService
