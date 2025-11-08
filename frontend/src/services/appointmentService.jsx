import axios from 'axios';

const API_URL = '/api/appointments';

// Helper to get auth config
const getConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  // **FIX**: Check if user and token exist
  if (user && user.token) {
    return {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  }
  // Return empty config if no user/token
  return {};
};


// Book a new appointment
export const bookAppointment = async (appointmentData) => {
  const config = getConfig();
  if (!config.headers) {
    throw new Error('You must be logged in to book an appointment.');
  }
  
  const response = await axios.post(API_URL, appointmentData, config);
  return response.data;
};

// Get appointments for the logged-in user
export const getUserAppointments = async () => {
  const config = getConfig();
   if (!config.headers) {
    // Return empty array if user is not logged in, preventing the error
    return [];
  }

  const response = await axios.get(`${API_URL}/myappointments`, config);
  return response.data;
};