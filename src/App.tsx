import React, { useState } from "react";

type SignupFormValues = {
  username: string;
  password: string;
};

const submitCredentials = ({ username, password }: SignupFormValues) => {
  return new Promise((resolve): void => {
    setTimeout(() => {
      resolve(null);
      console.log("Submitted data: ", username, password);
    }, 500);
  });
};

const validateSignupForm = (
  values: SignupFormValues,
): Partial<SignupFormValues> => {
  const errors: Partial<SignupFormValues> = {};

  if (!values.username) {
    errors.username = "Username is required";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
};

type FormState<T> = {
  values: T;
  errors: Partial<T>;
  loading: boolean;
};

type SignupFormStore<T> = {
  state: FormState<T>;
  setValues: (values: Partial<T>) => void;
  setErrors: (errors: Partial<T>) => void;
  setLoading: (loading: boolean) => void;
};

const useSignupFormStore = function <T>(
  initialState: FormState<T>,
): SignupFormStore<T> {
  const [state, setState] = useState(initialState);

  const setValues = (values: Partial<T>) => {
    setState((prevState) => ({
      ...prevState,
      values: { ...prevState.values, ...values },
    }));
  };

  const setErrors = (errors: Partial<T>) => {
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

const renderSignupFields = function ({
  state,
  setValues,
}: SignupFormStore<SignupFormValues>) {
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
    </>
  );
};

const renderSubmitButton = function ({
  state,
}: SignupFormStore<SignupFormValues>) {
  return <SubmitButton loading={state.loading} />;
};

type SignupFormProps = {
  initialState: FormState<SignupFormValues>;
  useFormStore?: typeof useSignupFormStore;
  validate?: typeof validateSignupForm;
  submit?: typeof submitCredentials;
  renderFormFields?: (store: SignupFormStore<SignupFormValues>) => JSX.Element;
  renderSubmitButton?: (
    store: SignupFormStore<SignupFormValues>,
  ) => JSX.Element;
};

const SignupForm = ({
  initialState,
  useFormStore = useSignupFormStore,
  validate = validateSignupForm,
  submit = submitCredentials,
  renderFormFields = renderSignupFields,
  renderSubmitButton: renderSubmitButtonProp = renderSubmitButton,
}: SignupFormProps) => {
  const store = useFormStore(initialState);
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

const initialSignupFormState = {
  values: { username: "", password: "" },
  errors: {},
  loading: false,
};

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}
    >
      <SignupForm initialState={initialSignupFormState} />
    </div>
  );
}

export default App;
