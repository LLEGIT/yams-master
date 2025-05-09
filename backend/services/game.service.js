// websocket-server/services/game.service.js

// Durée d'un tour en secondes
const TURN_DURATION = 30;

const DECK_INIT = {
    dices: [
        { id: 1, value: '', locked: true },
        { id: 2, value: '', locked: true },
        { id: 3, value: '', locked: true },
        { id: 4, value: '', locked: true },
        { id: 5, value: '', locked: true },
    ],
    rollsCounter: 1,
    rollsMaximum: 3
};

const GAME_INIT = {
    gameState: {
        currentTurn: 'player:1',
        timer: null,
        player1Score: 0,
        player2Score: 0,
        grid: [],
        choices: {},
        deck: {},
        player1Pions: 12,
        player2Pions: 12,
        scores: {
            'player:1': 0,
            'player:2': 0
        }
    }
}

const CHOICES_INIT = {
    isDefi: false,
    isSec: false,
    idSelectedChoice: null,
    availableChoices: [],
};

const ALL_COMBINATIONS = [
    { value: 'Brelan1', id: 'brelan1' },
    { value: 'Brelan2', id: 'brelan2' },
    { value: 'Brelan3', id: 'brelan3' },
    { value: 'Brelan4', id: 'brelan4' },
    { value: 'Brelan5', id: 'brelan5' },
    { value: 'Brelan6', id: 'brelan6' },
    { value: 'Full', id: 'full' },
    { value: 'Carré', id: 'carre' },
    { value: 'Yam', id: 'yam' },
    { value: 'Suite', id: 'suite' },
    { value: '≤8', id: 'moinshuit' },
    { value: 'Sec', id: 'sec' },
    { value: 'Défi', id: 'defi' }
];

const GRID_INIT = [
    [
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: 'Yam', id: 'yam', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
    ]
];

