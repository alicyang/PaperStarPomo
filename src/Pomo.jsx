import Timer from "./components/Timer.jsx";
import ToDoList from "./components/ToDoList.jsx";
import AllTasksContext from "./components/AllTasksContext.jsx";
import GroupsContext from "./components/GroupsContext.jsx";
import TimerContext from "./components/TimerContext.jsx";
import { useState, useRef } from "react";

import { Paper, Grid, ButtonBase } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Spline from "@splinetool/react-spline";

function getGreeting() {
    const hours = new Date().getHours();
    if (hours < 12) {
        return "Good Morning!";
    } else if (hours < 18) {
        return "Good Afternoon!";
    } else {
        return "Good Evening!";
    }
}

const groupsArr = [
    { id: -1, name: "All Tasks", totalPomos: undefined, color: undefined }, // utility group for displaying all tasks
    { id: 0, name: "Chores", totalPomos: 0, color: "blue" },
    { id: 1, name: "Homework", totalPomos: 0, color: "pink" },
];
const tasksArr = [
    {
        id: 0,
        group: "Chores",
        name: "Do dishes",
        pomos: 0,
        completed: false,
        totalTime: 0,
    },
    {
        id: 1,
        group: "Homework",
        name: "Write proofs",
        pomos: 0,
        completed: false,
        totalTime: 0,
    },
];

const groupColors = [
    { color: "red", hex: "#DB8A8A" },
    { color: "pink", hex: "#DFA6D7" },
    { color: "yellow", hex: "#ffb121" },
    { color: "blue", hex: "#5BADF1" },
    { color: "green", hex: "#87D0AC" },
];

export default function Pomo() {
    const starJar = useRef();
    const [groups, setGroups] = useState(groupsArr);
    const [allTasks, setAllTasks] = useState(tasksArr);
    // const [timerViewOn, setTimerViewOn] = useState(false);
    const modeLengths = [25 * 60, 5 * 60, 15 * 60];

    const [timerInfo, setTimerInfo] = useState({
        on: false,
        currTaskId: null,
        secondsLeft: modeLengths[0],
        modeIndex: 0,
        inView: false,
        completedPomos: 0,
    });

    function splineOnLoad(splineApp) {
        starJar.current = splineApp.findObjectById(
            "29f0ed21-8117-43b2-b6a0-a7a82c050f8c"
        );
        console.log(starJar.current);
    }

    function triggerAddStar(color) {
        switch (color) {
            case "yellow":
                starJar.current.emitEvent("mouseUp");
                break;
            case "red":
                starJar.current.emitEvent("mouseDown");
                break;
            case "pink":
                starJar.current.emitEvent("mouseHover");
                break;
            case "blue":
                starJar.current.emitEvent("keyDown");
                break;
            case "green":
                starJar.current.emitEvent("keyUp");
                break;
        }
    }

    const topBarStyle = {
        padding: "5px 20px 5px 20px",
        backgroundColor: "transparent",
        color: "black",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        boxShadow: "0 2px 4px 0 rgba(0,0,0,.03)",
        marginBottom: '40px'
    };

    // Top / Left / Right Parts of Page ----------------
    const TopBar = (
        <div style={topBarStyle}>
            <StarRoundedIcon />
            <p style={{ fontFamily: "Montserrat" }}>Paper Star Pomo</p>
            <p style={{ fontFamily: "Montserrat", marginLeft: "auto" }}>
                {getGreeting()}
            </p>
            {/* <ButtonBase
                sx={{
                    ...topBarButtonStyle,
                    marginRight: "10px",
                    marginLeft: "auto",
                    fontWeight: timerViewOn ? "normal" : "bold",
                }}
                onClick={() => setTimerViewOn(false)}
            >
                Tasks
            </ButtonBase>
            <ButtonBase
                sx={{
                    ...topBarButtonStyle,
                    fontWeight: timerViewOn ? "bold" : "normal",
                }}
                onClick={() => setTimerViewOn(true)}
            >
                Pomodoro
            </ButtonBase> */}
        </div>
    );

    // ------------------------------

    const LeftLayout = (
        <Grid
            container
            item
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            xs={12}
            sm={12}
            md={5}
            lg={5}
            sx={{
                [useTheme().breakpoints.up("md")]: {
                    position: "sticky",
                    top: "80px",        
                }, marginBottom: '30px'
            }}
        >
            <Grid container item>
                <Paper
                    elevation={4}
                    sx={{
                        width: "95%",
                        height: "39rem",
                        borderRadius: "100px",
                        margin: "0 auto",
                        borderColor: "white",
                        borderWidth: "2px",
                        borderStyle: "solid",
                    }}
                >
                    <Spline
                        style={{ borderRadius: "100px", pointerEvents: "none" }}
                        scene="https://prod.spline.design/t8ijbH2GtZl0ouJQ/scene.splinecode"
                        onLoad={splineOnLoad}
                    />
                </Paper>
            </Grid>
            {/* <Grid container item>
                <Paper
                    elevation={4}
                    sx={{
                        width: "95%",
                        height: "10rem",
                        borderRadius: "0px 0px 30px 30px",
                        margin: "0 auto",
                        borderColor: "white",
                        borderWidth: "2px",
                        borderStyle: "solid",
                    }}
                >
                    <h2>Stats</h2>
                </Paper>
            </Grid> */}
        </Grid>
    );

    const RightLayout = (
        <Grid
            container
            item
            direction="column"
            xs={12}
            sm={12}
            md={7}
            lg={6}
            sx={{
                [useTheme().breakpoints.up("md")]: {
                    height: "calc(100vh - 80px)", // Matches the left layout height
                    overflowY: "auto", // Enables scrolling within the right layout
                    flexWrap: 'nowrap'     
                },
            }}
        >
            <Timer
                timerViewOn
                triggerAddStar={(color) => triggerAddStar(color)}
            />
            <ToDoList timerViewOn />
        </Grid>
    ); // ) : (
    //     <Grid container item direction="column" xs={12} sm={12} md={7} lg={6}>
    //         <h1 style={{ margin: "5px 10px 0px 10px", fontSize: "2.25em" }}>
    //             {greeting}
    //         </h1>
    //         <Grid item>
    //             <ToDoList />
    //         </Grid>
    //     </Grid>
    // );

    // ----------------------------

    return (
        <>
            {TopBar}
            <TimerContext.Provider
                value={{ timerInfo, setTimerInfo, modeLengths }}
            >
                <GroupsContext.Provider
                    value={{ groups, setGroups, groupColors }}
                >
                    <AllTasksContext.Provider value={{ allTasks, setAllTasks }}>
                        <Grid
                            container
                            alignItems="flex-start"
                            justifyContent="center"
                            direction="row"
                            spacing={3}
                            sx={{
                                paddingLeft: "15px",
                                paddingRight: "15px",
                            }}
                        >
                            {LeftLayout}
                            {RightLayout}
                        </Grid>
                    </AllTasksContext.Provider>
                </GroupsContext.Provider>
            </TimerContext.Provider>
        </>
    );
}
