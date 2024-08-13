import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newPersonObject) => {
  return axios.post("http://localhost:3001/persons", newPersonObject);
};

export default { getAll, create };
