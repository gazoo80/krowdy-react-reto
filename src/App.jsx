import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QuestionList from './components/QuestionList';
import Response from './components/Response';
import Provider from './contexto/Provider';

function App() {

  return (
      <Provider>
          <div className="container-fluid" style={{ backgroundColor: '#002b99'}}>
              <p className="text-white display-5 text-center py-3">
                  Video Cuestionario
              </p>
          </div>
          <div className='container bg-light mb-5'>
              <BrowserRouter>
                  <Routes>
                      <Route path='/' element={ <QuestionList/> }></Route>
                      <Route path='/questions/:id' element={ <Response/> }></Route>
                      <Route path='*' element={ <Navigate to='/'/> }></Route>
                  </Routes>
              </BrowserRouter>
          </div>
      </Provider>
  )
}

export default App
