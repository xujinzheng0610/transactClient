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

export function donorProfile(address){
  return client.get("/getDonorDetails", {
    params: {
      donorAddress: address
    }
  })
}

export function donorUpdate(data){
  return client.post('/updateDonor',data)
}

export function getProjectByDonor(address){
  return client.get("/getProjectsByDonor", {
    params: {
      donorAddress: address
    }
  })
}


export function charityProfile(address){
  return client.get("/getCharityDetails", {
    params: {
      charityAddress: address
    }
  })
}

export function charityUpdate(data){
  return client.post('/updateOrganization',data)
}

export function getProjectByCharity(address){
  return client.get("/getProjectsByOrganization", {
    params: {
      charityAddress: address
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

export function pendingDonorRetrieval(){
  return client.get("/getAllPendingDonors")
}

export function pendingCharityRetrieval(){
  return client.get("/getAllPendingOrganizations")
}

export function charityApproval(data){
  return client.post('/approveOrganization',data)
}

export function charityReject(data){
  return client.post('/rejectOrganization',data)
}

export function donorApproval(data){
  return client.post('/approveDonor',data)
}

export function donorReject(data){
  return client.post('/rejectDonor', data)
}


