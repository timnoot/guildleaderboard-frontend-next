// import Head from 'next/head'
import Image from 'next/image';
// import styles from '../styles/Home.module.css'
import React from 'react';

import axios from 'axios';

import { TimeDelta } from '../utils/timedelta.js';
import { numberShortener, numberWithCommas } from '../utils/numformatting.js';
import { useRouter } from 'next/router';
// import { NavigationBar } from '../components/NavigationBar.js';

import 'tippy.js/dist/tippy.css'; // optional
import Tippy from '@tippyjs/react';
import { hideAll } from 'tippy.js';
import { useCookies } from 'react-cookie';

const Guild = (props) => {
  const router = useRouter();
  const goRouteId = () => {
    router.push(`/guild/${props.name}`);
  };

  let scammers_in_guild;
  if (props.scammers > 0 && props.showScammers) {
    scammers_in_guild = (
      <th className='md:pr-2'>
        <Tippy
          // options
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
              found {props.scammers} scammers in this guild.
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
                {props.scammers}
              </text>
            </svg>
          </div>
        </Tippy>
      </th>
    );
  } else {
    scammers_in_guild = <th></th>;
  }

  let position_change;
  if (
    Boolean(props.position_change) &&
    props.sortOn === 'senither_weight' &&
    !props.sortReversed
  ) {
    if (props.position_change > 0) {
      position_change = (
        <th className='text-left md:px-1'>
          <Image src='/uparrowgreen.svg' width={27} height={27} />
        </th>
      );
    } else {
      position_change = (
        <th className='text-left md:px-1'>
          <Image src='/downarrowred.svg' width={27} height={27} />
        </th>
      );
    }
  } else {
    position_change = <th></th>;
  }

  let weight;
  let weightColor;
  if (props.usedWeight === 'Senither') {
    weight = props.senither_weight;
    weightColor = 'bg-purple-700';
  } else {
    weight = props.lily_weight;
    weightColor = 'bg-green-700';
  }

  const [TimeAgo, SetTimeAgo] = React.useState('');
  React.useEffect(() => {
    SetTimeAgo(props.capture_date);
  }, []);

  return (
    <tr
      className={`${props.color} font-[Helvetica] hover:cursor-pointer`} // text-[.9em] font-semibold
      onClick={goRouteId}
    >
      <th className='pl-1 lg:pl-6'>{props.position}</th>
      {position_change}
      {scammers_in_guild}
      <th className='text-left'>{props.name}</th>
      <th>
        <span className='px-1 font-normal bg-yellow-500 rounded-md min-w-[2rem]'>
          {props.members}
        </span>
      </th>
      <th>
        <Tippy
          content={`${numberWithCommas(weight)} ${
            props.usedWeight
          } Weight with a multiplier of ${numberWithCommas(props.multiplier)}`}
        >
          <span className={`px-1 font-normal ${weightColor} rounded-md`}>
            {numberWithCommas(weight * props.multiplier)}
          </span>
        </Tippy>
      </th>
      <th>
        <Tippy
          content={`${numberShortener(
            props.networth * props.members
          )} total guild networth`}
        >
          <span className={`px-1 font-normal bg-blue-700 rounded-md`}>
            {numberShortener(props.networth)}
          </span>
        </Tippy>
      </th>
      <th className='hidden md:table-cell'>
        <Tippy
          content={`${props.name} is #${props.skills_index} in Average Skills`}
        >
          <span className='px-1 font-normal bg-blue-500 rounded-md'>
            {props.skills}
          </span>
        </Tippy>
      </th>
      <th className='hidden md:table-cell'>
        <Tippy content={`${props.name} is #${props.slayer_index} in Slayers`}>
          <span className='px-1 font-normal bg-red-500 rounded-md'>
            {numberWithCommas(Math.round(props.slayers))}
          </span>
        </Tippy>
      </th>
      <th className='hidden md:table-cell'>
        <Tippy
          content={`${props.name} is #${props.catacombs_index} in Catacombs`}
        >
          <span className='px-1 font-normal bg-green-400 rounded-md'>
            {props.catacombs}
          </span>
        </Tippy>
      </th>
      <th className='hidden px-1 lg:px-5 lg:table-cell'>
        {TimeAgo || props.capture_date}
      </th>
    </tr>
  );
};

