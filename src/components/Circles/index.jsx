import React from "react";
import classNames from 'classnames';

import '../Circles/Circles.scss';


const Circle = ({ color, onClick, className }) => (
    <i 
        onClick={onClick} 
        className={classNames('circle', {[`circle--${color}`] : color}, className)}>
    </i>
);

export default Circle;