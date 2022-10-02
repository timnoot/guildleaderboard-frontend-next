import React, { useState, useEffect } from 'react';

import { TimeDelta } from '../utils/timedelta.js';
import { numberShortener, numberWithCommas } from '../utils/numformatting.js';
import { NavigationBar } from '../components/NavigationBar.js';
import { StatsHeader } from '../components/StatsHeaderHome.js';
import { Footer } from '../components/Footer.js';

import axios from 'axios';
import { useRouter } from 'next/router';
import 'tippy.js/dist/tippy.css'; // optional
import Tippy from '@tippyjs/react';
import { hideAll } from 'tippy.js';
import { useCookies } from 'react-cookie';

function positionChange(change) {
  if (change > 0) {
    return (
      <svg
        width='1.5em'
        height='1.5em'
        viewBox='0 0 487 487'
        style={{ 'enable-background': 'new 0 0 487 487' }}
        xmlns='http://www.w3.org/2000/svg'
      >
        <g>
          <path
            d='M397.7,376.1c20.4,20.4,53.6,20.4,74,0s20.4-53.6,0-74L280.5,110.9c-20.4-20.4-53.6-20.4-74,0L15.3,302.1 c-20.4,20.4-20.4,53.6,0,74s53.6,20.4,74,0l154.2-154.2L397.7,376.1z'
            style={{ fill: 'rgb(0, 255, 21)' }}
          />
        </g>
      </svg>
    );
  } else {
    return (
      <svg
        width='1.5em'
        height='1.5em'
        viewBox='0 0 487 487'
        style={{ 'enable-background': 'new 0 0 487 487' }}
        xmlns='http://www.w3.org/2000/svg'
      >
        <g transform='matrix(-1, 0, 0, -1, 487, 487)'>
          <path
            d='M397.7,376.1c20.4,20.4,53.6,20.4,74,0s20.4-53.6,0-74L280.5,110.9c-20.4-20.4-53.6-20.4-74,0L15.3,302.1 c-20.4,20.4-20.4,53.6,0,74s53.6,20.4,74,0l154.2-154.2L397.7,376.1z'
            style={{ fill: 'rgb(255, 26, 68)' }}
          />
        </g>
      </svg>
    );
  }
}

