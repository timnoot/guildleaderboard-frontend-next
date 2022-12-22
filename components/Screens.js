import React from 'react';
import { SpinnerCircular } from 'spinners-react';

export class LoadingScreen extends React.Component {
    render() {
        return (
            <div className='bg-secondary flex justify-center items-center h-screen scroll fixed w-screen z-50'>
                <SpinnerCircular size={'50%'} thickness={180} speed={200} color="rgba(57, 125, 172, 1)" secondaryColor="rgba(0, 0, 0, 0.0)" />
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
                        {this.props.title || 'Something went wrong...'}
                    </div>
                    <div>
                        {this.props.report ? 'Please report this in our discord server.' : ''}
                    </div>
                    <div className='text-base md:text-lg lg:text-xl pt-10'>
                        {this.props.error}
                    </div>
                </a>
            </div>
        );
    }

}