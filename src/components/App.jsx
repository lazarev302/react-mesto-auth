import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import PopupWithForm from "./PopupWithForm/PopupWithForm.jsx";
import ImagePopup from "./ImagePopup/ImagePopup.jsx";
import { useCallback, useEffect, useState } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import api from "../utils/api.js";
import EditProfilePopup from "./EditProfilePopup/EditProfilePopup.jsx";
import EditAvatarPopup from "./EditAvatarPopup/EditAvatarPopup.jsx";
import AddPlacePopup from "./AddPlacePopup/AddPlacePopup.jsx";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { auth } from "../utils/token.js";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopup, setImagePopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isSend, setIsSend] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSeccessAuth, setIsSeccessAuth] = useState(false);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({});

  const [card, setCard] = useState([]);
  const [deleteCardId, setDeleteCardId] = useState("");

  const setAllStatesForClosePopups = useCallback(() => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setDeletePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setImagePopup(false);
    setIsInfoTooltipOpen(false);
  }, []);

  const closePopupByEsc = useCallback(
    (evt) => {
      if (evt.key === "Escape") {
        setAllStatesForClosePopups();
        document.removeEventListener("keydown", closePopupByEsc);
      }
    },
    [setAllStatesForClosePopups]
  );

  const closeAllPopups = useCallback(() => {
    setAllStatesForClosePopups();
    document.removeEventListener("keydown", closePopupByEsc);
  }, [setAllStatesForClosePopups, closePopupByEsc]);

  function setEventListenerForDocument() {
    document.addEventListener("keydown", closePopupByEsc);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
    setEventListenerForDocument();
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
    setEventListenerForDocument();
  }

  function handleDeletePopupClick(cardId) {
    setDeleteCardId(cardId);
    setDeletePopupOpen(true);
    setEventListenerForDocument();
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
    setEventListenerForDocument();
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopup(true);
    setEventListenerForDocument();
  }

  useEffect(() => {
    loggedIn &&
      Promise.all([api.getInfo(), api.getCards()])
        .then(([dataUser, dataCards]) => {
          setCurrentUser(dataUser);
          setCard(dataCards);
        })
        .catch((err) =>
          console.error(`Ошибка при загрузке начальных данных ${err} `)
        );
  }, [loggedIn]);

  function handleDeleteSubmit(evt) {
    evt.preventDefault();
    setIsSend(true);
    api
      .deleteCard(deleteCardId)
      .then(() => {
        setCard(
          card.filter((item) => {
            return item._id !== deleteCardId;
          })
        );
        closeAllPopups();
        setIsSend(false);
      })
      .catch((err) => console.error(`Ошибка при удалении ${err} `));
  }

  const handleLike = useCallback(
    (card) => {
      const isLike = card.likes.some(
        (element) => currentUser._id === element._id
      );
      if (isLike) {
        api
          .deleteLike(card._id)
          .then((res) => {
            setCard((state) =>
              state.map((c) => (c._id === card._id ? res : c))
            );
          })
          .catch((err) => console.error(`Ошибка при снятии лайка ${err} `));
      } else {
        api
          .addLike(card._id)
          .then((res) => {
            setCard((state) =>
              state.map((c) => (c._id === card._id ? res : c))
            );
          })
          .catch((err) => console.error(`Ошибка при установке лайка ${err} `));
      }
    },
    [currentUser._id]
  );

  function handleUpdateUser(dataUser, reset) {
    setIsSend(true);
    api
      .setUserInfo(dataUser)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
        reset();
        setIsSend(false);
      })
      .catch((err) =>
        console.error(`Ошибка при редактировании профиля ${err} `)
      );
  }

  function handleUpdateAvatar(dataUser, reset) {
    setIsSend(true);
    api
      .setNewAvatar(dataUser)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
        reset();
        setIsSend(false);
      })
      .catch((err) =>
        console.error(`Ошибка при редактировании аватара ${err} `)
      );
  }

  function handleAddPlaceSubmit(dataCards, reset) {
    setIsSend(true);
    api
      .addCard(dataCards)
      .then((res) => {
        setCard([res, ...card]);
        closeAllPopups();
        reset();
        setIsSend(false);
      })
      .catch((err) => console.error(`Ошибка при добавлении карточки ${err} `));
  }

  useEffect(() => {
    const tokenCheck = () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        auth
          .getToken(token)
          .then((res) => {
            if (res) {
              setLoggedIn(true);
              navigate("/");
              setUserEmail(res.data.email);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    tokenCheck();
  }, [navigate]);

  function handleLogin({ email, password }) {
    auth
      .authorization(email, password)
      .then(() => {
        setUserEmail(email);
        setLoggedIn(true);
        navigate("/");
      })
      .catch((err) => {
        setIsInfoTooltipOpen(true);
        setIsSeccessAuth(false);
        console.error(`Ошибка при авторизации ${err}`);
      });
  }

  function handleRegister(values) {
    const { email, password } = values;
    auth
      .registration(email, password)
      .then(() => {
        setIsInfoTooltipOpen(true);
        setIsSeccessAuth(false);
        navigate("/sign-in");
      })
      .catch((err) => {
        setIsInfoTooltipOpen(true);
        setIsSeccessAuth(false);
        console.error(`Ошибка при регистрации ${err}`);
      });
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setUserEmail("");
    setLoggedIn(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header email={userEmail} loggedIn={loggedIn} onLogout={handleLogout} />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                loggedIn={loggedIn}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onDelete={handleDeletePopupClick}
                onCardLike={handleLike}
                card={card}
              />
            }
          />

          <Route
            path="/sign-up"
            element={<Register handleRegister={handleRegister} />}
          />
          <Route
            path="/sign-in"
            element={<Login handleLogin={handleLogin} />}
          />
          <Route path="/*" element={<Navigate to="/sign-up" />} />
        </Routes>

        <Footer />

        <EditProfilePopup
          onUpdateUser={handleUpdateUser}
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          isSend={isSend}
        />

        <AddPlacePopup
          onAddPlace={handleAddPlaceSubmit}
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          isSend={isSend}
        />

        <EditAvatarPopup
          onUpdateAvatar={handleUpdateAvatar}
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          isSend={isSend}
        />

        <PopupWithForm
          name="delete"
          title="Вы уверенны?"
          titleButton="Да"
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleDeleteSubmit}
          isSend={isSend}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopup}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSeccess={isSeccessAuth}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
