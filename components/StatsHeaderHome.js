import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { FaArrowLeft } from 'react-icons/fa';

import { spaces } from '../utils/other.js';
import { numberWithCommas } from '../utils/numformatting.js';
import { MenuButton } from '../components/StatBlocks.js';

export const GuildStatsHeader = ({ stats, backButton = false }) => {
  return (
    <header>
      <Head>
        <title>Hypixel SkyBlock Guild Leaderboard</title>
        <meta name='title' content='Hypixel SkyBlock Guild Leaderboard' />
        <meta
          name='description'
          content={`Tracking 🏢${stats.guilds_tracked} Guilds and 👥${numberWithCommas(stats.players_tracked)} Players`}
        />

        <meta property='og:title' content='SkyBlock Guildleaderboard' />
        <meta property='og:site_name' content='GuildLeaderboard' />
        <meta
          property='og:description'
          content={`Tracking:
${spaces(3)}Guilds 🏢 ${stats.guilds_tracked}
${spaces(3)}Players 👥 ${numberWithCommas(stats.players_tracked)}

Top Guilds:
${spaces(3)}🥇 ${stats.top_guilds[0].guild_name} 🏆 ${numberWithCommas(
            stats.top_guilds[0].weighted_stats.split(",")[6] / 100
          )} SB Levels
${spaces(3)}🥈 ${stats.top_guilds[1].guild_name} 🏆 ${numberWithCommas(
            stats.top_guilds[1].weighted_stats.split(",")[6] / 100
          )} SB Levels
${spaces(3)}🥉 ${stats.top_guilds[2].guild_name} 🏆 ${numberWithCommas(
            stats.top_guilds[2].weighted_stats.split(",")[6] / 100
          )} SB Levels`}
        />
      </Head>
      <h1 className='text-2xl text-center text-white bg-secondary sm:text-5xl'>
        Hypixel SkyBlock Guild Leaderboard
      </h1>
      <h1 className='pt-4 text-center text-white sm:text-2xl'>
        Tracking {stats.guilds_tracked} guilds with {stats.players_tracked}{' '}
        players
      </h1>
      {backButton && (
        <div className='text-center font-[Helvetica] my-4 text-lg'>
          <div className='inline-block p-1 '>
            <MenuButton disabled={false}>
              <Link href='/'>
                <div className='text-center'>
                  <FaArrowLeft className='inline-block' />
                  <div className='pl-1 inline-block'>
                    Back to Home
                  </div>
                </div>
              </Link>
            </MenuButton>
          </div>
        </div>
      )}
    </header>
  );
};

export const PlayerStatsHeader = ({ stats }) => {
  return (
    <header>
      <Head>
        <title>Hypixel SkyBlock Player Leaderboard</title>
        <meta name='title' content='Hypixel SkyBlock Player Leaderboard' />
        <meta
          name='description'
          content={`Tracking 🏢${stats.guilds_tracked} Guilds and 👥${numberWithCommas(stats.players_tracked)} Players`}
        />

        <meta property='og:title' content='SkyBlock Playerleaderboard' />
        <meta property='og:site_name' content='GuildLeaderboard' />
        <meta
          property='og:description'
          content={`Tracking:
${spaces(3)}Guilds 🏢 ${stats.guilds_tracked}
${spaces(3)}Players 👥 ${numberWithCommas(stats.players_tracked)}

Top Guilds:
${spaces(3)}🥇 ${stats.top_guilds[0].guild_name} 🏆 ${numberWithCommas(
            stats.top_guilds[0].weighted_stats.split(",")[6] / 100
          )} SB Levels
${spaces(3)}🥈 ${stats.top_guilds[1].guild_name} 🏆 ${numberWithCommas(
            stats.top_guilds[1].weighted_stats.split(",")[6] / 100
          )} SB Levels
${spaces(3)}🥉 ${stats.top_guilds[2].guild_name} 🏆 ${numberWithCommas(
            stats.top_guilds[2].weighted_stats.split(",")[6] / 100
          )} SB Levels`}
        />
      </Head>
      <h1 className='text-2xl text-center text-white bg-secondary sm:text-5xl'>
        Hypixel SkyBlock Player Leaderboard
      </h1>
      <h1 className='pt-4 text-center text-white sm:text-2xl'>
        Tracking {stats.guilds_tracked} guilds with {stats.players_tracked}{' '}
        players
      </h1>
      <div className='text-center font-[Helvetica] my-4 text-lg'>
        <div className='inline-block p-1 '>
          <MenuButton disabled={false}>
            <Link href='/'>
              <div className='text-center'>
                <FaArrowLeft className='inline-block' />
                <div className='pl-1 inline-block'>
                  Back to Home
                </div>
              </div>
            </Link>
          </MenuButton>
        </div>
      </div>
    </header>
  );
};