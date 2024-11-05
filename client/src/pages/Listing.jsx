import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaUtensils, // Import kitchen icon
} from 'react-icons/fa';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className='bg-gradient-to-r from-blue-200 min-h-screen'>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl text-red-600">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className="max-w-7xl mx-auto p-5 md:p-10">
          <Swiper navigation className="rounded-lg shadow-lg">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[400px] md:h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                    borderRadius: '0.5rem',
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="fixed top-5 right-5 z-10 bg-white rounded-full p-2 shadow-lg cursor-pointer">
            <FaShare
              className="text-gray-600"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-16 right-5 z-10 rounded-md bg-white p-2 shadow-lg">
              Link copied!
            </p>
          )}

          <div className="bg-white shadow-lg rounded-lg p-5 mt-5">
            <h1 className="text-3xl font-semibold">
              {listing.name} - ₹{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-IN')
                : listing.regularPrice.toLocaleString('en-IN')}
              {listing.type === 'rent' && ' / month'}
            </h1>
            <p className="flex items-center mt-2 text-gray-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>

            <div className="flex gap-4 my-3">
              <span className="bg-red-600 text-white text-center py-1 px-3 rounded-md">
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              {listing.offer && (
                <span className="bg-green-600 text-white text-center py-1 px-3 rounded-md">
                  ₹{(listing.regularPrice - listing.discountPrice).toLocaleString('en-IN')} OFF
                </span>
              )}
            </div>

            <p className="text-gray-800 mt-4">
              <span className="font-semibold text-black">Description:</span> {listing.description}
            </p>

            <ul className="text-gray-700 font-medium text-sm flex flex-wrap items-center gap-4 mt-4">
              <li className="flex items-center gap-1">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} Bed`}
              </li>
              <li className="flex items-center gap-1">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} Bath`}
              </li>
              <li className="flex items-center gap-1">
                <FaParking className="text-lg" />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className="flex items-center gap-1">
                <FaChair className="text-lg" />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
              <li className="flex items-center gap-1"> {/* New kitchen section */}
                <FaUtensils className="text-lg" />
                {listing.kitchen ? 'Kitchen' : 'No Kitchen'}
              </li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && (
              <div className="mt-8">
                <a
                  href="mailto:sq.squarefeet@gmail.com?subject=Inquiry about the listing&body=I'm interested in this property. Please provide more details."
                  className="block bg-blue-600 text-white rounded-lg uppercase text-center hover:bg-blue-700 transition duration-300 p-3 w-full"
                >
                  Contact Agent
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}