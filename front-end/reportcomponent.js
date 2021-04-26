import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
    Card,
    CardContent,
    TextField,
    Button,
    Typography
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import theme from "../theme";
import "../App.css";
import ReportButton from "./reportcomponents/reportbutton"
import Report from "./reportcomponents/report"
const GRAPHURL = "http://localhost:5000/graphql";

const ReportComponent = (props) => {
    const initialState = {
        projectArr: [],
        project: "",
        sprintArr: [],
        sprint: ""
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);
    const buttonEnabled = state.project === undefined || state.project === ""
        || state.sprint === undefined || state.sprint === "";

    useEffect(() => {
        fetchProjectInfo();
    }, []);

    const currentProjectOnChange = (e, selection) => {
        selection
            ? setState({ project: selection.name })
            : setState({ project: "" });
        selection
            ? fetchSprintInfo(selection.name)
            : fetchSprintInfo("");
    };

    const currentSprintOnChange = (e, selection) => {
        selection
            ? setState({ sprint: selection.sprint })
            : setState({ sprint: "" });
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

    const fetchSprintInfo = async (project) => {
        try {
            props.dataFromChild("running setup...");
            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({
                    query:
                        `{getallsprintsperproject(project:"${project}"){project,team,sprint,numberofuserstory,storypoints}}`,
                }),
            });
            let payload = await response.json();
            props.dataFromChild(
                `found ${payload.data.getallsprintsperproject.length} sprints`
            );
            console.log(payload.data.getallsprintsperproject);
            setState({
                sprintArr: payload.data.getallsprintsperproject,
            });
        } catch (error) {
            console.log(error);
            props.dataFromChild(`Problem loading server data - ${error.message}`);
        }
    };

    return (
        <MuiThemeProvider theme={theme}>
            <Card>
                <Typography variant="h4" align="center" style={{ color: theme.palette.primary.main, fontWeight: "bold", paddingTop: "2vh" }}>
                    Print Report
                </Typography>
                <CardContent>
                    <Typography variant="h5" align="center" style={{ color: theme.palette.primary.main, fontWeight: "bold", paddingTop: "2vh" }}>
                        Choose Project to Write Report About
                    </Typography>
                    <div align="center">
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
                        <Typography variant="h5" align="center" style={{ color: theme.palette.primary.main, fontWeight: "bold", paddingTop: "2vh" }}>
                            Choose Sprint to Write Report About
                    </Typography>
                        <Autocomplete
                            onChange={currentSprintOnChange}
                            id="sprint"
                            options={state.sprintArr}
                            getOptionLabel={(option) => option.sprint}
                            style={{ width: 350, height: 20, paddingTop: "2vh", paddingBottom: "5vh" }}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label="sprint"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            disabled={buttonEnabled}
                        >
                            <ReportButton id={state.sprint} label="Create Report" project={state.project} />
                        </Button>
                        {state.sprint && (
                            <Report id={state.sprint} project={state.project} />
                        )}
                    </div>
                </CardContent>
            </Card>
        </MuiThemeProvider>
    );
};
export default ReportComponent;