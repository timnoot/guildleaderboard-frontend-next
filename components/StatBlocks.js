import Image from 'next/image'

import Tippy from '@tippyjs/react';
import { hideAll } from 'tippy.js';

export const StatBlockTop = (props) => {
    const element = (
        <div className='inline-block px-1 py-2 text-sm font-normal text-white'>
            <span className='p-2 rounded-l-lg bg-primary'>{`${props.name} `}</span>
            <span className={`${props.color} rounded-r-lg p-2`}>{props.value}</span>
        </div>
    );
    if (props.tippy) {
        return <Tippy content={props.tippy}>{element}</Tippy>;
    } else {
        return element;
    }
};

export const OutsideLink = (props) => {
    return (
        <div className='inline-block'>
            <a className={`${props.className} flex align-midle bg-primary p-2 text-sm font-normal text-white rounded-lg m-1`} href={props.href}>
                <div className='pr-1'>
                    {props.name}
                </div>
                <Image src='/offwebsite.png' height='20' width='20' alt=''/>
            </a>
        </div>
    )
}

export const CopyButton = (props) => {
    return (
        <Tippy content={`Copied ${props.text} to clipboard`} trigger='click' onShown={(() => {
            setTimeout(() => {
                hideAll();
            }, 500);
        })}>
            <div className='inline-block'>
                <div className='flex align-midle bg-primary  p-2 text-sm font-normal text-white rounded-lg m-1 cursor-pointer' onClick={
                    (e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(props.copy);
                    }}>
                    <div className='pr-1'>
                        {props.text}
                    </div>
                    <Image src='/copy.png' height='20' width='20' alt=''/>
                </div>
            </div>
        </Tippy>
    )
}

export const BackButton = (props) => {
    return (
        <div className='inline-block'>
            <div className={`${props.className} flex align-middle p-2 text-sm font-normal text-white rounded-lg m-1`}>
                <Image src='/back.png' height='20' width='20' alt=''/>
                <div className='pl-1'>
                    {props.name}
                </div>
            </div>
        </div>
    )
}
export const MenuButton = (props) => {
    return (
        <button class={`${props.className} relative inline-flex items-center justify-center px-6 py-3 overflow-hidden text-white ${props.disabled ? 'bg-primary' : 'bg-lightprimary'} rounded-lg group`}
            onClick={props.onClick} disabled={props.disabled}>
            {props.disabled ? null : <span class="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#24a0ed] rounded-full group-hover:w-56 group-hover:h-56"></span>}
            <span class="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-lightprimary"></span>
            <span class="relative">{props.children}</span>
        </button>
    )
}