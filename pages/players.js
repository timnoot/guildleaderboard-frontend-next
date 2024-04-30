import React, { useState, useEffect, useRef } from 'react';

import { followCursor, hideAll } from 'tippy.js';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import { TimeDelta } from '../utils/timedelta.js';
import { getCataLevel } from '../utils/other.js';
import { numberShortener, numberWithCommas } from '../utils/numformatting.js';
import { Footer } from '../components/Footer.js';
import { NavigationBar } from '../components/NavigationBar.js';
import { GuildStatsHeader } from '../components/StatsHeaderHome.js';

import axios from 'axios';
import { useRouter } from 'next/router';


const NAME_TO_POSITION_PLAYER = {
  'latest_senither': 0,
  'latest_asl': 1,
  'latest_cata': 2,
  'latest_slayer': 3,
  'latest_lily': 4,
  'latest_nw': 5,
  'latest_sb_xp': 6
};


const Player = (props) => {
  let player_data = props.player_data;

  const ref = useRef();

  const router = useRouter();
  const goRouteId = (id) => {
    router.push(`/player/${id}`);
  };

  // const TimeAgo = TimeDelta.fromDate(player_data.capture_date).toNiceString();
  // Improve above code to not get a hydration error
  const TimeAgo = TimeDelta.fromDate(player_data.latest_capture_date).toNiceString();

  return (
    <>
      <tr
        className={`${props.color} ${props.hidden ? 'hidden' : ''} font-[Helvetica] hover:opacity-60 hover:cursor-pointer`}
        ref={ref}
        onClick={() => goRouteId(player_data.name)}
      >
        <th className='px-1 sm:px-4'>{props.position}</th>
        <th className='pr-[2em] text-left'>{player_data.name}</th>
        <th className='px-1'>
          <div className='px-1 my-1 font-normal bg-levelorange rounded-md lg:mx-6 xl:px-0'>
            {Math.floor(player_data.latest_sb_xp / 10) / 10}
          </div>
        </th>
        <th className='px-1'>
          <div className='px-1 my-1 font-normal bg-blue-700 rounded-md lg:mx-2 xl:px-0'>
            {numberShortener(player_data.latest_nw)}
          </div>
        </th>
        <th>
          <div className='px-1 my-1 font-normal bg-purple-700 rounded-md lg:mx-6 xl:px-0'>
            {numberWithCommas(player_data.latest_senither)}
          </div>
        </th>
        <th className='hidden md:table-cell'>
          <div className='px-1 my-1 font-normal bg-blue-500 rounded-md xl:mx-4 xl:px-0'>
            {player_data.latest_asl}
          </div>
        </th>
        <th className='hidden md:table-cell'>
          <div className='px-1 my-1 font-normal bg-red-500 rounded-md lg:mx-2 xl:px-0'>
            {numberWithCommas(Math.round(player_data.latest_slayer))}
          </div>
        </th>
        <th className='hidden md:table-cell'>
          <div className='px-1 mx-6 my-1 font-normal bg-green-400 rounded-md xl:px-0'>
            {Math.round(getCataLevel(player_data.latest_cata) * 10) / 10}
          </div>
        </th>
        <th className='hidden sm:px-5 lg:table-cell'>{TimeAgo}</th>
        <th></th>
      </tr>
    </>
  );
};

class Players extends React.Component {
  constructor(props) {
    super(props);
    this.props = props

    this.state = {
      playerJson: props.playerJson,
      isLoaded: null,
      current_page: 1,
      last_page: null,
      sortOn: 'latest_sb_xp',
      searchQuery: '',
    };
    this.loadPage = this.loadPage.bind(this);
  }

