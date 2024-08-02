import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BtnHome from "./BtnHome";
import Logo from "./Logo";

const getLevelFromScore = (score) => {
    if (score >= 20000) return 8;
    if (score >= 7000) return 7;
    if (score >= 2500) return 6;
    if (score >= 1000) return 5;
    if (score >= 500) return 4;
    if (score >= 150) return 3;
    if (score >= 30) return 2;
    return 1;
};

const Game = () => {
    const location = useLocation();
    const { user } = location.state || {};
    const [question, setQuestion] = useState(null);
    const [score, setScore] = useState(user ? user.score : 0);
    const [level, setLevel] = useState(user ? user.niveau : 1);

    const correctPoints = {
        1: 10,
        2: 25,
        3: 50,
        4: 100,
        5: 250,
        6: 600,
        7: 1500,
        8: 3500,
        9: 8000,
        10: 20000,
    };

    const wrongPoints = {
        1: 5,
        2: 10,
        3: 20,
        4: 40,
        5: 100,
        6: 250,
        7: 650,
        8: 1200,
        9: 3000,
        10: 8000,
    };

    useEffect(() => {
        if (!user) return;

        fetch('/json/quizz.json')
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Erreur HTTP ! Statut : ${response.status} - ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                const levelKey = `niveau_${level}`;
                const levelQuestions = data[levelKey];
                if (levelQuestions && levelQuestions.length > 0) {
                    const randomIndex = Math.floor(Math.random() * levelQuestions.length);
                    setQuestion(levelQuestions[randomIndex]);
                } else {
                    console.error('Aucune question disponible pour ce niveau.');
                }
            })
            .catch(error => console.error('Erreur lors de la récupération des questions:', error));
    }, [user, level]);

    const handleAnswer = (isCorrect) => {
        let newScore;
        if (isCorrect) {
            newScore = Math.min(score + correctPoints[level], 100000);
        } else {
            newScore = Math.max(score - wrongPoints[level], 0);
        }
        
        const newLevel = getLevelFromScore(newScore);

        setScore(newScore);
        if (newLevel !== level) {
            setLevel(newLevel);
        }

        fetch('http://localhost:3001/update-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: user.name,
                newScore,
                newLevel,
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Erreur HTTP ! Statut : ${response.status} - ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Score et niveau mis à jour avec succès:', data);
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour du score et du niveau:', error);
        });

        fetch('/json/quizz.json')
            .then(response => response.json())
            .then(data => {
                const levelKey = `niveau_${level}`;
                const levelQuestions = data[levelKey];
                if (levelQuestions && levelQuestions.length > 0) {
                    const randomIndex = Math.floor(Math.random() * levelQuestions.length);
                    setQuestion(levelQuestions[randomIndex]);
                } else {
                    console.error('Aucune question disponible pour ce niveau.');
                }
            })
            .catch(error => console.error('Erreur lors de la récupération des questions:', error));
    };

    if (!user) {
        return <p>Aucun utilisateur sélectionné.</p>;
    }

    return (
        <>
            <div className="nav">
                <Logo />
                <BtnHome />
            </div>
            <div id="userInfo">
                <img src={`/images/avatars/${user.avatar}.png`} alt="avatar" />
                <div>
                    <p id="level">Niveau {level}</p>
                    <p id="score">Score: {score}</p>
                </div>
            </div>
            {question && (
                <div id="question">
                    <p>{question.question}</p>
                    <div id="answers">
                        {question.reponses.map((answer, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(answer.correcte)}
                            >
                                {answer.texte}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default Game;