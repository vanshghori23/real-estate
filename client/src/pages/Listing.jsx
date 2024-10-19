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
  FaUtensils,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
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
    <main className='min-h-screen bg-gradient-to-r from-slate-300 to-blue-300'>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className='max-w-7xl mx-auto p-5'>
          {/* Updated Swiper section */}
          <div className='relative'>
            <Swiper navigation className='rounded-lg shadow-lg'>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div className='h-[550px] rounded-lg overflow-hidden relative'>
                    <div
                      className='absolute inset-0 bg-black bg-opacity-25 hover:bg-opacity-10 transition duration-300'
                      style={{
                        backgroundImage: `url(${url})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }}
                    ></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-lg cursor-pointer'>
              <FaShare
                className='text-gray-500'
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
              <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-white p-2 shadow-lg'>
                Link copied!
              </p>
            )}
          </div>

          <div className='bg-white shadow-lg rounded-lg p-8 mt-8'>
            <p className='text-3xl font-semibold text-gray-800'>
              {listing.name} - ₹{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-IN')
                : listing.regularPrice.toLocaleString('en-IN')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-4 gap-2 text-gray-600 text-lg'>
              <FaMapMarkerAlt className='text-green-600' />
              {listing.address}
            </p>
            <div className='flex gap-4 mt-4'>
              <p className='bg-red-700 text-white text-center py-2 px-4 rounded-lg shadow-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-700 text-white text-center py-2 px-4 rounded-lg shadow-md'>
                  ₹{(listing.regularPrice - listing.discountPrice).toLocaleString('en-IN')} OFF
                </p>
              )}
            </div>
            <p className='text-lg text-gray-700 mt-4'>
              <span className='font-semibold text-gray-900'>Description: </span>
              {listing.description}
            </p>
            <ul className='text-gray-800 font-medium text-lg flex flex-wrap items-center gap-4 mt-6'>
              <li className='flex items-center gap-2'>
                <FaBed className='text-xl' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className='flex items-center gap-2'>
                <FaUtensils className='text-xl' />
                {listing.kitchen > 1
                  ? `${listing.kitchen} kitchens`
                  : `${listing.kitchen} kitchen`}
              </li>
              <li className='flex items-center gap-2'>
                <FaBath className='text-xl' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className='flex items-center gap-2'>
                <FaParking className='text-xl' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-2'>
                <FaChair className='text-xl' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-blue-600 text-white mt-6 py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
