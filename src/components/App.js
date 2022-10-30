import { React, useEffect, useReducer } from "react";
import MyTickets from './MyTickets';
import NewTicket from './NewTicket';
import TicketDetails from './TicketDetails';
import Listings from './Listings';
import SearchResults from './SearchResults';
import SubmissionSuccess from './SubmissionSuccess';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Container from '@mui/material/Container';
import NavBar from './NavBar';
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import { StateContext } from "../utils/StateContext"
import reducer from "../utils/StateReducer";
import { getTickets } from "../services/ticketServices";

const sections = [
  {
    title: "My Tickets", url:"mytickets"
  },
  {
    title: "New Ticket", url:"newticket"
  },
  {
    title: "Listings", url:"listings"
  }
]

function App() {
  const initialState = {
    tickets: [],
    loggedInUser: null,
    auth: null,
  };
  const [store, dispatch] = useReducer(reducer, initialState);
  const { loggedInUser } = store;

  useEffect(() => {
    if (!loggedInUser){
      return;
    }

    getTickets()
      .then((tickets) =>
        dispatch({ type: "setTickets", data: tickets })
      )
      .catch((error) => console.log(error));
  },[loggedInUser])

  return (
    <StateContext.Provider value={{ store, dispatch }}>
    <div className="App">
        <Header />
        <Container maxWidth='lg'>
            <NavBar title="Project Priorization" sections={sections}></NavBar>
        </Container>

        <Routes>
          <Route path="/" element={<MyTickets />} />
          <Route path="Mytickets" element={<MyTickets />} />
          <Route path="Newticket" element={<NewTicket />} />
          <Route path="Listings" element={<Listings />} />
          <Route path="Signin" element={<SignIn />} />
          <Route path="Signup" element={<SignUp />} />
          <Route path="Searchresults" element={<SearchResults />} />
          <Route path="Submissionsuccess" element={<SubmissionSuccess />} />
          <Route path="Ticketdetails" element={<TicketDetails  />} />
         
          {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      
    </div>
    </StateContext.Provider>
  );
}

export default App;
