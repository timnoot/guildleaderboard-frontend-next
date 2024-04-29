import React from 'react';
import { useState } from 'react';


export const SuggestionBar = ({ tags, suggestions, onDelete, onAddition, placeholderText, mustBeSuggestion = true }) => {
    const [input, setInput] = useState('');
    const filteredSuggestions = input.length >= 2 ? suggestions.filter((suggestion) => suggestion.name.toLowerCase().startsWith(input.toLowerCase()) && !tags.some((tag) => tag.id === suggestion.id)).sort((a, b) => a.name.length - b.name.length).slice(0, 5) : [];

    return (
        <div className='relative m-auto w-[90%] lg:w-full text-white text-lg font-sans'>
            <div className='flex flex-wrap p-2 w-full rounded-lg border bg-primary border-gray-600 placeholder-gray-400  focus-within:border-white delay-00 transition'>
                <div className='inline-block flex-wrap my-auto'>
                    {tags.map((tag) => (
                        <div className="inline-block cursor-pointer" key={tag.id}>
                            <div
                                className='flex items-center pl-2 pr-1 py-1 mr-2 my-1 font-medium rounded-lg border border-gray-600'
                                onClick={() => onDelete(tag.id)}
                            >
                                {tag.name}
                                <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-gray-300 ml-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='flex-grow flex m-2'>
                    <input
                        // type='search'
                        id='default-search'
                        className='inline-block bg-primary outline-none w-full'
                        placeholder={placeholderText}
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace' && input === '' && tags.length > 0) {
                                console.log(tags);
                                onDelete(tags[tags.length - 1].id);
                            } else if (e.key === 'Enter') {
                                e.preventDefault();
                                if (mustBeSuggestion) {
                                    if (filteredSuggestions.length > 0) {
                                        setInput('');
                                        onAddition(filteredSuggestions[0]);
                                    }
                                } else {
                                    if (!tags.some((tag) => tag.name.toLowerCase() === input.toLowerCase())) {
                                        onAddition({ name: input, id: input });
                                        setInput('');
                                    }
                                }
                            }
                        }}
                        onChange={(e) => {
                            setInput(e.target.value)
                        }}
                        autoComplete='off'
                        value={input}
                    />
                    {
                        filteredSuggestions.length > 0 ?
                            <div className='absolute z-10 w-64 mt-1 bg-primary border border-gray-300 rounded-lg translate-y-12'>
                                {filteredSuggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        className='px-3 py-1 font-medium rounded-lg cursor-pointer hover:bg-lightprimary'
                                        onClick={() => {
                                            setInput('');
                                            onAddition(suggestion)
                                        }}
                                    >
                                        {/* {suggestion.name} */}
                                        {suggestion.name.split(new RegExp(`(${input})`, 'gi')).map((part, index) => (
                                            <span
                                                key={index}
                                                className={part.toLowerCase() === input.toLowerCase() ? 'underline font-bold' : ''}
                                            >
                                                {part}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div> : null
                    }
                </div>
            </div>
        </div>
    );
};
