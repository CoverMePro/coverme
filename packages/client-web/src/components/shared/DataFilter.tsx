import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface IFilterOptions {
    value: string;
    label: string;
    show: boolean;
}

interface IDataFilterProps {
    filterValue: string;
    onFilterChange: (type: string) => void;
    extraOptions: IFilterOptions[];
}

const DataFilter: React.FC<IDataFilterProps> = ({ onFilterChange, filterValue, extraOptions }) => {
    const handleFilterChange = (event: SelectChangeEvent) => {
        onFilterChange(event.target.value as string);
    };
    return (
        <FormControl sx={{ width: '200px' }}>
            <InputLabel id="filter-label">Filter By</InputLabel>
            <Select
                labelId="filter-label"
                value={filterValue}
                label="Filter By"
                onChange={handleFilterChange}
                fullWidth
            >
                <MenuItem value={'company'}>Company Wide</MenuItem>
                <MenuItem value={'teams'}>My Teams</MenuItem>
                {extraOptions.map((option) => {
                    return (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

export default DataFilter;
