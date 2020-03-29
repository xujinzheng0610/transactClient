var axios = require('axios');

var client = axios.create({
  baseURL: 'http://localhost:5000',
  /* other custom settings */
});

export default client 

export function retrieveAllProjects(){
  return client.get("/retrieveAllProjects")
}

export function retrieveProjectDetails(data){
  return client.get("/retrieveProjectDetails?id="+data)
}

export function retrieveDonorsByProject(data){
  return client.get("/retrieveDonorsByProject?id="+data)
}

export function donorRegister(data){
  return client.post('/registerDonor',data)
}

export function charityRegister(data){
  return client.post('/registerOrganization',data)
}

export function donorLogin(){

}

export function charityLogin(){

}

export function adminLogin(username, password){
  return client.get("/admin/login", {
    params: {
      username: username,
      password: password
    }
  })
}
