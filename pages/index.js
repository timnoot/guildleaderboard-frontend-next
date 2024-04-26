import React from 'react';

import { NavigationBar } from '../components/NavigationBar.js';
import { MainStatsHeader } from '../components/StatsHeaderHome.js';
import { Footer } from '../components/Footer.js';

import axios from 'axios';
import Link from 'next/link';

import { FaUsers, FaLandmark } from 'react-icons/fa';

const Options = (props) => {
    return (
        <div className='w-full text-center text-white text-xl lg:text-4xl'>
            <Link href='/guilds'>
                <div className='inline-block cursor-pointer bg-[#2B2D31] border-4 border-primary w-[45%] lg:w-1/3 text-center rounded-xl m-1 py-16 lg:m-5 lg:py-32'>
                    <FaLandmark className='w-full fa-6x mb-4' size={200} />
                    Guild Leaderboard
                </div>
            </Link>
            <Link href='/players'>
                <div className='inline-block cursor-pointer bg-[#2B2D31] border-4 border-primary w-[45%] lg:w-1/3 text-center rounded-xl m-1 py-16 lg:m-5 lg:py-32'>
                    <FaUsers className='w-full fa-6x mb-4' size={200} />
                    Player Leaderboard
                </div>
            </Link>
        </div>
    )
}

export default function Home({ stats }) {
    return (
        <div
            id='maindiv'
            className='min-h-screen space-y-10 overflow-x-hidden overflow-y-auto bg-secondary sm:h-96 scrollbar'
        >
            <NavigationBar patronscount={stats.patrons} />
            <MainStatsHeader stats={stats} />
            <Options />
            <Footer />
        </div>
    );
}

export async function getStaticProps() {
    const res = await axios.get('https://apiv2.guildleaderboard.com/stats');

    const stats = res.data;
    if (res.status !== 200) {
        console.error(json);
        throw new Error('Failed to fetch API');
    }

    return {
        props: {
            stats,
        },
        revalidate: 300,
    };
}