import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import NewsDetail from './pages/NewsDetail'
import Discussion from './pages/Discussion'
import AIChat from './pages/AIChat'
import About from './pages/About'
import './App.css'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                BuzzWorld AI
              </Link>
              <nav className="flex space-x-4">
                <Link to="/" className="text-gray-600 hover:text-blue-600">News</Link>
                <Link to="/discussion" className="text-gray-600 hover:text-blue-600">Discussions</Link>
                <Link to="/ai-chat" className="text-gray-600 hover:text-blue-600">AI Assistant</Link>
                <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
              </nav>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/discussion" element={<Discussion />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 BuzzWorld AI - Your Hyperlocal News Assistant</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App