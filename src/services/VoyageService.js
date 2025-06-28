import axios from 'axios';

const API_URL = 'https://localhost:7014/api/Voyages'; // url back

export function getAllVoyages() {
  return axios.get(API_URL);
}

export function createVoyage(data) {
  return axios.post(API_URL, data);
}

export function updateVoyage(id, data) {
  return axios.put(`${API_URL}/${id}`, data);
}

export function deleteVoyage(id) {
  return axios.delete(`${API_URL}/${id}`);
}
