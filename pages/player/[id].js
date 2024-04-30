import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import axios from 'axios';

import 'tippy.js/dist/tippy.css'; // optional

import { numberShortener, numberWithCommas } from '../../utils/numformatting.js';
import { capitalizeFirstLetter, getSlayerLevel, getCataLevel, getSkillLevel } from '../../utils/other.js';
import { TimeDelta } from '../../utils/timedelta.js';
import { APIURL, GENERAL_NUMS, SKILL_NUMS, SLAYER_NUMS, DUNGEON_NUMS, skillMaxLevel, COLOR_ARRAY } from '../../utils/constants.js';

import { JoinLog } from '../../components/JoinLogs.js';
import { StatBlockTop, OutsideLink, CopyButton, MenuButton } from '../../components/StatBlocks';
import { Footer } from '../../components/Footer';
import { ProgressBar } from '../../components/ProgressBar.js';
import { CustomChart2 } from '../../components/Chart.js';
import { LoadingScreen } from '../../components/Screens.js';
import { SuggestionBar } from '../../components/SuggestionBar.js';

import { FaArrowLeft } from 'react-icons/fa';

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
          <JoinLog
            key={`${log.uuid}-${log.capture_date}`}
            type={log.type}
            name={log.guild_name}
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

    fetch(`${APIURL}history?uuid=${uuid}&per_page=10&page=${page}`)
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

