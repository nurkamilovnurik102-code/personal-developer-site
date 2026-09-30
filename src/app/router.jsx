import { createBrowserRouter } from 'react-router'
import AppLayout from './AppLayout'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import ProjectDetailPage from '../pages/ProjectDetailPage'
import ProjectsPage from '../pages/ProjectsPage'
import ServicesPage from '../pages/ServicesPage'
import RouteErrorPage from '../pages/RouteErrorPage'
import AdminPage from '../pages/admin/AdminPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, Component: HomePage },
      { path: 'services', Component: ServicesPage },
      { path: 'projects', Component: ProjectsPage },
      { path: 'projects/:projectId', Component: ProjectDetailPage },
      { path: 'about', Component: AboutPage },
      { path: 'contact', Component: ContactPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
  { path: '/admin', Component: AdminPage },
])
