// TutAPS.js
import SubjectLevel from "./SubjectLevel.js";

export default class TutAPS {
  constructor(subjects) {
    // subjects = [{ name: "Maths", mark: 78 }, ... ]
    this.subjects = subjects;
  }

  computeAPS() {
    let totalAPS = 0;

    this.subjects.forEach((sub) => {
      const level = new SubjectLevel(sub.mark).getLevel();

      // Exclude Life Orientation
      if (sub.name.toLowerCase() === "life orientation") return;

      // Exclude Level 1 subjects
      if (level === 1) return;

      totalAPS += level;
    });

    return totalAPS;
  }
}

