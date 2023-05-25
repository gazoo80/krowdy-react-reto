import IconButton from '@mui/material/IconButton';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SwitchVideoIcon from '@mui/icons-material/SwitchVideo';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Dialog } from '@mui/material';
import { Link } from "react-router-dom";
import React, { useEffect, useState, useRef } from 'react'

const Questiom = ({question}) => {

    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const handleIsOpenDialog = () => {
        setIsOpenDialog(true);
    }

    return (
        <>
        <div className="card border-0">
          <figure>  
              {
                 !question.recorded ? 
                 (
                     <img height='100%' src="../src/assets/images/fn2.jpg" className="card-img-top"/>  
                 )
                 : question?.video && 
                 (
                     <video id='videoSnap' width='100%' height='100%' src={window.URL.createObjectURL(question.video)}></video>
                 ) 
              }
              
              {
                  !question.recorded ?
                  (
                      <figcaption className='init-response'>
                          <Link to={`/questions/${question.id}`}>
                              <IconButton size='large' title='Activar cámara web'>
                                  <VideoCameraFrontIcon sx={{ color: 'white', fontSize: 70}} />
                              </IconButton>
                          </Link>
                      </figcaption>
                  ) :
                  (
                    <>
                      <figcaption className='edit-response d-flex justify-content-between'>
                          <IconButton size='large' title='Reproducir video' onClick={ handleIsOpenDialog }>
                              <PlayCircleIcon sx={{ color: 'white', fontSize: 30}} />
                          </IconButton>
                          <Link to={`/questions/${question.id}`}>
                              <IconButton size='large' title='Regrabar video'>
                                  <SwitchVideoIcon sx={{ color: 'white', fontSize: 30}} />
                              </IconButton>
                          </Link>
                      </figcaption>
                      </>
                  )
              }
          </figure>
          <div className='pt-2 ps-3 pe-3 small text-wrap'  style={{backgroundColor: 'lightgray'}}>
              <p>{`${question.order}. ${question.question}`}</p>
          </div>
        </div>
        <Dialog fullWidth={false} maxWidth={'md'}  open={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
          <div className='video-popup'>
              {
                 question?.video && 
                 (
                 <video id='video' controls width='640px' height='480px' src={window.URL.createObjectURL(question.video)}></video>
                 )
              }
          </div>
        </Dialog> 
        </>
    )
}

export default Questiom