const Guild = (props) => {
  let guildJson = props.guildJson;

  const router = useRouter();
  const goRouteId = () => {
    router.push(`/guild/${guildJson.name}`);
  };

  let scammerElement = (
    <th className='md:pr-2'>
      <Tippy
        // position="top"
        // animation={false}
        interactive={true}
        // appendTo={document.body}
        duration={0}
        theme='tomato'
        content={
          <div className='block-inline'>
            <a
              className='text-blue-500 underline'
              href='https://discord.gg/skyblock'
            >
              SkyBlockZ
            </a>{' '}
            found {guildJson.scammers} scammers in this guild.
          </div>
        }
      >
        <div>
          <svg
            width='1.5em'
            height='1.5em'
            viewBox='0 0 64 64'
            xmlns='http://www.w3.org/2000/svg'
            textRendering='geometricPrecision'
            shapeRendering='geometricPrecision'
          >
            <polygon
              id='svg_1'
              y='50%'
              x='50%'
              stroke='#e6d2d2'
              fill='#d54e4e'
              points='44.24585723876953,2.435657501220703 61.5635986328125,19.754154205322266 61.56416320800781,44.24567794799805 44.24528121948242,61.5643424987793 19.754140853881836,61.56398391723633 2.4360132217407227,44.24640655517578 2.4358367919921875,19.75396156311035 19.75433349609375,2.436215877532959 44.24585723876953,2.435657501220703'
            />
            <text
              id='svg_2'
              textAnchor='middle'
              dominantBaseline='middle'
              fontSize='40px'
              fill='rgb(255, 255, 255)'
              y='50%'
              x='50%'
            >
              {guildJson.scammers}
            </text>
          </svg>
        </div>
      </Tippy>
    </th>
  );
  const [ScammerInGuild, setScammerInGuild] = useState(<th></th>);
  if (guildJson.scammers > 0 && props.showScammers) {
    scammerElement = (
      <th className='md:pr-2'>
        <Tippy
          // position="top"
          // animation={false}
          interactive={true}
          // appendTo={document.body}
          duration={0}
          theme='tomato'
          content={
            <div className='block-inline'>
              <a
                className='text-blue-500 underline'
                href='https://discord.gg/skyblock'
              >
                SkyBlockZ
              </a>{' '}
              found {guildJson.scammers} scammers in this guild.
            </div>
          }
        >
          <div>
            <svg
              width='1.5em'
              height='1.5em'
              viewBox='0 0 64 64'
              xmlns='http://www.w3.org/2000/svg'
              textRendering='geometricPrecision'
              shapeRendering='geometricPrecision'
            >
              <polygon
                id='svg_1'
                y='50%'
                x='50%'
                stroke='#e6d2d2'
                fill='#d54e4e'
                points='44.24585723876953,2.435657501220703 61.5635986328125,19.754154205322266 61.56416320800781,44.24567794799805 44.24528121948242,61.5643424987793 19.754140853881836,61.56398391723633 2.4360132217407227,44.24640655517578 2.4358367919921875,19.75396156311035 19.75433349609375,2.436215877532959 44.24585723876953,2.435657501220703'
              />
              <text
                id='svg_2'
                textAnchor='middle'
                dominantBaseline='middle'
                fontSize='40px'
                fill='rgb(255, 255, 255)'
                y='50%'
                x='50%'
              >
                {guildJson.scammers}
              </text>
            </svg>
          </div>
        </Tippy>
      </th>
    );
  } else {
    scammerElement = <th></th>;
  }
  useEffect(() => {
    setScammerInGuild(scammerElement);
  }, [props.showScammers]);

  let position_change;

  if (
    Boolean(guildJson.position_change) &&
    props.sortOn === 'senither_weight' &&
    !props.sortReversed
  ) {
    position_change = (
      <th className='text-left md:px-1'>
        {positionChange(guildJson.position_change)}
      </th>
    );
  } else {
    position_change = <th></th>;
  }

  let weight;
  let weightColor;

  if (props.usedWeight === 'Senither') {
    weight = guildJson.senither_weight;
    weightColor = 'bg-purple-700';
  } else {
    weight = guildJson.lily_weight;
    weightColor = 'bg-green-700';
  }

  const [TimeAgo, SetTimeAgo] = useState('Loading...');
  useEffect(() => {
    SetTimeAgo(props.capture_date);
  }, []);

  return (
    <tr
      className={`${props.color} font-[Helvetica] hover:cursor-pointer`} // text-[.9em] font-semibold
      onClick={goRouteId}
    >
      <th className='pl-1 lg:pl-6'>{props.position}</th>
      {position_change}
      {ScammerInGuild}
      <th className='text-left'>{guildJson.name}</th>
      <th className=' '>
        <div className=' bg-yellow-500 mx-6 font-normal rounded-md'>
          {guildJson.members}
        </div>
      </th>
      <th>
        <Tippy
          content={`${numberWithCommas(weight)} ${
            guildJson.usedWeight
          } Weight with a multiplier of ${numberWithCommas(
            guildJson.multiplier
          )}`}
        >
          <div className={`mx-6 font-normal ${weightColor} rounded-md`}>
            {numberWithCommas(weight * guildJson.multiplier)}
          </div>
        </Tippy>
      </th>
      <th>
        <Tippy
          content={`${numberShortener(
            guildJson.networth * guildJson.members
          )} total guild networth`}
        >
          <span className={`px-1 font-normal bg-blue-700 rounded-md`}>
            {numberShortener(guildJson.networth)}
          </span>
        </Tippy>
      </th>
      <th className='hidden md:table-cell'>
        <Tippy
          content={`${guildJson.name} is #${props.skills_index} in Average Skills`}
        >
          <span className='px-1 font-normal bg-blue-500 rounded-md'>
            {guildJson.skills}
          </span>
        </Tippy>
      </th>
      <th className='hidden md:table-cell'>
        <Tippy
          content={`${guildJson.name} is #${props.slayer_index} in Slayers`}
        >
          <span className='px-1 font-normal bg-red-500 rounded-md'>
            {numberWithCommas(Math.round(guildJson.slayer))}
          </span>
        </Tippy>
      </th>
      <th className='hidden md:table-cell'>
        <Tippy
          content={`${guildJson.name} is #${props.catacombs_index} in Catacombs`}
        >
          <span className='px-1 font-normal bg-green-400 rounded-md'>
            {guildJson.catacombs}
          </span>
        </Tippy>
      </th>
      <th className='px-1 lg:px-5 hidden lg:table-cell'>{TimeAgo}</th>
    </tr>
  );
};

const sortOnFunct = (guild_data, sortOn) => {
  let r = guild_data.slice();

  r.sort(function (a, b) {
    return b[sortOn] - a[sortOn];
  });
  return r;
};

