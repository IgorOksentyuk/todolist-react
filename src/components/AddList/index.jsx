import React, { useEffect, useState } from "react";
import axios from 'axios';

import List from "../List";
import Circle from '../Circles';

import '../AddList/AddButtonList.scss';

import addPng from '../../assets/img/add.png';
import closePng from '../../assets/img/close.png';


const AddList = ({ colors, onAdd }) => {
    const [visibleForm, setVisibleForm] = useState(false);
    const [selectedColor, selectColor] = useState(3);
    const [isLoading, setisLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (Array.isArray(colors)) {
            selectColor(colors[0].id);
        }
    }, [colors]);

    const addList = () => {
        if (!inputValue) {
            alert('Введіть назву списку!');
            return;
        }
        setisLoading(true);
        axios
            .post('http://localhost:3001/lists', {
                "name": inputValue, 
                colorId: selectedColor 
            })
            .then(({ data }) => {
                const color = colors.filter(c => c.id === selectedColor)[0];
                const listObj = {...data, color, tasks: []};
                onAdd(listObj);
                onClose();
            })
            .catch(() => {
                alert('Помилка при додаванні списку!');
            })
            .finally(() => {
                setisLoading(false);
            })
    }

    const onClose = () => {
        setVisibleForm(false);
        setInputValue('');
        selectColor(colors[0].id);
    }

    return (
        <div className="add-list">
            <List 
                onClick={() => setVisibleForm(true)}
                items={[
                {
                    className: 'list__add-button',
                    icon: <img src={addPng} alt="Add icon"/>,
                    name: 'Додати папку',
                }
                ]}
            />

            {visibleForm && (
                <div className="add-list__form">
                    <img 
                        onClick={onClose} 
                        src={closePng} 
                        className="add-list__form-close-btn" 
                        alt="Close button"
                    />

                    <input 
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="field" 
                        type="text" 
                        placeholder="Назва списку"
                    />

                    <div className="add-list__form-colors">
                        {colors.map(color => (
                            <Circle 
                                onClick={() => selectColor(color.id)}
                                key={color.id} 
                                color={color.name}
                                className={selectedColor === color.id && 'active'}
                            />
                        ))}
                    </div>

                    <button onClick={addList} className="button">
                        {isLoading ? 'Додавання...' : 'Додати'}
                    </button>
                </div>)}
        </div>
    )
}

export default AddList;