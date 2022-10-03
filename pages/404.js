// 404 page

import React from 'react';
import { useRouter } from 'next/router';

import { ErrorScreen } from '../components/Screens.js';

export default function NotFoundPage() {
    const router = useRouter();

    setTimeout(() => {
        router.push('/');    
    }, 5000);

    return (
        <ErrorScreen title='404 Page not found' error="Returning to main page in 5 seconds" report={false} />
    );
}

