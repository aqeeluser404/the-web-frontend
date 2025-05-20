import axiosInstance from "./axiosInstance"
import Logger from "./Logger"

class UnitService {
  static async createUnit(unitDetails) {
    const ENDPOINT = "/admin/units"
    try {
      const response = await axiosInstance.post(ENDPOINT, unitDetails)
      return response.data
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
  // static async updateUnit(unitId, unitDetails) {
  //   const ENDPOINT = `/admin/units/${unitId}`
  //   try {
  //     const response = await axiosInstance.put(ENDPOINT, unitDetails)
  //     return response
  //   } catch (error) {
  //     Logger.error(error);
  //   }
  // }
  // PHP VERSION
  static async updateUnit(unitId, formData) {
    const ENDPOINT = `/admin/units/${unitId}`;
    try {
      const response = await axiosInstance.post(ENDPOINT, formData);
      return response;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
  static async getAllUnits() {
    const ENDPOINT = "/units"
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error);
    }
  }
  static async getByIdUnit(unitId) {
    const ENDPOINT = `/units/${unitId}`
    try {
      const response = await axiosInstance.get(ENDPOINT)
      return response.data
    } catch (error) {
      Logger.error(error);
    }
  }
  static async deleteUnit(unitId) {
    const ENDPOINT = `/admin/units/${unitId}`
    try {
      const response = await axiosInstance.delete(ENDPOINT)
      return response
    } catch (error) {
      Logger.error(error);
    }
  }
}

export default UnitService
