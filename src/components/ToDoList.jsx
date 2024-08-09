import AllTasksContext from "./AllTasksContext.jsx";
import GroupsContext from "./GroupsContext.jsx";
import TaskModal from "./TaskModal.jsx";
import ToDoItem from "./ToDoItem.jsx";
import ColorPicker from "./ColorPicker.jsx";
import { useState, useEffect, useContext } from "react";

import {
    List,
    IconButton,
    ListItem,
    ListItemButton,
    ButtonBase,
    Menu,
    MenuItem,
    TextField,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

export default function ToDoList() {
    const { groups, setGroups, groupColors } = useContext(GroupsContext);
    const { allTasks, setAllTasks } = useContext(AllTasksContext);

    // states for managing the current group shown
    const [groupInView, setGroupInView] = useState("All Tasks");
    const [tasksInView, setTasksInView] = useState([]);

    // states for group dropdown menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [colorAnchor, setColorAnchor] = useState(null);
    const [colorInput, setColorInput] = useState("yellow");
    const [newGroupInput, setNewGroupInput] = useState("");
    const [error, setError] = useState("");

    // states for adding task
    const [modalOpen, setModalOpen] = useState(false);

    // update tasksInView
    useEffect(() => {
        groupInView == "All Tasks"
            ? setTasksInView(allTasks)
            : setTasksInView(
                  allTasks.filter((task) => task.group == groupInView)
              );
    }, [groupInView, allTasks]);

    function handleAddGroup(e) {
        e.preventDefault();
        if (groups.some((group) => group.name.trim() == newGroupInput.trim())) {
            setError("That group already exists :(");
            // send an error to the user if group already exists
        } else {
            setGroups((prev) => {
                const newGroups = [...prev];
                newGroups.push({
                    id: prev.length,
                    name: newGroupInput,
                    totalPomos: 0,
                    color: colorInput,
                });
                return newGroups;
            });
        }
        setNewGroupInput("");
        return 0;
    }

    function selectGroup(groupName) {
        setGroupInView(groupName);
        setAnchorEl(null);
    }

    function getGroupColor(groupName) {
        const color = groups.find((g) => g.name === groupName).color;
        if (color == undefined) {
            return "#000000";
        }
        return groupColors.find((c) => c.color === color).hex;
    }

    return (
        <>
            <List
                subheader={
                    // Displays group in view + dropdown menu of groups
                    <div style={ListHeaderStyle}>
                        <ButtonBase
                            onClick={(event) =>
                                setAnchorEl(event.currentTarget)
                            }
                            sx={{
                                borderRadius: "5px",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                                },
                            }}
                        >
                            <ArrowDropDownRoundedIcon />
                            <h2
                                style={{
                                    fontSize: "18px",
                                    fontFamily: "Montserrat",
                                    margin: "7px",
                                }}
                            >{`${groupInView} (${tasksInView.length})`}</h2>
                        </ButtonBase>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            disableAutoFocusItem
                            disableAutoFocus
                        >
                            {groups.map((group) => (
                                <MenuItem
                                    onClick={() => selectGroup(group.name)}
                                    key={group.id}
                                >
                                    {group.name}
                                    <StarRoundedIcon
                                        style={{
                                            color: getGroupColor(group.name),
                                            marginLeft: "auto",
                                        }}
                                    />
                                </MenuItem>
                            ))}
                            <MenuItem disableRipple>
                                <IconButton
                                    edge={"start"}
                                    onClick={(e) =>
                                        setColorAnchor(e.currentTarget)
                                    }
                                >
                                    <StarRoundedIcon
                                        style={{
                                            color: groupColors.find(
                                                (c) => c.color === colorInput
                                            ).hex,
                                        }}
                                    />
                                </IconButton>
                                <TextField
                                    onKeyUp={(e) => e.stopPropagation()}
                                    size="small"
                                    sx={{ margin: "auto" }}
                                    label="Add a new group"
                                    value={newGroupInput}
                                    onChange={(e) => {
                                        setNewGroupInput(e.target.value);
                                        setError("");
                                    }}
                                    error={!!error}
                                    helperText={error}
                                    onKeyDown={(e) => {
                                        e.stopPropagation();
                                        if (e.key === "Enter") {
                                            handleAddGroup(e);
                                        }
                                    }}
                                />
                            </MenuItem>
                            <ColorPicker
                                colorAnchor={colorAnchor}
                                setColorAnchor={(newAnchor) =>
                                    setColorAnchor(newAnchor)
                                }
                                setColorInput={setColorInput}
                            />
                        </Menu>
                        <IconButton
                            onClick={() => {
                                setModalOpen(true);
                            }}
                        >
                            <AddCircleIcon aria-label="add-task" />
                        </IconButton>
                    </div>
                }
            >
                {tasksInView.map((task) => (
                    <ToDoItem
                        thisTask={task}
                        key={task.id}
                        getGroupColor={(groupName) => getGroupColor(groupName)}
                    />
                ))}
                <ListItem
                    sx={AddTaskButtonStyle}
                    onClick={() => {
                        setModalOpen(true);
                    }}
                >
                    <ListItemButton>
                        <p>Add a new task</p>
                    </ListItemButton>
                </ListItem>
            </List>
            <TaskModal open={modalOpen} setOpen={setModalOpen} />
        </>
    );
}

// styling adjustments

const ListHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 10px 0px 0px",
    margin: "7px 0 7px 0",
};

const AddTaskButtonStyle = {
    borderRadius: "15px",
    bgcolor: "transparent",
    borderStyle: "dotted",
    borderColor: "#E3E3E3",
    marginBottom: "5px",
    boxShadow: "0px 2px 4px 0px rgba(0,0,0,.06)",
    padding: "5px 25px 5px 25px",
};
