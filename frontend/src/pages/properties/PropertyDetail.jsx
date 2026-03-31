import React, { useState, useEffect } from 'react';
import { fetchPropertyDetail } from './api/call';
import { useParams } from 'react-router-dom';
import { formatDate, formatPrice, getAuthUser } from '../../helpers';
import { BedIcon, BathIcon, LocationIcon, HomeIcon, CalendarIcon, PhoneIcon, EmailIcon, BadgeIcon } from '../../icons/index.jsx';



const PropertyDetail = () => {
    const { propertyId } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [enquirySent, setEnquirySent] = useState(false);

    const user = getAuthUser();

    console.log(propertyId)

    useEffect(() => {
        if (!propertyId) return;
        const loadDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchPropertyDetail(propertyId);
                setProperty(res.data || res);
            } catch (err) {
                setError(err?.response?.data?.detail || err.message || 'Failed to load property.');
            } finally {
                setLoading(false);
            }
        };
        loadDetail();
    }, [propertyId]);

    if (loading) return <div className="min-h-screen bg-gray-50">Loading</div>;

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center max-w-sm mx-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                    </svg>
                </div>
                <p className="text-gray-900 font-medium mb-1">Something went wrong</p>
                <p className="text-sm text-gray-400 mb-6">{error}</p>
            </div>
        </div>
    );

    if (!property) return null;

    const p = property;
    const agentInitials = p.agent_detail.name
        .split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

    const typeLabel = {
        house: 'House', apartment: 'Apartment',
        townhouse: 'Townhouse', land: 'Land', commercial: 'Commercial',
    }[p.property_type] || p.property_type;

    return (
        <div className="min-h-screen bg-gray-50">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
                .pd-serif { font-family: 'Instrument Serif', Georgia, serif; }
                .pd-sans  { font-family: 'DM Sans', system-ui, sans-serif; }
                @keyframes pd-fade-up {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .pd-anim   { animation: pd-fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both; }
                .pd-anim-1 { animation-delay: 0.05s; }
                .pd-anim-2 { animation-delay: 0.12s; }
                .pd-anim-3 { animation-delay: 0.20s; }
                .pd-anim-4 { animation-delay: 0.28s; }
                .pd-img-wrap img { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
                .pd-img-wrap:hover img { transform: scale(1.03); }
            `}</style>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pd-sans">
                {/* Hero Image */}
                <div className="pd-anim pd-anim-1 pd-img-wrap bg-gray-100 rounded-2xl overflow-hidden mb-6 h-72 sm:h-96 relative">
                    {!imgLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
                    )}
                    <img
                        src={p.image || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80'}
                        alt={p.title}
                        onLoad={() => setImgLoaded(true)}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                        <HomeIcon />{typeLabel}
                    </span>
                    {p.is_published && (
                        <span className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">
                            Active listing
                        </span>
                    )}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Title + price */}
                        <div className="pd-anim pd-anim-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <p className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
                                        <LocationIcon />{p.suburb}
                                    </p>
                                    <h1 className="pd-serif text-2xl sm:text-3xl text-gray-900 leading-snug">
                                        {p.title}
                                    </h1>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-2xl sm:text-3xl font-semibold text-gray-900 tabular-nums">
                                        {formatPrice(p.price)}
                                    </p>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 my-5" />
                            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400"><BedIcon /></span>
                                    <span><strong className="text-gray-900 font-medium">{p.bedrooms}</strong> Bedrooms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400"><BathIcon /></span>
                                    <span><strong className="text-gray-900 font-medium">{p.bathrooms}</strong> Bathrooms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400"><CalendarIcon /></span>
                                    <span>Listed {formatDate(p.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pd-anim pd-anim-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                                About this property
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-[15px]">{p.description}</p>
                        </div>

                        {/* Details grid */}
                        <div className="pd-anim pd-anim-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                                Property details
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {[
                                    { label: 'Type', value: typeLabel },
                                    { label: 'Suburb', value: p.suburb },
                                    { label: 'Bedrooms', value: p.bedrooms },
                                    { label: 'Bathrooms', value: p.bathrooms },
                                    { label: 'Status', value: p.is_published ? 'Published' : 'Draft' },
                                    { label: 'Listing ID', value: `#${p.id}` },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-400 mb-1">{label}</p>
                                        <p className="text-sm font-medium text-gray-800">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-5">

                        {/* Agent card */}
                        <div className="pd-anim pd-anim-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                                Listing agent
                            </h2>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center text-sm font-medium shrink-0">
                                    {agentInitials}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-[15px]">{p.agent_detail.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Licensed Agent</p>
                                </div>
                            </div>
                            <div className="space-y-2.5 mb-5">
                                <a href={`tel:${p.agent_detail.phone}`}
                                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 transition group">
                                    <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition shrink-0">
                                        <PhoneIcon />
                                    </span>
                                    {p.agent_detail.phone}
                                </a>
                                <a href={`mailto:${p.agent_detail.email}`}
                                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 transition group">
                                    <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition shrink-0">
                                        <EmailIcon />
                                    </span>
                                    <span className="truncate">{p.agent_detail.email}</span>
                                </a>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                        <BadgeIcon />
                                    </span>
                                    {p.agent_detail.license_number}
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <a href={`tel:${p.agent_detail.phone}`}
                                    className="w-full py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 active:scale-[0.98]">
                                    <PhoneIcon />
                                    Call agent
                                </a>
                            </div>
                        </div>

                        {/* Price summary */}
                        <div className="pd-anim pd-anim-3 bg-gray-900 rounded-2xl p-5 text-white">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Asking price</p>
                            <p className="pd-serif text-2xl mb-3">{formatPrice(p.price)}</p>
                            <div className="border-t border-white/10 pt-3 flex justify-between text-xs text-gray-400">
                                <span>{p.bedrooms} bed · {p.bathrooms} bath</span>
                                <span>{p.suburb}</span>
                            </div>
                        </div>
                        {user?.is_admin && (
                            <div className="pd-anim pd-anim-3 rounded-2xl p-5 bg-white border-2 border-amber-200">
                                <p className="text-sm uppercase tracking-wider mb-1">Internal Notes (for Admin only)</p>
                                <div className="border-t border-white/10 pt-3 flex justify-between text-xs text-gray-400">
                                    <span>{p.internal_notes || "No Notes"}</span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;