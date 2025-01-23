import { format } from 'quasar'
// import { jwtDecode } from 'jwt-decode'
import CryptoJS from 'crypto-js';
import axios from 'axios';

class Helper {
  static formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
  }
  static capitalizeFirstLetter(text) {
    if (!text) return '';
    const lowerCaseText = text.toLowerCase();
    return format.capitalize(lowerCaseText);
  }
  static getImageUrl(imagePath) {
    try {
        // Check if imagePath is an object and extract imageUrl
        if (imagePath && typeof imagePath === 'object' && typeof imagePath.imageUrl === 'string' && imagePath.imageUrl.startsWith('https://ik.imagekit.io')) {
            return imagePath.imageUrl;
        }
        // Check if imagePath is a valid URL string directly
        if (typeof imagePath === 'string' && imagePath.startsWith('https://ik.imagekit.io')) {
            return imagePath;
        }
        // Handle invalid imagePath or non-string values
        console.error('Invalid image path:', imagePath);
        return 'https://ik.imagekit.io/default.jpg'; // Fallback image
    } catch (error) {
        console.error('Error generating image URL:', error);
        return 'https://ik.imagekit.io/default.jpg'; // Default fallback image
    }
  }
  static getDocumentUrl(documentPath) {
    try {
        // Check if documentPath is an object and extract documentUrl
        if (documentPath && typeof documentPath === 'object' && typeof documentPath.documentUrl === 'string' && documentPath.documentUrl.startsWith('https://ik.imagekit.io')) {
            return documentPath.documentUrl;
        }
        // Check if documentPath is a valid URL string directly
        if (typeof documentPath === 'string' && documentPath.startsWith('https://ik.imagekit.io')) {
            return documentPath;
        }
        // Handle invalid documentPath or non-string values
        console.error('Invalid document path:', documentPath);
        return 'https://ik.imagekit.io/default-document.pdf'; // Fallback document
    } catch (error) {
        console.error('Error generating document URL:', error);
        return 'https://ik.imagekit.io/default-document.pdf'; // Default fallback document
    }
  }
  // Validation Functions
  static validateText(text) {
    const textPattern = /^[A-Z][a-z]{4,}$/
    return textPattern.test(text)
  }
  static validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }
  static validatePhone(phone) {
    const phonePattern = /^\d{10}$/
    return phonePattern.test(phone)
  }
  static validateUsername(username) {
    const usernamePattern = /^[a-zA-Z0-9]{3,15}$/;
    return usernamePattern.test(username);
  }
  static validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(password);
  }
  // Function to check if the cookie exists on the server-side
  static async checkCookie() {
    try {
        const response = await axios.get(`https://the-web-backend.onrender.com/check-token`, { withCredentials: true });
        return response.data.exists; // Assuming the server returns { exists: true/false }
    } catch (error) {
        console.error('Error checking token existence:', error);
        return false;
    }
  }
  // Function to get the cookie from the backend
  static async getCookie(name) {
    try {
        if (name === 'token') {
            const response = await axios.get(`https://the-web-backend.onrender.com/get-token`, { withCredentials: true });
            return response.data || null;
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
      await axios.post(`https://the-web-backend.onrender.com/remove-token`, {}, { withCredentials: true });
    } catch (error) {
      console.error(`Error removing cookie ${name}:`, error);
    }
  }
  static beforeRouteEnter(to, from, next) {
    Helper.getCookie('token').then((token) => {
      if (!token) {
        next({ path: '/' }); // Redirect to home if no token
      } else {
        next(); // Proceed to the requested route
      }
    }).catch((error) => {
      console.error('Error fetching token:', error);
      next({ path: '/' }); // Handle the error case
    });
  }
  static beforeRouteEnterUser(to, from, next) {
    Helper.getCookie('token').then((token) => {
      // Check if token exists
      if (!token) {
        next({ path: '/' }); // Redirect to home if no token
      } else {
        next(); // Proceed to the requested route
      }
    }).catch((error) => {
      console.error('Error fetching token:', error);
      next({ path: '/' }); // Redirect in case of error
    });
  }
  static beforeRouteLeave(to, from, next) {
    Helper.getCookie('token').then((token) => {
      // Check if token exists
      if (!token) {
        next(false); // Prevent navigation if no token
      } else {
        next(); // Allow navigation
      }
    }).catch((error) => {
      console.error('Error fetching token:', error);
      next(false); // Prevent navigation in case of error
    });
  }
}
export default Helper
