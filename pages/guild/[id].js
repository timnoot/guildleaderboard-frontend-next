import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import { hideAll } from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional

import { APIURL, NAME_TO_POSITION, COLOR_ARRAY } from '../../utils/constants.js';
import { numberShortener, numberWithCommas } from '../../utils/numformatting.js';
import { TimeDelta } from '../../utils/timedelta.js';
import { getCataLevel } from '../../utils/other.js';

import { StatBlockTop, MenuButton } from '../../components/StatBlocks';
import { Footer } from '../../components/Footer';
import { JoinLog } from '../../components/JoinLogs.js';
import { CustomChart2 } from '../../components/Chart.js';
import { LoadingScreen } from '../../components/Screens.js';
import { SuggestionBar } from '../../components/SuggestionBar.js';

import { FaArrowLeft } from 'react-icons/fa';

const GuildHeader = (props) => {
  let backButtonElement = (
    <div className='mx-auto w-max'>
      {/* <Link href='/'>
        <a>
          <BackButton name={`Back to leaderboard`} />
        </a>
      </Link> */}
    </div>
  );

  if (!props.guildJson) {
    return (
      <div className='text-center font-[Helvetica]'>{backButtonElement}</div>
    );
  }
  let stats = props.guildJson.metrics[0];

  //   {
  //     senither_weight int,
  //     skills float,                    
  //     catacombs float,
  //     slayer int,
  //     lily_weight int,
  //     networth int,
  //     sb_experience int
  // }
  let weightedStats = stats.weighted_stats.split(',');
  let positions = props.guildJson.positions.split(',');

  let StatBlocksProps = [
    {
      color: 'bg-yellow-500',
      value: stats.players.length,
      name: 'Members',
    },
    {
      'color': 'bg-levelorange',
      'value': numberWithCommas(weightedStats[6] / 100),
      'name': 'SkyBlock Level',
      'tippy': `#${positions[6]} in SkyBlock Levels with ${numberWithCommas(
        (weightedStats[6] / stats.multiplier) / 100
      )} average SkyBlock level and a multiplier of ${stats.multiplier}.`
    },
    {
      color: 'bg-blue-700',
      name: 'Networth',
      value: numberShortener(weightedStats[5]),
      tippy: `#${positions[5]} in Networth and ${numberShortener(
        weightedStats[5] * stats.players.length
      )} total guild networth.`,
    },
    {
      color: 'bg-purple-700',
      value: numberWithCommas(
        weightedStats[0]
      ),
      name: 'Senither Weight',
      tippy: `#${positions[0]} in Weight with ${numberWithCommas(
        weightedStats[0] / stats.multiplier
      )} Senither Weight and a multiplier of ${stats.multiplier}.`,
    },
    // {
    //   'color': 'bg-green-700',
    //   'value': numberWithCommas(props.guildJson.lily_weight * props.guildJson.multiplier),
    //   'name': 'Lily Weight',
    //   'tippy': `${numberWithCommas(props.guildJson.lily_weight)} Lily Weight with a multiplier of ${stats.multiplier}.`
    // },
    {
      color: 'bg-blue-500',
      value: weightedStats[1],
      name: 'Skill Average',
      tippy: `#${positions[1]} in Average Skill Level`,
    },
    {
      color: 'bg-green-500',
      value: weightedStats[2],
      name: 'Catacombs',
      tippy: `#${positions[2]} in Catacombs`,
    },
    {
      color: 'bg-red-500',
      value: numberWithCommas(weightedStats[3]),
      name: 'Slayer',
      tippy: `#${positions[3]} in Slayer`,
    },
  ];
  return (
    <div className='text-center font-[Helvetica]'>
      <Head>
        <title>{props.guildJson.guild_name} - Hypixel Skyblock Statistics</title>
        <meta name='title' content={`${props.guildJson.guild_name} statistics`} />
        <meta
          name='description'
          content={`View the statistics of ${props.guildJson.guild_name} here!`}
        />

        <meta property='og:title' content={props.guildJson.guild_name} />
        <meta property='og:site_name' content='GuildLeaderboard' />
        <meta
          property='og:description'
          content={`👥 Members: ${stats.players.length}
🏆 SkyBlock level: ${numberWithCommas(weightedStats[6] / 100)}
💵 Networth: ${numberShortener(weightedStats[5])} (Total: ${numberShortener(weightedStats[5] * stats.players.length)})

💪 Senither: ${numberWithCommas(weightedStats[0])}
🌺 Lily: ${numberWithCommas(weightedStats[4])}

📚 Avg Skill: ${weightedStats[1]}
💀 Catacombs: ${weightedStats[2]}                        
🔫 Slayer: ${numberWithCommas(weightedStats[3])}`}
        />
      </Head>
      <h1 className='text-[1.8em] sm:text-[3em] font-semibold text-white'>
        {props.guildJson.guild_name}
      </h1>
      <div className='p-2 text-center'>
        {StatBlocksProps.map((stat, index) => {
          return <StatBlockTop key={index} {...stat} />;
        })}
      </div>
      <div className='py-2'>
        <button
          className={`${props.guildJson.discord != ''
            ? 'opacity-95 hover:opacity-100 hover:scale-105'
            : 'opacity-25'
            } 
      bg-blue-900 text-[1.2em] text-center text-gray-200 drop-shadow-lg px-3 py-2 rounded-md border border-gray-800`}
        >
          <div className='flex items-center'>
            <svg
              width='1.5rem'
              height='1.5rem'
              viewBox='0 0 71 55'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <g clipPath='url(#clip0)'>
                <path
                  d='M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z'
                  fill='#ffffff'
                />
              </g>
              <defs>
                <clipPath id='clip0'>
                  <rect width='71' height='55' fill='white' />
                </clipPath>
              </defs>
            </svg>
            <span className='pl-3'>
              {props.guildJson.discord != '' ? (
                <a href={`https://discord.gg/${props.guildJson.discord}`}>
                  Guild Discord
                </a>
              ) : (
                <a href='https://discord.gg/ej92B474Ej'>Submit Guild Discord</a>
              )}
            </span>
          </div>
        </button>
      </div>
      <hr className='border-none bg-tertiary h-[2px] my-4 mx-[15%]' />
      {backButtonElement}
    </div>
  );
};

