import { useState } from "react";
import Contexto from "./Contexto";
import DATA_QUESTIONNAIRE from '../data/data.json';
import * as util from '../utils';

console.log(DATA_QUESTIONNAIRE);


const Provider = ({children}) => {

    const initialState = util.getInitialState(DATA_QUESTIONNAIRE);

    console.log(initialState);

    const [questions, setQuestions] = useState(initialState);
    const [completed, setCompleted] = useState(false);

    
    return (
        <Contexto.Provider value={{ questions, setQuestions, completed, setCompleted }}>
            { children }
        </Contexto.Provider>
    )
};

export default Provider