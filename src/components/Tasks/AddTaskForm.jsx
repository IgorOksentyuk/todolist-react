import React, {useState} from 'react';
import axios from 'axios';

import addPng from '../../assets/img/add.png';


 const AddTaskForm = ({ list, onAddTask }) => {
    const [visibleForm, setFormVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setisLoading] = useState('');

    const toggleFormVisible = () => {
        setFormVisible(!visibleForm);
        setInputValue('');
    }

    const addTask = () => {
        const obj = {
            listId: list.id,
            text: inputValue,
            completed: false
        };
        setisLoading(true);
        axios
            .post('http://localhost:3001/tasks/', obj)
            .then(({ data }) => {
                onAddTask(list.id, data)
                toggleFormVisible();
            })
            .catch(() => {
                alert('Помилка при додаванні задачі!');
            })
            .finally(() => {
                setisLoading(false);
            });   
    };

    return (
        <div className="tasks__form">
            {!visibleForm ? (
                <div onClick={toggleFormVisible} className="tasks__form-new">
                    <img src={addPng} alt="Add icon" />
                    <span>Нова задача</span>
                </div>
            ) : (
                <div className="tasks__form-block">
                    <input
                        value={inputValue} 
                        className="field" 
                        type="text" 
                        placeholder="Текст завдання"
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <button disabled={isLoading} onClick={addTask} className="button">
                        {isLoading ? 'Додавання' : 'Додати завдання'}
                    </button>
                    <button onClick={toggleFormVisible} className="button button--grey">Відмінити</button>
                </div>)
            }
        </div>
    )
}

export default AddTaskForm;