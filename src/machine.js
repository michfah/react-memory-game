import { createMachine , assign} from 'xstate';

const memoryMachine = createMachine({
  id: 'memoryGame',
  initial: 'onGame',
  context: {
    turnCounter: 0,
    sourceCard: Array(9).fill(null)
  },
  on: {
    newGame:{
      actions: ['newGame'],
      target:'onGame'
    }
  },
  states: {
    onGame: {
      on: {
        ONCLICK: [
          {
            cond: 'choiceOne',
            target: 'flip'
          }
        ]
      },
     // exit: 'updateBoard'
    },
    onFinish:{

    },
    flip: {
      on: {
        ONCLICK: [{

          cond: 'flippedAllCards',
          target: 'onFinish'
        },
        {
          target: 'onGame'

        }
      ]
      },
      exit: ['updateMatch']
    }
  }
},
{
  guards: {
    evaluateMatch: (context) => {
      return true;
    }
  },
  actions: {
    updateMatch: (context, event) => {
      // checking match :P
    },
    newGame:assign({
      turnCounter:0,
      sourceCard: Array(9).fill(null)
    })
  }
});

export { memoryMachine };
