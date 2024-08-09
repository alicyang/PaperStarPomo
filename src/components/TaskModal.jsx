import AllTasksContext from "./AllTasksContext";
import GroupsContext from "./GroupsContext";
import { useState, useContext } from "react";
import { Button, TextField, Modal, Autocomplete } from "@mui/material";

export default function TaskModal({
    open, // bool: whether the modal is open or not
    setOpen,
}) {
    const { allTasks, setAllTasks } = useContext(AllTasksContext);
    const { groups, setGroups } = useContext(GroupsContext);
    const [taskInput, setTaskInput] = useState("");
    const [groupInput, setGroupInput] = useState("");

    function submitInput() {
        if (!groups.some((group) => group.name == groupInput)) {
            // add group if it doesn't exist yet
            setGroups((prev) => {
                const newGroups = [...prev];
                newGroups.push({ name: groupInput, id: prev.length, totalPomos: 0, color: 'yellow'});
                return newGroups;
            });
        }
        setAllTasks((prev) => {
            // add new task 
            const newTasks = [...prev];
            newTasks.push({
                id: prev.length,
                name: taskInput,
                completed: false,
                pomos: 0,
                group: groupInput,
                totalTime: 0,
            });
            return newTasks;
        });
        setOpen(false);
        setTaskInput('');
        setGroupInput('');
    }

    return (
        <Modal
            open={open}
            onClose={() => {
                setOpen(false);
            }}
        >
            <div style={modalDivStyle} onKeyDown={(e) => e.stopPropagation()} onKeyUp={(e) => e.stopPropagation()}>
                <TextField
                    label="Task name"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                ></TextField>
                <Autocomplete
                    freeSolo
                    options={groups.toSpliced(0, 1).map((group) => group.name)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Group name"
                            onSelect={(e) => {
                                console.log(e.target.value);
                                setGroupInput(e.target.value);
                            }}
                            value={groupInput}
                        />
                    )}
                ></Autocomplete>
                <Button variant="contained" onClick={submitInput} disabled={taskInput.trim() == '' || groupInput.trim() == ''}>
                    Save
                </Button>
            </div>
        </Modal>
    );
}

const modalDivStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "white",
    border: "2px solid #000",
    borderRadius: "15px",
    boxShadow: 24,
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
};
