import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectAutoWidth({ fullWidth, label, onChange, value, userRoleToShow, name, options, error }) {

    return (
        <div className="relative">
            <FormControl fullWidth={fullWidth}>
                <InputLabel id="demo-simple-select-autowidth-label">{label}</InputLabel>
                <Select
                    className='h-10'
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={value}
                    defaultValue={value}
                    onChange={onChange}
                    label={label}
                    name={name}
                    error={error}
                >
                    {options.map((option, index) => {
                        return (
                            <MenuItem key={index} value={option}>{option}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    );
}
