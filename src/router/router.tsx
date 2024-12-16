import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home';
import LoginPage from '@/pages/Login';
import SignUpPage from '@/pages/Signup';
import InterviewPage from '@/pages/InterviewScreen';
import Notfound from '@/pages/Notfound';
import Public from './public';
import Protected from './protected';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/'>
        <Route path='/' element={<Home />} />
        <Route element={<Public />}>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} />
        </Route>
        <Route element={<Protected />}>
            <Route path='/dashboard/*' element={<Dashboard />} />
            <Route path='/interview/:type' element={<InterviewPage />} />
        </Route>
        <Route path='/*' element={<Notfound />} />
    </Route>
))


const Index = () => {
    return <RouterProvider router={router} />
}

export default Index
