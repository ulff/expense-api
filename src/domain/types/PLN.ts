export type PLN = {
  zloty: number;
  groszy: number;
};

export const sumPLN: (a: PLN, b: PLN) => PLN = (a, b) => {
  const sumGroszy = a.groszy + b.groszy;
  const extraZloty = Math.floor(sumGroszy / 100);
  const groszy = sumGroszy % 100;
  const zloty = a.zloty + b.zloty + extraZloty;

  return { zloty, groszy };
};
