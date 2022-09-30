import axios from "axios";

export default function GuildPage({ guild }) {
    return (
        <>
            {guild.name}
        </>
    )

}

export const getServerSideProps = async (context) => {
    const guild = await axios.get(`https://api.guildleaderboard.com/guild/${context.params?.id}`).then(res => res.data)

    return {
        props: {
            guild
        }
    }
}
