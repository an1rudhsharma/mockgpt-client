import Dashboard from './pages/Dashboard'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import InterviewPage from './pages/InterviewScreen';
const App = () => {
  return (
    <main>
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/interview/:type' element={<InterviewPage />} />
        </Routes>
      </Router>
    </main>
  )
}

export default App
