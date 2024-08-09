import TimerContext from "./TimerContext.jsx";
import GroupsContext from "./GroupsContext.jsx";
import AllTasksContext from "./AllTasksContext.jsx";
import { useState, useEffect, useRef, useContext } from "react";
import {
    Button,
    ButtonGroup,
    TextField,
    Autocomplete,
    Box,
    Typography,
} from "@mui/material";

export default function Timer({ triggerAddStar }) {
    const { groups } = useContext(GroupsContext);
    const { allTasks, setAllTasks } = useContext(AllTasksContext);
    const { timerInfo, setTimerInfo, modeLengths } = useContext(TimerContext);
    const [taskInput, setTaskInput] = useState("");
    const [inputEnabled, setInputEnabled] = useState(false);
    const [startTime, setStartTime] = useState(timerInfo.secondsLeft);
    const timerInterv = useRef(null);

    useEffect(() => {
        if (timerInfo.on) {
            setUpTimer();
        } else if (timerInfo.secondsLeft != modeLengths[timerInfo.modeIndex]) {
            pauseTimer();
        }
        return () => clearInterval(timerInterv.current);
    }, [timerInfo.on]);

    function setUpTimer() {
        timerInterv.current = setInterval(() => {
            setTimerInfo((prev) => {
                if (prev.secondsLeft <= 0) {
                    clearInterval(timerInterv.current);
                    return advanceTimer();
                } else {
                    return { ...prev, secondsLeft: prev.secondsLeft - 1 };
                }
            });
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterv.current);
        if (timerInfo.modeIndex === 0) {
            if (timerInfo.currTaskId !== null) {
                const updatedTask = {
                    ...allTasks.find((t) => t.id === timerInfo.currTaskId),
                };
                updatedTask.totalTime += startTime - timerInfo.secondsLeft;
                updateAllTasks(updatedTask);
            }
        }
    }

    function advanceTimer(skipped) {
        const prev = timerInfo;
        const nextInfo = { ...prev, on: false };
        if (prev.modeIndex === 0) {
            nextInfo.completedPomos = prev.completedPomos + 1;

            let groupColor;
            if (prev.currTaskId === null) {
                groupColor = "yellow";
            } else {
                const updatedTask = {
                    ...allTasks.find((t) => t.id === timerInfo.currTaskId),
                };
                updatedTask.pomos += 1;
                if (skipped) {
                    updatedTask.totalTime += startTime - prev.secondsLeft;
                } else {
                    updatedTask.totalTime += startTime;
                }
                updateAllTasks(updatedTask);

                const groupName = allTasks.find(
                    (t) => t.id === prev.currTaskId
                ).group;
                groupColor = groups.find((g) => g.name === groupName).color;
            }
            triggerAddStar(groupColor);
        }

        // advance to the next mode
        if (prev.modeIndex == 1 || prev.modeIndex == 2) {
            // go to pomodoro
            nextInfo.modeIndex = 0;
            nextInfo.secondsLeft = modeLengths[0];
        } else if (nextInfo.completedPomos % 4 == 0) {
            // go to long break
            nextInfo.modeIndex = 2;
            nextInfo.secondsLeft = modeLengths[2];
        } else {
            // go to short break
            nextInfo.modeIndex = 1;
            nextInfo.secondsLeft = modeLengths[1];
        }

        return nextInfo;
    }

    function skipTimer() {
        setTimerInfo((prev) => {
            return advanceTimer(/* skipped = */ true);
        });
    }

    useEffect(() => {
        setStartTime(modeLengths[timerInfo.modeIndex]);
    }, [timerInfo.modeIndex]);

    useEffect(() => {
        // handles the focused task being changed
        if (timerInfo.currTaskId === null) {
            setTaskInput("");
        } else {
            setTaskInput(
                allTasks.find((t) => t.id === timerInfo.currTaskId).name
            );
        }
        // reset timer back to default settings
        setTimerInfo((prev) => ({
            ...prev,
            secondsLeft: modeLengths[0],
            modeIndex: 0,
        }));
    }, [timerInfo.currTaskId]);

    function updateAllTasks(updatedTask) {
        setAllTasks((prev) => {
            const newTasks = [...prev];
            const taskIndex = prev.findIndex((t) => t.id === updatedTask.id);
            newTasks[taskIndex] = updatedTask;
            return newTasks;
        });
    }

    function formatTime() {
        const UTCtime = new Date(timerInfo.secondsLeft * 1000);
        let sc = UTCtime.getSeconds();
        if (sc < 10) sc = `0${sc}`;
        return `${UTCtime.getUTCMinutes()}:${sc}`;
    }

    function changeCurrTask() {
        let newId;
        console.log(taskInput)
        if (taskInput.trim() === "") {
            newId = null;
        } else {
            newId = allTasks.find((task) => task.name === taskInput).id;
        }
        setTimerInfo((prev) => ({
            ...prev,
            currTaskId: newId,
            modeIndex: 0,
            secondsLeft: modeLengths[0],
        }));
        setInputEnabled(false);
    }

    return (
        <Box sx={TimerStyle}>
            <ButtonGroup sx={{ marginBottom: "30px" }}>
                <Button
                    disabled={timerInfo.on}
                    variant={
                        timerInfo.modeIndex === 0 ? "contained" : "outlined"
                    }
                    onClick={() => {
                        setTimerInfo((prev) => ({
                            ...prev,
                            secondsLeft: modeLengths[0],
                            modeIndex: 0,
                        }));
                    }}
                >
                    Pomodoro
                </Button>
                <Button
                    disabled={timerInfo.on}
                    variant={
                        timerInfo.modeIndex === 1 ? "contained" : "outlined"
                    }
                    onClick={() => {
                        setTimerInfo((prev) => ({
                            ...prev,
                            secondsLeft: modeLengths[1],
                            modeIndex: 1,
                        }));
                    }}
                >
                    Short Break
                </Button>
                <Button
                    disabled={timerInfo.on}
                    variant={
                        timerInfo.modeIndex === 2 ? "contained" : "outlined"
                    }
                    onClick={() => {
                        setTimerInfo((prev) => ({
                            ...prev,
                            secondsLeft: modeLengths[2],
                            modeIndex: 2,
                        }));
                    }}
                >
                    Long Break
                </Button>
            </ButtonGroup>
            <Typography variant="h1" sx={{ fontSize: "3rem" }}>
                {formatTime()}
            </Typography>
            <Box sx={{ display: "flex", gap: "10px", marginTop: "20px", marginBottom: '10px'}}>
                <Button
                    onClick={() =>
                        setTimerInfo((prev) => ({ ...prev, on: !prev.on }))
                    }
                    variant="contained"
                    disabled={inputEnabled}
                >
                    {timerInfo.on ? "Pause" : "Start"}
                </Button>
                <Button
                    variant="contained"
                    disabled={!timerInfo.on}
                    onClick={skipTimer}
                >
                    Skip
                </Button>
            </Box>
            {!inputEnabled ? (
                <Typography >
                    <strong>Current task:</strong>{" "}
                    {taskInput == "" ? "(none linked)" : taskInput}
                </Typography>
            ) : (
                <Autocomplete
                    options={allTasks
                        .filter((t) => !t.completed)
                        .map((task) => task.name)}
                    onInputChange={(e, value, reason) => {
                        if (reason == "clear") {
                            setTaskInput("");
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                            label="Link a task (or leave blank)"
                            onSelect={(e) => setTaskInput(e.target.value)}
                            value={taskInput}
                        />
                    )}
                    noOptionsText="No matching tasks"
                    disabled={!inputEnabled}
                    sx={{ marginBottom: "20px", width: "80%" }}
                />
            )}

            {inputEnabled ? (
                <Button onClick={changeCurrTask}>Save</Button>
            ) : (
                <Button
                    disabled={timerInfo.on}
                    onClick={() => setInputEnabled(true)}
                >
                    Link a new Task
                </Button>
            )}
        </Box>
    );
}

const TimerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    backgroundColor: "transparent",
    border: "1px dotted #E3E3E3",
    marginBottom: "20px",
    boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.08)",
    padding: "20px",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
};
