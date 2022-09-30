import React from 'react';
// import { Helmet } from 'react-helmet';
import axios from 'axios';


export const StatsHeader = ({ stats }) => {
	return (
		<header>
			{/* <Helmet>
					<meta charSet='utf-8' />
					<meta property='og:title' content={'SkyBlock Guildleaderboard'} />
					<meta
						property='og:description'
						content={`Tracking ${this.state.guildsTracked} guilds with ${this.state.playersTracked} players`}
					/>
				</Helmet> */}
			<h1 className='text-2xl text-center text-white bg-secondary sm:text-5xl'>
				Hypixel Skyblock Guild leaderboard
			</h1>
			<h1 className='pt-4 text-center text-white sm:text-2xl'>
				Tracking {stats.guilds_tracked} guilds with{' '}
				{stats.players_tracked} players
			</h1>
			<h1 className='text-center text-white sm:text-1xl pt-'>
				Scammer Database provided by{' '}
				<a
					className='text-blue-500 underline'
					href='https://discord.gg/skyblock'
				>
					SkyBlockZ
				</a>
			</h1>
		</header>
	);
}

// export async function getStaticProps() {
// }