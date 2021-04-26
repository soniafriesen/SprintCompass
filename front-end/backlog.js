import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
    Card,
    CardContent,
    TextField,
    Table,
    TableContainer,
    TableRow,
    TableBody,
    TableCell,
    Paper,
    Button,
    Typography
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import theme from "../theme";
import "../App.css";
const GRAPHURL = "http://localhost:5000/graphql";

const Backlog = (props) => {
    const initialState = {
        resArr: [],
        projectArr: [],
        project: "",
        priority: "",
        userrole: "",
        iwantto: "",
        ican: "",
        relativeestimate: "",
        estimatedcost: "",
        reset: false,
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);
    const buttonEnabled = state.project === undefined || state.project === ""
        || state.priority === undefined || state.priority === ""
        || state.userrole === undefined || state.userrole === ""
        || state.iwantto === undefined || state.iwantto === ""
        || state.ican === undefined || state.ican === ""
        || state.relativeestimate === undefined || state.relativeestimate === ""
        || state.estimatedcost === undefined || state.estimatedcost === "";

    useEffect(() => {
        fetchProjectInfo();
    }, []);

    const currentProjectOnChange = (e, selection) => {
        selection
            ? setState({ project: selection.name })
            : setState({ project: "" });
        selection
            ? fetchBacklogs(selection.name)
            : fetchBacklogs("");
    };

    const priorityOnChange = e => {
        setState({ priority: e.target.value });
    };

    const userroleOnChange = e => {
        setState({ userrole: e.target.value });
    };

    const iwanttoOnChange = e => {
        setState({ iwantto: e.target.value });
    };

    const icanOnChange = e => {
        setState({ ican: e.target.value });
    };

    const relativeestimateOnChange = e => {
        setState({ relativeestimate: e.target.value });
    };

    const estimatedcostOnChange = e => {
        setState({ estimatedcost: e.target.value });
    };

    const editSelectOnChange = (e, selection) => {
        selection
            ? setState({ project: selection.project, priority: selection.priority, iwantto: selection.iwantto, userrole: selection.userrole, ican: selection.ican, relativeestimate: selection.relativeestimate, estimatedcost: selection.estimatedcost })
            : setState({
                project: "",
                priority: "",
                iwantto: "",
                userrole: "",
                ican: "",
                relativeestimate: "",
                estimatedcost: ""
            });
    };

    const fetchBacklogs = async (project) => {
        try {
            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({ query: `{getallbacklogbyproject(project:"${project}"){project,priority,userrole,iwantto,ican,relativeestimate,estimatedcost}}` })
            });
            let payload = await response.json();
            setState({
                resArr: payload.data.getallbacklogbyproject
            });
        } catch (error) {
            console.log(error);
            props.dataFromChild(`Problem loading server data - ${error.message}`);
        }
    };

    const fetchProjectInfo = async () => {
        try {
            setState({
                project: "",
                priority: "",
                iwantto: "",
                userrole: "",
                ican: "",
                relativeestimate: "",
                estimatedcost: ""
            });
            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({ query: "{getallproject{name,description,teamname,numberofteammembers,numberofsprints,velocity,storypointsconversion,costperhour}}" })
            });
            let payload = await response.json();
            props.dataFromChild(`found ${payload.data.getallproject.length} projects`);
            setState({
                projectArr: payload.data.getallproject
            });
        } catch (error) {
            console.log(error);
            props.dataFromChild(`Problem loading server data - ${error.message}`);
        }
    };

    const addBacklog = async () => {
        try {
            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({
                    query: ` mutation { addbacklog ( project: "${state.project}", priority: ${state.priority}, iwantto: "${state.iwantto}", userrole: "${state.userrole}", ican: "${state.ican}", relativeestimate: ${state.relativeestimate} )
                            { project, priority, iwantto, userrole, ican, relativeestimate, estimatedcost } } `
                })
            });
            let payload = await response.json();
            props.dataFromChild(`added info for ${payload.data.addbacklog.project} project`);
            setState({
                project: "",
                priority: "",
                iwantto: "",
                userrole: "",
                ican: "",
                relativeestimate: "",
                estimatedcost: "",
                reset: true
            });
            fetchBacklogs();
        } catch (error) {
            console.log(error);
            props.dataFromChild(`Problem loading server data - ${error.message}`);
        }
    };

    const editBacklogs = async () => {
        try {
            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({
                    query: ` mutation { updatebacklogrelaticeestimate ( project: "${state.project}", priority: ${state.priority}, relativeestimate: ${state.relativeestimate} )
                            { project, priority, iwantto, userrole, ican, relativeestimate, estimatedcost } } `
                })
            });
            setState({
                project: "",
                priority: "",
                iwantto: "",
                userrole: "",
                ican: "",
                relativeestimate: "",
                estimatedcost: "",
                reset: true
            });
            fetchBacklogs();
        } catch (error) {
            console.log(error);
            props.dataFromChild(`Problem loading server data - ${error.message}`);
        }
    };

    return (
        <MuiThemeProvider theme={theme}>
            <Card>
                <Typography variant="h4" align="center" style={{ color: theme.palette.primary.main, fontWeight: "bold", paddingTop: "2vh" }}>
                    Backlog
                </Typography>
                <CardContent>
                    <Autocomplete
                        onChange={currentProjectOnChange}
                        id="project"
                        options={state.projectArr}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 350, height: 20, paddingTop: "2vh", paddingBottom: "5vh" }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="project"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                    <TableContainer component={Paper}>
                        <Table aria-label="project table">
                            <TableBody>
                                <TableRow key="headers">
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
                                        Project Name
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
                                        Priority
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
                                        User Role
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
                                        I Want To
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
                                        I Can
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
                                        Relative Estimates
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
                                        Estimated Cost
                                    </TableCell>
                                    <TableCell component="th" scope="row"></TableCell>
                                </TableRow>
                                {state.resArr.map(row => (
                                    <TableRow key={state.resArr.indexOf(row)}>
                                        <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                            {row.project}
                                        </TableCell>
                                        <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                            {row.priority}
                                        </TableCell>
                                        <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                            {row.userrole}
                                        </TableCell>
                                        <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                            {row.iwantto}
                                        </TableCell>
                                        <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                            {row.ican}
                                        </TableCell>
                                        <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                            {row.relativeestimate}
                                        </TableCell>
                                        <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                            {row.estimatedcost}
                                        </TableCell>
                                        <TableCell component="th" scope="row"></TableCell>
                                    </TableRow>
                                ))}
                                <TableRow key="fillable">
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                        {state.project}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                        <TextField
                                            id="priority-field"
                                            onChange={priorityOnChange}
                                            value={state.priority}
                                            type="number"
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                        <TextField
                                            id="user-role-field"
                                            onChange={userroleOnChange}
                                            value={state.userrole}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                        <TextField
                                            id="iwantto-field"
                                            onChange={iwanttoOnChange}
                                            value={state.iwantto}
                                            fullwidth
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                        <TextField
                                            id="ican-field"
                                            onChange={icanOnChange}
                                            value={state.ican}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                        <TextField
                                            id="relativeestimate-field"
                                            onChange={relativeestimateOnChange}
                                            value={state.relativeestimate}
                                            type="number"
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ color: theme.palette.primary.main, textAlign: "center", fontSize: 14 }}>
                                        <TextField
                                            id="estimated-cost-field"
                                            onChange={estimatedcostOnChange}
                                            value={state.estimatedcost}
                                            type="number"
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Button
                                            style={{ color: "green" }}
                                            variant="contained"
                                            onClick={addBacklog}
                                            disabled={buttonEnabled}
                                        >
                                            ADD
                                        </Button>
                                        <Button
                                            style={{ color: "blue" }}
                                            variant="contained"
                                            onClick={editBacklogs}
                                            disabled={buttonEnabled}
                                        >
                                            EDIT
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography variant="h5" align="center" style={{ color: theme.palette.primary.main, fontWeight: "bold", paddingTop: "2vh" }}>
                        Choose Backlog to Edit
                    </Typography>
                    <div align="center">
                        <Autocomplete
                            onChange={editSelectOnChange}
                            key={state.reset}
                            id="backlog"
                            options={state.resArr}
                            getOptionLabel={(option) => option.iwantto}
                            style={{ width: 600, height: 20, paddingTop: "2vh", paddingBottom: "10vh" }}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label="backlog"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        </MuiThemeProvider>
    );
};
export default Backlog;
