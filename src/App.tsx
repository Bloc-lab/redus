import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteContentProvider } from './context/SiteContentContext'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { Home } from './pages/Home'

export default function App() {
  return (
    <SiteContentProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/o-nas" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SiteContentProvider>
  )
}
