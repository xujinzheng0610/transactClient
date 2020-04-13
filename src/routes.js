import React from 'react';
const ManageDonors = React.lazy(() => import('./views/Pages/Admin/ManageDonors'));
const ManageCharities = React.lazy(() => import('./views/Pages/Admin/ManageCharities'));
const ManageProjects = React.lazy(() => import('./views/Pages/Admin/ManageProjects'));
const ManageActiveProjects = React.lazy(() => import('./views/Pages/Admin/ManageActiveProjects'));


const Cover = React.lazy(() => import('./views/Client/Cover'))
const Project = React.lazy( () => import("./views/Project"))
const NewProject = React.lazy( () => import("./views/Project/NewProject"))
const Profile = React.lazy(() => import('./views/Profile'));
const ProjectDetails = React.lazy( () => import("./views/Project/ProjectDetails"))
const ProjectCharity = React.lazy( () => import("./views/ProjectCharity"))
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/admin/managedonors', name: 'Manage Donors', component: ManageDonors },
  { path: '/admin/managecharities', name: 'Manage Charities', component: ManageCharities },
  { path: '/admin/manageprojects', name: 'Manage Pending Projects', component: ManageProjects },
  { path: '/admin/manageactiveprojects', name: 'Manage Active Projects', component: ManageActiveProjects },

  { path: '/', exact: true, name: 'Home' , component: Cover},
  
  { path: '/home', name: 'PublicHome', component: Cover},
  { path: '/projects', name: 'ProjectList', component: Project},
  { path: '/projectnew/:id', name: 'Modify Project', component: NewProject},
  { path: '/profile/:type/:address', name: 'Profile Page', component: Profile},
  { path: '/projects',exact: true, name: 'Projects', component: Project},
  { path: '/project/:projectId', exact: true, name: 'Project Details', component: ProjectDetails},
  { path: '/project_charity/:projectId',exact:true,name:'Project Charity', component: ProjectCharity }
];

export default routes;