const Player = (props) => {
  let player_data = props.player_data;

  const ref = useRef();

  const router = useRouter();
  const goRouteId = (id) => {
    router.push(`/player/${id}`);
  };

  const [TimeAgo, SetTimeAgo] = useState('Loading...');
  useEffect(() => {
    SetTimeAgo(TimeDelta.fromDate(player_data.latest_capture_date).toNiceString());
  }, []);

  return (
    <>
      <tr
        className={`${props.color} ${props.hidden ? 'hidden' : ''
          } font-[Helvetica] hover:opacity-60 hover:cursor-pointer`}
        ref={ref}
        onClick={() => goRouteId(player_data.name)}
      >
        <th className='px-1 sm:px-4'>{props.position}</th>
        <th className='pr-[2em] text-left'>{player_data.name}</th>
        <th>
          <div className='px-1 mx-2 my-1 font-normal bg-levelorange rounded-md lg:mx-6 xl:px-0'>
            {Math.round(player_data.latest_sb_xp / 10) / 10}
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
    this.state = {
      sortOn: 'latest_sb_xp',
      sortReversed: false,
      searchQuery: '',
    };
  }

  onSortClick(sortOn) {
    if (this.state.sortOn === sortOn) {
      this.setState({
        sortReversed: !this.state.sortReversed,
      });
    } else {
      this.setState({
        sortOn: sortOn,
        sortReversed: false,
      });
    }
  }

  render() {
    if (!this.props.guildJson) {
      return <LoadingScreen />;
    }
    let players_data = this.props.guildJson.metrics[0].players.slice();
    let sortOn = this.state.sortOn;
    let sortReversed = this.state.sortReversed;
    let players = [];

    players_data.sort(function (a, b) {
      if (sortReversed === true) {
        return a[sortOn] - b[sortOn];
      } else {
        return b[sortOn] - a[sortOn];
      }
    });

    let colorIndex = 1;
    for (const i in players_data) {
      let player_data = players_data[i];

      if (this.state.searchQuery !== '' && player_data.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
        colorIndex++;
      }

      let color = (this.state.searchQuery !== '' ? colorIndex : i) % 2 === 0
        ? 'bg-tertiary hover:bg-lighttertiary'
        : 'hover:bg-lightprimary';

      players.push(
        <Player
          key={player_data._id}
          player_data={player_data}
          position={parseInt(i) + 1}
          color={color}
          hidden={
            this.state.searchQuery !== '' && !player_data.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
          }
        />
      );
    }
    players.push(<tr key='spacer' className='h-2'></tr>);

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
        name: `Average Skill`,
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
    ];

    let tempAvgSkillFix = (
      <div>
        Average <br /> Skills
      </div>
    );

    return (
      <div className='text-white text-[0.6em] xs:text-[0.8em] sm:text-base md:text-sm lg:text-[1rem] 2xl:text-xl'>
        <div className='relative m-auto my-10 w-[90%] lg:w-1/2 '>
          <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
            <svg
              aria-hidden='true'
              className='w-5 h-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              ></path>
            </svg>
          </div>
          <input
            type='search'
            id='default-search'
            className='block p-4 pl-10 w-full text-sm rounded-lg border bg-primary border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Search for Players'
            required
            onInput={(e) => this.setState({ searchQuery: e.target.value })}
          />
        </div>
        <table className='bg-primary text-center rounded-md w-[90%] xl:w-4/5 mx-auto'>
          <tbody>
            <tr>
              <th>#</th>
              <th className='text-left'>Name</th>
              {tableHeadersProps.map((header) => {
                return (
                  <th
                    key={header.id}
                    className={`cursor-pointer ${header.classname} px-2`}
                    onClick={() => this.onSortClick(header.id)}
                  >
                    {header.name === 'Average Skill'
                      ? tempAvgSkillFix
                      : header.name}
                  </th>
                );
              })}
              <th className='hidden lg:table-cell'>Last updated</th>
            </tr>
            {players}
          </tbody>
        </table>
      </div>
    );
  }
}

class JoinLogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historyGuildJson: null,
      historyIsLoaded: null,
      current_page: 1,
      last_page: null,
    };
    this.guildId = props.guildId;
    this.loadHistory = this.loadHistory.bind(this);
  }

  render() {
    if (!this.state.historyGuildJson) {
      return <LoadingScreen />;
    }

    let logsElements = [];
    let historyData = this.state.historyGuildJson.data;
    // loop through guild json
    for (const i in historyData) {
      let log = historyData[i];
      let time_difference = TimeDelta.fromDate(log.capture_date);

      logsElements.push(
        <Link
          href={`/player/${log.uuid}`}
          key={`${log.uuid}-${log.capture_date}`}
        >
          <JoinLog
            type={log.type}
            name={log.name}
            time_difference={time_difference}
          />
        </Link>
      );
    }
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
            this.loadHistory(this.guildId, number);
          }}
        >
          {number}
        </button>
      );
    }

    return (
      <div className='text-center'>
        {logsElements}
        <div className='pt-3'>
          <div className='inline-flex w-11/12 p-2 text-xs text-white rounded-md bg-tertiary md:p-6 xl:w-2/3 xs:text-sm md:text-xl'>
            <div className='text-left align-middle' style={{ flexGrow: 1 }}>
              <button
                className={`bg-primary rounded-md p-2 ${allow_previous
                  ? 'cursor-pointer border-white border-2'
                  : 'cursor-not-allowed bg-lightprimary text-gray-400'
                  }`}
                onClick={() => {
                  if (allow_previous) {
                    this.loadHistory(this.guildId, this.state.current_page - 1);
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
              className='justify-end text-right align-middle '
              style={{ flexGrow: 1 }}
            >
              <button
                className={`bg-primary  rounded-md p-2 ${allow_next
                  ? 'cursor-pointer border-white border-2'
                  : 'cursor-not-allowed bg-lightprimary text-gray-400'
                  }`}
                onClick={() => {
                  if (allow_next) {
                    this.loadHistory(this.guildId, this.state.current_page + 1);
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
  }

  loadHistory(guildId, page) {
    let paths = window.location.href.split('/');
    if (!this.guildId) {
      guildId = paths[paths.length - 1];
    }
    console.log(guildId);

    fetch(`${APIURL}history?guild_id=${guildId}&per_page=10&page=${page}`)
      .then((res) => res.json())
      .then(
        (result) => {
          let paginate = result.paginate;
          this.setState({
            historyIsLoaded: true,
            historyGuildJson: result,
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
            historyIsLoaded: true,
          });
        }
      );
  }

  componentDidMount() {
    this.loadHistory(this.guildId, 1);
  }
}


const CompareGuilds = (props) => {
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [autoCompleteLoaded, setAutoCompleteLoaded] = useState(false);

  const [all_datasets, setAllDatasets] = useState({});
  // const [change, setChange] = useState(0);
  const [daysShow, setDaysShow] = useState(90);

  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState({});

  const [charts, setCharts] = useState([]);
  const [chartsUpdate, setChartsUpdate] = useState(0);

  const daysProps = [7, 30, 90];
  const chartsProps = [
    { id: "sb_experience", title: "SkyBlock experience", },
    { id: 'networth', title: 'Networth', },
    { id: 'senither_weight', title: 'Senither Weight', },
    { id: "lily_weight", title: "Lily Weight", },
    { id: 'skills', title: 'Skills', },
    { id: 'catacombs', title: 'Catacombs', },
    { id: 'slayer', title: 'Slayer', },
    { id: 'member_count', title: 'Members', },
  ];

  const onDelete = (guild_id) => {
    const tagsCopy = tags.slice(0);
    for (const i in tagsCopy) {
      if (tagsCopy[i].id === guild_id) {
        tagsCopy.splice(i, 1);
      }
    }
    // remove guild from guild_sorted_data
    delete all_datasets[guild_id];
    setTags(tagsCopy);
    setAllDatasets({ ...all_datasets });
    // setChange(change + 1);
  };

  const onAddition = (tag) => {
    const tagsCopy = [].concat(tags, tag);
    let guildid = tag.id;

    fetch(`${APIURL}metrics/guild/${guildid}`)
      .then((res) => res.json())
      .then(
        (result) => {
          all_datasets[guildid] = result;
          setTags(tagsCopy);
          setAllDatasets({ ...all_datasets });
          // setChange(change + 1);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const getGuildName = (guildId) => {
    // loop through tags and find the name
    for (const i in tags) {
      if (tags[i].id === guildId) {
        return tags[i].name;
      }
    }
  }

  useEffect(() => {
    if (autoCompleteLoaded) {
      return;
    }
    onAddition({ id: props.id, name: props.name });
    // setChange(change + 1);
    fetch(`${APIURL}autocomplete`)
      .then((res) => res.json())
      .then(
        (result) => {
          setAutoCompleteLoaded(true);
          setSuggestions(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  useEffect(() => { // update labels 
    let labels2 = [];
    const currentDate = new Date();

    for (let i = 0; i < daysShow; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      labels2.push(date.toLocaleString('default', { month: 'short', day: 'numeric' }));
    }
    setLabels(labels2.reverse());
    // setChange(change + 1);
  }, [daysShow]);

  useEffect(() => { // update datasets
    let newDataSetDict = {};
    for (const i in chartsProps) {
      let chart = chartsProps[i];
      let statNum = NAME_TO_POSITION[chart.id];
      // loop through the guilds
      let datasets = [];
      for (const guild_id in all_datasets) {
        let guildMetrics = all_datasets[guild_id];
        let guildName = getGuildName(guild_id);

        // loop through guildMetrics
        let guildData = [];
        let currentDate = new Date();
        let guildMetricsIndex = 0;

        for (let j = 0; j < 90; j++) {
          let metric = guildMetrics[guildMetricsIndex];
          let metricDate = new Date(metric.capture_date);

          if (metricDate.toDateString() === currentDate.toDateString()) {
            if (chart.id === 'member_count') {
              guildData.push(metric.member_count);
            } else {
              guildData.push(metric.weighted_stats.split(',')[statNum]);
            }
            guildMetricsIndex++;
          } else {
            guildData.push(null);
          }
          currentDate.setDate(currentDate.getDate() - 1);
        }

        datasets.push({
          label: guildName,
          data: guildData.reverse(),
          borderColor: COLOR_ARRAY[guild_id % COLOR_ARRAY.length],
          fill: Object.keys(all_datasets).length === 1,
          pointHitRadius: 100,
          spanGaps: true,
          pointBackgroundColor: 'white',
          tension: 0.2,

        });
      }
      newDataSetDict[chart.id] = datasets;
    }

    setDatasets(newDataSetDict);
  }, [all_datasets]);

  useEffect(() => { // update charts
    if (Object.keys(datasets).length === 0) {
      return;
    }

    let newCharts = [];
    for (const i in chartsProps) {
      let chart = chartsProps[i];

      let dataSet = datasets[chart.id].map(dataset => ({ ...dataset }));
      for (const j in dataSet) {
        dataSet[j].data = dataSet[j].data.slice(90 - daysShow);
      }

      newCharts.push(
        <div
          className='p-4 m-2 rounded-md md:inline-block  md:w-2/3 bg-primary' // h-80 md:h-96
          key={chart.id}
        >
          <CustomChart2
            title={chart.title}
            datasets={dataSet}
            labels={labels}
            key={chart.id + chartsUpdate}
            options={{
              options: {},
            }}
          />
        </div>
      );
    }
    setCharts(newCharts);
    setChartsUpdate(chartsUpdate + 1);
  }, [datasets, labels]);

  return (
    <div>
      <div className='text-center'>
        <div className='inline-block p-1 w-[90%] md:w-2/3 text-left mb-20'>
          <SuggestionBar
            tags={tags}
            suggestions={suggestions}
            onDelete={onDelete}
            onAddition={onAddition}
            placeholderText='Add a guild'
          />
        </div>
      </div>
      <div className='text-sm text-center text-white'>
        {daysProps.map((days) => {
          return (
            <MenuButton
              onClick={() => {
                setDaysShow(days);
                // setChange(change + 1);
              }}
              disabled={daysShow === days}
              className='mx-1 text-base'
              key={days}
            >
              {days} days
            </MenuButton>
          );
        })}
      </div>
      <div className='text-center' key={chartsUpdate}>
        {charts}
      </div>
    </div>
  );
}

export default function Guild({ guild }) {
  const router = useRouter();

  useEffect(() => {
    if (!guild) {
      router.push(`/`);
    } else {
      router.replace(`/guild/${guild.guild_name}`, undefined, { shallow: true });
    }
  }, []);

  const [selectedPage, setSelectedPage] = useState('players');

  let component;

  if (selectedPage === 'players') {
    component = <Players guildJson={guild} />;
  } else if (selectedPage === 'history') {
    component = <JoinLogs guildId={guild._id} />;
  } else if (selectedPage === 'metrics') {
    component = <CompareGuilds id={guild._id} name={guild.guild_name} />;
  }

  return (
    <div
      className='min-h-screen space-y-10 overflow-y-auto bg-secondary pt-7 sm:h-96 scrollbar'
      onScroll={() => {
        hideAll({ duration: 0 });
      }}
    >
      <GuildHeader guildJson={guild} selectedPage={selectedPage} />
      <div className='text-center font-[Helvetica] text-lg'>
        <div className='inline-block p-1 '>
          <MenuButton disabled={false}>
            <Link href='/guilds'>
              <div className='text-center'>
                <FaArrowLeft className='inline-block' />
                <div className='pl-1 inline-block'>
                  Back to leaderboard
                </div>
              </div>
            </Link>
          </MenuButton>
        </div>
        <div className='inline-block p-1 '>
          <MenuButton
            onClick={(i) => setSelectedPage('players')}
            disabled={selectedPage === 'players'}
          >
            Show Players
          </MenuButton>
        </div>
        <div className='inline-block p-1'>
          <MenuButton
            onClick={(i) => setSelectedPage('metrics')}
            disabled={selectedPage === 'metrics'}
          >
            Show Metrics
          </MenuButton>
        </div>
        <div className='inline-block p-1'>
          <MenuButton
            onClick={(i) => setSelectedPage('history')}
            disabled={selectedPage === 'history'}
          >
            Show History
          </MenuButton>
        </div>
      </div>
      {component}
      <Footer />
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const guild = await axios
    .get(`${APIURL}guild/${context.params?.id}`)
    .then((res) => res.data);

  return {
    props: {
      guild,
    },
  };
};
