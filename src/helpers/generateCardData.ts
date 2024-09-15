import { FRANCHISE } from "../interfaces/card";

export const generateCardNumber = 
    (numberCardList: string[], franchise: FRANCHISE) =>{
        
        const initialNumber = franchise === FRANCHISE.visa? 4 : 5;
        
        if(numberCardList.length === 0 ) {
            return getRandomInt(initialNumber);
        }
        
        let numberGenerated = getRandomInt(initialNumber);
        console.log(numberGenerated, numberCardList);
        
        while(numberCardList.includes(numberGenerated)){
            numberGenerated = getRandomInt(initialNumber);
        }
        return numberGenerated;

}

const getRandomInt = (initNumber: number) => {
    const numberLimit = 1000000000000000;
    const randomNumber = Math.floor(Math.random() * numberLimit)
    return `${initNumber}${randomNumber}`;
  }