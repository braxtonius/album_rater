import React, {useState, useEffect} from 'react';
import { createAlbumReview, updateAlbumReview } from './graphql/mutations.js';
import { listAlbumReviews } from './graphql/queries.js';
import './App.css';
import Amplify, {API,graphqlOperation} from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

type AlbumReview = {
  id: string,
  name: string,
  artistName: string,
  comments: string,
  rating: number,
}

const App = () => {
  const [reviews, setReviews] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState(5);
  const [selectedID, setSelectedID] = useState("");

  useEffect(() => {
    handleListReviews()
  }, []);

  const handleListReviews = async () => {
    const  { data } = await API.graphql(graphqlOperation(listAlbumReviews));
    setReviews(data.listAlbumReviews.items);
  }

  const handleCreateOrUpdateReview = async event => {
    event.preventDefault();
    var updatedReviews = [];
    if (selectedID !== "") {
      const payload = {
        id: selectedID,
        name: albumName,
        artistName: artistName,
        comments: comments,
        rating: rating,
      };
      const {data} = await API.graphql(graphqlOperation(updateAlbumReview, {input: payload}));
      const updatedReview = data.updateAlbumReview;
      debugger;
      var updatedReviews = [
        updatedReview,
        ...reviews.filter(review => review.id !== selectedID),
      ];
    } else {
      const payload = {
        name: albumName,
        artistName: artistName,
        comments: comments,
        rating: rating,
      };
      const { data } = await API.graphql(graphqlOperation(createAlbumReview, {input: payload}));
      const updatedReview = data.createAlbumReview;
      var updatedReviews = [updatedReview, ...reviews];
    }
    setReviews(updatedReviews);
    setSelectedID("");
    setAlbumName("");
    setArtistName("");
    setComments("");
    setRating("");
  }

  const onClearSelectedReview = () => {
    setSelectedID("");
    setAlbumName("");
    setArtistName("");
    setComments("");
    setRating("");
  }

  const onSelectReview = (id) => {
    setSelectedID(id);
    const review = reviews.filter(review => review.id === id)[0];
    setAlbumName(review.name != null ? review.name : "");
    setArtistName(review.artistName != null ? review.artistName : "");
    setComments(review.comments != null ? review.comments : "");
    setRating(review.rating != null ? review.rating : 5);
  }

  const formHeader = selectedID === ""
    ? "Rate An Album"
    : `Updating Album ${
        reviews.filter(review => review.id === selectedID)[0].name
      }`;

  return (
    <div className="flex flex-column items-center
    justify-center bg-washed-red pa3">

      <h1 className="code f2">{formHeader}</h1>
        <form onSubmit={handleCreateOrUpdateReview} className="mb3">
          <label>
            Album Title
            <input
              type="text"
              placeholder={albumName}
              className="pa2 f4"
              value={albumName}
              onChange={({ target }) => setAlbumName(target.value)}
            />
          </label>
          <br />
          <label>
            Artist Name
            <input
              type="text"
              placeholder={artistName}
              className="pa2 f4"
              value={artistName}
              onChange={({ target }) => setArtistName(target.value)}
            />
          </label>
          <br />
          <label>
            Comments
            <input
              type="text"
              placeholder={comments}
              className="pa2 f4"
              value={comments}
              onChange={({ target }) => setComments(target.value)}
            />
          </label>
          <br />
          <label>
            Rating
            <select
              name="rating"
              required={true}
              className="pa2 f4"
              value={rating}
              onChange={({ target }) => setRating(target.value)}>
              <option value={5}>Amazing</option>
              <option value={4}>Good</option>
              <option value={3}>OK</option>
              <option value={2}>Poor</option>
              <option value={1}>Terrible</option>
            </select>
          </label>
          <br />
          <button type="submit" className="pa2 f4">
            Add Rating
          </button>
          {selectedID !== "" &&
            <button
              type="button"
              className="pa2 f4"
              onClick={() => onClearSelectedReview()}>
              Clear
            </button>
          }
        </form>
      <h1 className="code f2">Your Ratings</h1>
      <table>
        <tr>
          <th>Album Name</th>
          <th>Artist</th>
          <th>Rating</th>
          <th>Comments</th>
          <th>Update</th>
        </tr>
        <tbody>
        {reviews.map(review =>
          <tr id={review.id}>
            <td>{review.name}</td>
            <td>{review.artistName}</td>
            <td>{review.rating}</td>
            <td>{review.comments}</td>
            <td>
              <button
                type="button"
                value={review.id}
                onClick={({ target }) => onSelectReview(target.value)}
              />
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}

export default withAuthenticator(App, {includeGreetings: true });
