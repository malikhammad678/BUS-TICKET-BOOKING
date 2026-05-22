import React from 'react'

const Newsletter = () => {
    return (
        <>
            <div className='px-4 sm:px-6 md:px-10 lg:px-20 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-20'>
                <div className="w-full bg-slate-900 px-4 sm:px-8 md:px-12 text-center text-white py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center rounded-xl">

                    <p className="text-primary font-medium text-sm sm:text-base">Get updated</p>

                    <h1 className="max-w-xs sm:max-w-sm md:max-w-lg font-semibold text-2xl sm:text-3xl md:text-4xl leading-tight mt-2">
                        Subscribe to our newsletter & get the latest news
                    </h1>

                    {/* Input + Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-center mt-8 sm:mt-10 w-full max-w-md gap-3 sm:gap-0">

                        <div className="hidden sm:flex items-center border border-slate-600 focus-within:outline focus-within:outline-primary text-sm rounded-full h-14 w-full max-w-md">
                            <input
                                type="email"
                                className="bg-transparent outline-none rounded-full px-4 h-full flex-1 text-sm"
                                placeholder="Enter your email address"
                            />
                            <button className="bg-primary text-white rounded-full h-11 mr-1 px-6 sm:px-8 flex items-center justify-center hover:scale-105 duration-300 cursor-pointer text-sm whitespace-nowrap">
                                Subscribe now
                            </button>
                        </div>

                        {/* Mobile layout */}
                        <input
                            type="email"
                            className="sm:hidden bg-transparent outline-none border border-slate-600 focus:border-primary rounded-full px-4 h-12 w-full text-sm text-white placeholder-slate-400"
                            placeholder="Enter your email address"
                        />
                        <button className="sm:hidden bg-primary text-white rounded-full h-11 px-8 w-full flex items-center justify-center hover:scale-105 duration-300 cursor-pointer text-sm font-medium">
                            Subscribe now
                        </button>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Newsletter