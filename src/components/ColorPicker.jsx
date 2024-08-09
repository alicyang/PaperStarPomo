import GroupContext from "./GroupsContext";
import { useContext, useState } from "react";

import { Menu, MenuItem } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

export default function ColorPicker({ colorAnchor, setColorAnchor, setColorInput }) {
    const { groupColors } = useContext(GroupContext);

    function changeColor(color) {
        if (color) {
            setColorInput(color.color)
        }
    }

    return (
        <Menu
            anchorEl={colorAnchor}
            open={Boolean(colorAnchor)}
            onClose={() => setColorAnchor(null)}
            disableAutoFocusItem
            disableAutoFocus
        >
            {groupColors.map((c, i) => (
                <MenuItem
                    onClick={() => changeColor(c)}
                    key={i}
                >
                    <StarRoundedIcon style={{ color: c.hex}} />
                </MenuItem>
            ))}
        </Menu>
    );
}
