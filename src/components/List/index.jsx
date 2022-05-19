import React from "react";
import classNames from "classnames";
import axios from 'axios';

import Circle from '../Circles/index.jsx';

import '../List/List.scss';

import removePng from '../../assets/img/remove.png';


const List = ({ 
    items, 
    isRemovable,
    onClick, 
    onRemove, 
    onClickItem, 
    activeItem 
}) => {
    const onRemoveList = item => {
        if (window.confirm('Ви дійсно хочете видалити список?')) {
            axios.delete('http://localhost:3001/lists/' + item.id).then(() => {
                onRemove(item.id);
            });
        }
      }

    return (
        <ul onClick={onClick} className="list">
            {items.map((item, index) => (
                <li 
                    key={index} 
                    className={classNames(item.className, { 
                        active: item.active 
                            ? item.active 
                            : activeItem && activeItem.id === item.id 
                    })}
                    onClick={onClickItem ? () => onClickItem(item) : null}
                >
                    <i>{item.icon ? item.icon : <Circle color={item.color.name}/>}</i>
                    
                    <span>
                        {item.name} 
                        {item.tasks && `(${item.tasks.length})`}
                    </span>

                    {isRemovable && 
                        <img
                            className="list__remove-icon"
                            src={removePng}
                            alt="Remove icon"
                            onClick={() => onRemoveList(item)}   
                        />
                    }
                </li>
            ))}
        </ul>
    );
};

export default List;