import React from 'react';
import { ReactComponent as SettingsIcon } from '../svgs/settingsicon.svg';
import { ReactComponent as DiscordIcon } from '../svgs/Discord-Logo-White.svg';


const DropDown = (props) => {
	let showScammers

	if (props.cookies.showScammers === undefined) {
		showScammers = true
	} else {
		if (typeof props.cookies.showScammers === 'string' || props.cookies.showScammers instanceof String) {
			showScammers = (props.cookies.showScammers === 'true')
		} else {
			showScammers = props.cookies.showScammers
		}
	}
	props.cookies.showScammers = showScammers

	if (props.cookies.weightUsed === undefined) {
		props.cookies.weightUsed = 'Senither';
	}

	let img
	if ((props.cookies.weightUsed || 'Senither') === "Senither") {
		img = '/lily_weight_icon.png'
	} else {
		img = '/weight_icon.png'
	}

	return (
		<div className='bg-primary absolute translate-x-[-80%] rounded-md p-3 overflow-hidden w-72'>
			<div className='bg-primary hover:bg-lightprimary rounded-md p-2 items-center flex justify-between' onClick={() => {
				props.changeCookie('weightUsed', (props.cookies.weightUsed || 'Senither') === "Senither" ? "Lily" : "Senither");
				props.cookies.weightUsed = (props.cookies.weightUsed || 'Senither') === "Senither" ? "Lily" : "Senither";
			}
			}>
				<span className="h-[55px] w-[55px]">
					<img src={img} alt='weight' />
				</span>
				<span className='p-2 text-lg'>
					{`${(props.cookies.weightUsed || 'Senither') === "Senither" ? "Lily" : "Senither"} Weight`}
				</span>
			</div>
			<div className='bg-primary hover:bg-lightprimary rounded-md p-2 items-center flex justify-between' onClick={() => {
				props.changeCookie('showScammers', !props.cookies.showScammers);
				props.cookies.showScammers = !props.cookies.showScammers
			}
			}>
				<span className="h-[55px] w-[55px]">
					<img src='/barrier.png' alt='weight' />
				</span>
				<span className='p-2 text-lg'>
					{props.cookies.showScammers ? 'Hide Scammers' : 'Show Scammers'}
				</span>
			</div>
		</div>
	);
}


export class NavigationBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
		}
		this.wrapperRef = React.createRef();
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.handleScroll = this.handleScroll.bind(this);

		this.cookies = props.cookies;
		this.changeCookie = props.changeCookie
	}

	changeIsOpen(val) {
		this.setState({ isOpen: val })
	}

	handleScroll(event, state1) {
		this.setState({ isOpen: false });
	}

	handleClickOutside(event) {
		if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
			this.setState({ isOpen: false });
		}
	}

	componentDidMount() {
		document.getElementById("maindiv").addEventListener("scroll", this.handleScroll);
		document.addEventListener("mousedown", this.handleClickOutside);
	}

	componentWillUnmount() {
		document.getElementById("maindiv").removeEventListener("scroll", this.handleScroll);
		document.removeEventListener("mousedown", this.handleClickOutside);
	}


	render() {
		return (
			<nav className="block ">
				<section className='py-2.5 flex justify-between items-center text-white text-xs md:text-lg px-[5%] bg-[#2B2D31] text-center'>
					<a className='flex items-center relative ' href="https://discord.gg/ej92B474Ej">
						<img width='100em' src='/logo459.png' alt='SkyHub Logo' />
						<h2 className="ml-5 text-lg md:text-2xl">Sky Hub</h2>
					</a>
					<ul className=''>
						<li className='float-right px-4 overflow-hidden hover:cursor-pointer' ref={this.wrapperRef}>
							<SettingsIcon width="2.5em" height="2.5em" onClick={() => { this.setState({ isOpen: !this.state.isOpen }) }} />
							{this.state.isOpen ? <DropDown cookies={this.cookies} changeCookie={this.changeCookie}/> : null}
						</li>
						<li className='float-right px-1 md:px-9 overflow-hidden hidden xs:block'>
							<a href="https://discord.gg/ej92B474Ej"><DiscordIcon width="2.5em" height="2.5em" /></a>
						</li>
						<li className='float-right px-1 md:px-9 overflow-hidden hidden md:block'>
							<a href="https://www.patreon.com/sbhub">
								<div className='inline-block px-1 py-2 text-base font-normal text-white'>
									<span className='p-2 rounded-l-lg bg-primary'>Patreons</span>
									<span id='patronscount'className='bg-[#FF424D] rounded-r-lg p-2'>0</span>
								</div>
							</a>
						</li>
					</ul>
				</section>
			</nav>
		);
	};
};