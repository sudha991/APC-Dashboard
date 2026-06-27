import axios from "axios";

//const BASE_URL = "http://10.0.16.18:8090";
//const BASE_URL = "https://localhost:44381";

const BASE_URL =
  "http://10.0.16.18:8090";

// ========================================
// POWER DATA
// ========================================

export const getPowerData = () => {

  return axios.get(
    `${BASE_URL}/api/power-data`
  );
};

// ========================================
// TREND DATA
// ========================================

export const getTrendData = async (
  tag,
  startDate,
  endDate
) => {
console.log({
  tag,
  startDate,
  endDate
});
  const response = await axios.get(
     `${BASE_URL}/api/trend/history`,
    {
      params: {
        tag,
        startDate,
        endDate
      }
    }
  );

  return response.data;
};
   
