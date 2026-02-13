import { useState, useMemo, useCallback } from "react";

export default function useInput(defaultValue = '', options = {}) {
    const { minLength = 2 } = options;

    const [value, setValue] = useState(defaultValue);
    const [submittedValue, setSubmittedValue] = useState(defaultValue);
    const [touched, setTouched] = useState(false);

    const isValid = useMemo(() => {
        if (!touched) return true;
        return value.trim().length >= minLength;
    }, [value, minLength, touched]);

    const errorMessage = useMemo(() => {
        if (!touched || isValid) return '';
        if (value.trim().length < minLength) {
            return `Минимум ${minLength} символа`;
        }
        return 'Недопустимые символы';
    }, [touched, isValid, minLength, value]);

    const onChange = useCallback((e) => {
        setValue(e.target.value);
        if (!touched) setTouched(true);
    }, [touched]);

    const reset = useCallback(() => {
        setValue('');
        setSubmittedValue('');
        setTouched(false);
    }, []);

    const setCustomValue = useCallback((newValue) => {
        setValue(newValue);
        setSubmittedValue(newValue);
        setTouched(true);
    }, []);

    const submit = useCallback(() => {
        if (isValid) {
            setSubmittedValue(value);
        }
    }, [value, isValid]);

    return useMemo(
        () => ({
            value,
            submittedValue,
            onChange,
            reset,
            setValue: setCustomValue,
            isValid,
            errorMessage,
            touched,
            submit,
        }),
        [value, submittedValue, onChange, reset, setCustomValue, isValid, errorMessage, touched, submit]
    );
}