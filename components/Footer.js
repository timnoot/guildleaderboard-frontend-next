import React from 'react';

export class Footer extends React.Component {
	render() {
		return (
			<footer className='py-2 text-[0.6em] md:text-sm text-center text-white rounded-t-lg h-20 bg-primary w-full'>
				<div>
					Inspired by{' '}
					<a
						className='text-blue-500 underline hover:cursor-pointer'
						href='https://hypixel-leaderboard.senither.com'
					>
						Senither's Hypixel Skyblock Leaderboard
					</a>
					.
				</div>
				<div>
					Created by{' '}
					<a
						className='text-blue-500 underline hover:cursor-pointer'
						href='https://github.com/timnoot'
					>
						timnoot#4372
					</a>
					,{' '}
					<a
						className='text-blue-500 underline hover:cursor-pointer'
						href='https://github.com/XoutDragon'
					>
						XoutDragon#2466
					</a>
					, and{' '}
					<a
						className='text-blue-500 underline hover:cursor-pointer'
						href='https://github.com/MooshiMochi'
					>
						Mooshi#6669
					</a>
					.
				</div>
				<div>
					Powered by{' '}
					<a
						className='text-blue-500 underline hover:cursor-pointer'
						href='https://apexcharts.com'
					>
						Apexcharts
					</a>
					,{' '}
					<a
						className='text-blue-500 underline hover:cursor-pointer'
						href='https://tailwindcss.com'
					>
						TailwindCSS
					</a>
					,{' '}
					<a
						className='text-blue-500 underline hover:cursor-pointer'
						href='https://tippyjs.bootcss.com'
					>
						TippyJS
					</a>
					, and{' '}
					<a
						className='text-blue-500 underline hover:cursor-pointer'
						href='https://digitalocean.com'
					>
						Digital Ocean
					</a>
				</div>
			</footer>
		);
	}
};