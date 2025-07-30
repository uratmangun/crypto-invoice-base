import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StagewiseToolbar } from '@stagewise/toolbar-react'
import ReactPlugin from '@stagewise-plugins/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Home } from '@/pages/Home'
import { CreateInvoice } from '@/pages/CreateInvoice'
import { Login } from '@/pages/Login'
import ViewInvoice from '@/pages/ViewInvoice'
import { ReceivePayment } from '@/pages/ReceivePayment'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <StagewiseToolbar
        config={{
          plugins: [ReactPlugin],
        }}
      />
      <ThemeToggle />
      
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pay/:invoiceId" element={<ViewInvoice />} />
          <Route path="/receive-payment" element={<ReceivePayment />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
