import React from 'react';

export class Footer extends React.Component {
  render() {
    // const scrollToTop = () => {
    //   window.scrollTo({
    //     top: 0,
    //     behavior: 'smooth',
    //   });
    // };
    return (
      <footer className='py-2 text-[0.6em] md:text-sm text-center text-white rounded-t-lg pt-5 bg-primary w-full'>
        {/* <div>
          <button
            className='w-10 h-10 border rounded-lg border-secondary'
            onClick={() => scrollToTop()}
          >
            <a href='#/'>
              <div className='ml-[9px]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  className='w-5 h-5 hover:animate-bounce'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18'
                  />
                </svg>
              </div>
            </a>
          </button>
        </div> */}
        <div>
          Inspired by{' '}
          <a
            className='text-blue-500 underline hover:cursor-pointer'
            href='https://hypixel-leaderboard.senither.com'
          >
            Senither&apos;s Hypixel Skyblock Leaderboard
          </a>
          .
        </div>
        <div>
          Created by{' '}
          <a
            className='text-blue-500 underline hover:cursor-pointer'
            href='https://github.com/timnoot'
          >
            timnoot#4372
          </a>
          ,{' '}
          <a
            className='text-blue-500 underline hover:cursor-pointer'
            href='https://github.com/XoutDragon'
          >
            XoutDragon#2466
          </a>
          , and{' '}
          <a
            className='text-blue-500 underline hover:cursor-pointer'
            href='https://github.com/MooshiMochi'
          >
            Mooshi#6669
          </a>
          .
        </div>
        <div>
          Powered by{' '}
          <a
            className='text-blue-500 underline hover:cursor-pointer'
            href='https://apexcharts.com'
          >
            Apexcharts
          </a>
          ,{' '}
          <a
            className='text-blue-500 underline hover:cursor-pointer'
            href='https://tailwindcss.com'
          >
            TailwindCSS
          </a>
          ,{' '}
          <a
            className='text-blue-500 underline hover:cursor-pointer'
            href='https://tippyjs.bootcss.com'
          >
            TippyJS
          </a>
          , and{' '}
          <a
            className='text-blue-500 underline hover:cursor-pointer'
            href='https://digitalocean.com'
          >
            Digital Ocean
          </a>
        </div>
      </footer>
    );
  }
}
