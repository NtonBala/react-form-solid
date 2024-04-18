import React, { useState } from "react";

type SignupFormValues = {
  username: string;
  password: string;
};

type ExtendedSignupFormValues = SignupFormValues & { gender: string };

const submitCredentials = ({ username, password }: SignupFormValues) => {
  return new Promise((resolve): void => {
    setTimeout(() => {
      resolve(null);
      console.log("submitCredentials: ", username, password);
    }, 500);
  });
};

const submitExtendedCredentials = ({
  username,
  password,
  gender,
}: ExtendedSignupFormValues) => {
  return new Promise((resolve): void => {
    setTimeout(() => {
      resolve(null);
      console.log("submitExtendedCredentials: ", username, password, gender);
    }, 600);
  });
};

const validateSignupForm = <T extends SignupFormValues>(
  values: T,
): Partial<T> => {
  const errors: Partial<T> = {};

  if (!values.username) {
    errors.username = "Username is required";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
};

type FormState<T extends SignupFormValues> = {
  values: T;
  errors: Partial<T>;
  loading: boolean;
};

type SignupFormStore<T extends SignupFormValues> = {
  state: FormState<T>;
  setValues: (values: Partial<T>) => void;
  setErrors: (errors: Partial<T>) => void;
  setLoading: (loading: boolean) => void;
};

const useSignupFormStore = function <T extends SignupFormValues>(
  initialValues: T,
): SignupFormStore<T> {
  const [state, setState] = useState({
    values: initialValues,
    errors: {},
    loading: false,
  });

  const setValues = (values: Partial<typeof initialValues>) => {
    setState((prevState) => ({
      ...prevState,
      values: { ...prevState.values, ...values },
    }));
  };

  const setErrors = (errors: Partial<typeof initialValues>) => {
    setState((prevState) => ({ ...prevState, errors }));
  };

  const setLoading = (loading: boolean) => {
    setState((prevState) => ({ ...prevState, loading }));
  };

  return { state, setValues, setErrors, setLoading };
};

type TextInputProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
};

const TextInput = ({
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  error,
}: TextInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    onChange(value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder || `Enter ${name}`}
        onChange={handleChange}
      />
      {error && (
        <span style={{ color: "red", fontSize: "0.8em" }}>{error}</span>
      )}
    </div>
  );
};

type SubmitButtonProps = {
  loading: boolean;
};

const SubmitButton = ({ loading }: SubmitButtonProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input type="submit" value="Submit" disabled={loading} />
    </div>
  );
};

type SelectOption = { value: string; label: string };

type SelectProps = {
  name: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

const Select = ({ name, value, options, onChange }: SelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    onChange(value);
  };

  return (
    <select name={name} value={value} onChange={handleChange}>
      {options.map(({ value, label }) => (
        <option key={label} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

const renderSignupFields = <T extends SignupFormValues>({
  state,
  setValues,
}: SignupFormStore<T>) => {
  return (
    <>
      <div style={{ paddingBottom: "5px" }}>
        <TextInput
          name="username"
          value={state.values.username}
          onChange={(value: string) => {
            if ("username" in state.values)
              setValues({ username: value } as Partial<T>);
          }}
          error={state.errors.username}
        />
      </div>

      <div style={{ paddingBottom: "5px" }}>
        <TextInput
          type="password"
          name="password"
          value={state.values.password}
          onChange={(value: string) => {
            if ("username" in state.values)
              setValues({ username: value } as Partial<T>);
          }}
          error={state.errors.password}
        />
      </div>
    </>
  );
};

const renderExtendedSignupFields = function ({
  state,
  setValues,
}: SignupFormStore<ExtendedSignupFormValues>) {
  return (
    <>
      <div style={{ paddingBottom: "5px" }}>
        <TextInput
          name="username"
          value={state.values.username}
          onChange={(value: string) => setValues({ username: value })}
          error={state.errors.username}
        />
      </div>

      <div style={{ paddingBottom: "5px" }}>
        <TextInput
          type="password"
          name="password"
          value={state.values.password}
          onChange={(value: string) => setValues({ password: value })}
          error={state.errors.password}
        />
      </div>

      <div style={{ paddingBottom: "5px" }}>
        <Select
          name="gender"
          value={state.values.gender}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          onChange={(value: string) => setValues({ gender: value })}
        />
      </div>
    </>
  );
};

const renderSubmitButton = <T extends SignupFormValues>({
  state,
}: SignupFormStore<T>) => {
  return <SubmitButton loading={state.loading} />;
};

type SignupFormProps<T extends SignupFormValues> = {
  initialValues: T;
  useFormStore?: typeof useSignupFormStore;
  validate?: (values: T) => Partial<T>;
  submit?: typeof submitCredentials;
  renderFormFields?: (store: SignupFormStore<T>) => JSX.Element;
  renderSubmitButton?: (store: SignupFormStore<T>) => JSX.Element;
};

const SignupForm = <T extends SignupFormValues>({
  initialValues,
  useFormStore = useSignupFormStore,
  validate = validateSignupForm,
  submit = submitCredentials,
  renderFormFields = renderSignupFields,
  renderSubmitButton: renderSubmitButtonProp = renderSubmitButton,
}: SignupFormProps<T>) => {
  const store = useFormStore(initialValues);
  const { state, setErrors, setLoading } = store;

  const validateForm = () => {
    const errors = validate(state.values);

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    submit(state.values).then(() => {
      setLoading(false);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid black",
        padding: "5px",
      }}
    >
      {renderFormFields(store)}
      {renderSubmitButtonProp(store)}
    </form>
  );
};

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}
    >
      <SignupForm initialValues={{ username: "", password: "" }} />
    </div>
  );
}

type SignupFormDumbProps = {
  submit: () => Promise<unknown>;
  renderFormFields: () => React.ReactElement;
  validate?: () => boolean;
  renderActionButtons?: (isSubmitDisabled: boolean) => React.ReactElement;
};

const SignupFormDumb = ({
  validate,
  submit,
  renderFormFields,
  renderActionButtons = (submitting) => <SubmitButton loading={submitting} />,
}: SignupFormDumbProps) => {
  const [submitting, setSubmitting] = useState(false);
  const isSubmitDisabled = validate ? submitting || !validate() : submitting;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await submit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          border: "1px solid black",
          padding: "5px",
        }}
      >
        <div
          style={{
            paddingBottom: "10px",
          }}
        >
          {renderFormFields()}
        </div>

        <div>{renderActionButtons(isSubmitDisabled)}</div>
      </div>
    </form>
  );
};

export default App;
