import React from "react"
import { useFormikContext } from "formik"

import AppTextInput from "../AppTextInput"
import ErrorMessage from "./ErrorMessage"

const AppFormField = ({ icon, name, placeholder, width, ...otherProps }) => {
    const {
        errors,
        handleChange,
        setFieldTouched,
        touched,
    } = useFormikContext()

    return (
        <>
            <AppTextInput
                onBlur={() => setFieldTouched(name)}
                onChangeText={handleChange(name)}
                icon={icon}
                placeholder={placeholder}
                width={width}
                {...otherProps}
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />
        </>
    )
}

export default AppFormField