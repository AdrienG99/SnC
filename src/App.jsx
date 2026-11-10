import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import WorkoutBuilder from './pages/WorkoutBuilder.jsx'
import Schedule from './pages/Schedule.jsx'
import PRTracker from './pages/PRTracker.jsx'
import Store from './pages/Store.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/plans" element={<WorkoutBuilder />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/prs" element={<PRTracker />} />
            <Route path="/store" element={<Store />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
