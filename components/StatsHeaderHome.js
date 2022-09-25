import React from 'react';
import { Helmet } from 'react-helmet';

import { APIURL } from '../constants.js';

export class StatsHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			guildsTracked: 0,
			playersTracked: 0,
			isLoaded: false,
		};
	}

	render() {
		return (
			<header>
				<Helmet>
					<meta charSet='utf-8' />
					<meta property='og:title' content={'SkyBlock Guildleaderboard'} />
					<meta
						property='og:description'
						content={`Tracking ${this.state.guildsTracked} guilds with ${this.state.playersTracked} players`}
					/>
				</Helmet>
				<h1 className='text-2xl text-center text-white bg-secondary sm:text-5xl'>
					Hypixel Skyblock Guild leaderboard
				</h1>
				<h1 className='pt-4 text-center text-white sm:text-2xl'>
					Tracking {this.state.guildsTracked} guilds with{' '}
					{this.state.playersTracked} players
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

	componentDidMount() {
		fetch(`${APIURL}stats`)
			.then((res) => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						guildsTracked: result.guilds_tracked,
						playersTracked: result.players_tracked,
					});
					document.getElementById('patronscount').innerHTML = result.patrons;
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) => {
					console.log(error);
					this.setState({
						isLoaded: true,
						error,
					});
				}
			);
	}
}