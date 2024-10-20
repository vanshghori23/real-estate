import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  // Chat functionality
  const handleChatToggle = () => {
    setShowChat((prev) => !prev);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage) return;

    // Simulate sending the message
    console.log(`Message sent to squarefeetft@gmail.com: ${chatMessage}`);
    alert('Message sent!'); // Placeholder for user feedback
    setChatMessage('');
  };

  return (
    <div className="bg-gradient-to-r from-blue-200 min-h-screen flex items-center justify-center py-10">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative w-32 h-32 mx-auto">
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt="profile"
              className="rounded-full w-full h-full object-cover cursor-pointer border-4 border-gray-200 hover:border-gray-400 transition"
            />
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
          </div>
          <p className="text-sm text-center">
            {fileUploadError ? (
              <span className="text-red-700">Error Image upload (image must be less than 2 mb)</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-700">Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>

          <input
            type="text"
            placeholder="Username"
            defaultValue={currentUser.username}
            id="username"
            className="border p-4 rounded-lg w-full bg-gray-50"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            defaultValue={currentUser.email}
            className="border p-4 rounded-lg w-full bg-gray-50"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={handleChange}
            id="password"
            className="border p-4 rounded-lg w-full bg-gray-50"
          />

          <button
            disabled={loading}
            className="bg-indigo-600 text-white rounded-lg p-4 uppercase font-semibold hover:bg-indigo-500 transition disabled:bg-gray-300"
          >
            {loading ? 'Loading...' : 'Update'}
          </button>

          <Link
            className="bg-green-600 text-white p-4 rounded-lg text-center uppercase font-semibold hover:bg-green-500 transition"
            to="/create-listing"
          >
            Create Listing
          </Link>
        </form>

        <div className="flex justify-between mt-8">
          <span onClick={handleDeleteUser} className="text-red-600 cursor-pointer hover:underline">
            Delete account
          </span>
          <span onClick={handleSignOut} className="text-red-600 cursor-pointer hover:underline">
            Sign out
          </span>
        </div>

        <p className="text-red-700 mt-5">{error ? error : ''}</p>
        <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' : ''}</p>

        <button
          onClick={handleShowListings}
          className="bg-indigo-600 text-white p-4 rounded-lg text-center uppercase font-semibold w-full mt-5 hover:bg-indigo-500 transition"
        >
          Show Listings
        </button>
        <p className="text-red-700 mt-5">{showListingsError ? 'Error showing listings' : ''}</p>

        {userListings && userListings.length > 0 && (
          <div className="mt-10">
            <h1 className="text-2xl font-semibold text-gray-800 mb-5 text-center">Your Listings</h1>
            <div className="grid grid-cols-1 gap-4">
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className="border rounded-lg p-4 flex items-center gap-4 bg-white shadow hover:shadow-lg transition"
                >
                  <Link to={`/listing/${listing._id}`} className="flex-shrink-0">
                    <img
                      src={listing.imageUrls[0]}
                      alt="listing cover"
                      className="h-20 w-20 object-cover rounded-lg hover:scale-105 transition"
                    />
                  </Link>

                  <Link
                    className="text-gray-700 font-semibold hover:underline flex-1 truncate"
                    to={`/listing/${listing._id}`}
                  >
                    <p>{listing.name}</p>
                  </Link>

                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="text-red-600 hover:underline mb-2"
                    >
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className="text-green-600 hover:underline">Edit</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Support Button */}
        <button
          className="fixed bottom-5 right-5 bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-500 transition"
          onClick={handleChatToggle}
        >
          ?
        </button>

        {/* Chat Box */}
        {showChat && (
          <div className="fixed bottom-20 right-5 bg-white border rounded-lg shadow-lg p-4 w-64">
            <h2 className="text-lg font-semibold">Customer Support</h2>
            <form onSubmit={handleChatSubmit} className="mt-2">
              <textarea
                rows="3"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="border rounded-lg w-full p-2"
              />
              <button
                type="submit"
                className="mt-2 bg-indigo-600 text-white rounded-lg p-2 hover:bg-indigo-500 transition"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
