export const APIURL = "https://apiv2.guildleaderboard.com/"
// export const APIURL = "http://localhost:8080/"

export const COLOR_ARRAY = [
    'bg-blue-700',
    'bg-purple-700',
    'bg-green-700',
    'bg-red-700',
    'bg-yellow-700',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',

];


export const skillMaxLevel = {
    "mining": 60,
    "foraging": 50,
    "enchanting": 60,
    "farming": 60,
    "combat": 60,
    "fishing": 50,
    "alchemy": 50,
    "taming": 50,
    "carpentry": 50,
    "runecrafting": 25,
}

// PLAYER STATS
// general_stats str # comma separated list of stats
// {
//     senither_weight REAL,
//     lily_weight REAL,
//     networth BIGINT,
//     sb_experience BIGINT,
// }
export const GENERAL_NUMS = {
    'senither_weight': 0,
    'lily_weight': 1,
    'networth': 2,
    'sb_experience': 3,
}


// skill_stats str # comma separated list of stats
//     {
//         average_skill REAL,
//         taming_xp BIGINT,
//         mining_xp BIGINT,
//         farming_xp BIGINT,
//         combat_xp BIGINT,
//         foraging_xp BIGINT,
//         fishing_xp BIGINT,
//         enchanting_xp BIGINT,
//         alchemy_xp BIGINT,
//         carpentry_xp BIGINT
//     }
export const SKILL_NUMS = {
    'average_skill': 0,
    'combat': 4,
    'foraging': 5,
    'farming': 3,
    'mining': 2,
    'fishing': 6,
    'taming': 1,
    'enchanting': 7,
    'alchemy': 8,
    'carpentry': 9,
}


// slayer_stats str # comma separated list of stats
//     {
//         total_slayer REAL,
//         zombie_xp BIGINT,
//         spider_xp BIGINT,
//         wolf_xp BIGINT,
//         enderman_xp BIGINT,
//         blaze_xp BIGINT,
//         vampire_xp BIGINT,
//     }
export const SLAYER_NUMS = {
    'zombie': 1,
    'spider': 2,
    'wolf': 3,
    'enderman': 4,
    'blaze': 5,
    'vampire': 6,
}

// dungeon_stats str # comma separated list of stats
//     {
//         catacombs_xp BIGINT,
//         healer_xp BIGINT,
//         mage_xp BIGINT,
//         berserk_xp BIGINT,
//         archer_xp BIGINT,
//         tank_xp BIGINT,
//     }
export const DUNGEON_NUMS = {
    'catacombs': 0,
    'mage': 2,
    'healer': 1,
    'berserk': 3,
    'archer': 4,
    'tank': 5,
}

//GUILDS
export const NAME_TO_POSITION = {
    'senither_weight': 0,
    'skills': 1,
    'catacombs': 2,
    'slayer': 3,
    'lily_weight': 4,
    'networth': 5,
    'sb_experience': 6
};