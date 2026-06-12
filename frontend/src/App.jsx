import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Resources from "./components/Resources";
import ResourceDetails from "./components/ResourceDetails";
import UploadResource from "./components/UploadResource";
import Bookmarks from "./components/Bookmarks";
import Notifications from "./components/Notifications";
import WhiteboardRooms from "./components/WhiteboardRooms";
import Whiteboard from "./components/Whiteboard";
import ChatRoom from "./components/ChatRoom";
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
        path: "bookmarks",
        element: <Bookmarks />,
      },

      {
        path: "notifications",
        element: <Notifications />,
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
  return <RouterProvider router={router} />;
}

export default App;