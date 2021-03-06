import { Input } from "@chakra-ui/input";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  placeholder?: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      {props.label ? (
        <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      ) : null}
      {props.textarea ? (
        <Textarea
          {...field}
          id={field.name}
          placeholder={props.placeholder}
          size="sm"
          resize="none"
        />
      ) : (
        <Input
          {...field}
          id={field.name}
          placeholder={props.placeholder}
          type={props.type}
        />
      )}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
