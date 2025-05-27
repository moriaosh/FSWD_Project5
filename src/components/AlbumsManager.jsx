import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AlbumsManager() {
  const { user, userData, setUserData } = useContext(AuthContext);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({ type: 'id', value: '' });
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 5;
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editPhoto, setEditPhoto] = useState(null);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [addPhotoAlbumId, setAddPhotoAlbumId] = useState('');

  useEffect(() => {
    fetchAlbums();
  }, [user.id]);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/albums?userId=${Number(user.id)}`);
      setFilteredAlbums(response.data);
      setUserData((prev) => ({ ...prev, albums: response.data }));
    } catch (err) {
      console.error('Error fetching albums:', err);
    }
  };

  const fetchPhotos = async (albumId, page) => {
    try {
      const start = (page - 1) * photosPerPage;
      const response = await axios.get(
        `http://localhost:3000/photos?albumId=${albumId}&_start=${start}&_limit=${photosPerPage}`
      );
      setPhotos((prev) => (page === 1 ? response.data : [...prev, ...response.data]));
      const totalResponse = await axios.get(`http://localhost:3000/photos?albumId=${albumId}`);
      setTotalPhotos(totalResponse.data.length);
    } catch (err) {
      console.error('Error fetching photos:', err);
    }
  };

  useEffect(() => {
    if (selectedAlbum) {
      setPhotos([]);
      setCurrentPage(1);
      fetchPhotos(selectedAlbum.id, 1);
    }
  }, [selectedAlbum]);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
  };

  const handleSearch = () => {
    const { type, value } = searchCriteria;
    if (!value) {
      fetchAlbums();
      return;
    }
    const filtered = filteredAlbums.filter((album) =>
      type === 'id'
        ? album.id.toString() === value
        : album.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAlbums(filtered);
  };

  const handleDeleteAlbum = async (albumId) => {
    try {
      await axios.delete(`http://localhost:3000/albums/${albumId}`);
      setFilteredAlbums((prev) => prev.filter((album) => album.id !== albumId));
      setUserData((prev) => ({
        ...prev,
        albums: prev.albums.filter((album) => album.id !== albumId),
      }));
      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum(null);
        setPhotos([]);
        setTotalPhotos(0);
      }
    } catch (err) {
      console.error('Error deleting album:', err);
    }
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
        <button onClick={handleSearch} className="searchButton">Search</button>
      </div>
      <ul className="list">
        {filteredAlbums.map((album) => (
          <li key={album.id} className="postListItem">
            <span>ID: {album.id} | Title: {album.title}</span>
            <div>
              <button
                onClick={() => {
                  setSelectedAlbum(album);
                }}
                className="actionButton selectButton"
              >
                View Photos
              </button>
              <button
                onClick={() => handleDeleteAlbum(album.id)}
                className="actionButton deleteButton"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {selectedAlbum && (
        <div className="modalOverlay">
          <div className="modal">
            <button
              onClick={() => {
                setSelectedAlbum(null);
                setPhotos([]);
                setSelectedPhoto(null);
                setEditPhoto(null);
                setTotalPhotos(0);
              }}
              className="modalCloseButton"
            >
              ×
            </button>
            <h4 className="formTitle">Photos for Album: {selectedAlbum.title}</h4>
            {photos.length > 0 ? (
              <ul className="list">
                {photos.map((photo) => (
                  <li key={photo.id} className="commentListItem">
                    <img
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      style={{ maxWidth: '100px' }}
                      onError={handleImageError}
                    />
                    <p>{photo.title}</p>
                    <button
                      onClick={() => {
                        setSelectedPhoto(photo);
                        setEditPhoto({ ...photo, title: photo.title });
                      }}
                      className={`actionButton ${selectedPhoto?.id === photo.id ? 'selectedPostItem' : ''}`}
                    >
                      Select
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No photos available for this album.</p>
            )}
            {photos.length < totalPhotos && (
              <button
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                  fetchPhotos(selectedAlbum.id, currentPage + 1);
                }}
                className="formButton"
              >
                Load More
              </button>
            )}
            {selectedPhoto && (
              <div className="formContainer">
                <h5 className="formTitle">Manage Photo</h5>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const response = await axios.put(
                        `http://localhost:3000/photos/${editPhoto.id}`,
                        editPhoto
                      );
                      setPhotos((prev) =>
                        prev.map((p) => (p.id === editPhoto.id ? response.data : p))
                      );
                      setEditPhoto(null);
                      setSelectedPhoto(null);
                    } catch (err) {
                      console.error('Error updating photo:', err);
                    }
                  }}
                >
                  <input
                    type="text"
                    value={editPhoto?.title || ''}
                    onChange={(e) =>
                      setEditPhoto((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Photo Title"
                    className="formInput"
                  />
                  <button type="submit" className="formButton updateButton">
                    Update Photo
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await axios.delete(`http://localhost:3000/photos/${selectedPhoto.id}`);
                        setPhotos((prev) => prev.filter((p) => p.id !== selectedPhoto.id));
                        setSelectedPhoto(null);
                        setEditPhoto(null);
                        setTotalPhotos((prev) => prev - 1);
                        setPhotos([]);
                        setCurrentPage(1);
                        fetchPhotos(selectedAlbum.id, 1);
                      } catch (err) {
                        console.error('Error deleting photo:', err);
                      }
                    }}
                    className="formButton deleteButton"
                  >
                    Delete Photo
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="formContainer">
        <h4 className="formTitle">Create New Album</h4>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const response = await axios.post('http://localhost:3000/albums', {
                userId: Number(user.id),
                title: newAlbumTitle,
              });
              setFilteredAlbums((prev) => [...prev, response.data]);
              setUserData((prev) => ({
                ...prev,
                albums: [...prev.albums, response.data],
              }));
              setNewAlbumTitle('');
              fetchAlbums();
            } catch (err) {
              console.error('Error creating album:', err);
            }
          }}
        >
          <input
            type="text"
            value={newAlbumTitle}
            onChange={(e) => setNewAlbumTitle(e.target.value)}
            placeholder="Album Title"
            className="formInput"
          />
          <button type="submit" className="formButton">Create Album</button>
        </form>
      </div>
      <div className="formContainer">
        <h4 className="formTitle">Add Photo</h4>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!addPhotoAlbumId) {
              alert('Please select an album');
              return;
            }
            try {
              const response = await axios.post('http://localhost:3000/photos', {
                albumId: Number(addPhotoAlbumId),
                title: `Photo ${photos.length + 1}`,
                url: `https://picsum.photos/600/400?image=${photos.length + 1}`,
                thumbnailUrl: `https://picsum.photos/150/150?image=${photos.length + 1}`,
              });
              if (selectedAlbum?.id === Number(addPhotoAlbumId)) {
                setPhotos((prev) => [...prev, response.data]);
                setTotalPhotos((prev) => prev + 1);
              }
              setUserData((prev) => ({
                ...prev,
                photos: [...prev.photos, response.data],
              }));
            } catch (err) {
              console.error('Error adding photo:', err);
            }
          }}
        >
          <select
            value={addPhotoAlbumId}
            onChange={(e) => setAddPhotoAlbumId(e.target.value)}
            className="searchSelect"
          >
            <option value="">Select Album</option>
            {filteredAlbums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title}
              </option>
            ))}
          </select>
          <button type="submit" className="formButton">Add Photo</button>
        </form>
      </div>
    </div>
  );
}

export default AlbumsManager;