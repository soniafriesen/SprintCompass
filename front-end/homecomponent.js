import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Card, CardContent, CardHeader, Typography, CardMedia } from "@material-ui/core";
import theme from "../theme";
import "../App.css";

const HomeComponent = () => {

    return (
        <MuiThemeProvider theme={theme}>
            <Card>
                <CardHeader
                    title="Dream Geek"
                    style={{ color: theme.palette.primary.main, textAlign: "center" }}
                />
                <CardContent>
                    <br />
                    <Typography
                        color="primary"
                        style={{ float: "right", paddingRight: "1vh", fontSize: "smaller" }}
                    >
                        &copy;Dream Geek
                    </Typography>
                </CardContent>
            </Card>
        </MuiThemeProvider>
    );
};

export default HomeComponent;