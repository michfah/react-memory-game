import { memoryMachine } from "./machine";
import { inspect } from "@xstate/inspect";
import { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import SingleCard from "./components/SingleCard";
import "./App.css";

inspect({ iframe: false });

// array of card images
const cardImages = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
];

const App = () => {
  const [current, send] = useMachine(memoryMachine, { devTools: true });
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // shuffle cards, duplicate cards to get set of 12, assign random ID to each
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages] // 2 lots of card images
      .sort(() => Math.random() - 0.5) // shuffled array
      .map((card) => ({ ...card, id: Math.random() })); // add on random ID number to each card

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  // handle a user choice, update choice one or two
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card); // if choiceOne is null (is false), update with setChoiceOne, else update choiceTwo with setChoiceTwo
  };

  // reset game automagically
  useEffect(() => {
    shuffleCards();
  }, []);

  // compare two selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // reset choices and increase number of turns
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <h5>A card memory game</h5>
      <button onClick={shuffleCards}>New Game</button>
      <p>Turns: {turns}</p>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            cardFlipped={
              card === choiceOne || card === choiceTwo || card.matched
            }
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
