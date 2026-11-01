import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import SessionsPage from './pages/SessionsPage.jsx'
import SessionFormPage from './pages/SessionFormPage.jsx'
import SessionDetailPage from './pages/SessionDetailPage.jsx'
import SubjectsPage from './pages/SubjectsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

/**
 * StudySync starter.
 *
 * This scaffold gives you the route shell and seed data. It does NOT include
 * state management, persistence, or CRUD — those are your Week 9/10 work.
 * Read final-project/requirements.md before extending it.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="sessions/new" element={<SessionFormPage />} />
        <Route path="sessions/:sessionId" element={<SessionDetailPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
