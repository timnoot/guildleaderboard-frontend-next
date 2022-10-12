import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async (ctx) => {
    // Method to source urls from cms
    // const urls = await fetch('https//example.com/api')
    const r = await fetch('https://api.guildleaderboard.com/sitemapurls')
    const urls = await r.json()

    const guilds = urls.guilds.map((name) => {
        return {
            loc: `https://guildleaderboard.com/guild/${name}`,
            lastmod: new Date().toISOString(),
        }
    })
    const players = urls.players.map((name) => {
        return {
            loc: `https://guildleaderboard.com/player/${name}`,
            lastmod: new Date().toISOString(),
        }
    })

    const fields = [
        ...guilds,
        ...players,
    ]

    return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() { }