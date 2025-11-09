import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { RoomPage } from './pages/RoomPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/room/:roomId',
    element: <RoomPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;