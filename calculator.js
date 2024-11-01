const { PLUS_OPERATOR, MINUS_OPERATOR, MULTIPLY_OPERATOR, DIVIDE_OPERATOR , OPERATORS} = require("./constants");

const checkIfInputValuesAreValid = (args) => {
  return args.every(arg => typeof arg === "number" && !isNaN(arg));
};

const checkIfOperatorsAreValid = (args) => {
  return args.every(arg => OPERATORS.includes(arg));
};

const checkIfInputsAndOperatorsAreValid = (args) => {
  if (args.length < 3 || args.length % 2 === 0) {
    throw new Error("Invalid input type");
  }
  
  const inputValues = args.filter((arg, index) => index % 2 === 0);
  const operators = args.filter((arg, index) => index % 2 === 1);

  const hasValidInputs = checkIfInputValuesAreValid(inputValues);
  const hasValidOperators = checkIfOperatorsAreValid(operators);

  if (!hasValidInputs) {
    throw new Error("Invalid input type");
  }
  if (!hasValidOperators) {
    throw new Error("Invalid operator");
  }
};

function getPrecedence(operator) {
  switch (operator) {
    case PLUS_OPERATOR:
    case MINUS_OPERATOR:
      return 1;
    case MULTIPLY_OPERATOR:
    case DIVIDE_OPERATOR:
      return 2;
    default:
      return 0;
  }
}

function applyOperator(operator, secondNumber, firstNumber) {
  if (firstNumber > 1000) {
    firstNumber = operator === PLUS_OPERATOR || operator === MINUS_OPERATOR ? 0 : 1;
  }

  switch (operator) {
    case PLUS_OPERATOR:
      return firstNumber + (secondNumber > 1000 ? 0 : secondNumber);
    case MINUS_OPERATOR:
      return firstNumber - (secondNumber > 1000 ? 0 : secondNumber);
    case MULTIPLY_OPERATOR:
      return firstNumber * (secondNumber > 1000 ? 1 : secondNumber);
    case DIVIDE_OPERATOR:
      if (secondNumber === 0) throw new Error("Division by zero");
      return firstNumber / (secondNumber > 1000 ? 1 : secondNumber);
  }
}

function calculateExpression(args) {
  const resultStack = [];
  const operatorStack = [];

  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === "number") {
      resultStack.push(args[i]);
    } else {
      while (
        operatorStack.length &&
        getPrecedence(operatorStack[operatorStack.length - 1]) >= getPrecedence(args[i])
      ) {
        const operator = operatorStack.pop();
        const secondNumber = resultStack.pop();
        const firstNumber = resultStack.pop();
        resultStack.push(applyOperator(operator, secondNumber, firstNumber));
      }
      operatorStack.push(args[i]);
    }
  }

  while (operatorStack.length) {
    const operator = operatorStack.pop();
    const secondNumber = resultStack.pop();
    const firstNumber = resultStack.pop();
    resultStack.push(applyOperator(operator, secondNumber, firstNumber));
  }

  return resultStack[0];
}

function calc(...args) {
  checkIfInputsAndOperatorsAreValid(args);
  return calculateExpression(args);
}

module.exports = {
  calc,
  checkIfInputValuesAreValid,
  checkIfOperatorsAreValid,
  checkIfInputsAndOperatorsAreValid,
  getPrecedence,
  applyOperator,
  calculateExpression,
};