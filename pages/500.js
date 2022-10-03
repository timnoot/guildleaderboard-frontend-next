import React from 'react';

import { ErrorScreen } from '../components/Screens.js';


function Error({ statusCode }) {
    return (
        <ErrorScreen error={statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'} report={true} />
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error
