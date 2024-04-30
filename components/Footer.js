import React from 'react';

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className='py-2 text-[0.6em] md:text-sm text-center text-white rounded-t-lg bg-primary w-full'>
      <p>
        © 2021-{year} Hypixel SkyBlock Stats | Created by{' '}
        <a
          href='https://github.com/timnoot'
          target='_blank'
          rel='noreferrer'
          className='text-blue-300'
        >
          timnoot
        </a>
      </p>
      <p>
        Consider supporting us on{' '}
        <a
          href='https://www.patreon.com/sbhub'
          target='_blank'
          rel='noreferrer'
          className='text-blue-300'
        >
          Patreon
        </a>
      </p>

    </footer>
  );
};
