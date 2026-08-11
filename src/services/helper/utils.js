import { format } from 'quasar'
import axios from 'axios'
import UserService from 'src/services/api/UserService'
import UnitService from 'src/services/api/UnitService';
import CryptoJS from 'crypto-js';
import { jwtDecode } from "jwt-decode";

let logoutTimer = null;
import { useRouter } from 'vue-router';

import { showSessionExpired } from 'src/services/components/showSessionExpired';

class Helper {

  // ------------------------------------------------------------------------------------------------------------------------------------------------
  // FORMATTING FUNCTIONS
  static formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
  }

  // static formatDate(dateString) {
  //   if (!dateString) return 'N/A';

  //   const date = new Date(dateString);
  //   if (isNaN(date.getTime())) return 'Invalid Date';

  //   const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  //   const day = date.getUTCDate();
  //   const month = months[date.getUTCMonth()];
  //   const year = date.getUTCFullYear();

  //   return `${day} ${month} ${year}`;
  // }


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
      const valueA = (a[property] ?? '').toString();
      const valueB = (b[property] ?? '').toString();

      // Special handling for unit numbers (with or without dashes)
      if (property === 'unitNumber') {
        // Parse the numbers (e.g., "1-02" becomes [1, 2], "101" becomes [1, 1])
        const parseUnitNumber = (str) => {
          if (str.includes('-')) {
            const [floor, unit] = str.split('-');
            return [parseInt(floor || 0), parseInt(unit || 0)];
          }
          // Handle old format numbers (e.g., 101, 201)
          const num = parseInt(str) || 0;
          const floor = Math.floor(num / 100);
          const unit = num % 100;
          return [floor, unit];
        };

        const [floorA, unitA] = parseUnitNumber(valueA);
        const [floorB, unitB] = parseUnitNumber(valueB);

        // First compare by floor, then by unit number
        if (floorA !== floorB) {
          return order === 'asc' ? floorA - floorB : floorB - floorA;
        }
        return order === 'asc' ? unitA - unitB : unitB - unitA;
      }

      // Default sorting for other properties
      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  static getImageUrl(imagePath) {
    try {
      const webBase = 'https://the-web.co.za/get-file.php?file=';
      const defaultImage = 'images/default.jpg';

      if (imagePath && typeof imagePath === 'object' && imagePath.imageUrl) {
        return Helper.normalizeImagePath(imagePath.imageUrl, webBase, defaultImage);
      }
      if (typeof imagePath === 'string') {
        return Helper.normalizeImagePath(imagePath, webBase, defaultImage);
      }

      console.error('Invalid image path:', imagePath);
      return `${webBase}${encodeURIComponent(defaultImage)}`;
    } catch (error) {
      console.error('Error generating image URL:', error);
      return `${webBase}images/default.jpg`;
    }
  }

  // static getImageUrl(imagePath, width = null) {
  //   try {
  //     const webBase = 'https://the-web.co.za/get-file.php?file=';
  //     const defaultImage = 'images/default.jpg';
  //     let url;

  //     if (imagePath && typeof imagePath === 'object' && imagePath.imageUrl) {
  //       url = Helper.normalizeImagePath(imagePath.imageUrl, webBase, defaultImage);
  //     } else if (typeof imagePath === 'string') {
  //       url = Helper.normalizeImagePath(imagePath, webBase, defaultImage);
  //     } else {
  //       console.error('Invalid image path:', imagePath);
  //       url = `${webBase}${encodeURIComponent(defaultImage)}`;
  //     }

  //     return width ? `${url}&w=${width}` : url;
  //   } catch (error) {
  //     console.error('Error generating image URL:', error);
  //     return `${webBase}images/default.jpg`;
  //   }
  // }

  static normalizeImagePath(path, webBase, defaultPath) {
    if (path.startsWith('http')) {
      return path;
    }
    if (path.startsWith('images/') || path.startsWith('documents/')) {
      return `${webBase}${encodeURIComponent(path)}`;
    }
    return `${webBase}${encodeURIComponent(defaultPath)}`;
  }

  static getDocumentUrl(documentPath) {
    try {
      const webBase = 'https://the-web.co.za/get-file.php?file=';
      const defaultDocument = 'documents/default.pdf';

      if (documentPath && typeof documentPath === 'object' && documentPath.documentUrl) {
        return this.normalizeImagePath(documentPath.documentUrl, webBase, defaultDocument);
      }
      if (typeof documentPath === 'string') {
        return this.normalizeImagePath(documentPath, webBase, defaultDocument);
      }

      console.error('Invalid document path:', documentPath);
      return `${webBase}${encodeURIComponent(defaultDocument)}`;
    } catch (error) {
      console.error('Error generating document URL:', error);
      return `${webBase}documents/default.pdf`;
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
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/;
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
        // console.log(`Cookie ${name} not found`);
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

  // ------------------------------------------------------------------------------------------------------------------------------------------------
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
  static viewRentalDetails(id, router) {
    if (!id) {
      Logger.error("Invalid Rental ID");
      return;
    }
    try {
      const encyptedId = CryptoJS.AES.encrypt(id.toString(), 'secret-key').toString();
      router.push(`/user/applications/view/${encodeURIComponent(encyptedId)}`)
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
    const router = useRouter();
    try {
      const isLoggedIn = await Helper.checkCookie();
      if (!isLoggedIn) {
        // next({ path: '/' });
        next(false);
        showSessionExpired(router);
      } else {
        next();
      }
    } catch (error) {
      console.error('Error fetching token or user details:', error);
      next({ path: '/' });
    }
  }
  static async beforeRouteEnterAdmin(to, from, next) {
    const router = useRouter();
    try {
      const isLoggedIn = await Helper.checkCookie();
      if (!isLoggedIn) {
        next(false); // cancel navigation
        showSessionExpired(router);
      } else {
        const user = await UserService.FindUserByToken();
        if (user && user.userType === 'admin') {
          next(); // allow navigation
        } else {
          next(false);
          Dialog.create({
            title: 'Access denied',
            message: 'You must be an admin to view this page.',
            ok: { label: 'Go to Home', color: 'primary' },
            persistent: true
          }).onOk(() => {
            router.push('/');
          });
        }
      }
    } catch (error) {
      console.error('Error fetching token or user details:', error);
      next(false);
      showSessionExpired(router);
    }
  }
  static async beforeRouteEnterVendor(to, from, next) {
    try {
      const isLoggedIn = await Helper.checkCookie();
      if (!isLoggedIn) {
        next({ path: '/' });
      } else {
        const user = await UserService.FindUserByToken()
        if (user && user.userType === 'vendor') {
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
        next(false);
      } else {
        next();
      }
    } catch (error) {
      console.error('Error fetching token or user details:', error);
      next(false);
    }
  }

  // static async checkLoginStatus(router) {
  //   const isLoggedIn = await Helper.checkCookie();
  //   if (!isLoggedIn)
  //     return null

  //   const token = await this.getCookie("token");
  //   if (!token) {
  //     return this.handleLogout(router);
  //   }

  //   try {
  //     const decoded = jwtDecode(token);
  //     const exp = decoded.exp * 1000;
  //     const timeLeft = exp - Date.now();

  //     if (timeLeft <= 0) {
  //       return this.handleLogout(router);
  //     }

  //     const user = await UserService.FindUserByToken();
  //     if (!user) {
  //       return this.handleLogout(router);
  //     }

  //     // Return user so the router guard can check roles
  //     this.startLogoutTimer(timeLeft, router);
  //     return user;
  //   } catch (err) {
  //     console.error("Error decoding token:", err);
  //     this.handleLogout(router);
  //   }
  // }

  // static startLogoutTimer(duration, router) {
  //   if (logoutTimer) clearTimeout(logoutTimer);

  //   logoutTimer = setTimeout(() => {
  //     console.info("Auto-logging out due to token expiration");
  //     this.handleLogout(router);
  //   }, duration);
  // }

  // static handleLogout(router) {
  //   this.removeCookie("token");

  //   if (logoutTimer) {
  //     clearTimeout(logoutTimer);
  //     logoutTimer = null;
  //   }

  //   router.push("/"); // redirect to home/login
  // }

}
export default Helper
