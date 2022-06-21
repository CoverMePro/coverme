import React from 'react';
import NumberFormat from 'react-number-format';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const DurationCustom = React.forwardRef<any, CustomProps>(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            name="shiftDuration"
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            format="##:##"
            placeholder="HH:MM"
            mask={['H', 'H', 'M', 'M']}
            isNumericString
        />
    );
});

export default DurationCustom;
