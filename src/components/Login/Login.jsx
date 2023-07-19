import useFormValidation from "../../utils/useFormValidation";

export default function Login({ handleLogin }) {
  const { values, handleChange, errors, reset } = useFormValidation();

  function handleSubmit(evt) {
    evt.preventDefault();
    handleLogin({
      email: values.email,
      password: values.password,
    });
    reset();
  }
  return (
    <div className="login">
      <h2 className="login__title">Вход</h2>
      <form className="form__login" onSubmit={handleSubmit}>
        <input
          className={`  login__input ${errors.email && "form__input_error"}`}
          type="email"
          name="email"
          placeholder="Email"
          minLength={2}
          maxLength={40}
          required
          value={values.email || ""}
          onChange={handleChange}
        />
        <span className="form__error">{errors.email}</span>
        <input
          className={` login__input ${errors.password && "form__input_error"}`}
          type="password"
          name="password"
          placeholder="Пароль"
          minLength={6}
          maxLength={40}
          required
          value={values.password || ""}
          onChange={handleChange}
        />
        <span className="form__error">{errors.password}</span>
        <button className="login__button" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}
