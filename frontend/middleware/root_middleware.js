import { applyMiddleware } from 'redux';
import SessionMiddleware from './session_middleware';
import TracksMiddleware from './tracks_middleware';
import annotationMiddleware from './annotations_middleware';
import commentMiddleware from './comments_middleware';
import votesMiddleware from './votes_middleware';
import searchMiddleware from './search_middleware';


const RootMiddleware = applyMiddleware(
  SessionMiddleware,
  TracksMiddleware,
  annotationMiddleware,
  commentMiddleware,
  votesMiddleware,
  searchMiddleware);

export default RootMiddleware;
