import React, { useState } from 'react'
import { GiCheckMark } from "react-icons/gi";
import { CgClose } from "react-icons/cg";
import { useLocation } from 'react-router-dom';

function CESubscription({ selectedTier, setSelectedTier, selectedPrice, setSelectedPrice }) {
    const location = useLocation();
    const isEditPage = location.pathname.startsWith("/org/edit/");

    const tiers = {
        free: {
            name: 'Free',
            features: [
                'Up to 500 attendees',
                '1 ticket type',
                'Email support',
                'QR code check-in',
                'Downloadable attendee list'
            ],
            exclusions: [
                'No bulk email support',
            ],
            price: 0.00,
        },
        basic: {
            name: 'Basic',
            features: [
                'Up to 1,000 attendees',
                '3 ticket type',
                '500 bulk emails',
                'Email support'
            ],
            exclusions: [
                'No SMS support',
            ],
            price: 999.00,
        },
        premium: {
            name: 'Premium',
            features: [
                'Up to 5,000 attendees',
                'Up to 5 ticket types',
                '2,500 bulk emails',
                'Discount codes',
                'Custom ticket design'
            ],
            exclusions: [
                'No on-site support',
            ],
            price: 3499.00,
        },
        mega: {
            name: 'Mega',
            features: [
                'Unlimited attendees',
                'Unlimited ticket types',
                '10,000 bulk emails',
                'On-site support included',
                'Event will be featured on the landing page'
            ],
            exclusions: [
            ],
            price: 9999.00,
        },
    }

    return (
        <div className='w-full bg-white shadow-sm p-4 md:p-6 rounded-2xl mb-6 font-outfit'>
            <h2 className='text-2xl font-semibold mb-4'>{isEditPage ? `Plan` : `Choose your plan for this event`}</h2>
            <div className='flex w-full items-center justify-center'>
                {isEditPage ? (
                    <div className="w-full flex flex-col items-center">
                        <p className="text-gray-500 mb-2 w-[85%] text-center">
                            You are currently on the{" "}
                            <span className="font-semibold text-secondary">{selectedTier}</span> plan.
                        </p>

                        {tiers[selectedTier.toLowerCase()] && (
                            <ul className='bg-black/3 border-2 border-secondary shadow-md/20 py-4 px-7 rounded-xl mb-4'>
                                {tiers[selectedTier.toLowerCase()].features.map((feat, i) => (
                                    <li
                                        key={i}
                                        className="text-gray-500 flex flex-row items-center gap-1 text-sm"
                                    >
                                        <GiCheckMark className="text-green-600" /> {feat}
                                    </li>
                                ))}

                                {tiers[selectedTier.toLowerCase()].exclusions.length > 0 &&
                                    tiers[selectedTier.toLowerCase()].exclusions.map((excl, i) => (
                                        <li
                                            key={i}
                                            className="text-gray-500 line-through flex flex-row items-center gap-1 text-sm"
                                        >
                                            <CgClose className="text-red-500" /> {excl}
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-[85%] place-items-stretch'>
                        {Object.entries(tiers).map(([key, tier]) => (
                            <div key={key} className={`rounded-2xl border-2 w-full flex flex-col justify-between transition-all duration-200 bg-black/3 shadow-md/20 p-6 flex flex-col ${selectedTier === tier.name ? 'border-secondary' : 'border-transparent'}`}>
                                <div>
                                    <div className='flex flex-row justify-center items-center gap-2 mb-4'>
                                        <h3 className='text-xl font-semibold text-center'>{tier.name}</h3>
                                        <p className='text-4xl font-bold text-secondary text-center'>₱{tier.price}</p>
                                    </div>
                                    <ul>
                                        {tier.features.map((feat, i) => (
                                            <li key={i} className='text-gray-500 flex flex-row items-center gap-1 text-sm'><GiCheckMark className='text-green-600' />{feat}</li>
                                        ))}
                                        {tier.exclusions.length > 0 && (
                                            tier.exclusions.map((excl, i) => (
                                                <li key={i} className='text-gray-500 line-through flex flex-row items-center gap-1 text-sm'><CgClose className='text-red-500' /> {excl}</li>
                                            ))
                                        )}
                                    </ul>
                                </div>

                                <button onClick={() => { setSelectedTier(tier.name); setSelectedPrice(tier.price) }}
                                    disabled={tier.name !== 'Free'}
                                    className={`mt-5 text-sm w-1/2 ${selectedTier === tier.name ? 'bg-transparent' :
                                        tier.name !== 'Free' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                                            'bg-secondary text-white'} self-center cursor-pointer py-2 border border-secondary rounded-lg`}>{selectedTier === tier.name ? 'Selected' : 'Select'}</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CESubscription
