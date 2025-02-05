export class PLN {
  public readonly zloty: number;
  public readonly groszy: number;

  constructor(zloty: number, groszy: number) {
    // @todo validation
    this.zloty = zloty;
    this.groszy = groszy;
  }

  public static sumPLN: (a: PLN, b: PLN) => PLN = (a, b) => {
    const sumGroszy = a.groszy + b.groszy;
    const extraZloty = Math.floor(sumGroszy / 100);
    const groszy = sumGroszy % 100;
    const zloty = a.zloty + b.zloty + extraZloty;

    return { zloty, groszy };
  };
}
