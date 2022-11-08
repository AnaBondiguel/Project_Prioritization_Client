import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Typography,
  Button,
  Paper,
  Select,
  NativeSelect,
} from "@mui/material";
import { useGlobalState } from "../utils/StateContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  createTicket,
  updateTicket,
  getTicket,
} from "../services/ticketServices";
import FileBase from "react-file-base64";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";


/**
 * TicketForm is also used for the edit page
 * How it works is that coming from the TicketDetails page, we're sending
 * the same data to this component. The way to access the data that we sent
 * is via `useLocation()` hook.
 * e.g.
 * in TicketDetails.jsx
 * const navigate = useNavigate() // this is how to send data
 * <button onClick={navigate(`/mytickets/update/${id}`, { state }) />
 * 
 * in TicketForm.jsx
 * const location = useLocation() // this is how to receive data
 * const [formState, setFormState] = useState(initialState)
 * useEffect(() => {
 *    setFormState(location.state)
 * }, [location.state])
 */
function TicketForm(props) {
  const location = useLocation();
  console.log(location.state);
  const initialFormState = {
    initiative: "",
    description: "",
    target_id: 1,
    impact_id: 1,
    confidence_id: 1,
    effort_id: 1,
    selectedFile: "",
    feedback:"",
  };
  // const {
  //     enableInitiative = false,
  //     enableDescription = true,
  //     enableTargetId = true,
  //     enableImpactId = true,
  //     enableConfidenceId = true,
  //     enableEffortId = true,
  //     enableSelectedFile = true,
  // } = props;

  const [formState, setFormState] = useState(initialFormState);
  const { dispatch, store } = useGlobalState();
  const { targets, impacts, confidences, efforts } = store;

  let { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    // if (id) {
    //   getTicket(id).then((ticket) => {
    //     const target = targets.find(
    //       (target) => target.name.toLowerCase() === ticket.target.toLowerCase()
    //     );
    //     setFormState({
    //       target_id: target.id,
    //       description: ticket.description,
    //     });
    //   });
    // }
    // /tickets/new
    // location.state = undefined
    // setFormState(undefined)
    //setFormState(location.state)

    // state = initialFormState
    setFormState(state => {
      return {
        ...state, // this is the initialFormState
        ...location.state // this is the ticket details
      }
    });
  }, [location.state]);

  function handleChange(event) {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  }

  function handleClick(event) {
    event.preventDefault();
    //if statement to handle update ticket and create ticket
    if (id) {
      updateTicket({ id: id, ...formState })
        .then(() => {
          dispatch({
            type: "updateTicket",
            data: { id: id, ...formState },
          });
          //if user update ticket with form, leave ticket to show on the page.
          navigate(`/mytickets/${id}`);
        })
        .catch((error) => console.log(error));
    } else {
      createTicket({ ...formState })
        .then((ticket) => {
          dispatch({ type: "addTicket", data: ticket });
          //we can navigate back to the my tickets page once we create a ticket.
          navigate("/mytickets");
        })
        .catch((error) => console.log(error));
    }
  }

  return (
    <Paper elevation={3}>
      <form>
        <h1>New Ticket</h1>
        <Typography>Initiative:</Typography>
        <input
          type="text"
          name="initiative"
          value={formState.initiative}
          onChange={handleChange}
        ></input>
        <Typography>Description:</Typography>
        <textarea
          type="text"
          name="description"
          value={formState.description}
          onChange={handleChange}
        ></textarea>
        <Typography>Target:</Typography>
        <NativeSelect
          name="target_id"
          value={formState.target_id}
          onChange={handleChange}
        >
          {targets.map((target) => (
            <option key={target.id} value={target.id}>
              {target.name}
            </option>
          ))}
        </NativeSelect>
        <Typography>Impact:</Typography>
        <select
          name="impact_id"
          value={formState.impact_id}
          onChange={handleChange}
        >
          {impacts.map((impact) => (
            <option key={impact.id} value={impact.id}>
              {impact.name}
            </option>
          ))}
        </select>
        <Typography>Confidence:</Typography>
        <Select
          name="confidence_id"
          value={formState.confidence_id}
          onChange={handleChange}
        >
          {confidences.map((confidence) => (
            <MenuItem key={confidence.id} value={confidence.id}>
              {confidence.name}
            </MenuItem>
          ))}
        </Select>
        <Typography>Effort:</Typography>
        <Select
          name="effort_id"
          value={formState.effort_id}
          onChange={handleChange}
        >
          {efforts.map((effort) => (
            <MenuItem key={effort.id} value={effort.id}>
              {effort.name}
            </MenuItem>
          ))}
        </Select>
        <Typography>Due Date:</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Basic example"
            value={formState.duedate}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Typography>Upload files:</Typography>
        <input
          type="text"
          name="uselectedFile"
          value={formState.selectedFile}
          onChange={handleChange}
        ></input>
        <FileBase
          type="file"
          multiple={false}
          onDone={({ base64 }) =>
            setFormState({ ...formState, selectedFile: base64 })
          }
        />
         <Typography>Feedback:</Typography>
        <textarea
          type="text"
          name="feedback"
          value={formState.feedback}
          onChange={handleChange}
        ></textarea>
        <br></br> <br></br>
        {/* If id is in the url, that means we update the ticket. If id is not in the url, that means we create a new ticket. */}
        <Button variant="contained" onClick={handleClick}>
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </Paper>
  );
}

export default TicketForm;