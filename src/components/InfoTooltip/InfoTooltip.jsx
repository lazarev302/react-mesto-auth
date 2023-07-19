import success from "../../images/success.png";
import error from "../../images/error.png";

export default function InfoTooltip({ isOpen, onClose, isSuccess }) {
  return (
    <div
      className={`popup popup_image ${isOpen && "popup_opened"}`}
      onClick={onClose}
      пше
    >
      <div
        className="popup__contanier"
        onClick={(evt) => evt.stopPropagation()}
      >
        <button
          className="popup__close-button"
          type="button"
          onClick={onClose}
        />
        <img
          className="image"
          src={isSuccess ? success : error}
          alt={
            isSuccess
              ? "Вы успешно зарегистрировались"
              : "Ошибка при регистрации"
          }
        />
      </div>
    </div>
  );
}
