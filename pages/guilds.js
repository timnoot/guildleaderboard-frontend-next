import React, { useState, useEffect } from 'react';

import { TimeDelta } from '../utils/timedelta.js';
import { weightMultiplier } from '../utils/other.js';
import { numberShortener, numberWithCommas } from '../utils/numformatting.js';
import { NavigationBar } from '../components/NavigationBar.js';
import { GuildStatsHeader } from '../components/StatsHeaderHome.js';
import { Footer } from '../components/Footer.js';
import { NAME_TO_POSITION } from '../utils/constants.js';

import axios from 'axios';
import { useRouter } from 'next/router';
import 'tippy.js/dist/tippy.css'; // optional
import Tippy from '@tippyjs/react';
import { hideAll } from 'tippy.js';

function positionChange(change) {
  if (change > 0) {
    return (
      <svg width='1.5em' height='1.5em' viewBox='0 0 487 487' style={{ 'enable-background': 'new 0 0 487 487' }} xmlns='http://www.w3.org/2000/svg'      >
        <g>
          <path d='M397.7,376.1c20.4,20.4,53.6,20.4,74,0s20.4-53.6,0-74L280.5,110.9c-20.4-20.4-53.6-20.4-74,0L15.3,302.1 c-20.4,20.4-20.4,53.6,0,74s53.6,20.4,74,0l154.2-154.2L397.7,376.1z' style={{ fill: 'rgb(0, 255, 21)' }} />
        </g>
      </svg>
    );
  } else {
    return (
      <svg width='1.5em' height='1.5em' viewBox='0 0 487 487' style={{ 'enable-background': 'new 0 0 487 487' }} xmlns='http://www.w3.org/2000/svg'      >
        <g transform='matrix(-1, 0, 0, -1, 487, 487)'>
          <path d='M397.7,376.1c20.4,20.4,53.6,20.4,74,0s20.4-53.6,0-74L280.5,110.9c-20.4-20.4-53.6-20.4-74,0L15.3,302.1 c-20.4,20.4-20.4,53.6,0,74s53.6,20.4,74,0l154.2-154.2L397.7,376.1z' style={{ fill: 'rgb(255, 26, 68)' }} />
        </g>
      </svg>
    );
  }
}

