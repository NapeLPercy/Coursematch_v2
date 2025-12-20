export default class CourseManager {
  constructor() {}

  //filter by aps
  filterCoursesByAps(qualifications, aps) {
    return qualifications.filter(q => q.minimum_aps <= aps);
  }


  //filter by diploma,cert or bachelor
  filterCoursesByEndorsement(qualifications, studentEndorsement) {
    return qualifications.filter(q => {
      const min = q.minimum_endorsement;

      if (min === "Certificate") {
        return ["Certificate", "Diploma", "Bachelor"].includes(studentEndorsement);
      }
      if (min === "Diploma") {
        return ["Diploma", "Bachelor"].includes(studentEndorsement);
      }
      if (min === "Bachelor") {
        return studentEndorsement === "Bachelor";
      }

      return false;
    });
  }

  // -------------------------
  //  SUBJECT EQUIVALENTS MAP
  // -------------------------
 PREREQ_FAMILIES = {
  MATH: ["Mathematics", "Technical Mathematics", "Math Literacy"],
  SCIENCE: ["Physical Sciences", "Technical Sciences"],
  ENGLISH: ["English HL", "English FAL"],
};

SUBJECT_EQUIVALENTS = {
    "Mathematics": ["Mathematics"],
    "Physical Sciences": ["Physical Sciences", "Technical Sciences"],
    "English FAL":["English FAL","English HL"],
  };

//get subject family
getFamilyForSubject(subject) {
  for (const family in this.PREREQ_FAMILIES) {
    if (this.PREREQ_FAMILIES[family].includes(subject)) {
      return family;
    }
  }
  return subject; // treat as own family
}

//group
groupPrereqsByFamily(prereqs) {
  const groups = {};

  prereqs.forEach(pr => {
    const family = this.getFamilyForSubject(pr.subject_name);

    if (!groups[family]) groups[family] = [];
    groups[family].push(pr);
  });

  return groups;
}

doesStudentMeetFamily(group, studentSubjects) {
  return group.some(prereq => 
    this.doesStudentMeetSingleOption(prereq, studentSubjects)
  );
}



 doesStudentMeetSingleOption(option, studentSubjects) {
  const validNames = this.SUBJECT_EQUIVALENTS[option.subject_name] || [option.subject_name];

  return studentSubjects.some(s =>
    validNames.includes(s.name) && s.mark >= option.min_mark
  );
}


  // Check all prereqs
doesStudentMeetAllPrerequisites(course, studentSubjects) {
  if (!course.prereqs || course.prereqs.length === 0) return true;

  const groups = this.groupPrereqsByFamily(course.prereqs);

  return Object.values(groups).every(group =>
    this.doesStudentMeetFamily(group, studentSubjects)
  );
}


  // Final filtering method
  filterCoursesByPrerequisites(studentSubjects, courses) {
    return courses.filter(course =>
      this.doesStudentMeetAllPrerequisites(course, studentSubjects)
    );
  }
}
