import React from 'react';
import Head from 'next/head';

import axios from 'axios';

export const StatsHeader = ({ stats }) => {
	return (
		<header>
			<Head>
				<meta property='og:title' content={'SkyBlock Guildleaderboard'} />
				<meta property='og:site_name' content='Guildleaderboard' />
				<meta
					property='og:description'
					content={`Tracking:
Guilds 🏢 ${stats.guilds_tracked}
Players 👥 ${stats.players_tracked}
🥇 ${stats.top_guilds[0].name} 💪 ${stats.top_guilds[0].senither_weight} Weight
🥈 ${stats.top_guilds[1].name} 💪 ${stats.top_guilds[1].senither_weight} Weight
🥉 ${stats.top_guilds[2].name} 💪 ${stats.top_guilds[2].senither_weight} Weight`}
				/>
			</Head>
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