const Guild = (props) => {
  let guildJson = props.guildJson;

  const router = useRouter();
  const goRouteId = () => {
    router.push(`/guild/${guildJson.guild_name}`);
  };
  let multiplier = weightMultiplier(guildJson.members);

  const [TimeAgo, SetTimeAgo] = useState('Loading...');
  useEffect(() => {
    SetTimeAgo(props.capture_date);
  }, []);

  return (
    <tr
      className={`${props.color} ${props.hidden ? 'hidden' : ''} font-[Helvetica] hover:cursor-pointer`} // text-[.9em] font-semibold
      onClick={goRouteId}
    >
      <th className='pl-1 lg:pl-6'>{props.position}</th>
      {
        (Boolean(guildJson.position_change) && props.hidePositionChange) ? (
          <th className='text-left md:px-1'>
            {positionChange(guildJson.position_change)}
          </th>
        ) : <th></th>
      }
      <th></th>
      <th className='text-left'>{guildJson.guild_name}</th>
      <th>
        <div className='mx-3 my-1 font-normal bg-yellow-500 rounded-md xl:mx-6 xl:px-0'>
          {guildJson.members}
        </div>
      </th>
      <th>
        <Tippy
          content={`${guildJson.guild_name} is #${guildJson.positions[6]} in average SkyBlock level with ${Math.floor((guildJson.weighted_stats[6] / multiplier) / 10) / 10} levels and a multiplier of ${numberWithCommas(
            multiplier
          )}`}
        >
          <div className="my-1 mx-1 font-normal bg-levelorange rounded-md px-1 xl:px-0 lg:mx-1">
            {Math.floor(guildJson.weighted_stats[6] / 10) / 10}
          </div>
        </Tippy>
      </th>
      <th>
        <Tippy
          content={`${guildJson.guild_name} is #${guildJson.positions[5]} in Networth`}
        >
          <div
            className="my-1 mx-1 font-normal bg-blue-700 rounded-md px-1 xl:px-0 lg:mx-3"
          >
            {numberShortener(guildJson.weighted_stats[5])}
          </div>
        </Tippy>
      </th>
      <th>
        <Tippy
          content={`${guildJson.guild_name} is #${guildJson.positions[0]} in Weight with ${numberWithCommas(guildJson.weighted_stats[0] / multiplier)} Senither Weight and a multiplier of ${numberWithCommas(
            multiplier
          )}`}
        >
          <div
            className={`font-normal my-1 bg-purple-700 rounded-md px-1 mx-1 xl:px-0 xl:mx-0`}
          >
            {numberWithCommas(Math.floor(guildJson.weighted_stats[0]))}
          </div>
        </Tippy>
      </th>
      <th className='hidden md:table-cell'>
        <Tippy
          content={`${guildJson.guild_name} is #${guildJson.positions[1]} in Average Skills`}
        >
          <div className='px-1 my-1 font-normal bg-blue-500 rounded-md xl:mx-4 xl:px-0'>
            {guildJson.weighted_stats[1]}
          </div>
        </Tippy>
      </th>
      <th className='hidden md:table-cell'>
        <Tippy
          content={`${guildJson.guild_name} is #${guildJson.positions[3]} in Slayers`}
        >
          <div className='px-1 mx-2 my-1 font-normal bg-red-500 rounded-md xl:px-0'>
            {numberWithCommas(Math.round(guildJson.weighted_stats[3]))}
          </div>
        </Tippy>
      </th>
      <th className='hidden md:table-cell'>
        <Tippy
          content={`${guildJson.guild_name} is #${guildJson.positions[2]} in Catacombs`}
        >
          <div className='px-1 mx-2 my-1 font-normal bg-green-400 rounded-md xl:mx-8 xl:px-0'>
            {guildJson.weighted_stats[2]}
          </div>
        </Tippy>
      </th>
      <th className='hidden px-1 lg:px-5 lg:table-cell'>{TimeAgo}</th>
    </tr>
  );
};

