import React, { useState } from "react";

const submitCredentials = (username: string, password: string) => {
  return new Promise((resolve): void => {
    setTimeout(() => {
      resolve(null);
      console.log(username, password);
    }, 500);
  });
};

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    loading: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormData((prevState) => ({ ...prevState, loading: true }));

    submitCredentials(formData.username, formData.password).then(() => {
      setFormData((prevState) => ({ ...prevState, loading: false }));
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        placeholder="Enter username"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        placeholder="Enter password"
        onChange={handleChange}
      />
      <input type="submit" value="Submit" disabled={formData.loading} />
    </form>
  );
};

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SignupForm />
    </div>
  );
}

export default App;