class Guilds extends React.Component {
  constructor(props) {
    super(props);

    let usedWeight = props.cookies.weightUsed || 'Senither';
    let usedWeightKey =
      usedWeight === 'Senither' ? 'senither_weight' : 'lily_weight';

    let sortedOnSlayer = this.sortOn(props.guildsJson, 'slayer');
    let sortedOnSkill = this.sortOn(props.guildsJson, 'skills');
    let sortedOnCatacombs = this.sortOn(props.guildsJson, 'catacombs');

    this.state = {
      guildsJson: props.guildsJson,
      isLoaded: false,
      isError: false,
      error: null,
      sortOn: usedWeightKey,
      sortReversed: false,
      useMultiplier: true,
      sortedOnSlayer: sortedOnSlayer,
      sortedOnSkill: sortedOnSkill,
      sortedOnCatacombs: sortedOnCatacombs,
    };
    this.cookies = props.cookies;
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

  sortOn(guild_data, sortOn) {
    let r = guild_data.slice();

    r.sort(function (a, b) {
      return b[sortOn] - a[sortOn];
    });
    return r;
  }

  render() {
    let guild_data = this.state.guildsJson.slice();

    let sortOn = this.state.sortOn;
    let sortReversed = this.state.sortReversed;

    let usedWeight = this.cookies.weightUsed || 'Senither';
    let usedWeightKey =
      usedWeight === 'Senither' ? 'senither_weight' : 'lily_weight';
    if (sortOn.includes('weight')) {
      sortOn = usedWeightKey;
    }

    let showScammers;
    if (this.cookies.showScammers === undefined) {
      showScammers = true;
    } else {
      if (
        typeof this.cookies.showScammers === 'string' ||
        this.cookies.showScammers instanceof String
      ) {
        showScammers = this.cookies.showScammers === 'true';
      } else {
        showScammers = this.cookies.showScammers;
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

      let color =
        i % 2 === 0
          ? 'bg-tertiary hover:bg-lighttertiary'
          : 'hover:bg-lightprimary';

      let slayer_index;
      let catacombs_index;
      let skills_index;

      slayer_index =
        this.state.sortedOnSlayer.findIndex(
          (guild) => guild.id === guild_json.id
        ) + 1;
      catacombs_index =
        this.state.sortedOnCatacombs.findIndex(
          (guild) => guild.id === guild_json.id
        ) + 1;
      skills_index =
        this.state.sortedOnSkill.findIndex(
          (guild) => guild.id === guild_json.id
        ) + 1;

      guilds.push(
        <Guild
          position={parseInt(i) + 1}
          position_change={guild_json.position_change}
          name={guild_json.name}
          id={guild_json.id}
          members={guild_json.members}
          senither_weight={guild_json.senither_weight}
          lily_weight={guild_json.lily_weight}
          networth={guild_json.networth}
          skills={guild_json.skills}
          slayers={guild_json.slayer}
          scammers={guild_json.scammers}
          catacombs={guild_json.catacombs}
          multiplier={guild_json.multiplier}
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
          color={color}
        />
      );
    }
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
                this.onSortClick('members');
              }}
            >
              Member
            </th>
            <th
              className='hover:cursor-pointer'
              onClick={() => {
                this.onSortClick(usedWeightKey);
              }}
            >
              Weight
            </th>
            <th
              className='hover:cursor-pointer'
              onClick={() => {
                this.onSortClick('networth');
              }}
            >
              Networth
            </th>
            <th
              className='hidden hover:cursor-pointer md:table-cell'
              onClick={() => {
                this.onSortClick('skills');
              }}
            >
              Average Skills
            </th>
            <th
              className='hidden hover:cursor-pointer md:table-cell'
              onClick={() => {
                this.onSortClick('slayer');
              }}
            >
              Slayers
            </th>
            <th
              className='hidden hover:cursor-pointer md:table-cell'
              onClick={() => {
                this.onSortClick('catacombs');
              }}
            >
              Catacombs
            </th>
            <th className='hidden lg:table-cell'>Last updated</th>
          </tr>
          {guilds}
          {/* <th className='h-2'></th> */}
        </tbody>
      </table>
    );
  }
}

export default function Home({ guildsJson }) {
  const [cookies, setCookie] = useCookies(['showScammers', 'weightUsed']);

  function changeCookie(key, value) {
    setCookie(key, value, { path: '/' });
  }
  return (
    <div
      className='min-h-screen space-y-10 overflow-x-hidden overflow-y-auto bg-secondary sm:h-96 scrollbar'
      onScroll={() => {
        hideAll({ duration: 0 });
      }}
    >
      <Guilds cookies={cookies} guildsJson={guildsJson} />
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

  return {
    props: {
      guildsJson,
    },
    revalidate: 5,
  };
}

{
  /* <div className={styles.container}>
<Head>
  <title>Create Next App</title>
  <meta name="description" content="Generated by create next app" />
  <link rel="icon" href="/favicon.ico" />
</Head>

<main className={styles.main}>
  <h1 className={styles.title}>
    Welcome to <a href="https://nextjs.org">Next.js!</a>
  </h1>

  <p className={styles.description}>
    Get started by editing{' '}
    <code className={styles.code}>pages/index.js</code>
  </p>

  <div className={styles.grid}>
    <a href="https://nextjs.org/docs" className={styles.card}>
      <h2>Documentation &rarr;</h2>
      <p>Find in-depth information about Next.js features and API.</p>
    </a>

    <a href="https://nextjs.org/learn" className={styles.card}>
      <h2>Learn &rarr;</h2>
      <p>Learn about Next.js in an interactive course with quizzes!</p>
    </a>

    <a
      href="https://github.com/vercel/next.js/tree/canary/examples"
      className={styles.card}
    >
      <h2>Examples &rarr;</h2>
      <p>Discover and deploy boilerplate example Next.js projects.</p>
    </a>

    <a
      href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
      className={styles.card}
    >
      <h2>Deploy &rarr;</h2>
      <p>
        Instantly deploy your Next.js site to a public URL with Vercel.
      </p>
    </a>
  </div>
</main>

<footer className={styles.footer}>
  <a
    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
    target="_blank"
    rel="noopener noreferrer"
  >
    Powered by{' '}
    <span className={styles.logo}>
      <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
    </span>
  </a>
</footer>
</div> */
}
