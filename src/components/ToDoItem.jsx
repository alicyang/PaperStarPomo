import AllTasksContext from "./AllTasksContext";
import GroupsContext from "./GroupsContext";
import TimerContext from "./TimerContext";
import { useState, useContext, useEffect } from "react";
import {
    ListItem,
    Checkbox,
    IconButton,
    Grid,
    Chip,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";

export default function ToDoItem({ thisTask, getGroupColor }) {
    const { allTasks, setAllTasks } = useContext(AllTasksContext);
    const { timerInfo, setTimerInfo } = useContext(TimerContext);
    const [active, setActive] = useState(timerInfo.currTaskId === thisTask.id);

    useEffect(() => {
        if (timerInfo.currTaskId === thisTask.id) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [timerInfo.currTaskId]);

    function toggleCompleted() {
        const index = allTasks.findIndex((task) => task.id == thisTask.id);
        setAllTasks((prev) => {
            const newTasks = [...prev];
            newTasks[index].completed = !newTasks[index].completed;
            return newTasks;
        });
    }

    function deleteTask() {
        const index = allTasks.findIndex((task) => task.id == thisTask.id);
        setAllTasks((prev) => {
            const newTasks = [...prev];
            newTasks.splice(index, 1);
            return newTasks;
        });
    }

    function handleTimerClick() {
        setTimerInfo((prev) => ({
            ...prev,
            currTaskId: thisTask.id,
            on: true,
        }));
    }

    function formatTime(seconds) {
        const UTCtime = new Date(seconds * 1000);
        let sc = UTCtime.getSeconds();
        if (sc < 10) sc = `0${sc}`;
        return `${UTCtime.getUTCMinutes()}:${sc}`;
    }

    return (
        <>
            <ListItem sx={ListItemStyle}>
                <Grid container direction="column">
                    {/* ---- Top Half ---- */}
                    <Grid container item sx={{ alignItems: "center" }}>
                        <Chip
                            label={`${thisTask.group}`}
                            variant="outlined"
                            size="small"
                            icon={
                                <StarRoundedIcon
                                    style={{
                                        color: getGroupColor(thisTask.group),
                                    }}
                                />
                            }
                        />
                        <Checkbox
                            checked={thisTask.completed == true}
                            edge="end"
                            sx={{ marginLeft: "auto" }}
                            onClick={toggleCompleted}
                        />
                    </Grid>
                    {/* ---- Bottom Half ---- */}
                    <Grid container item direction="column" spacing={1}>
                        <Grid item>
                            <p
                                style={{
                                    fontWeight: 500,
                                    margin: 0,
                                    fontSize: "18px",
                                }}
                            >
                                {thisTask.name}
                            </p>
                        </Grid>
                        <Grid container item sx={{ alignItems: "center" }}>
                            <Button
                                startIcon={
                                    active && timerInfo.on ? (
                                        <PauseCircleRoundedIcon />
                                    ) : (
                                        <PlayCircleRoundedIcon />
                                    )
                                }
                                variant="contained"
                                disabled={
                                    (!active && timerInfo.on) ||
                                    thisTask.completed
                                }
                                onClick={handleTimerClick}
                                sx={{
                                    padding: "2px 10px 2px 10px",
                                    marginRight: "5px",
                                }}
                            >
                                {active ? formatTime(timerInfo.secondsLeft) : formatTime(0)}
                            </Button>
                            <p
                                style={{
                                    fontSize: 14,
                                    display: "inline-block",
                                }}
                            >
                                -- total time: {formatTime(thisTask.totalTime)}
                            </p>
                            <IconButton
                                aria-label="delete"
                                onClick={deleteTask}
                                sx={{ marginLeft: "auto" }}
                                edge="end"
                                disabled={active}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItem>
        </>
    );
}

// component styling
const ListItemStyle = {
    borderRadius: "15px",
    bgcolor: "background.paper",
    borderStyle: "solid",
    borderColor: "#E3E3E3",
    marginBottom: "5px",
    boxShadow: "0px 2px 4px 0px rgba(0,0,0,.06)",
    padding: "10px 25px 15px 25px",
};
