import React from 'react';
import { Loading } from '../Functions.js';


export class LoadingScreen extends React.Component {
    render() {
        return (
            <div className='bg-secondary flex justify-center items-center h-screen '>
                <Loading size='50%'/>
            </div>
        );
    }

}

export class ErrorScreen extends React.Component {
    render() {
        return (
            <div className='bg-secondary flex justify-center items-center h-screen text-white text-lg md:text-3xl lg:text-5xl'>
                <a className='text-center' href='https://discord.gg/ej92B474Ej'>
                    <div>
                        Something went wrong...
                    </div>
                    <div>
                        Please report this in our discord server.
                    </div>
                    <div className='text-base md:text-lg lg:text-xl pt-10'>
                        {this.props.error}
                    </div>
                </a>
            </div>
        );
    }

}