const Guilds = (props) => {
  let guild_data = props.guildsJson.slice();

  const [sortOn, setSortOn] = useState('sb_experience');
  let positionNum = NAME_TO_POSITION[sortOn];
  const [sortReversed, setSortReversed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [loadedPages, setLoadedPages] = useState(50);


  useEffect(() => {
    const handleScroll = (element) => {
      // if close to the bottom of the page, load more guilds the page lenght should be dynamic
      console.log(element.scrollHeight - element.scrollTop, element.clientHeight, element.scrollHeight, element.scrollTop)
      if (element.scrollHeight - element.scrollTop - 1000 <= element.clientHeight && loadedPages < guild_data.length) {
        setLoadedPages(loadedPages + 10);
        console.log('loading more guilds', loadedPages)
      }
      // unload guilds if the user element up      
      if (element.scrollHeight - element.scrollTop >= 3000 && loadedPages > 50) {
        setLoadedPages(loadedPages - 10);
        console.log('unloading guilds', loadedPages)
      }
      if (element.scrollTop === 0) {
        setLoadedPages(50);
      }
    };

    const handleMainDivScroll = () => {
      handleScroll(maindiv);
    };

    const handleDocumentScroll = () => {
      handleScroll(document.documentElement);
    };

    var maindiv = document.getElementById('maindiv');

    maindiv.addEventListener('scroll', handleMainDivScroll);
    document.addEventListener('scroll', handleDocumentScroll);

    // Remove event listeners using the same functions
    return () => {
      maindiv.removeEventListener('scroll', handleMainDivScroll);
      document.removeEventListener('scroll', handleDocumentScroll);
    };
  }, [loadedPages]);


  let guildArrangement = {};
  for (const guild of guild_data) {
    if (guild.positions[positionNum] === 0) {
      continue;
    }
    guildArrangement[guild.positions[positionNum]] = guild;
  }
  guild_data = Object.values(guildArrangement);
  if (sortReversed) {
    guild_data.reverse();
  }

  // remove the ones that don't match the search query
  if (searchQuery.length > 0) {
    guild_data = guild_data.filter((guild_json) => {
      return guild_json.guild_name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }

  let hidePositionChange = sortOn === 'sb_experience' && !sortReversed

  let guilds = [];
  for (const i in guild_data.slice(0, loadedPages)) {
    let guild_json = guild_data[i];

    guilds.push(
      <Guild
        key={guild_json._id}

        position={guild_json.positions[positionNum]}
        guildJson={guild_json}
        capture_date={TimeDelta.fromDate(guild_json.capture_date).toNiceString()}

        hidePositionChange={hidePositionChange}
        color={i % 2 === 0 ? 'bg-tertiary hover:bg-lighttertiary' : 'hover:bg-lightprimary'}
      />
    );
  }
  guilds.push(<tr key='spacer' className='h-2'></tr>);

  const onSortClick = (sortOnValue) => {
    if (sortOn === sortOnValue) {
      setSortReversed(!sortReversed);
    } else {
      setSortOn(sortOnValue);
      setSortReversed(false);
    }
  };

  return (
    <div className='text-[0.6em] xs:text-[0.8em] sm:text-base md:text-sm lg:text-[1rem] 2xl:text-xl text-white'>
      <div className="relative m-auto my-10 w-[90%] lg:w-1/2 ">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input type="search" id="default-search" className="block p-4 pl-10 w-full text-sm rounded-lg border bg-primary border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for Guilds" required
          onInput={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table className='bg-primary text-center rounded-md w-[90%] xl:w-4/5 mx-auto table-auto'>
        <tbody>
          <tr>
            <th className='pl-1 md:pl-6'>#</th>
            <th></th>
            <th></th>
            <th className='tracking-[.1em] text-left'>Guilds</th>
            <th>Members</th>
            <th
              className='hover:cursor-pointer'
              onClick={() => { onSortClick('sb_experience'); }}
            >
              SkyBlock <br />
              level
            </th>
            <th
              className='hover:cursor-pointer'
              onClick={() => { onSortClick('networth'); }}
            >
              Networth
            </th>
            <th
              className='hover:cursor-pointer'
              onClick={() => { onSortClick('senither_weight'); }}
            >
              Weight
            </th>
            <th
              className='hidden hover:cursor-pointer md:table-cell'
              onClick={() => { onSortClick('skills'); }}
            >
              Average <br />
              Skills
            </th>
            <th
              className='hidden hover:cursor-pointer md:table-cell min-w-fit'
              onClick={() => { onSortClick('slayer'); }}
            >
              Slayers
            </th>
            <th
              className='hidden hover:cursor-pointer md:table-cell'
              onClick={() => { onSortClick('catacombs'); }}
            >
              Catacombs
            </th>
            <th className='hidden lg:table-cell'>Last updated</th>
          </tr>
          {guilds}
        </tbody>
      </table>
    </div>
  );
};

export default function Home({ guildsJson, stats }) {
  return (
    <div
      id='maindiv'
      className='min-h-screen space-y-10 overflow-x-hidden overflow-y-auto bg-secondary sm:h-96 scrollbar'
      onScroll={() => {
        hideAll({ duration: 0 });
      }}
    >
      <NavigationBar patronscount={stats.patrons} />
      <GuildStatsHeader stats={stats} backButton={true} />
      <Guilds guildsJson={guildsJson} />
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const res = await axios.get('https://apiv2.guildleaderboard.com/leaderboard');
  let guildsJson = res.data;
  for (const guild of guildsJson) {
    guild.positions = guild.positions.split(',');
    guild.weighted_stats = guild.weighted_stats.split(',');
  }

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
      guildsJson,
      stats,
    },
    revalidate: 60,
  };
}
