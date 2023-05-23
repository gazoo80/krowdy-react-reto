
import React, { useContext, useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Contexto from '../contexto/Contexto';
import Questiom from './Questiom';

const QuestionList = () => {

    const { questions, completed } = useContext(Contexto);

    return (
        <>
            <div className='w-100 list-questions'>
            {
                questions.map((question) => (
                    <Questiom key={question.id} question={question}/>
                ))
            }
            </div>
            <div className='mt-3 d-flex justify-content-end'>
                <Button disabled={completed ? false: true} onClick={ () => alert('Sus respuestas se enviaron con éxito') } variant="contained" endIcon={<SendIcon />}>
                    Enviar
                </Button>
            </div>
            
        </> 
    )
}

export default QuestionList