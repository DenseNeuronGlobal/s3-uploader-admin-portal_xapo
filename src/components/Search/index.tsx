import React, {SyntheticEvent} from 'react';
import {styled, TextField, InputAdornment} from '@material-ui/core';
import {SearchOutlined} from '@material-ui/icons';

const Field: any = styled(TextField)({
    margin: '0 0 10px',
    '& .MuiOutlinedInput-root' : {
        borderRadius: '15px',
        '& input': {
            padding: '8.5px 14px 8.5px 0;',
            '&:placeholder': {
                color: '#00404d !important'
            }
        },
        '& .MuiOutlinedInput-notchedOutline' : {
            borderColor: '#838c95',
        },
        '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline' : {
                borderColor: '#00404d !important',
                boxShadow: '0 0 0 1px #00404d',
            }
        }
    },
});

const SearchIconWrapper: any = styled(InputAdornment)({
    '& svg': {
        transform: 'scale(0.75)'
    }
});

interface ISearchField {
    placeholder: string
    value: string
    onChange: (event: SyntheticEvent) => void
}

const SearchField: React.FC<ISearchField> = ({placeholder, value, onChange}) => {
    return (
        <Field
            size={"small"}
            variant={"outlined"}
            type={"text"}
            InputProps={{
                startAdornment: <SearchIconWrapper position="start"><SearchOutlined /></SearchIconWrapper>,
            }}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

export default SearchField;
