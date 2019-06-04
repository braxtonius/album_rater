// eslint-disable
// this is an auto generated file. This will be overwritten

export const getAlbumReview = `query GetAlbumReview($id: ID!) {
  getAlbumReview(id: $id) {
    name
    artistName
    createdDate
    upatedDate
    comments
    rating
  }
}
`;
export const listAlbumReviews = `query ListAlbumReviews(
  $filter: ModelAlbumReviewFilterInput
  $limit: Int
  $nextToken: String
) {
  listAlbumReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      name
      artistName
      createdDate
      upatedDate
      comments
      rating
    }
    nextToken
  }
}
`;
