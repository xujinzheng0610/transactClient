var axios = require('axios');

var client = axios.create({
  baseURL: 'http://localhost:5000',
  /* other custom settings */
});

export default client 

export function donorRegister(data){
  return client.post('/registerDonor',data)
}

export function charityRegister(data){
  return client.post('/registerOrganization',data)
}

export function donorLogin(username, password){
  return client.get('/donor/login',{
    params: {
      username: username,
      password: password
    }
  })
}

export function charityLogin(username, password){
  return client.get('/charity/login',{
    params: {
      username: username,
      password: password
    }
  })
}

export function adminLogin(username, password){
  return client.get("/admin/login", {
    params: {
      username: username,
      password: password
    }
  })
}
