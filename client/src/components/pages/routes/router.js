import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './home'
import NoMatch from './noMatch'

const RouterComponent = (props) => {
  return <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home {...props}/>} />
          <Route path="/api/paypal/success" element={<Home {...props}/>} />
          <Route path="/api/paypal/cancel" element={<Home {...props}/>} />
          <Route path="/api/crypto/success" element={<Home {...props}/>} />
          <Route path="/api/crypto/cancel" element={<Home {...props}/>} />
          <Route path="*" element={<NoMatch {...props}/>} />
        </Routes>
      </div>
    </Router>
}

export default RouterComponent