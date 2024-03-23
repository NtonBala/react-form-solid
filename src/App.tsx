import React, { useState } from "react";

const submitCredentials = (username: string, password: string) => {
  return new Promise((resolve): void => {
    setTimeout(() => {
      resolve(null);
      console.log("Submitted data: ", username, password);
    }, 500);
  });
};

type Errors = {
  username?: string;
  password?: string;
};

const SignupForm = () => {
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    errors: Errors;
    loading: boolean;
  }>({
    username: "",
    password: "",
    errors: {},
    loading: false,
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormData((prevState) => ({ ...prevState, loading: true }));

    submitCredentials(formData.username, formData.password).then(() => {
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

      <input
        type="submit"
        value="Submit"
        disabled={formData.loading}
        style={{ marginTop: "5px" }}
      />
    </form>
  );
};

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}
    >
      <SignupForm />
    </div>
  );
}

export default App;
