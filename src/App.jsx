import './App.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import AppLayout from './layouts/app-layout';
import LandingPage from './pages/landing';
import Onboarding from './pages/onboarding';
import JobListing from './pages/job-listing';
import PostJob from './pages/post-job';
import SavedJobs from './pages/saved-job';
import MyJobs from './pages/my-jobs';
import { ThemeProvider } from './components/theme-provide';
import ProtectedRoute from './components/protected-route';
import JobPage from './pages/job';


const router = createBrowserRouter([
  {
    element:<AppLayout/>,
    children:[
      {
        path:"/",
        element:<LandingPage/>,
      },
      {
        path:"/onboarding",
        element:(<ProtectedRoute>
          <Onboarding/> 
          </ProtectedRoute>
          ),
      },
      {
        path:"/jobs",
        element:(<ProtectedRoute>
          <JobListing/> 
          </ProtectedRoute>
          ),
      },
      {
        path:"/job/:id",
        element:(<ProtectedRoute>
          <JobPage/>
          </ProtectedRoute>
          ), 
      },
      {
        path:"/postjob",
        element:(<ProtectedRoute>
          <PostJob/>
          </ProtectedRoute>
          ),    
      },
      {
        path:"/savedjobs",
        element:(<ProtectedRoute>
          <SavedJobs/>
          </ProtectedRoute>
          ),
      },
      {
        path:"/myjobs",
        element:(<ProtectedRoute>
          <MyJobs/>
          </ProtectedRoute>
        ),    
      },
    ],
  },
]);

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <RouterProvider router = {router} />
    </ThemeProvider>
  );
}

export default App;
