import axios from 'axios';

const API_URL = 'https://localhost:7014/api/Offres'; // adapte si besoin

export function getAllOffres() {
  return axios.get(API_URL);
}

export function createOffre(data) {
  return axios.post(API_URL, data);
}

export function updateOffre(id, data) {
  return axios.put(`${API_URL}/${id}`, data);
}

export function deleteOffre(id) {
  return axios.delete(`${API_URL}/${id}`);
}
