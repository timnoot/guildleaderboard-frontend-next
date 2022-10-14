import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import axios from 'axios';

import 'tippy.js/dist/tippy.css'; // optional

import {
  numberShortener,
  numberWithCommas,
} from '../../utils/numformatting.js';
import { capitalizeFirstLetter, getSlayerLevel } from '../../utils/other.js';
import { TimeDelta } from '../../utils/timedelta.js';
import {
  APIURL,
  skills,
  slayers,
  skillMaxLevel,
  dungeons,
} from '../../utils/constants.js';

import { JoinLog } from '../../components/JoinLogs.js';
import {
  StatBlockTop,
  OutsideLink,
  CopyButton,
  BackButton,
  MenuButton,
} from '../../components/StatBlocks';
import { Footer } from '../../components/Footer';
import { ProgressBar } from '../../components/ProgressBar.js';
import { CustomChart2 } from '../../components/Chart.js';
import { LoadingScreen } from '../../components/Screens.js';

import ReactTags from 'react-tag-autocomplete';

class JoinLogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historyGuildJson: null,
      historyIsLoaded: null,
      current_page: 1,
      last_page: null,
    };
    this.uuid = props.uuid;
    this.loadHistory = this.loadHistory.bind(this);
  }

  render() {
    if (!this.state.historyGuildJson) {
      return <LoadingScreen />;
    }

    let logsElements = [];
    let historyData = this.state.historyGuildJson.data;
    // fix the order of the logs

    for (let i = 0; i < historyData.length; i++) {
      // yes
    }

    for (const i in historyData) {
      let log = historyData[i];
      let time_difference = TimeDelta.fromDate(log.capture_date);

      logsElements.push(
        <Link href={`/guild/${log.guild_id}`}>
          <a>
            <JoinLog
              key={`${log.uuid}-${log.capture_date}`}
              type={log.type}
              name={log.guild_name}
              time_difference={time_difference}
            />
          </a>
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
      let active =
        number === this.state.current_page
          ? 'bg-green-800 text-white'
          : 'bg-primary text-white';
      middleButtons.push(
        <button
          className={`${active} rounded-md py-1 px-1 xs:px-2 my-1 mx-[0.125rem] align-middle inline-block`}
          key={`${number}-button`}
          onClick={() => {
            this.loadHistory(this.uuid, number);
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
                    this.loadHistory(this.uuid, this.state.current_page - 1);
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
                    this.loadHistory(this.uuid, this.state.current_page + 1);
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

  loadHistory(uuid, page) {
    let paths = window.location.href.split('/');
    if (!this.uuid) {
      uuid = paths[paths.length - 1];
    }

    fetch(`${APIURL}v2/history?uuid=${uuid}&per_page=10&page=${page}`)
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
            window.location.href = '/';
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
    this.loadHistory(this.uuid, 1);
  }
}

class PlayerMetrics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      suggestions: [],
      all_series: {},
      autoCompleteLoaded: false,
      change: 0,
      daysShow: 90,
      showMetrics: {
        general: true,
        skill: false,
        dungeon: false,
        slayer: false,
      },
    };
    this.reactTags = React.createRef();
    this.getSeries.bind(this);
    this.metricsKeys = {
      general: ['senither_weight', 'lily_weight', 'average_skill', 'networth'],
      skill: [
        ['combat', 'combat_xp'],
        ['alchemy', 'alchemy_xp'],
        ['enchanting', 'enchanting_xp'],
        ['farming', 'farming_xp'],
        ['fishing', 'fishing_xp'],
        ['foraging', 'foraging_xp'],
        ['mining', 'mining_xp'],
        ['taming', 'taming_xp'],
      ],
      dungeon: [
        ['catacombs', 'catacombs_xp'],
        ['archer', 'archer_xp'],
        ['berserk', 'berserk_xp'],
        ['healer', 'healer_xp'],
        ['mage', 'mage_xp'],
        ['tank', 'tank_xp'],
      ],
      slayer: ['zombie_xp', 'wolf_xp', 'spider_xp', 'enderman_xp', 'blaze_xp'],
    };
  }

  onDelete(i) {
    const tags = this.state.tags.slice(0);
    let uuid = tags.splice(i, 1)[0].id;
    // remove guild from guild_sorted_data
    let all_series = this.state.all_series;
    delete all_series[uuid];
    this.setState({
      tags: tags,
      all_series: all_series,
      change: this.state.change + 1,
    });
  }

  onAddition(tag) {
    let uuid = tag.id || tag.name;

    fetch(`${APIURL}metrics/player/${uuid}`)
      .then((res) => res.json())
      .then(
        (result) => {
          let all_series = this.state.all_series;
          if (result) {
            uuid = result[result.length - 1].uuid;
            let name = result[result.length - 1].name;

            all_series[uuid] = result;
            tag.name = name;
            tag.id = uuid;
            const tags = [].concat(this.state.tags, tag);
            this.setState({
              tags: tags,
              all_series: all_series,
              change: this.state.change + 1,
            });
          }
        },
        (error) => {
          console.log(error);
          this.setState({
            metricsIsLoaded: true,
            error,
          });
        }
      );
  }

  getSeries(wanted_key, daysShow) {
    let result = [];

    // loop through given
    for (let uuid in this.state.all_series) {
      let metrics = this.state.all_series[uuid];

      let last = metrics[metrics.length - 1];

      let tempresult = {
        data: [],
        name: last.name,
      };

      for (const i in metrics) {
        let metric = metrics[i];

        let timeDelta = TimeDelta.fromDate(metric['capture_date']);
        if (timeDelta.toSeconds() > daysShow * 24 * 60 * 60) {
          continue;
        }
        tempresult['data'].push([
          Date.now() - timeDelta.toMS(),
          metric[wanted_key],
        ]);
      }
      result.push(tempresult);
    }
    return result;
  }

  getMetricName(metric) {
    return metric
      .replace('xp', 'XP')
      .split('_')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
  }

  render() {
    let daysShow = this.state.daysShow;
    let metricsCharts = [];
    // loop through showMetrics
    for (const key in this.state.showMetrics) {
      metricsCharts.push(
        <div className='pt-4'>
          <div className='text-4xl text-white'>
            {capitalizeFirstLetter(key)} Metrics
          </div>
          <hr className='border-none bg-tertiary h-[2px] my-4 mx-[5%]' />
        </div>
      );
      if (this.state.showMetrics[key]) {
        for (const i in this.metricsKeys[key]) {
          let metric = this.metricsKeys[key][i];
          if (typeof metric === 'object') {
            let metricName1 = this.getMetricName(metric[0]);
            let metricName2 = this.getMetricName(metric[1]);
            metricsCharts.push(
              <div>
                <div className='p-2 m-1 rounded-md md:inline-block h-80 md:h-96 md:w-1/3 bg-primary'>
                  <CustomChart2
                    series={this.getSeries(metric[0], daysShow)}
                    title={metricName1}
                    width={'100%'}
                    height={'100%'}
                    key={this.state.change}
                  />
                </div>
                <div className='p-2 m-1 rounded-md md:inline-block h-80 md:h-96 md:w-1/3 bg-primary'>
                  <CustomChart2
                    series={this.getSeries(metric[1], daysShow)}
                    title={metricName2}
                    width={'100%'}
                    height={'100%'}
                    key={this.state.change}
                  />
                </div>
              </div>
            );
          } else {
            let metricName = this.getMetricName(metric);
            metricsCharts.push(
              <div className='p-2 m-2 rounded-md md:inline-block h-80 md:h-96 md:w-2/3 bg-primary'>
                <CustomChart2
                  series={this.getSeries(metric, daysShow)}
                  title={metricName}
                  width={'100%'}
                  height={'100%'}
                  key={this.state.change}
                />
              </div>
            );
          }
        }
      } else {
        metricsCharts.push(
          <div>
            <button
              className='text-white p-2 m-2 rounded-md w-[90%] md:inline-block h-80 md:h-96 md:w-2/3 bg-primary text-xl md:text-4xl lg:text-6xl'
              onClick={() => {
                let showMetrics = this.state.showMetrics;
                showMetrics[key] = true;
                this.setState({
                  showMetrics: showMetrics,
                });
              }}
            >
              Show {capitalizeFirstLetter(key)} Metrics
            </button>
          </div>
        );
      }
    }
    let daysProps = [
      7, 30, 90
    ]

    return (
      <div className='text-black'>
        <div className='text-center'>
          <div className='inline-block p-1 w-[90%] md:w-2/3 text-left mb-20'>
            <ReactTags
              ref={this.reactTags}
              tags={this.state.tags}
              onDelete={this.onDelete.bind(this)}
              onAddition={this.onAddition.bind(this)}
              placeholderText='Add a player'
              allowNew={true}
            />
          </div>
        </div>
        <div className='text-sm text-center text-white'>
          {
            daysProps.map((days) => {
              return (
                <MenuButton
                  key={days}
                  onClick={() => {
                    this.setState({
                      daysShow: days,
                      change: this.state.change + 1,
                      showMetrics: {
                        general: true,
                        skill: false,
                        dungeon: false,
                        slayer: false,
                      },
                    });
                  }}
                  disabled={daysShow === days}
                  className='mx-1'
                >
                  {days} days
                </MenuButton>
              )
            })
          }
        </div>
        <div className='text-center'>{metricsCharts}</div>
      </div>
    );
  }

  componentDidMount() {
    this.onAddition({ id: this.props.uuid, name: this.props.name });
  }
}

class PlayerStats extends React.Component {
  constructor(props) {
    super(props);
    this.playerJson = props.playerJson;
  }

  render() {
    let skillProgressBars = [];
    for (const skill in skills) {
      let skillName = skills[skill];
      let level = this.playerJson[skillName];
      let levelProgress = level - parseInt(level);

      if (level >= skillMaxLevel[skillName]) {
        levelProgress = 1;
      }

      skillProgressBars.push(
        <div className='inline-block p-2 w-[45%] sm:w-64 lg:w-96'>
          <ProgressBar
            key={skillName}
            name={`${capitalizeFirstLetter(skillName)} ${numberWithCommas(
              this.playerJson[skillName]
            )}`}
            xp={this.playerJson[`${skillName}_xp`]}
            levelProgress={levelProgress}
            color={
              level >= skillMaxLevel[skillName]
                ? 'bg-progressgold'
                : 'bg-progressblue'
            }
          />
        </div>
      );
    }
    let slayerProgressBars = [];
    for (const slayer in slayers) {
      let slayerName = slayers[slayer];

      let { level, progress } = getSlayerLevel(
        slayerName,
        this.playerJson[`${slayerName}_xp`]
      );
      if (level >= 9) {
        progress = 1;
      }

      slayerProgressBars.push(
        <div className='inline-block p-2 w-[45%] sm:w-64 lg:w-96'>
          <ProgressBar
            key={slayerName}
            name={`${capitalizeFirstLetter(slayerName)} ${level}`}
            xp={this.playerJson[`${slayerName}_xp`]}
            levelProgress={progress}
            color={level >= 9 ? 'bg-progressgold' : 'bg-progressblue'}
          />
        </div>
      );
    }

    let dungeonProgressBars = [];
    for (const dungeon in dungeons) {
      let dungeonName = dungeons[dungeon];
      let level = this.playerJson[dungeonName];
      let levelProgress = level - parseInt(level);

      if (level >= 50) {
        levelProgress = 1;
      }

      dungeonProgressBars.push(
        <div className='inline-block p-2 w-[45%] sm:w-64 lg:w-96'>
          <ProgressBar
            key={dungeonName}
            name={`${capitalizeFirstLetter(dungeonName)} ${numberWithCommas(
              this.playerJson[dungeonName]
            )}`}
            xp={this.playerJson[`${dungeonName}_xp`]}
            levelProgress={levelProgress}
            color={level >= 50 ? 'bg-progressgold' : 'bg-progressblue'}
          />
        </div>
      );
    }

    return (
      <div className='text-center'>
        <div className='inline-block w-full pb-20'>
          <div className='text-4xl'>Skills</div>
          <hr className='border-none bg-tertiary h-[2px] my-4 mx-[5%]' />
          {skillProgressBars}
        </div>
        <div className='inline-block w-full pb-20'>
          <div className='text-4xl'>Slayers</div>
          <hr className='border-none bg-tertiary h-[2px] my-4 mx-[5%]' />
          {slayerProgressBars}
        </div>
        <div className='inline-block w-full pb-20'>
          <div className='text-4xl'>Dungeons</div>
          <hr className='border-none bg-tertiary h-[2px] my-4 mx-[5%]' />
          {dungeonProgressBars}
        </div>
      </div>
    );
  }
}

export default function Player({ player }) {
  const [selectedPage, setSelectedPage] = useState('stats');

  const router = useRouter();
  useEffect(() => {
    router.push(`/player/${player.name}`);
  }, []);

  let component;

  if (selectedPage === 'stats') {
    component = <PlayerStats playerJson={player} />;
  } else if (selectedPage === 'metrics') {
    component = <PlayerMetrics uuid={player.uuid} name={player.name} />;
  } else if (selectedPage === 'history') {
    component = <JoinLogs uuid={player.uuid} />;
  }

  if (player.limited && selectedPage !== 'history') {
    component = (
      <div className='text-center'>
        <div className='text-lg text-white'>
          This player has not been updated yet or is not in one of the
          leaderboard guilds!
          <br />
          Get your guild added to the leaderboard by making a ticket in{' '}
          <a
            href='https://discord.gg/ej92B474Ej'
            className='text-blue-500 underline'
          >
            our discord
          </a>
          .
        </div>
      </div>
    );
  }

  let last_updated = TimeDelta.fromDate(player.capture_date);
  let notUpdatedText;
  // 25 hours
  if (last_updated.toMS() > 1000 * 60 * 60 * 25) {
    notUpdatedText = (
      <span className='text-red-500'>
        Last updated {last_updated.toNiceStringWDays()}
      </span>
    );
  } else {
    notUpdatedText = <></>;
  }

  return (
    <div className='min-h-screen space-y-10 overflow-y-auto bg-secondary pt-7 sm:h-96 scrollbar text-white text-center font-[Helvetica]'>
      <Head>
        <title>{player.name} - Hypixel Skyblock Statistics</title>
        <meta name='title' content={`${player.name} statistics`} />
        <meta
          name='description'
          content={`View the statistics of ${player.name} here!`}
        />

        <meta property='og:title' content={player.name} />
        <meta property='og:site_name' content='GuildLeaderboard' />
        <meta
          property='og:description'
          content={`
💪 Senither: ${numberWithCommas(player.senither_weight)}
🌺 Lily: ${numberWithCommas(player.lily_weight)}
💵 Networth: ${numberShortener(player.networth)}

📚 Avg Skill: ${numberWithCommas(player.average_skill)}
💀 Catacombs: ${numberWithCommas(player.catacombs)} (🚑 ${parseInt(
            player.healer
          )} 🧙🏽 ${parseInt(player.mage)} 🗡️ ${parseInt(
            player.berserk
          )} 🏹 ${parseInt(player.archer)} 🛡️ ${parseInt(player.tank)})
🔫 Slayer: ${numberShortener(
            player.wolf_xp +
            player.spider_xp +
            player.zombie_xp +
            player.blaze_xp +
            player.enderman_xp
          )} 🧟 ${getSlayerLevel('zombie', player.zombie_xp).level} 🕸️ ${getSlayerLevel('spider', player.spider_xp).level
            } 🐺 ${getSlayerLevel('wolf', player.wolf_xp).level} 🔮 ${getSlayerLevel('enderman', player.enderman_xp).level
            } 🔥 ${getSlayerLevel('blaze', player.blaze_xp).level}`}
        />
        <meta
          property='og:image'
          content={`https://crafatar.com/avatars/${player.uuid}?size=512&overlay`}
        />
      </Head>
      <div>
        <div>
          <h1 className='text-[2em] sm:text-[3em] font-semibold'>
            {player.name}
          </h1>
          <h2
            className={`text-[1em] sm:text-[1.5em] font-semibold ${Boolean(player.guild_name) ? '' : 'hidden'
              }`}
          >
            From{' '}
            <Link href={`/guild/${player.guild_name}`}>
              <a className='inline-block text-blue-500 underline cursor-pointer'>
                {player.guild_name}
              </a>
            </Link>
          </h2>

          <div className='p-2 text-center'>
            <StatBlockTop
              color='bg-purple-700'
              value={numberWithCommas(player.senither_weight)}
              name='Senither Weight'
            />
            <StatBlockTop
              color='bg-green-700'
              value={numberWithCommas(player.lily_weight)}
              name='Lily Weight'
            />
            <StatBlockTop
              value={numberShortener(player.networth)}
              name='Networth'
              color='bg-blue-700'
            />
            <StatBlockTop
              color='bg-blue-500'
              value={numberWithCommas(player.average_skill)}
              name='Skill Average'
            />
            <StatBlockTop
              color='bg-green-500'
              value={numberWithCommas(player.catacombs)}
              name='Catacombs'
            />
            <StatBlockTop
              color='bg-red-500'
              value={numberWithCommas(
                player.wolf_xp +
                player.spider_xp +
                player.zombie_xp +
                player.blaze_xp +
                player.enderman_xp
              )}
              name='Slayer'
            />
          </div>
          {notUpdatedText}
          <hr className='border-none bg-tertiary h-[2px] my-4 mx-[15%]' />
          <OutsideLink
            href={`https://sky.shiiyu.moe/${player.uuid}`}
            name='SkyCrypt'
          />
          <OutsideLink
            href={`https://plancke.io/hypixel/player/stats/${player.uuid}`}
            name='Plancke'
          />
          <OutsideLink
            href={`https://sky.coflnet.com/player/${player.uuid}`}
            name='Coflnet'
          />
          <CopyButton text='UUID' copy={player.uuid} />
        </div>
        <div>
          <Link href={player.guild_name ? `/guild/${player.guild_name}` : '/'}>
            <a>
              <BackButton
                className='bg-red-600 cursor-pointer'
                name={`Back to ${player.guild_name || 'Leaderboard'}`}
              />
            </a>
          </Link>
        </div>
      </div>
      <div className='text-center font-[Helvetica] my-4'>
        <div className='inline-block p-1'>
          <MenuButton
            onClick={(i) => setSelectedPage('stats')}
            disabled={selectedPage === 'stats'}
          >
            Show Stats
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
  let player = await axios
    .get(`${APIURL}player/${context.params?.id}`)
    .then((res) => res.data);
  if (!player) {
    player = {
      name: context.params?.id,
      uuid: context.params?.id,
      limited: true,
    };
  }

  return {
    props: {
      player,
    },
  };
};
