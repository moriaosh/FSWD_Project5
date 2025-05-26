import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

  function AlbumsManager() {
    const { user, userData } = useContext(AuthContext);
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState({ type: 'id', value: '' });
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const photosPerPage = 5;

    useEffect(() => {
      setFilteredAlbums(userData.albums.filter(album => album.userId === Number(user.id)));
    }, [userData.albums, user.id]);

    const fetchPhotos = async (albumId, page) => {
      const start = (page - 1) * photosPerPage;
      try {
        const response = await axios.get(`http://localhost:3000/photos?albumId=${albumId}&_start=${start}&_limit=${photosPerPage}`);
        setPhotos(prev => [...prev, ...response.data]);
      } catch (err) {
        console.error('Error fetching photos:', err);
      }
    };

    useEffect(() => {
      if (selectedAlbum) {
        fetchPhotos(selectedAlbum.id, currentPage);
      }
    }, [selectedAlbum, currentPage]);

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'; // Fallback image
    };

    return (
      <div className="postsManagerContainer">
       <Link to="/home" className="navButton returnButton">Return to Home</Link> 
        <h3 className="sectionTitle">Manage Your Albums</h3>
        <div className="searchContainer">
          <label className="searchLabel">Search by: </label>
          <select
            value={searchCriteria.type}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, type: e.target.value })}
            className="searchSelect"
          >
            <option value="id">ID</option>
            <option value="title">Title</option>
          </select>
          <input
            type="text"
            value={searchCriteria.value}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, value: e.target.value })}
            placeholder="Search..."
            className="searchInput"
          />
          <button
            onClick={() => {
              const filtered = userData.albums.filter(album =>
                album.userId === Number(user.id) &&
                (searchCriteria.type === 'id'
                  ? album.id.toString() === searchCriteria.value
                  : album.title.toLowerCase().includes(searchCriteria.value.toLowerCase()))
              );
              setFilteredAlbums(filtered);
            }}
            className="searchButton"
          >
            Search
          </button>
        </div>
        <ul className="list">
          {filteredAlbums.map(album => (
            <li key={album.id} className="postListItem">
              <span>ID: {album.id} | Title: {album.title}</span>
              <button
                onClick={() => {
                  setSelectedAlbum(album);
                  setPhotos([]);
                  setCurrentPage(1);
                }}
                className="actionButton selectButton"
              >
                View Photos
              </button>
            </li>
          ))}
        </ul>
        {selectedAlbum && (
          <div className="formContainer">
            <h4 className="formTitle">Photos for Album: {selectedAlbum.title}</h4>
            {photos.length > 0 ? (
              <ul className="list">
                {photos.map(photo => (
                  <li key={photo.id} className="commentListItem">
                    <img
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      style={{ maxWidth: '100px' }}
                      onError={handleImageError}
                    />
                    <p>{photo.title}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No photos available for this album.</p>
            )}
            {photos.length < userData.photos.filter(p => p.albumId === selectedAlbum.id).length && (
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="formButton"
              >
                Load More
              </button>
            )}
          </div>
        )}
        <div className="formContainer">
          <h4 className="formTitle">Create New Album</h4>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const response = await axios.post('http://localhost:3000/albums', {
                userId: Number(user.id),
                title: searchCriteria.value
              });
              setFilteredAlbums(prev => [...prev, response.data]);
              setSearchCriteria({ ...searchCriteria, value: '' });
            }}
          >
            <input
              type="text"
              value={searchCriteria.value}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, value: e.target.value })}
              placeholder="Album Title"
              className="formInput"
            />
            <button type="submit" className="formButton">Create Album</button>
          </form>
        </div>
        {selectedAlbum && (
          <div className="formContainer">
            <h4 className="formTitle">Manage Photos</h4>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const response = await axios.post('http://localhost:3000/photos', {
                  albumId: selectedAlbum.id,
                  title: `Photo ${photos.length + 1}`,
                  url: `https://picsum.photos/600/400?image=${photos.length + 1}`,
                  thumbnailUrl: `https://picsum.photos/150/150?image=${photos.length + 1}`
                });
                setPhotos(prev => [...prev, response.data]);
              }}
            >
              <button type="submit" className="formButton">Add Photo</button>
            </form>
            {photos.length > 0 && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const photoToUpdate = photos[0];
                  const response = await axios.put(`http://localhost:3000/photos/${photoToUpdate.id}`, {
                    ...photoToUpdate,
                    title: `Updated ${photoToUpdate.title}`
                  });
                  setPhotos(prev => prev.map(p => p.id === response.data.id ? response.data : p));
                }}
              >
                <button type="submit" className="formButton updateButton">Update First Photo</button>
              </form>
            )}
            {photos.length > 0 && (
              <button
                onClick={async () => {
                  const photoToDelete = photos[0];
                  await axios.delete(`http://localhost:3000/photos/${photoToDelete.id}`);
                  setPhotos(prev => prev.filter(p => p.id !== photoToDelete.id));
                }}
                className="formButton deleteButton"
              >
                Delete First Photo
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  export default AlbumsManager;