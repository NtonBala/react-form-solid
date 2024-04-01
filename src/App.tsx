import React, { useState } from "react";

const submitCredentials = (username: string, password: string) => {
  return new Promise((resolve): void => {
    setTimeout(() => {
      resolve(null);
      console.log("Submitted data: ", username, password);
    }, 500);
  });
};

type SignupFormValues = {
  username: string;
  password: string;
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

const useSignupFormState = function <T>(initialState: FormState<T>) {
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

type SignupFormProps = {
  initialState: FormState<SignupFormValues>;
};

const SignupForm = ({ initialState }: SignupFormProps) => {
  const { state, setValues, setErrors, setLoading } =
    useSignupFormState(initialState);

  const validateForm = () => {
    const errors = validateSignupForm(state.values);

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    submitCredentials(state.values.username, state.values.password).then(() => {
      setLoading(false);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
        padding: "5px",
      }}
    >
      <input
        type="text"
        name="username"
        value={state.values.username}
        placeholder="Enter username"
        onChange={handleChange}
      />
      {state.errors.username && (
        <span style={{ color: "red", fontSize: "0.8em" }}>
          {state.errors.username}
        </span>
      )}

      <input
        type="password"
        name="password"
        value={state.values.password}
        placeholder="Enter password"
        onChange={handleChange}
        style={{ marginTop: "5px" }}
      />
      {state.errors.password && (
        <span style={{ color: "red", fontSize: "0.8em" }}>
          {state.errors.password}
        </span>
      )}

      <input
        type="submit"
        value="Submit"
        disabled={state.loading}
        style={{ marginTop: "5px" }}
      />
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
