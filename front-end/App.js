import React, { useState, useReducer } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import Reorder from "@material-ui/icons/Reorder";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import HomeComponent from "./softwareproject/homecomponent";
import ProjectInfo from "./softwareproject/projectinfo";
import MemberInfo from "./softwareproject/memberinfo";
import Sprint from "./softwareproject/sprint";
import Userstory from "./softwareproject/userstory";
import Subtask from "./softwareproject/subtask";
import Retrospective from "./softwareproject/retrospective";
import Backlog from "./softwareproject/backlog";
import ReportComponent from "./softwareproject/reportcomponent";
import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Snackbar,
} from "@material-ui/core";

const App = () => {
  const initialState = {
    gotData: false,
    anchorEl: null,
    snackBarMsg: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const handleClick = (event) => {
    setState({ anchorEl: event.currentTarget });
  };

  const handleClose = () => {
    setState({ anchorEl: null });
  };

  const snackbarClose = () => {
    setState({ gotData: false });
  };

  const msgFromChild = (msg) => {
    setState({ snackBarMsg: msg, gotData: true });
  };

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            INFO3112 - Project #1
          </Typography>
          <IconButton
            onClick={handleClick}
            color="inherit"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <Reorder />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={state.anchorEl}
            open={Boolean(state.anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/home" onClick={handleClose}>
              Home
            </MenuItem>
            <MenuItem component={Link} to="/info" onClick={handleClose}>
              Project Info
            </MenuItem>
            <MenuItem component={Link} to="/teammembers" onClick={handleClose}>
              Member Info
            </MenuItem>
            <MenuItem component={Link} to="/backlog" onClick={handleClose}>
              Backlog
            </MenuItem>
            <MenuItem component={Link} to="/sprints" onClick={handleClose}>
              Sprint Info
            </MenuItem>
            <MenuItem component={Link} to="/userstories" onClick={handleClose}>
              User Story Info
            </MenuItem>
            <MenuItem component={Link} to="/subtasks" onClick={handleClose}>
              Subtask Info
            </MenuItem>
            <MenuItem
              component={Link}
              to="/retrospective"
              onClick={handleClose}
            >
              Sprint Retrospective
            </MenuItem>
            <MenuItem component={Link} to="/report" onClick={handleClose}>
              Report Component
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route path="/home" component={HomeComponent} />
        <Route
          path="/info"
          render={() => <ProjectInfo dataFromChild={msgFromChild} />}
        />
        <Route
          path="/teammembers"
          render={() => <MemberInfo dataFromChild={msgFromChild} />}
        />
        <Route
          path="/backlog"
          render={() => <Backlog dataFromChild={msgFromChild} />}
        />
        <Route
          path="/sprints"
          render={() => <Sprint dataFromChild={msgFromChild} />}
        />
        <Route
          path="/userstories"
          render={() => <Userstory dataFromChild={msgFromChild} />}
        />
        <Route
          path="/subtasks"
          render={() => <Subtask dataFromChild={msgFromChild} />}
        />
        <Route
          path="/retrospective"
          render={() => <Retrospective dataFromChild={msgFromChild} />}
        />

        <Route
          path="/report"
          render={() => <ReportComponent dataFromChild={msgFromChild} />}
        />
      </div>
      <Snackbar
        open={state.gotData}
        message={state.snackBarMsg}
        autoHideDuration={3000}
        onClose={snackbarClose}
      />
    </MuiThemeProvider>
  );
};
export default App;