const GameService = {

    init: {
        gameState: () => {
            const game = { ...GAME_INIT };
            game['gameState']['timer'] = TURN_DURATION;
            game['gameState']['deck'] = { ...DECK_INIT };
            game['gameState']['choices'] = { ...CHOICES_INIT };
            game['gameState']['grid'] = [...GRID_INIT];
            game['gameState']['player1Pions'] = 12;
            game['gameState']['player2Pions'] = 12;
            game['gameState']['player1Score'] = 0;
            game['gameState']['player2Score'] = 0;
            return game;
        },
        deck: () => {
            return { ...DECK_INIT };
        },
        choices: () => {
            return { ...CHOICES_INIT };
        },
        grid: () => {
            return { ...GRID_INIT };
        }
    },

    send: {
        forPlayer: {
            viewGameState: (playerKey, game) => {
                const isCurrentTurn = game.gameState.currentTurn === playerKey;
                return {
                    inQueue: false,
                    inGame: true,
                    idPlayer: playerKey === 'player:1' ? game.player1Socket.id : game.player2Socket.id,
                    idOpponent: playerKey === 'player:1' ? game.player2Socket.id : game.player1Socket.id,
                    currentTurn: game.gameState.currentTurn,
                    timer: game.gameState.timer,
                    player1Score: isCurrentTurn ? game.gameState.player1Score : game.gameState.player2Score,
                    player2Score: isCurrentTurn ? game.gameState.player2Score : game.gameState.player1Score,
                    player1Pions: isCurrentTurn ? game.gameState.player1Pions : game.gameState.player2Pions,
                    player2Pions: isCurrentTurn ? game.gameState.player2Pions : game.gameState.player1Pions,
                    grid: game.gameState.grid,
                    choices: game.gameState.choices,
                    deck: game.gameState.deck
                };
            },

            viewQueueState: () => {
                return {
                    inQueue: true,
                    inGame: false,
                };
            },
            gameTimer: (playerKey, gameState) => {
                // Selon la clé du joueur on adapte la réponse (player / opponent)
                const playerTimer = gameState.currentTurn === playerKey ? gameState.timer : 0;
                const opponentTimer = gameState.currentTurn === playerKey ? 0 : gameState.timer;
                return { playerTimer: playerTimer, opponentTimer: opponentTimer };
            },
            deckViewState: (playerKey, gameState) => {
                const deckViewState = {
                    displayPlayerDeck: gameState.currentTurn === playerKey,
                    displayOpponentDeck: gameState.currentTurn !== playerKey,
                    displayRollButton: gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
                    rollsCounter: gameState.deck.rollsCounter,
                    rollsMaximum: gameState.deck.rollsMaximum,
                    dices: gameState.deck.dices
                };
                return deckViewState;
            },
            choicesViewState: (playerKey, gameState) => {
                const choicesViewState = {
                    displayChoices: true,
                    canMakeChoice: playerKey === gameState.currentTurn,
                    idSelectedChoice: gameState.choices.idSelectedChoice,
                    availableChoices: gameState.choices.availableChoices
                }
                return choicesViewState;
            },
            gridViewState: (playerKey, gameState) => {

                return {
                    displayGrid: true,
                    canSelectCells: (playerKey === gameState.currentTurn) && (gameState.choices.availableChoices.length > 0),
                    grid: gameState.grid
                };

            },
        }
    },

    timer: {
        getTurnDuration: () => {
            return TURN_DURATION;
        },
    },

    choices: {
        findCombinations: (dices, isDefi, isSec) => {
            const availableCombinations = [];
            const allCombinations = ALL_COMBINATIONS;

            const counts = Array(7).fill(0); // Tableau pour compter le nombre de dés de chaque valeur (de 1 à 6)
            let hasPair = false; // Pour vérifier si une paire est présente
            let threeOfAKindValue = null; // Stocker la valeur du brelan
            let hasThreeOfAKind = false; // Pour vérifier si un brelan est présent
            let hasFourOfAKind = false; // Pour vérifier si un carré est présent
            let hasFiveOfAKind = false; // Pour vérifier si un Yam est présent
            let hasStraight = false; // Pour vérifier si une suite est présente
            let sum = 0; // Somme des valeurs des dés

            // Compter le nombre de dés de chaque valeur et calculer la somme
            for (let i = 0; i < dices.length; i++) {
                const diceValue = parseInt(dices[i].value);
                counts[diceValue]++;
                sum += diceValue;
            }

            // Vérifier les combinaisons possibles
            for (let i = 1; i <= 6; i++) {
                if (counts[i] === 2) {
                    hasPair = true;
                } else if (counts[i] === 3) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                } else if (counts[i] === 4) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                    hasFourOfAKind = true;
                } else if (counts[i] === 5) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                    hasFourOfAKind = true;
                    hasFiveOfAKind = true;
                }
            }

            const sortedValues = dices.map(dice => parseInt(dice.value)).sort((a, b) => a - b); // Trie les valeurs de dé

            // Vérifie si les valeurs triées forment une suite
            hasStraight = sortedValues.every((value, index) => index === 0 || value === sortedValues[index - 1] + 1);

            // Vérifier si la somme ne dépasse pas 8
            const isLessThanEqual8 = sum <= 8;

            // Retourner les combinaisons possibles via leur ID
            allCombinations.forEach(combination => {
                if (
                    (combination.id.includes('brelan') && hasThreeOfAKind && parseInt(combination.id.slice(-1)) === threeOfAKindValue) ||
                    (combination.id === 'full' && hasPair && hasThreeOfAKind) ||
                    (combination.id === 'carre' && hasFourOfAKind) ||
                    (combination.id === 'yam' && hasFiveOfAKind) ||
                    (combination.id === 'suite' && hasStraight) ||
                    (combination.id === 'moinshuit' && isLessThanEqual8) ||
                    (combination.id === 'defi' && isDefi)
                ) {
                    availableCombinations.push(combination);
                }
            });


            const notOnlyBrelan = availableCombinations.some(combination => !combination.id.includes('brelan'));

            if (isSec && availableCombinations.length > 0 && notOnlyBrelan) {
                availableCombinations.push(allCombinations.find(combination => combination.id === 'sec'));
            }

            return availableCombinations;
        }
    },
    grid: {
        resetcanBeCheckedCells: (grid) => {
            const updatedGrid = grid.map(row =>
                row.map(cell => ({
                    ...cell,
                    canBeChecked: false
                }))
            );
            return updatedGrid;
        },
        updateGridAfterSelectingChoice: (idSelectedChoice, grid) => {
            // Vérifie s'il y a des cases disponibles pour ce choix
            let hasAvailableCell = false;
            for (let row of grid) {
                for (let cell of row) {
                    if (cell.id === idSelectedChoice && cell.owner === null) {
                        hasAvailableCell = true;
                        break;
                    }
                }
                if (hasAvailableCell) break;
            }

            // Si aucune case n'est disponible, on retourne la grille sans modifications
            if (!hasAvailableCell) {
                return grid;
            }

            // Si des cases sont disponibles, on met à jour la grille
            const updatedGrid = grid.map(row =>
                row.map(cell => ({
                    ...cell,
                    canBeChecked: cell.id === idSelectedChoice && cell.owner === null
                }))
            );
            return updatedGrid;
        },
        shouldPassTurn: (idSelectedChoice, grid) => {
            // Vérifie si toutes les cases correspondant au choix sont déjà prises
            for (let row of grid) {
                for (let cell of row) {
                    if (cell.id === idSelectedChoice && cell.owner === null) {
                        return false; // Il y a au moins une case disponible
                    }
                }
            }
            return true; // Toutes les cases sont prises
        },
        selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid) => {
            const updatedGrid = grid.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                    if (rIdx === rowIndex && cIdx === cellIndex && cell.id === idCell && cell.owner === null) {
                        return {
                            ...cell,
                            owner: currentTurn
                        };
                    }
                    return cell;
                })
            );
            return updatedGrid;
        },
        checkFullLine: (grid, currentPlayer) => {
            const size = grid.length;

            // Check rows
            for (let row of grid) {
                if (row.every(cell => cell.owner === currentPlayer)) return true;
            }

            // Check columns
            for (let c = 0; c < size; c++) {
                if (grid.every(row => row[c].owner === currentPlayer)) return true;
            }

            // Check main diagonal (top-left to bottom-right)
            let mainDiagonalFull = true;
            for (let i = 0; i < size; i++) {
                if (grid[i][i].owner !== currentPlayer) {
                    mainDiagonalFull = false;
                    break;
                }
            }
            if (mainDiagonalFull) return true;

            // Check anti-diagonal (top-right to bottom-left)
            let antiDiagonalFull = true;
            for (let i = 0; i < size; i++) {
                if (grid[i][size - 1 - i].owner !== currentPlayer) {
                    antiDiagonalFull = false;
                    break;
                }
            }
            if (antiDiagonalFull) return true;

            return false;
        },
    },
    dices: {
        roll: (dicesToRoll) => {
            const rolledDices = dicesToRoll.map(dice => {
                if (dice.value === "") {
                    // Si la valeur du dé est vide, alors on le lance en mettant le flag locked à false
                    const newValue = String(Math.floor(Math.random() * 6) + 1);
                    return {
                        id: dice.id,
                        value: newValue,
                        locked: false
                    };
                } else if (!dice.locked) {
                    // Si le dé n'est pas verrouillé et possède déjà une valeur, alors on le relance
                    const newValue = String(Math.floor(Math.random() * 6) + 1);
                    return {
                        ...dice,
                        value: newValue
                    };
                } else {
                    // Si le dé est verrouillé ou a déjà une valeur mais le flag locked est true, on le laisse tel quel
                    return dice;
                }
            });
            return rolledDices;
        },

        lockEveryDice: (dicesToLock) => {
            const lockedDices = dicesToLock.map(dice => ({
                ...dice,
                locked: true
            }));
            return lockedDices;
        }
    },

    utils: {
        // Return game index in global games array by id
        findGameIndexById: (games, idGame) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i].idGame === idGame) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },

        findGameIndexBySocketId: (games, socketId) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i].player1Socket.id === socketId || games[i].player2Socket.id === socketId) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },

        findDiceIndexByDiceId: (dices, idDice) => {
            for (let i = 0; i < dices.length; i++) {
                if (dices[i].id === idDice) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        }
    },
    score: {
        calculateScore: (gameState) => {
            const grid = gameState.grid;
            const currentPlayer = gameState.currentTurn;

            let newPoints = 0;
            const numRows = grid.length;
            const numCols = grid[0].length;
            const checkedAlignments = new Set(); // Pour éviter de compter plusieurs fois le même alignement

            const isOwned = (row, col) => {
                return (
                    row >= 0 &&
                    col >= 0 &&
                    row < numRows &&
                    col < numCols &&
                    grid[row][col].owner === currentPlayer
                );
            };

            // Check all possible alignments
            for (let r = 0; r < numRows; r++) {
                for (let c = 0; c < numCols; c++) {
                    // Horizontal
                    if (isOwned(r, c) && isOwned(r, c + 1) && isOwned(r, c + 2)) {
                        const alignmentKey = `H${r}-${c}`;
                        if (!checkedAlignments.has(alignmentKey)) {
                            checkedAlignments.add(alignmentKey);
                            newPoints += 1; // 1 point pour un alignement de 3
                            
                            // Vérifier si c'est un alignement de 5 (victoire instantanée)
                            if (isOwned(r, c + 3) && isOwned(r, c + 4)) {
                                gameState.winner = currentPlayer;
                                gameState.winType = 'alignment';
                                return gameState;
                            }
                        }
                    }

                    // Vertical
                    if (isOwned(r, c) && isOwned(r + 1, c) && isOwned(r + 2, c)) {
                        const alignmentKey = `V${r}-${c}`;
                        if (!checkedAlignments.has(alignmentKey)) {
                            checkedAlignments.add(alignmentKey);
                            newPoints += 1; // 1 point pour un alignement de 3
                            
                            // Vérifier si c'est un alignement de 5 (victoire instantanée)
                            if (isOwned(r + 3, c) && isOwned(r + 4, c)) {
                                gameState.winner = currentPlayer;
                                gameState.winType = 'alignment';
                                return gameState;
                            }
                        }
                    }

                    // Diagonal down-right
                    if (isOwned(r, c) && isOwned(r + 1, c + 1) && isOwned(r + 2, c + 2)) {
                        const alignmentKey = `DR${r}-${c}`;
                        if (!checkedAlignments.has(alignmentKey)) {
                            checkedAlignments.add(alignmentKey);
                            newPoints += 1; // 1 point pour un alignement de 3
                            
                            // Vérifier si c'est un alignement de 5 (victoire instantanée)
                            if (isOwned(r + 3, c + 3) && isOwned(r + 4, c + 4)) {
                                gameState.winner = currentPlayer;
                                gameState.winType = 'alignment';
                                return gameState;
                            }
                        }
                    }

                    // Diagonal down-left
                    if (isOwned(r, c) && isOwned(r + 1, c - 1) && isOwned(r + 2, c - 2)) {
                        const alignmentKey = `DL${r}-${c}`;
                        if (!checkedAlignments.has(alignmentKey)) {
                            checkedAlignments.add(alignmentKey);
                            newPoints += 1; // 1 point pour un alignement de 3
                            
                            // Vérifier si c'est un alignement de 5 (victoire instantanée)
                            if (isOwned(r + 3, c - 3) && isOwned(r + 4, c - 4)) {
                                gameState.winner = currentPlayer;
                                gameState.winType = 'alignment';
                                return gameState;
                            }
                        }
                    }
                }
            }

            // Update player score
            if (!gameState.scores) {
                gameState.scores = {
                    'player:1': 0,
                    'player:2': 0
                };
            }

            // Mettre à jour les scores
            gameState.scores[currentPlayer] += newPoints;
            
            // Mettre à jour les scores spécifiques aux joueurs
            if (currentPlayer === 'player:1') {
                gameState.player1Score = gameState.scores['player:1'];
            } else {
                gameState.player2Score = gameState.scores['player:2'];
            }

            return gameState;
        },
    },
}

module.exports = GameService;