  render() {
    let players_data = this.state.playerJson.data;
    let players = [];

    for (const i in players_data) {
      let player_data = players_data[i];

      let color = i % 2 === 0 ? 'bg-tertiary hover:bg-lighttertiary' : 'hover:bg-lightprimary'

      players.push(
        <Player
          position={player_data.positions.split(',')[NAME_TO_POSITION_PLAYER[this.state.sortOn]]}
          player_data={player_data}
          capture_date={TimeDelta.fromDate(player_data.capture_date).toNiceString()}
          key={player_data._id}
          color={color}
        />
      );
    }
    players.push(<tr key='spacer' className='h-2'></tr>);

    const onSortClick = (sortOnValue) => {
      this.setState({ sortOn: sortOnValue, current_page: 1 });
      this.loadPage(sortOnValue, 1, this.state.searchQuery);
    };
    let allow_previous = this.state.current_page > 1;
    let allow_next = this.state.current_page < this.state.last_page;

    let middleButtonsNumbers = [];
    if (this.state.last_page > 4) {
      if (this.state.current_page <= 3) {
        middleButtonsNumbers = [1, 2, 3, 4, 5, this.state.last_page];
      } else if (
        this.state.current_page >= 4 &&
        this.state.current_page <= this.state.last_page - 3
      ) {
        middleButtonsNumbers = [
          1,
          this.state.current_page - 1,
          this.state.current_page,
          this.state.current_page + 1,
          this.state.last_page,
        ];
      } else if (this.state.current_page >= this.state.last_page - 2) {
        middleButtonsNumbers = [
          1,
          this.state.last_page - 4,
          this.state.last_page - 3,
          this.state.last_page - 2,
          this.state.last_page - 1,
          this.state.last_page,
        ];
      }
    } else {
      middleButtonsNumbers = [...Array(this.state.last_page + 1).keys()];
      middleButtonsNumbers.shift();
    }

    let middleButtons = [];

    for (let i = 0; i < middleButtonsNumbers.length; i++) {
      let number = middleButtonsNumbers[i];
      if (number - middleButtonsNumbers[i - 1] > 1) {
        middleButtons.push(
          <span
            className='text-white py-1 px-1 xs:px-2 my-1 mx-[0.125rem] align-middle'
            key={`${number}-dot`}
          >
            ...
          </span>
        );
      }
      let active = number === this.state.current_page ? 'bg-green-800 text-white' : 'bg-primary text-white';
      middleButtons.push(
        <button
          className={`${active} rounded-md py-1 px-1 xs:px-2 my-1 mx-[0.125rem] align-middle inline-block`}
          key={`${number}-button`}
          onClick={() => {
            this.setState({ current_page: number });
            this.loadPage(this.state.sortOn, number, this.state.searchQuery);
          }}
        >
          {number}
        </button>
      );
    }

    let tableHeadersProps = [
      {
        id: 'latest_sb_xp',
        name: 'SkyBlock level',
      },
      {
        id: 'latest_nw',
        name: 'Networth',
      },
      {
        id: 'latest_senither',
        name: 'Senither',
      },
      {
        id: 'latest_asl',
        name: 'Average Skill',
        classname: 'hidden md:table-cell',
      },
      {
        id: 'latest_slayer',
        name: 'Total Slayer',
        classname: 'hidden md:table-cell',
      },
      {
        id: 'latest_cata',
        name: 'Catacombs',
        classname: 'hidden md:table-cell',
      },
    ]

    return (
      <div className='text-white text-[0.6em] xs:text-[0.8em] sm:text-base md:text-sm lg:text-[1rem] 2xl:text-xl text-center'>
        <div className="relative m-auto my-10 w-[90%] lg:w-1/2 ">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input type="search" id="default-search" className="block p-4 pl-10 w-full text-sm rounded-lg border bg-primary border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for Players" required
            onChange={(e) => {
              this.setState({ searchQuery: e.target.value, current_page: 1 });
              this.loadPage(this.state.sortOn, 1, e.target.value);
            }}
          />
        </div>
        <div className='inline-block w-[90%] xl:w-4/5 text-center'>
          <table className='bg-primary text-center rounded-md w-full mx-auto'>
            <tbody>
              <tr>
                <th>#</th>
                <th className='text-left'>Name</th>
                {
                  tableHeadersProps.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className={`cursor-pointer ${header.classname}`}
                        onClick={() => onSortClick(header.id)}
                      >
                        {header.name}
                      </th>
                    )
                  })
                }
                <th className='hidden lg:table-cell'>Last updated</th>
              </tr>
              {players}
            </tbody>
          </table>
          <div className='inline-flex w-full p-2 mt-4 text-xs text-white rounded-md bg-tertiary md:p-6 xs:text-sm md:text-xl'>
            <div className='text-left align-middle' style={{ flexGrow: 1 }}>
              <button
                className={`bg-primary rounded-md p-2 ${allow_previous
                  ? 'cursor-pointer border-white border-2'
                  : 'cursor-not-allowed bg-lightprimary text-gray-400'
                  }`}
                onClick={() => {
                  if (allow_previous) {
                    this.setState({ current_page: this.state.current_page - 1 });
                    this.loadPage(this.state.sortOn, this.state.current_page - 1, this.state.searchQuery);
                  }
                }}
              >
                Previous
              </button>
            </div>
            <div className='text-center align-middle' style={{ flexGrow: 1 }}>
              {middleButtons}
            </div>
            <div
              className='justify-end text-right align-middle'
              style={{ flexGrow: 1 }}
            >
              <button
                className={`bg-primary  rounded-md p-2 ${allow_next
                  ? 'cursor-pointer border-white border-2'
                  : 'cursor-not-allowed bg-lightprimary text-gray-400'
                  }`}
                onClick={() => {
                  if (allow_next) {
                    this.setState({ current_page: this.state.current_page + 1 });
                    this.loadPage(this.state.sortOn, this.state.current_page + 1, this.state.searchQuery);
                  }
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  loadPage(sortOn, page, searchQuery = null) {
    console.log(sortOn)
    fetch(`https://apiv2.guildleaderboard.com/leaderboard/player?sort_by=${sortOn}&page=${page}${searchQuery ? `&username=${searchQuery}` : ''}`)
      .then((res) => res.json())
      .then(
        (result) => {
          let paginate = result.paginate;
          this.setState({
            isLoaded: true,
            playerJson: result,
            current_page: paginate.current_page,
            last_page: paginate.last_page,
          });
          if (result === null) {
            // window.location.href = '/';
          }
        },
        (error) => {
          console.log(error);
          this.setState({
            isLoaded: true,
          });
        }
      );
  }

  componentDidMount() {
    let result = this.props.playerJson;
    let paginate = result.paginate;
    this.setState({
      isLoaded: true,
      playerJson: result,
      current_page: paginate.current_page,
      last_page: paginate.last_page,
    });
  }
}

export default function Home({ playerJson, stats }) {
  return (
    <div
      id='maindiv'
      className='min-h-screen space-y-10 overflow-x-hidden overflow-y-auto bg-secondary sm:h-96 scrollbar'
      onScroll={() => {
        hideAll({ duration: 0 });
      }}
    >
      <NavigationBar patronscount={stats.patrons} />
      <GuildStatsHeader stats={stats} title={'Player'} backButton={true} />
      <Players playerJson={playerJson} />
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const res = await axios.get('https://apiv2.guildleaderboard.com/leaderboard/player?sort_by=latest_sb_xp');

  const playerJson = res.data;
  if (res.status !== 200) {
    console.error(json);
    throw new Error('Failed to fetch API');
  }

  const res2 = await axios.get('https://apiv2.guildleaderboard.com/stats');

  const stats = res2.data;
  if (res2.status !== 200) {
    console.error(json);
    throw new Error('Failed to fetch API');
  }

  return {
    props: {
      playerJson,
      stats,
    },
    revalidate: 60,
  };
}