const PlayerMetrics = (props) => {
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([
    { id: 'bf8794f505124d7da30ae238a1efb4c2', name: 'timnoot' },
    { id: "31b5211af8b64ea8abc6b16d6dddb07b", name: 'Nemqnja' }
  ]);
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
    { id: 'average_skill', title: 'Average Skill' },
    { id: 'combat', title: 'Combat XP' },
    { id: 'alchemy', title: 'Alchemy XP' },
    { id: 'enchanting', title: 'Enchanting XP' },
    { id: 'farming', title: 'Farming XP' },
    { id: 'fishing', title: 'Fishing XP' },
    { id: 'foraging', title: 'Foraging XP' },
    { id: 'mining', title: 'Mining XP' },
    { id: 'taming', title: 'Taming XP' },
    { id: 'carpentry', title: 'Carpentry XP' },
    { id: 'catacombs', title: 'Catacombs XP' },
    { id: 'archer', title: 'Archer XP' },
    { id: 'berserk', title: 'Berserk XP' },
    { id: 'healer', title: 'Healer XP' },
    { id: 'mage', title: 'Mage XP' },
    { id: 'tank', title: 'Tank XP' },
    { id: 'zombie', title: 'Zombie XP' },
    { id: 'wolf', title: 'Wolf XP' },
    { id: 'spider', title: 'Spider XP' },
    { id: 'enderman', title: 'Enderman XP' },
    { id: 'blaze', title: 'Blaze XP' },
    { id: 'vampire', title: 'Vampire XP' },
  ];
  const category = {
    general_stats: ['sb_experience', 'networth', 'senither_weight', 'lily_weight'],
    skill_stats: ['average_skill', 'combat', 'alchemy', 'enchanting', 'farming', 'fishing', 'foraging', 'mining', 'taming', 'carpentry'],
    dungeon_stats: ['catacombs', 'archer', 'berserk', 'healer', 'mage', 'tank'],
    slayer_stats: ['zombie', 'wolf', 'spider', 'enderman', 'blaze', 'vampire'],
  };

  const onDelete = (uuid) => {
    const tagsCopy = tags.slice(0);
    for (const i in tagsCopy) {
      if (tagsCopy[i].id === uuid) {
        tagsCopy.splice(i, 1);
      }
    }
    // remove guild from guild_sorted_data
    delete all_datasets[uuid];
    setTags(tagsCopy);
    setAllDatasets({ ...all_datasets });
  };

  const onAddition = (tag) => {
    const tagsCopy = [].concat(tags, tag);
    let uuid = tag.id;

    fetch(`${APIURL}metrics/player/${uuid}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        }
      })
      .then((result) => {
        if (result) {
          all_datasets[uuid] = result;
          setTags(tagsCopy);
          setAllDatasets({ ...all_datasets });
        }
      },
        (error) => {
          console.log(error);
        }
      );
  };

  const getPlayerName = (uuid) => {
    // loop through tags and find the name
    for (const i in tags) {
      if (tags[i].id === uuid) {
        return tags[i].name;
      }
    }
  }

  useEffect(() => {
    if (autoCompleteLoaded) {
      return;
    }
    onAddition({ id: props.uuid, name: props.name });
    // setChange(change + 1);
    // fetch(`${APIURL}autocomplete`)
    //   .then((res) => res.json())
    //   .then(
    //     (result) => {
    //       setAutoCompleteLoaded(true);
    //       setSuggestions(result);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
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
      // let statNum = GENERAL_NUMS[chart.id];
      // let statCategory = 'general_stats';
      // determine the stat category with category 
      let statCategory;
      let statNum;
      if (category.general_stats.includes(chart.id)) {
        statCategory = 'general_stats';
        statNum = GENERAL_NUMS[chart.id];
      } else if (category.skill_stats.includes(chart.id)) {
        statCategory = 'skill_stats';
        statNum = SKILL_NUMS[chart.id];
      } else if (category.dungeon_stats.includes(chart.id)) {
        statCategory = 'dungeon_stats';
        statNum = DUNGEON_NUMS[chart.id];
      } else if (category.slayer_stats.includes(chart.id)) {
        statCategory = 'slayer_stats';
        statNum = SLAYER_NUMS[chart.id];
      }

      // loop through the guilds
      let datasets = [];
      for (const uuid in all_datasets) {
        let playerMetrics = all_datasets[uuid];
        let playerName = getPlayerName(uuid);

        // loop through guildMetrics
        let playerData = [];
        let currentDate = new Date();
        let playerMetricsIndex = 0;

        for (let j = 0; j < 90; j++) {
          if (playerMetricsIndex >= playerMetrics.length) {
            playerData.push(null);
            currentDate.setDate(currentDate.getDate() - 1);
            continue;
          }
          let metric = playerMetrics[playerMetricsIndex];
          let metricDate = new Date(metric.capture_date);
          // console.log(metricDate.toDateString(), currentDate.toDateString());
          // if the metric date is the same as the current date or the metric date is older than the current date
          if (metricDate.toDateString() === currentDate.toDateString()) {
            playerData.push(metric[statCategory].split(',')[statNum]);
            playerMetricsIndex++;
            // console.log("pushed")
          } else if (metricDate > currentDate) {
            playerMetricsIndex++;
            currentDate.setDate(currentDate.getDate() + 1);
            j--;
            // console.log("skipped")
          }
          else {
            playerData.push(null);
            // console.log("null")
          }
          currentDate.setDate(currentDate.getDate() - 1);
        }
        // console.log(playerData.length);

        datasets.push({
          label: playerName,
          data: playerData.reverse(),
          borderColor: COLOR_ARRAY[uuid % COLOR_ARRAY.length],
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

    for (const i in category) {
      let categoryData = category[i];
      let categoryCharts = [];
      for (const j in categoryData) {
        let chart_id = categoryData[j];
        // find the name of the chart
        let chartName = chartsProps.find(chart => chart.id === chart_id).title;

        let dataSet = datasets[chart_id].map(dataset => ({ ...dataset }));
        for (const k in dataSet) {
          dataSet[k].data = dataSet[k].data.slice(90 - daysShow);
        }
        categoryCharts.push(
          <div
            className='p-4 m-2 rounded-md md:inline-block  md:w-2/3 bg-primary' // h-80 md:h-96
            key={chart_id}
          >
            <CustomChart2
              title={chartName}
              datasets={dataSet}
              labels={labels}
              key={chart_id + chartsUpdate}
            />
          </div>
        );
      }
      newCharts.push(
        <div>
          <div className='text-4xl m-2 mt-4 text-white'>{capitalizeFirstLetter(i.replace("_stats", ""))} Metrics</div>
          <hr className='border-none bg-tertiary h-[2px] my-4 mx-[5%]' />
          {categoryCharts}
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
            placeholderText='Add a player'
            mustBeSuggestion={false}
          />
        </div>
      </div>
      <div className='text-sm text-center text-white'>
        {daysProps.map((days) => {
          return (
            <MenuButton
              onClick={() => setDaysShow(days)}
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

const PlayerStats = (props) => {
  let skill_stats = props.player.metrics[0].skill_stats.split(',');
  let skillProgressBars = [];

  for (const skillName in SKILL_NUMS) {
    if (skillName === 'average_skill') {
      continue;
    }
    let skillNum = SKILL_NUMS[skillName];
    let xp = skill_stats[skillNum];
    let level = getSkillLevel(xp, skillMaxLevel[skillName]);
    let levelProgress = level - parseInt(level);

    if (level >= skillMaxLevel[skillName]) {
      levelProgress = 1;
    }

    skillProgressBars.push(
      <div className='inline-block p-2 w-[45%] sm:w-64 lg:w-96'>
        <ProgressBar
          key={skillName}
          name={`${capitalizeFirstLetter(skillName)} ${numberWithCommas(level)}`}
          xp={xp}
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

  let slayer_stats = props.player.metrics[0].slayer_stats.split(',');
  let slayerProgressBars = [];

  for (const slayerName in SLAYER_NUMS) {
    let slayerNum = SLAYER_NUMS[slayerName];

    let { level, progress } = getSlayerLevel(slayerName, slayer_stats[slayerNum]);
    if (level >= 9) {
      progress = 1;
    }
    if (slayerName === 'vampire' && level >= 5) {
      progress = 1;
    }

    slayerProgressBars.push(
      <div className='inline-block p-2 w-[45%] sm:w-64 lg:w-96'>
        <ProgressBar
          key={slayerName}
          name={`${capitalizeFirstLetter(slayerName)} ${level}`}
          xp={slayer_stats[slayerNum]}
          levelProgress={progress}
          color={(level >= 9 || (slayerName === 'vampire' && level >= 5)) ? 'bg-progressgold' : 'bg-progressblue'}
        />
      </div>
    );
  }

  let dungeon_stats = props.player.metrics[0].dungeon_stats.split(',');
  let dungeonProgressBars = [];
  for (const dungeonName in DUNGEON_NUMS) {
    let dungeonNum = DUNGEON_NUMS[dungeonName];
    let xp = dungeon_stats[dungeonNum];
    let level = getCataLevel(xp);

    let levelProgress = level - parseInt(level);

    if (level >= 50) {
      levelProgress = 1;
    }

    dungeonProgressBars.push(
      <div className='inline-block p-2 w-[45%] sm:w-64 lg:w-96'>
        <ProgressBar
          key={dungeonName}
          name={`${capitalizeFirstLetter(dungeonName)} ${numberWithCommas(
            level
          )}`}
          xp={xp}
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

export default function Player({ player }) {
  const [selectedPage, setSelectedPage] = useState('stats');

  const router = useRouter();
  useEffect(() => {
    // change to player name but do not reload the page
    if (player.name !== router.query.id) {
      router.replace(`/player/${player.name}`, undefined, { shallow: true });
    }
  }, []);

  let component;

  if (selectedPage === 'stats') {
    component = <PlayerStats player={player} />;
  } else if (selectedPage === 'metrics') {
    component = <PlayerMetrics uuid={player._id} name={player.name} />;
  } else if (selectedPage === 'history') {
    component = <JoinLogs uuid={player._id} />;
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

  let last_updated = TimeDelta.fromDate(player.latest_capture_date);
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
  console.log(player)
  let slayer_stats = player.limited ? [] : player.metrics[0].slayer_stats.split(',');
  let dungeon_stats = player.limited ? [] : player.metrics[0].dungeon_stats.split(',');

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
🏆 SkyBlock level: ${Math.floor(player.latest_sb_xp / 100)}
💵 Networth: ${numberShortener(player.latest_nw)}

💪 Senither: ${numberWithCommas(Math.round(player.latest_senither))}
🌺 Lily: ${numberWithCommas(Math.round(player.latest_lily))}

📚 Avg Skill: ${numberWithCommas(player.latest_asl)}
💀 Catacombs: ${numberWithCommas(parseInt(getCataLevel(player.latest_cata)))} (🚑 ${numberWithCommas(parseInt(getCataLevel(dungeon_stats[1])))} 🧙🏽 ${numberWithCommas(parseInt(getCataLevel(dungeon_stats[2])))} 🗡️ ${numberWithCommas(parseInt(getCataLevel(dungeon_stats[3])))} 🏹 ${numberWithCommas(parseInt(getCataLevel(dungeon_stats[4])))} 🛡️ ${numberWithCommas(parseInt(getCataLevel(dungeon_stats[5])))})
🔫 Slayer: ${numberShortener(slayer_stats[0])} 🧟 ${getSlayerLevel('zombie', slayer_stats[1]).level} 🕸️ ${getSlayerLevel('spider', slayer_stats[2]).level
            } 🐺 ${getSlayerLevel('wolf', slayer_stats[3]).level} 🔮 ${getSlayerLevel('enderman', slayer_stats[4]).level
            } 🔥 ${getSlayerLevel('blaze', slayer_stats[5]).level} 🧛 ${getSlayerLevel('enderman', slayer_stats[6]).level}`}
        />
        <meta
          property='og:image'
          content={`https://crafatar.com/avatars/${player._id}?size=512&overlay`}
        />
      </Head>
      <div>
        <div>
          <h1 className='text-[2em] sm:text-[3em] font-semibold'>
            {player.name}
          </h1>
          <h2
            className={`text-[1em] sm:text-[1.5em] font-semibold ${Boolean(player.guild_name) ? '' : 'hidden'}`}
          >
            From{' '}
            <Link href={`/guild/${player.guild_name}`} className='inline-block text-blue-500 underline cursor-pointer'>
              {player.guild_name}
            </Link>
          </h2>

          <div className='p-2 text-center'>
            <StatBlockTop
              color='bg-levelorange'
              value={Math.floor(player.latest_sb_xp / 100)}
              name='SkyBlock level'
            />
            <StatBlockTop
              value={numberShortener(player.latest_nw)}
              name='Networth'
              color='bg-blue-700'
            />
            <StatBlockTop
              color='bg-purple-700'
              value={numberWithCommas(player.latest_senither)}
              name='Senither Weight'
            />
            <StatBlockTop
              color='bg-green-700'
              value={numberWithCommas(player.latest_lily)}
              name='Lily Weight'
            />
            <StatBlockTop
              color='bg-blue-500'
              value={numberWithCommas(player.latest_asl)}
              name='Skill Average'
            />
            <StatBlockTop
              color='bg-green-500'
              value={numberWithCommas(getCataLevel(player.latest_cata))}
              name='Catacombs'
            />
            <StatBlockTop
              color='bg-red-500'
              value={numberWithCommas(slayer_stats[0])}
              name='Slayer'
            />
          </div>
          {notUpdatedText}
          <hr className='border-none bg-tertiary h-[2px] my-4 mx-[15%]' />
          <OutsideLink
            href={`https://sky.shiiyu.moe/stats/${player._id}`}
            name='SkyCrypt'
          />
          <OutsideLink
            href={`https://plancke.io/hypixel/player/stats/${player._id}`}
            name='Plancke'
          />
          <OutsideLink
            href={`https://sky.coflnet.com/player/${player._id}`}
            name='Coflnet'
          />
          <CopyButton text='UUID' copy={player._id} />
        </div>

      </div>
      <div className='text-center font-[Helvetica] my-4 text-lg'>
        <div className='inline-block p-1 '>
          <MenuButton disabled={false}>
            <Link href={player.guild_id ? `/guild/${player.guild_id}` : '/'}>
              <div className='text-center'>
                <FaArrowLeft className='inline-block' />
                <div className='pl-1 inline-block'>
                  {`Back to ${player.guild_name || 'Leaderboard'}`}
                </div>
              </div>
            </Link>
          </MenuButton>
        </div>
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
