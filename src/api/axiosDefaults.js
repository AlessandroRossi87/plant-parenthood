import axios from 'axios';

axios.defaults.baseURL = 'https://plant-parenthood-pp5-ac00fe42de7c.herokuapp.com/';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;