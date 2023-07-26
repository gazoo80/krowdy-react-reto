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
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
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
    const refTimer = useRef();

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

            if (goToQuestion.length === 0) {
                withNavigationButtons = false;
                withFinishButton = false;
            }
        }
        else {
            const nextQuestions = questions.filter(q => q.order > order && q.recorded === false);
            const previousQuestions = questions.filter(q => q.order < order && q.recorded === false);
            goToQuestion = [...nextQuestions, ...previousQuestions];

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
    let timerInterval = null;
    let minute = 0; 
    let second = 0;

    const recordMode = () => {
        refAgain.current.style.display = 'none';
        refStop.current.style.display = 'none';
        refRecord.current.style.display = 'block';
        console.log(refTimer.current);
        refTimer.current.lastElementChild.classList.remove('video-rec-indicator');
        refTimer.current.style.visibility = 'hidden';
    };

    const againMode = () => {
        refAgain.current.style.display = 'inline';
        refStop.current.style.display = 'none';
        refRecord.current.style.display = 'none';
        refTimer.current.lastElementChild.classList.remove('video-rec-indicator');
        refTimer.current.style.visibility = 'hidden';
    };

    const stopMode = () => {
        refAgain.current.style.display = 'none';
        refStop.current.style.display = 'block';
        refRecord.current.style.display = 'none';
        refTimer.current.style.visibility = 'visible';
        refTimer.current.lastElementChild.classList.add('video-rec-indicator');
    };

    const init = () => {
        if (recorded) {
            againMode();
        }
        else {
            recordMode();
        }

        initCamera();
    }

    useEffect(() => {    
        init();
        console.log('useEffect por id')
        return () => {
            console.log('unmount en segundo');
            window.clearTimeout(recordTimeout);
            window.clearInterval(timerInterval);
        }
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

        // Stop a la grabación
        recordTimeout = setTimeout(() => {
            stopRecording();
        }, 120000);

        stopMode();

        // Timer de la grabación
        timeRecording();
        timerInterval = setInterval(timeRecording, 1000)
    }

    const timeRecording = () => {
        let mt, st;
        second++;

        if (second > 59) { minute++; second = 0 }

        st = ('0' + second).slice(-2);
        mt = ('0' + minute).slice(-2);

        let spanTime = refTimer.current.firstElementChild;
        spanTime.innerText = `${mt}:${st}`;
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
        window.clearInterval(timerInterval);
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
   
        <div className='w-100 mt-2 d-flex flex-column justify-content-center align-items-center animated fadeIn' style={{height: 'auto'}}  >
            <div className='mb-2 d-flex justify-content-start width-video-response'>
                <Link to='/'>
                    <Button variant="outlined" startIcon={<ArrowBackIcon />}>
                        Regresar al cuestionario
                    </Button>
                </Link>
            </div>
            <div className='bg-dark video-response width-video-response height-video-response'>
                <video ref={refVideo} id='video' autoPlay={true} loop width='100%' height='100%'></video>
                <div ref={refTimer} className='timer-video-response d-flex justify-content-end align-items-center'>
                    <span>00:00</span>
                    <span className='rec-indicator ms-3'></span>
                </div>
            </div>
            <div className='bg-dark py-0 d-flex width-video-response'>
                <div className='flex-grow-1'>
                    <IconButton ref={refRecord} className='ms-2 mb-1' title='Grabar' onClick={ recordingVideo }>
                        <RadioButtonCheckedIcon sx={{ color: 'red'}} className="fs-2"/>
                    </IconButton>
                    <IconButton ref={refAgain} className='ms-2 mb-1'  title='Regrabar' onClick={ initRecordingAgain }>
                        <FlipCameraAndroidIcon sx={{ color: 'white'}} className="fs-2"/>
                    </IconButton>
                    <IconButton ref={refStop} className='ms-2 mb-1' title='Detener grabación' onClick={ stopRecording }>
                        <StopCircleIcon sx={{ color: 'white'}} className="fs-2" />
                    </IconButton>
                </div>
                <div>
                    {
                        recorded &&
                        (
                            <IconButton className='mt-1 me-2' title='Pregunta resuelta' >
                                <TaskAltIcon sx={{ color: 'lightGreen'}} className="fs-2"/>
                            </IconButton>
                        )
                    }
                </div>
            </div>
            <div className='pt-2 ps-3 pe-3 small fw-bolder width-video-response' style={{backgroundColor: '#b0c4de'}}>
                <p>{`${order}. ${question}`}</p>
            </div>
            <div className='mt-2 d-flex justify-content-between width-video-response'>
                {
                    withNavigationButtons && (
                        <>
                            <Link to={previousRoute} >
                                <Button variant="contained" startIcon={<SkipPreviousIcon />}>
                                    <span className='d-none d-sm-block'>Anterior</span>
                                </Button>
                            </Link>
            
                            <Link to={nextRoute}>
                                <Button variant="contained" endIcon={<SkipNextIcon />}>
                                <span className='d-none d-sm-block'>Siguiente</span>
                                    
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