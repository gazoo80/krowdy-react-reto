import React, { useContext, useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Contexto from '../contexto/Contexto';
import * as util from '../utils';

const Response = () => {                  
    const { id } = useParams(); 

    const { questions, setQuestions, completed, setCompleted } = useContext(Contexto);

    const { order, recorded, question } = questions.find(q => q.id === id);

    const refVideo = useRef();
    const refRecord = useRef();
    const refAgain = useRef();
    const refStop = useRef();

    const configureNavigation = () => {
        let previousRoute = '';
        let nextRoute = ''
        let withNavigationButtons = false;
        let withFinishButton = false;
        let goToQuestion = []; 
       
        if (completed) {
            const nextQuestions = questions.filter(q => q.order > order);
            const previousQuestions = questions.filter(q => q.order < order);
            goToQuestion = [...nextQuestions, ...previousQuestions];
            console.log(goToQuestion);

            if (goToQuestion.length === 0) {
                withNavigationButtons = false;
                withFinishButton = false;
            }
        }
        else {
            const nextQuestions = questions.filter(q => q.order > order && q.recorded === false);
            const previousQuestions = questions.filter(q => q.order < order && q.recorded === false);
            goToQuestion = [...nextQuestions, ...previousQuestions];
            console.log(goToQuestion);

            if (goToQuestion.length === 0) {
                withNavigationButtons = false;
                withFinishButton = true;
            }
        }

        if (goToQuestion.length === 0) {
            nextRoute = `/questions/${id}`;
            previousRoute = `/questions/${id}`;
        }
        else {
            withNavigationButtons = true;
            withFinishButton = false;
            nextRoute = `/questions/${goToQuestion[0].id}`;
            previousRoute = `/questions/${goToQuestion[goToQuestion.length-1].id}`;
        }
        
        return { previousRoute, nextRoute, withNavigationButtons, withFinishButton }
    }

    const { previousRoute, nextRoute, withNavigationButtons, withFinishButton } = configureNavigation();

    let cameraStream = null;
    let mediaRecorder = null;
    let blobsRecorded = [];
    let videoResponse;
    let recordTimeout = null;

    const recordMode = () => {
        refAgain.current.style.display = 'none';
        refStop.current.style.display = 'none';
        refRecord.current.style.display = 'block';
    };

    const againMode = () => {
        refAgain.current.style.display = 'inline';
        refStop.current.style.display = 'none';
        refRecord.current.style.display = 'none';
    };

    const stopMode = () => {
        refAgain.current.style.display = 'none';
        refStop.current.style.display = 'block';
        refRecord.current.style.display = 'none';
    };

    const init = () => {
        if (recorded) {
            console.log('Llegue al init');
            againMode();
        }
        else {
            recordMode();
        }

        initCamera();
    }

    useEffect(() => {
        init();

        return () => {
            mediaRecorder = null;
            cameraStream = null;
            window.clearTimeout(recordTimeout);
        }
    },[]);

    useEffect(() => {    
        init();
    },[id]);

    const initCamera = () => {
        
        cameraStream = null;
        mediaRecorder = null;
        blobsRecorded = [];

        util.startCamera().then((stream) => {
                                cameraStream = stream;
                                console.log(cameraStream);
                                refVideo.current.src = null;
                                refVideo.current.srcObject = cameraStream;
                           })
                           .catch(error => console.log(error));
    };

    const recordingVideo = () => {
        try {
            mediaRecorder = new MediaRecorder(cameraStream, {mimeType: 'video/webm'});
        } catch (error) {
            console.log('Error: ', error);
        }
        
        mediaRecorder.addEventListener('dataavailable', (e) => {
            blobsRecorded.push(e.data);
        });

        mediaRecorder.addEventListener('stop', () => {
            videoResponse = window.URL.createObjectURL(new Blob(blobsRecorded, {type: "video/webm"}));
        });

        mediaRecorder.start(500);
        recordTimeout = setTimeout(() => {
            stopRecording();
        }, 7000);

        stopMode();
    }

    const stopRecording = () => {
        mediaRecorder.stop();
        const blobs = [...blobsRecorded];
        const buffer = new Blob(blobs, {type: "video/webm"});
        refVideo.current.src = null;
        refVideo.current.srcObject = null;
        refVideo.current.src = window.URL.createObjectURL(buffer);
        refVideo.current.play();
        window.clearTimeout(recordTimeout);
        againMode();
        saveResponse(buffer);
    }

    const initRecordingAgain = () => {
        recordMode();
        initCamera();
    };
    
    const saveResponse = (buffer) => {
        const objQuestion = {
            id,
            question,
            order,
            video: buffer,
            image: '',
            recorded: true
        };

        const editedQuestions = questions.map(
            q => q.id === id ? objQuestion : q
        );

        setQuestions(editedQuestions);

        const completedQuestions = editedQuestions.every(q => q.recorded);

        completedQuestions && setCompleted(true);
    };

    return (
   
        <div className='w-100 mt-2 d-flex flex-column justify-content-center align-items-center' style={{height: '700px'}}  >
            <div className='w-75 mb-2 d-flex justify-content-start'>
                <Link to='/'>
                    <Button variant="outlined" startIcon={<ArrowBackIcon />}>
                        Regresar al cuestionario
                    </Button>
                </Link>
            </div>
            <div className='w-75 bg-dark' style={{height: '65%'}} >
                <video ref={refVideo} id='video' autoPlay={true} loop width='100%' height='100%'></video>
            </div>
            <div className='w-75 bg-dark py-0 d-flex'>
                <div className='flex-grow-1'>
                    <IconButton ref={refRecord} className='ms-2' size='large' title='Grabar' onClick={ recordingVideo }>
                        <FiberManualRecordIcon sx={{ color: 'red', fontSize: 30}} />
                    </IconButton>
                    <IconButton ref={refAgain} className='ms-2'  size='large' title='Regrabar' onClick={ initRecordingAgain }>
                        <FlipCameraAndroidIcon sx={{ color: 'white', fontSize: 30}} />
                    </IconButton>
                    <IconButton ref={refStop} className='ms-2'  size='large' title='Detener grabación' onClick={ stopRecording }>
                        <StopCircleIcon sx={{ color: 'white', fontSize: 30}} />
                    </IconButton>
                </div>
                <div>
                    {
                        recorded &&
                        (
                            <IconButton className='mt-2 me-2' size='large' title='Pregunta resuelta' >
                                <TaskAltIcon sx={{ color: 'lightGreen', fontSize: 30 }} />
                            </IconButton>
                        )
                    }
                </div>
            </div>
            <div className='w-75 pt-2 ps-3 pe-3 small' style={{backgroundColor: 'lightgray'}}>
                <p>{`${order}. ${question}`}</p>
            </div>
            <div className='w-75 mt-2 d-flex justify-content-between'>
                {
                    withNavigationButtons && (
                        <>
                            <Link to={previousRoute} >
                                <Button variant="contained" startIcon={<SkipPreviousIcon />}>
                                    Anterior
                                </Button>
                            </Link>
            
                            <Link to={nextRoute}>
                                <Button variant="contained" endIcon={<SkipNextIcon />}>
                                    Siguiente
                                </Button>
                            </Link>
                        </>
                    )
                }
                {
                    withFinishButton && (
                        <>
                            <div></div><div></div>
                            <Link to={'/'}>
                                <Button variant="contained" endIcon={<PlaylistAddCheckIcon />}>
                                    Terminar
                                </Button>
                            </Link>
                            
                        </> 
                    )
                }
                
            </div>
        </div>
    )
}

export default Response