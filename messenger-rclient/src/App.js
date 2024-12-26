import './App.css';
import Auth, { authLoader } from './pages/authentication/Auth'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Messenger, { conversationLoader } from './pages/messenger/Messenger';
import LoginForm, { LoginAction } from './pages/authentication/loginForm/LoginForm';
import RegisterForm, { RegisterAction } from './pages/authentication/registerForm/RegisterForm';
import { messengerLoader } from './pages/messenger/Messenger'
import EmptyChat from './pages/messenger/chat/emptyChat/EmptyChat';
import Chat from './pages/messenger/chat/chat/Chat'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Messenger />,
    loader: messengerLoader,
    children: [
      {
        index: true,
        element: <EmptyChat />
      }, 
      {
        path: ':conversationId',
        loader: conversationLoader,
        element: <Chat />
      }
    ] 
  }, 
  {
    path: '/auth',
    element: <Auth />,
    children: [
      {
        path: 'login',
        element: <LoginForm />,
        action: LoginAction
      }, 
      {
        path: 'register',
        element: <RegisterForm />,
        action: RegisterAction
      }
    ]
  }
])


function App() {
  return (
    <RouterProvider router={router}/> 
  )
}

export default App;
