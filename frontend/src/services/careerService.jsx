import axios from 'axios';

const API_URL = '/api/careers/';

// Get all careers
const getCareers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get single career by ID
const getCareerById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

const careerService = {
  getCareers,
  getCareerById,
};

export default careerService;