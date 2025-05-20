# Expo & Node.js Express Yam Master game

**Yam Master** is a two-player dice game where players compete to earn the most points or to align five tokens in a row on a game board.

### 🎯 Objective

* Score more points than your opponent **or** align **five tokens** horizontally, vertically, or diagonally to **win instantly**.

### 🎲 How to Play

* On your turn, you can roll **5 dice** up to **3 times**.

* After each roll, you can set aside any dice and re-roll the rest.

* The goal is to achieve one of several **combinations**:

  * **Three-of-a-kind (Brelan)**
  * **Four-of-a-kind (Carré)**
  * **Full house (Full): 3 of one + 2 of another**
  * **Yam: Five of a kind**
  * **Straight (Suite): 1-2-3-4-5 or 2-3-4-5-6**
  * **≤8**: Total sum of dice is 8 or less
  * **Sec**: Any of the above (except Brelan) on the first roll
  * **Défi (Challenge)**: Declare a challenge before the second roll and succeed with any combo (except Brelan) in the next two rolls

* When you succeed with a combo, you may place a token on the corresponding board space.

### 🐍 Yam Predator

* If you roll a **Yam**, you can **remove an opponent's token** instead of placing your own.

### 🏆 Scoring

* 3 tokens aligned = 1 point
* 4 tokens aligned = 2 points
* **Game ends** when:

  * A player **places all tokens**, or
  * A player **makes an alignment of 5** (instant win)

---

It's a strategic and fast-paced dice game blending **chance**, **choice**, and **tactical placement**.

## Stack architecture
![image](https://github.com/user-attachments/assets/ec77fce0-079e-4118-89ed-cc5b80c9fa8c)

## Frontend setup

``` bash
npm install
npx expo install @expo/metro-runtime
npx expo start
```

## Backend setup (websocket)

``` bash
cd server
npm install
npm run start
```

