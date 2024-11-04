import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [newListings, setNewListings] = useState(false);

  SwiperCore.use([Navigation]);

  const fetchListings = async (endpoint, setter, currentListings) => {
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      if (JSON.stringify(data) !== JSON.stringify(currentListings)) {
        setter(data);
        setNewListings(true); // Trigger notification if new listings are detected
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAllListings = async () => {
      await fetchListings('/api/listing/get?offer=true&limit=4', setOfferListings, offerListings);
      await fetchListings('/api/listing/get?type=rent&limit=4', setRentListings, rentListings);
      await fetchListings('/api/listing/get?type=sale&limit=4', setSaleListings, saleListings);
    };

    fetchAllListings();
    const intervalId = setInterval(fetchAllListings, 30000); // Check for updates every 30 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [offerListings, rentListings, saleListings]);

  return (
    <div className='bg-gradient-to-r from-blue-200 min-h-screen'>
      {/* Notification Banner */}
      {newListings && (
        <div className='bg-blue-600 text-white text-center py-2'>
          New listings available! Check them out below.
          <button
            onClick={() => setNewListings(false)}
            className='ml-4 underline'
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Section */}
      <div className='flex flex-col gap-6 p-10 md:p-20 max-w-6xl mx-auto'>
        <h1 className='text-slate-800 font-bold text-3xl lg:text-5xl'>
          Find Your Perfect Place,
          <br />
          Because Every <span className='text-blue-600'>"SquareFeet"</span> Matters!
        </h1>
        <p className='text-gray-900 text-sm md:text-base'>
          SquareFeet...Connecting you with the perfect place to call home.
          <br />
        </p>
        <Link
          to={'/search'}
          className='inline-block text-sm md:text-md text-blue-800 font-bold hover:underline transition'
        >
          Let's get started...
        </Link>
      </div>

      {/* Swiper Component */}
      <div className='overflow-hidden rounded-lg shadow-lg mx-4 sm:mx-8 lg:mx-16'>
        <Swiper navigation>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='h-[500px] rounded-lg'
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Listing Results for Offer, Sale, and Rent */}
      <div className='max-w-6xl mx-auto p-6 flex flex-col gap-10 my-10'>
        {offerListings.length > 0 && (
          <div className='bg-slate-300 shadow-md rounded-lg p-4'>
            <h2 className='text-2xl font-semibold text-slate-700'>Recent Offers</h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
              Show more offers
            </Link>
            <div className='flex flex-wrap gap-4 mt-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings.length > 0 && (
          <div className='bg-slate-300 shadow-md rounded-lg p-4'>
            <h2 className='text-2xl font-semibold text-slate-700'>Recent Places for Rent</h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
              Show more places for rent
            </Link>
            <div className='flex flex-wrap gap-4 mt-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings.length > 0 && (
          <div className='bg-slate-300 shadow-md rounded-lg p-4'>
            <h2 className='text-2xl font-semibold text-slate-700'>Recent Places for Sale</h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
              Show more places for sale
            </Link>
            <div className='flex flex-wrap gap-4 mt-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
