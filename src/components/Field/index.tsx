import React, {useState, SyntheticEvent} from 'react';
import {styled, TextField, InputAdornment} from '@material-ui/core';
import {Visibility, VisibilityOff} from '@material-ui/icons';

const Field: any = styled(TextField)({
    margin: '0 0 10px',
    '& .MuiOutlinedInput-root' : {
        borderRadius: '15px',
        '& input': {
            borderRadius: 'inherit',
            padding: '8.5px 14px;',
            border: '1px solid #838c95',
            '&:placeholder': {
                color: '#00404d !important'
            }
        },
        '& .MuiOutlinedInput-notchedOutline' : {
            border: '0 !important'
        },
        '&.Mui-focused': {
            '& input' : {
                border: '1px solid #00404d !important',
                boxShadow: '0 0 0 1px #00404d',
            }
        }
    },
});

const PasswordField: any = styled(Field)({
    '& .MuiOutlinedInput-root' : {
        padding: 0,
        '& input': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
    },
});

const ChangeVisibility: any = styled(InputAdornment)({
    cursor: 'pointer',
    height: '100%',
    border: '1px solid #838c95',
    borderRadius: '15px',
    borderLeft: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: '6px',
    margin: 0,
    '& svg': {
        transform: 'scale(0.75)'
    }
});

interface IInputField {
    label?: string
    placeholder?: string
    type?: string
    value?: string
    required?: boolean
    onChange?: (event: SyntheticEvent) => void
}

const InputField: React.FC<IInputField> = ({type, ...props}) => {
    const [fieldType, setFieldType] = useState<string>(type || 'text');

    const changeFieldText = (newType: string): void => {
        setFieldType(newType);
    };

    if (type === "password") {
        return (
            <PasswordField
                size={"small"}
                variant={"outlined"}
                type={fieldType}
                InputProps={{
                    endAdornment: (
                        <ChangeVisibility position="end" onClick={() => changeFieldText(fieldType === "password" ? "text" : "password")}>
                            {fieldType === "password" ? <Visibility /> : <VisibilityOff />}
                        </ChangeVisibility>
                    )
                }}
                {...props}
            />
        );
    }

    return (
        <Field
            size={"small"}
            variant={"outlined"}
            type={fieldType}
            {...props}
        />
    );
};

export default InputField;
