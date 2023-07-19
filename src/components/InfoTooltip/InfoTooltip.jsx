import PopupWithForm from "../PopupWithForm/PopupWithForm";
import success from "../../images/success.png";
import error from "../../images/error.png";

export default function InfoTooltip({ isOpen, onClose, isSuccess }) {
  return (
    <>
      <PopupWithForm name="infoTooltip" isOpen={isOpen} onClose={onClose}>
        <img
          src={isSuccess ? success : error}
          alt={
            isSuccess
              ? "Вы успешно зарегистрировались"
              : "Ошибка при регистрации"
          }
        />
      </PopupWithForm>
    </>
  );
}
