import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newPersonObject) => {
  return axios.post(baseUrl, newPersonObject);
};

const deletePerson = (personId) => {
  return axios.delete(`${baseUrl}/${personId}`);
};

export default { getAll, create, deletePerson };
