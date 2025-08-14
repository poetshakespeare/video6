const API_KEY = '70d3bb8dffde5fda143c391a456c9cdf';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MGQzYmI4ZGZmZGU1ZmRhMTQzYzM5MWE0NTZjOWNkZiIsIm5iZiI6MTcxNzM3MjM0Ny44NDcwMDAxLCJzdWIiOiI2NjVkMDViYmZkOTMxM2QwZDNhMGFjZDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.T9IS5_VKWyjVZqD00jDoC0FpcmsL1sZ-8QzMjiScW04';

export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZE = 'w500';
export const BACKDROP_SIZE = 'w1280';

export const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`
  }
};

export { API_KEY };