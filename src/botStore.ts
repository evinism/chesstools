import { BotConfig } from "./types";

const drawishFnText = `function score({ scores }){
  return -Math.abs(scores[scores.length - 1])
}`;

const inscrutableFnText = `
function last(arr){
  return arr[arr.length - 1]
}

function score({ scores }) {
  const firstNegative = scores.findIndex((a) => a < 0);
  const firstPositive = scores.findIndex((a) => a > 0);
  if (firstPositive === -1 || last(scores) < 0) {
    return last(scores);
  }
  let multiplier = 1;
  if (firstNegative < firstPositive) {
    multiplier = firstPositive + 1;
  }
  console.log(scores, multiplier);
  return last(scores) * multiplier;
}`;

export const defaultBots: { [key: string]: BotConfig } = {
  best: {
    name: "Best",
    builtin: true,
    baseEngine: {
      maxDepth: 23,
      timeout: 1500,
    },
    strategy: {
      type: "scorer/jsonlogic",
      logic: {
        reduce: [{ var: "scores" }, { var: "current" }, 0],
      },
    },
    preferredOpenings: [],
  },
  worst: {
    name: "Worst",
    builtin: true,
    strategy: {
      type: "scorer/jsonlogic",
      logic: {
        "-": {
          reduce: [{ var: "scores" }, { var: "current" }, 0],
        },
      },
    },
    baseEngine: {
      maxDepth: 23,
      timeout: 500,
    },
    preferredOpenings: [],
  },
  drawish: {
    name: "Drawish",
    builtin: true,
    strategy: {
      dangerous: true,
      type: "scorer/javascript",
      function: drawishFnText,
    },
    baseEngine: {
      maxDepth: 23,
      timeout: 1500,
    },
    preferredOpenings: [],
  },
  inscrutable: {
    name: "Inscrutable",
    builtin: true,
    strategy: {
      dangerous: true,
      type: "scorer/javascript",
      function: inscrutableFnText,
    },
    baseEngine: {
      maxDepth: 23,
      timeout: 1500,
    },
    preferredOpenings: [],
  },
  shallow: {
    name: "Shallow",
    builtin: true,
    baseEngine: {
      maxDepth: 1,
      timeout: 1500,
    },
    strategy: {
      type: "scorer/jsonlogic",
      logic: {
        reduce: [{ var: "scores" }, { var: "current" }, 0],
      },
    },
    preferredOpenings: [],
  },
};

let localBotStore: typeof defaultBots = defaultBots;

export function getAllBots() {
  return localBotStore;
}

export function save(
  bot: BotConfig,
  id = "user-" + (Math.random() * 1000).toString(18)
) {
  localBotStore = {
    ...localBotStore,
    [id]: {
      ...bot,
      builtin: false,
    },
  };
}

export function remove(id: string) {
  localBotStore = Object.assign({}, localBotStore);
  delete localBotStore[id];
}
