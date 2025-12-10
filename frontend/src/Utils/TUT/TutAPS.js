// TutAPS.js
import SubjectLevel from "../SubjectLevel";

export default class TutAPS {
  constructor(subjects) {
    // subjects = [{ name: "Maths", mark: 78 }, ... ]
    this.subjects = subjects;
  }

  computeAPS() {

    console.log("This is subjects inside aps function ",this.subjects);
    let totalAPS = 0;

    this.subjects.forEach((sub) => {
      const level = new SubjectLevel(sub.Mark).getLevel();

      // Exclude Life Orientation
      if (sub.Name.toLowerCase() === "life orientation") return;

      // Exclude Level 1 subjects
      if (level === 1) return;

      totalAPS += level;
    });

    return totalAPS;
  }
}

