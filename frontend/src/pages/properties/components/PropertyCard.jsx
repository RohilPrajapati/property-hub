import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, toTitleCase } from '../../../helpers';

const PropertyCard = ({ property, onViewDetail }) => {
    const navigate = useNavigate();
    // const formattedPrice = new Intl.NumberFormat('en-NP', {
    //     style: 'currency',
    //     currency: 'NPR',
    //     maximumFractionDigits: 0,
    // }).format(property.price);

    return (
        <div className="bg-white rounded-2xl p-2 shadow-sm hover:shadow-lg transition duration-300 overflow-hidden border border-gray-100">

            {/* Image */}
            <div className="p-3 pb-0">
                <div className="rounded-xl overflow-hidden">
                    <img
                        src={property.image || 'https://via.placeholder.com/400x300'}
                        alt={property.title}
                        className="w-full h-52 object-cover"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">

                {/* Title + Location */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                        {property.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {property.suburb}
                    </p>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(property.price)}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100"></div>

                {/* Details */}
                <div className="flex justify-between text-sm text-gray-600">
                    <span>{property.bedrooms} Beds</span>
                    <span>Type: {toTitleCase(property.property_type)}</span>
                    <span>{property.bathrooms} Baths</span>
                </div>

                {/* Agent + Button */}
                <div className="flex items-center justify-between pt-2">
                    <div>
                        <p className="text-sm font-medium text-gray-800">
                            {property.agent_detail.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {property.agent_detail.phone}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(`/listings/${property.id}`)}
                        className="text-sm font-medium px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
                    >
                        View
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PropertyCard;