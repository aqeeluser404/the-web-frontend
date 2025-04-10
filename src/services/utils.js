import { format } from 'quasar'
import axios from 'axios'
import UserService from './UserService'
import UnitService from './UnitService';
import CryptoJS from 'crypto-js';

class Helper {

  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // FORMATTING FUNCTIONS
  static formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
  }
  static formatTime(dateString) {
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleTimeString('en-GB', options);
  }
  static capitalizeFirstLetter(text) {
    if (!text) return '';
    const lowerCaseText = text.toLowerCase();
    return format.capitalize(lowerCaseText);
  }
  static sortByProperty(array, property, order = 'asc') {
    if (!array || !Array.isArray(array)) return [];
    return array.slice().sort((a, b) => {
      const valueA = a[property]
      const valueB = b[property]
      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    })
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // GETTING DATA FUNCTIONS
  // static getImageUrl(imagePath) {
  //   try {
  //       const baseUrl = 'https://the-web.co.za/get-file.php?file='; // Update to point to the public endpoint
  //       if (imagePath && typeof imagePath === 'object' && typeof imagePath.imageUrl === 'string') {
  //           return `${baseUrl}${encodeURIComponent(imagePath.imageUrl)}`;
  //       }
  //       if (typeof imagePath === 'string') {
  //           return `${baseUrl}${encodeURIComponent(imagePath)}`;
  //       }
  //       console.error('Invalid image path:', imagePath);
  //       return `${baseUrl}default.jpg`; // Default image
  //   } catch (error) {
  //       console.error('Error generating image URL:', error);
  //       return `${baseUrl}default.jpg`; // Default image
  //   }
  // }
  // static getDocumentUrl(documentPath) {
  //   try {
  //       const baseUrl = 'https://the-web.co.za/get-file.php?file='; // Update to point to the public endpoint
  //       if (documentPath && typeof documentPath === 'object' && typeof documentPath.documentUrl === 'string') {
  //           return `${baseUrl}${encodeURIComponent(documentPath.documentUrl)}`;
  //       }
  //       if (typeof documentPath === 'string') {
  //           return `${baseUrl}${encodeURIComponent(documentPath)}`;
  //       }
  //       console.error('Invalid document path:', documentPath);
  //       return `${baseUrl}default-document.pdf`; // Default document
  //   } catch (error) {
  //       console.error('Error generating document URL:', error);
  //       return `${baseUrl}default-document.pdf`; // Default document
  //   }
  // }
  static getImageUrl(imagePath) {
    try {
      if (imagePath && typeof imagePath === 'object' && typeof imagePath.imageUrl === 'string' && imagePath.imageUrl.startsWith('https://ik.imagekit.io')) {
        return imagePath.imageUrl;
      }
      if (typeof imagePath === 'string' && imagePath.startsWith('https://ik.imagekit.io')) {
        return imagePath;
      }
      console.error('Invalid image path:', imagePath);
      return 'https://ik.imagekit.io/default.jpg';
    } catch (error) {
      console.error('Error generating image URL:', error);
      return 'https://ik.imagekit.io/default.jpg';
    }
  }
  static getDocumentUrl(documentPath) {
    try {
      if (documentPath && typeof documentPath === 'object' && typeof documentPath.documentUrl === 'string' && documentPath.documentUrl.startsWith('https://ik.imagekit.io')) {
        return documentPath.documentUrl;
      }
      if (typeof documentPath === 'string' && documentPath.startsWith('https://ik.imagekit.io')) {
        return documentPath;
      }
      console.error('Invalid document path:', documentPath);
      return 'https://ik.imagekit.io/default-document.pdf';
    } catch (error) {
      console.error('Error generating document URL:', error);
      return 'https://ik.imagekit.io/default-document.pdf';
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // VALIDATION FUNCTION
  static validateText(text) {
    const textPattern = /^[A-Z][a-z]{4,}$/
    return textPattern.test(text)
  }
  static validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24}$/
    return emailPattern.test(email)
  }
  static validatePhone(phone) {
    const phonePattern = /^\d{10,15}$/;
    return phonePattern.test(phone);
  }
  static validateUsername(username) {
    const usernamePattern = /^[a-zA-Z0-9-_]{3,15}$/;
    return usernamePattern.test(username);
  }
  static validatePassword(password) {
    // Updated regular expression explanation:
    // ^: Start of string
    // (?=.*[a-z]): At least one lowercase letter
    // (?=.*[A-Z]): At least one uppercase letter
    // (?=.*\d): At least one numeric digit
    // (?=.*[@$!%*?&]): At least one special character
    // [A-Za-z\d@$!%*?&]{8,}: Minimum of 8 characters in total
    // $: End of string
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/;

    // Validate the password using the updated pattern
    return passwordPattern.test(password);
  }



  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // COOKIE SECURITY FUNCTIONS
  static async checkCookie() {
    try {
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/check-token`, { withCredentials: true });
      // const response = await axios.get(`https://the-web-backend.onrender.com/check-token`, { withCredentials: true });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking token existence:', error);
      return false;
    }
  }
  static async getCookie(name) {
    try {
      if (name === 'token') {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/get-token`, { withCredentials: true });
        // const response = await axios.get(`https://the-web-backend.onrender.com/get-token`, { withCredentials: true });
        return response.data.token || response.data || null;
      } else {
        console.log(`Cookie ${name} not found`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching token from backend:', error);
      return null;
    }
  }
  static async removeCookie(name) {
    try {
      await axios.post(`${process.env.VUE_APP_API_BASE_URL}/remove-token`, {}, { withCredentials: true });
      // await axios.post(`https://the-web-backend.onrender.com/remove-token`, {}, { withCredentials: true });
    } catch (error) {
      console.error(`Error removing cookie ${name}:`, error);
    }
  }

  // DATA RETRIEVAL
  static async fetchUserDetails() {
    try {
      const response = await UserService.FindUserByToken()
      return await UserService.findUserById(response._id)
    } catch (error) {
      throw error
    }
  }

  static adminRentalDetails(id, router) {
    if (!id) {
      Logger.error("Invalid Rental ID");
      return;
    }
    try {
      const encyptedId = CryptoJS.AES.encrypt(id.toString(), 'secret-key').toString();
      router.push(`/admin/rentals/view/${encodeURIComponent(encyptedId)}`)
    } catch (error) {
      Logger.error(error)
    }
  }
  static adminUserDetails(id, router) {
    if (!id) {
      Logger.error("Invalid User ID");
      return;
    }
    try {
      const encyptedId = CryptoJS.AES.encrypt(id.toString(), 'secret-key').toString();
      router.push(`/admin/users/view/${encodeURIComponent(encyptedId)}`)
    } catch (error) {
      Logger.error(error)
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // AUTHENTICATED ROUTE FUNCTIONS

  static async beforeRouteEnterUser(to, from, next) {
    try {
      const isLoggedIn = await Helper.checkCookie();
      if (!isLoggedIn) {
        next({ path: '/' });
      } else {
        next();
      }
    } catch (error) {
      console.error('Error fetching token or user details:', error);
      next({ path: '/' });
    }
  }
  static async beforeRouteEnterAdmin(to, from, next) {
    try {
      const isLoggedIn = await Helper.checkCookie();
      if (!isLoggedIn) {
        next({ path: '/' });
      } else {
        const user = await UserService.FindUserByToken()
        if (user && user.userType === 'admin') {
          next();
        } else {
          next({ path: '/' });
        }
      }
    } catch (error) {
      console.error('Error fetching token or user details:', error);
      next({ path: '/' });
    }
  }
  static async beforeRouteLeaveUser(to, from, next) {
    try {
      const isLoggedIn = await Helper.checkCookie();
      if (!isLoggedIn) {
        next(false); // Prevent navigation if no token
      } else {
        next(); // Allow navigation if token exists
      }
    } catch (error) {
      console.error('Error fetching token or user details:', error);
      next(false);
    }
  }
}
export default Helper
