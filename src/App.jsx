import './App.css'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QuestionList from './components/QuestionList';
import Response from './components/Response';
import Provider from './contexto/Provider';

function App() {

  return (
      <Provider>
          <div className="container-fluid" style={{ backgroundColor: '#002b99'}}>
                <p className="text-white fs-1 text-center py-2 align-middle">
                    <CenterFocusStrongIcon className='mb-2' sx={{ color: 'white', fontSize: 45}} />&nbsp;Video Cuestionario
                </p>
          </div>
          <div className='container mb-5' style={{backgroundColor: 'slategray'}}>
                <div className='row m-0 mb-3 border-1 border-dark border-bottom'>
                    <div className='col-12 col-sm-4 p-0 mb-1 fw-bold text-black-50'>
                        {/* <i class="bi bi-person-fill me-1 fs-4 text-info"></i> */}
                        <img width='20px' src="../src/assets/images/user1.gif"
                        className='me-1 align-text-bottom'/>
                        Jefferson Zárate
                    </div>
                    <div className='col-12 col-sm-4 text-sm-center p-0 mb-1 fw-bold text-black-50'>
                        {/* <i class="bi bi-file-earmark-code-fill me-1 fs-4"></i> */}
                        <img width='20px' src="../src/assets/images/computer.gif"
                        className='me-1 align-text-bottom'/>
                        React JS
                    </div>
                    <div className='col-12 col-sm-4 text-sm-end p-0 mb-1 fw-bold text-black-50'>
                        {/* <i class="bi bi-stopwatch-fill me-1 fs-4"></i> */}
                        <img width='20px' src="../src/assets/images/time.gif"
                        className='me-1 align-text-bottom'/>
                        30 min
                    </div>
                </div>
                <p className='text-black-50 fw-bold text-break fst-italic mb-4'>
                    Permita que la aplicación acceda a su videocámara y micrófono para  que pueda grabar las respuestas a cada pregunta del video cuestionario
                </p>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={ <QuestionList/> }></Route>
                        <Route path='/questions/:id' element={ <Response/> }></Route>
                        <Route path='*' element={ <Navigate to='/'/> }></Route>
                    </Routes>
                </BrowserRouter>
          </div>
          <div class="container mt-4 mb-0 footer pt-3 pb-1 border-1 border-dark border-top">
              <p class="text-center align-middle">2023 © Copyright</p>
          </div>
      </Provider>
  )
}

export default App
