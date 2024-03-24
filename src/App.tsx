import React, { useState } from "react";

type Errors = {
  username?: string;
  password?: string;
  gender?: string;
};

type FormData = {
  username: string;
  password: string;
  gender?: string;
  errors: Errors;
  loading: boolean;
};

const submitCredentials = ({ username, password }: FormData) => {
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
}: FormData) => {
  return new Promise((resolve): void => {
    setTimeout(() => {
      resolve(null);
      console.log("submitExtendedCredentials: ", username, password, gender);
    }, 600);
  });
};

const SignupForm = ({
  initialFormData = {
    username: "",
    password: "",
    errors: {},
    loading: false,
  },
  submit = submitCredentials,
}: {
  initialFormData?: FormData;
  submit?: (data: FormData) => Promise<unknown>;
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const validateForm = () => {
    const errors: Errors = {};

    if (!formData.username) {
      errors.username = "Username is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormData((prevState) => ({ ...prevState, errors }));

    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormData((prevState) => ({ ...prevState, loading: true }));

    submit(formData).then(() => {
      setFormData((prevState) => ({ ...prevState, loading: false }));
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
        value={formData.username}
        placeholder="Enter username"
        onChange={handleChange}
      />
      {formData.errors.username && (
        <span style={{ color: "red", fontSize: "0.8em" }}>
          {formData.errors.username}
        </span>
      )}

      <input
        type="password"
        name="password"
        value={formData.password}
        placeholder="Enter password"
        onChange={handleChange}
        style={{ marginTop: "5px" }}
      />
      {formData.errors.password && (
        <span style={{ color: "red", fontSize: "0.8em" }}>
          {formData.errors.password}
        </span>
      )}

      {"gender" in formData && (
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          style={{ marginTop: "5px" }}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      )}

      <input
        type="submit"
        value="Submit"
        disabled={formData.loading}
        style={{ marginTop: "5px" }}
      />
    </form>
  );
};

const initialExtendedSignupFormData = {
  username: "",
  password: "",
  gender: "male",
  errors: {},
  loading: false,
};

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}
    >
      <SignupForm />
      <hr />
      <SignupForm
        initialFormData={initialExtendedSignupFormData}
        submit={submitExtendedCredentials}
      />
    </div>
  );
}

export default App;
