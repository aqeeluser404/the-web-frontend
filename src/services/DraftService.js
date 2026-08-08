import axiosInstance from 'src/services/api/axiosInstance'

class DraftService {
  static async saveApplicationDraft(draftData) {
    try {
      const response = await axiosInstance.post('/application/draft', draftData);
      return response.data;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  }
  static async getApplicationDraft(userId) {
    try {
      const response = await axiosInstance.get(`/application/draft/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting draft:', error);
      return null;
    }
  }
  static async getAllApplicationDrafts() {
    try {
      const response = await axiosInstance.get(`/application/drafts`);
      return response.data;
    } catch (error) {
      console.error('Error getting all drafts:', error);
      return null;
    }
  }
}

export default DraftService
