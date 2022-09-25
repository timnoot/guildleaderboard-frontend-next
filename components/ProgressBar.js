import React from 'react';
import { numberWithCommas, numberShortener } from '../Functions.js';

export const ProgressBar = (props) => {
    let color = props.color || 'bg-progressblue';

    return (
        <div className='text-left text-sm text-white'>
            <span className='text-left pl-1'>
                {props.name}
            </span>
            <div className='w-full bg-gray-200 rounded-full h-5 dark:bg-gray-700 text-center' style={{ '--overhang': '1.25rem', '--progress': props.levelProgress }}>
                <div className={`${color} h-5 rounded-full progress-bar`}></div>
                <span className='relative text-center -top-5'
                    onMouseEnter={
                        (e) => {
                            e.target.innerText = numberWithCommas(props.xp);
                        }
                    }
                    onMouseLeave={
                        (e) => {
                            e.target.innerText = numberShortener(props.xp);
                        }
                    }
                >
                    {numberShortener(props.xp)} XP
                </span>
            </div>
        </div>
    )
};