import React from 'react';

export class JoinLog extends React.Component {
  render() {
    let color;
    let typeName
    if (this.props.type === '1') {
      color = 'bg-green-500';
      typeName = 'Joined'
    } else {
      color = 'bg-red-500';
      typeName = 'Left'
    }

    return (
      <div className='py-1'>
        <div className='bg-tertiary p-2 text-white rounded-md w-11/12 xl:w-2/3 inline-flex'>
          <div className='text-left text-base md:text-xl flex-grow'>
            <p className={`inline-block ${color} mr-1 my-2 py-0.5 px-2 md:px-3 md:m-3 rounded-lg`}>
              {typeName}
            </p>
            <p className='inline-block'>
              {this.props.name}
            </p>
          </div>
          <div className='rounded-xl py-0.5 px-2 text-sm flex-grow justify-end text-right flex items-center'>
            <div className='text-center'>
              <div>
                {this.props.time_difference.toNiceStringWDays().toString()}
              </div>
              <div>
                {this.props.time_difference.toLongDate()}
              </div>
            </div>

          </div>
        </div >
      </div>
    );
  }
}