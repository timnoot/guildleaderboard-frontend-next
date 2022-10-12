module.exports = {
    siteUrl: 'https://guildleaderboard.com',
    generateRobotsTxt: true,
    exclude: ['/server-sitemap.xml'], // <= exclude here
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://guildleaderboard.com/server-sitemap.xml', // <==== Add here
        ],
    },
};
