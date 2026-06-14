import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import RootLayout from "./components/RootLayout.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import Resources from "./components/Resources.jsx";
import ResourceDetails from "./components/ResourceDetails.jsx";
import UploadResource from "./components/UploadResource.jsx";
import WhiteboardRooms from "./components/WhiteboardRooms.jsx";
import Whiteboard from  "./components/Whiteboard.jsx";
import ChatRoom from "./components/ChatRoom.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "login",
        element: <Login />,
      },

      {
        path: "register",
        element: <Register />,
      },

      {
        path: "dashboard",
        element: <Dashboard />,
      },

      {
        path: "profile",
        element: <Profile />,
      },

      {
        path: "resources",
        element: <Resources />,
      },

      {
        path: "resources/:id",
        element: <ResourceDetails />,
      },

      {
        path: "upload-resource",
        element: <UploadResource />,
      },

      {
        path: "whiteboards",
        element: <WhiteboardRooms />,
      },

      {
        path: "whiteboard/:id",
        element: <Whiteboard />,
      },

      {
        path: "chat/:roomId",
        element: <ChatRoom />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <Toaster
       position="top-right"
        toastOptions={{
          duration: 3000,
        }} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;