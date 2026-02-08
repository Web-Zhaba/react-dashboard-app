import { useState } from "react";

export default function useInput(defaultValue = '') {
    const [value, setValue] = useState(defaultValue)

    const reset = () => {
        setValue('');
    };

    const onChange = (event) => {
        setValue(event.target.value);
    };

    const setCustomValue = (newValue) => {
        setValue(newValue);
    };

    return {
        value,
        onChange,
        reset,
        setValue: setCustomValue
    };
}