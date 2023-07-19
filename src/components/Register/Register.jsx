import React from "react";
import useFormValidation from "../../utils/useFormValidation";
import { Link } from "react-router-dom";

export default function Register({ handleRegister }) {
  const { values, handleChange, errors, reset } = useFormValidation();

  return (
    <div className="login">
      <h2 className="login__title">Регистрация</h2>
      <form
        className="form__login"
        onSubmit={(evt) => {
          evt.preventDefault();
          handleRegister({
            email: values.email,
            password: values.password,
          });
          reset();
        }}
      >
        <input
          className={`login__input ${errors.email && "form__input_error"}`}
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
          className={`login__input ${errors.password && "form__input_error"}`}
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
      <p className="login__text">
        Уже зарегистрированы? {" "}
        <Link to="/sign-in" className="login__sign-in">
          Войти
        </Link>
      </p>
    </div>
  );
}