const Guilds = (props) => {
  let guild_data = props.guildsJson.slice();

  const [usedWeight, setUsedWeight] = useState('Senither');

  // let usedWeight = props.cookies.weightUsed || 'Senither';
  let usedWeightKey =
    usedWeight === 'Senither' ? 'senither_weight' : 'lily_weight';
  // let usedWeight = 'Senither';
  // let usedWeightKey = usedWeight;

  const [sortOn, setSortOn] = useState(usedWeightKey);
  useEffect(() => {
    let newUsedWeight = props.cookies.weightUsed || 'Senither';
    setUsedWeight(newUsedWeight);
    setSortOn(newUsedWeight === 'Senither' ? 'senither_weight' : 'lily_weight');
  }, [props.cookies.weightUsed]);

  const [sortReversed, setSortReversed] = useState(false);

  const [sortedOnSlayer, setSortedOnSlayer] = useState(
    sortOnFunct(guild_data, 'slayer')
  );
  const [sortedOnCatacombs, setSortedOnCatacombs] = useState(
    sortOnFunct(guild_data, 'catacombs')
  );
  const [sortedOnSkill, setSortedOnSkills] = useState(
    sortOnFunct(guild_data, 'skills')
  );

  let showScammers;
  if (props.cookies.showScammers === undefined) {
    showScammers = true;
  } else {
    if (
      typeof props.cookies.showScammers === 'string' ||
      props.cookies.showScammers instanceof String
    ) {
      showScammers = props.cookies.showScammers === 'true';
    } else {
      showScammers = props.cookies.showScammers;
    }
  }

  guild_data.sort(function (a, b) {
    if (sortReversed === true) {
      if (sortOn.includes('weight')) {
        return a[sortOn] * a.multiplier - b[sortOn] * b.multiplier;
      }
      return a[sortOn] - b[sortOn];
    } else {
      if (sortOn.includes('weight')) {
        return b[sortOn] * b.multiplier - a[sortOn] * a.multiplier;
      }
      return b[sortOn] - a[sortOn];
    }
  });

  let guilds = [];

  for (const i in guild_data) {
    let guild_json = guild_data[i];

    let slayer_index =
      sortedOnSlayer.findIndex((guild) => guild.id === guild_json.id) + 1;
    let catacombs_index =
      sortedOnCatacombs.findIndex((guild) => guild.id === guild_json.id) + 1;
    let skills_index =
      sortedOnSkill.findIndex((guild) => guild.id === guild_json.id) + 1;

    guilds.push(
      <Guild
        position={parseInt(i) + 1}
        guildJson={guild_json}
        capture_date={TimeDelta.fromDate(
          guild_json.capture_date
        ).toNiceString()}
        showScammers={showScammers}
        usedWeight={usedWeight}
        sortOn={sortOn}
        sortReversed={sortReversed}
        slayer_index={slayer_index}
        catacombs_index={catacombs_index}
        skills_index={skills_index}
        key={guild_json.id}
        color={
          i % 2 === 0
            ? 'bg-tertiary hover:bg-lighttertiary'
            : 'hover:bg-lightprimary'
        }
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
    <table className='text-white bg-primary text-center rounded-md w-[90%] text-[0.6em] xs:text-[0.8em] sm:text-base md:text-sm lg:text-[1rem] xl:w-4/5 2xl:text-xl mx-auto'>
      <tbody>
        <tr>
          <th className='pl-1 md:pl-6'>#</th>
          <th></th>
          <th></th>
          <th className='tracking-[.1em] text-left'>Guilds</th>
          <th
            className='hover:cursor-pointer'
            onClick={() => {
              onSortClick('members');
            }}
          >
            Member
          </th>
          <th
            className='hover:cursor-pointer'
            onClick={() => {
              onSortClick(usedWeightKey);
            }}
          >
            Weight
          </th>
          <th
            className='hover:cursor-pointer'
            onClick={() => {
              onSortClick('networth');
            }}
          >
            Networth
          </th>
          <th
            className='hover:cursor-pointer hidden md:table-cell'
            onClick={() => {
              onSortClick('skills');
            }}
          >
            Average Skills
          </th>
          <th
            className='hover:cursor-pointer hidden md:table-cell'
            onClick={() => {
              onSortClick('slayer');
            }}
          >
            Slayers
          </th>
          <th
            className='hover:cursor-pointer hidden md:table-cell'
            onClick={() => {
              onSortClick('catacombs');
            }}
          >
            Catacombs
          </th>
          <th className='hidden lg:table-cell'>Last updated</th>
        </tr>
        {guilds}
      </tbody>
    </table>
  );
};

export default function Home({ guildsJson, stats }) {
  const [cookies, setCookie] = useCookies(['showScammers', 'weightUsed']);

  function changeCookie(key, value) {
    setCookie(key, value, { path: '/' });
  }
  return (
    <div
      id='maindiv'
      className='bg-secondary min-h-screen space-y-10 sm:h-96 overflow-y-auto overflow-x-hidden scrollbar'
      onScroll={() => {
        hideAll({ duration: 0 });
      }}
    >
      <NavigationBar
        cookies={cookies}
        changeCookie={changeCookie}
        patronscount={stats.patrons}
      />
      <StatsHeader stats={stats} />
      <Guilds cookies={cookies} guildsJson={guildsJson} />
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const res = await axios.get('https://api.guildleaderboard.com/leaderboard');

  const guildsJson = res.data;
  if (res.status !== 200) {
    console.error(json);
    throw new Error('Failed to fetch API');
  }
  const res2 = await axios.get('https://api.guildleaderboard.com/stats');

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
    revalidate: 10,
  };
}
