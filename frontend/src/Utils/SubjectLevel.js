// SubjectLevel.js
export default class SubjectLevel {
  constructor(mark) {
    this.mark = mark;
  }

  getLevel() {
    const m = this.mark;

    if (m >= 80) return 7;
    if (m >= 70) return 6;
    if (m >= 60) return 5;
    if (m >= 50) return 4;
    if (m >= 40) return 3;
    if (m >= 30) return 2;
    return 1; // below 30
  }
}
