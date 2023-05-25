
import { nanoid } from 'nanoid'

const getInitialState = ({ questions }) => {

    const initialData = questions.map((question, index) => {
        return {
            id: nanoid(),
            question,
            order: index + 1,
            video: null,
            image: '',
            recorded: false
        }
    });

    return initialData;
};

const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        return stream;
    } catch (error) {
        console.log('Error:', error)
    }
};

export { getInitialState, startCamera };