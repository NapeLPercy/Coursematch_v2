export const NAV_CONFIG = {
  guest: {
    main: [
      {
        path: "/",
        label: "Home",
      },
      {
        label: "Course Categories",
        dropdown: [
          {
            path: "/bachelor-degree-courses",
            label: "Bachelor Degrees",
          },
          {
            path: "/diploma-courses",
            label: "Diploma Courses",
          },
          {
            path: "/higher-certificate-courses",
            label: "Higher Certificates",
          },
          {
            path: "/extended-programmes",
            label: "Extended Programmes",
          },
          {
            path: "/courses-without-maths",
            label: "Courses Without Maths",
          },
        ],
      },
      {
        label: "Tools",

        dropdown: [
          {
            path: "/aps-calculator",
            label: "APS Calculators",
          },
          {
            path: "/nsfas-eligibility-checker",
            label: "NSFAS Eligibility Checker",
          },
          {
            path: "/university-prospectuses",
            label: "Prospectus Downloader",
          },
        ],
      },

      { path: "/features", label: "Features" },
      { path: "/blogs", label: "Blog" },

      {
        path: "/contact-us",
        label: "Contact",
      },
    ],
  },
  student: {
    main: [
      {
        path: "/student/dashboard",
        label: "Dashboard",
      },

      {
        label: "Subjects",

        dropdown: [
          {
            path: "/student/add/subjects",
            label: "Add Subjects",
          },
          {
            path: "/student/view/subjects",
            label: "View Subjects",
          },
        ],
      },

      {
        label: "Courses",
        dropdown: [
          {
            path: "/view-courses",
            label: "Find Your Courses",
          },
          {
            path: "/student/view/my-recommeded-courses",
            label: "AI Recommended Courses",
          },
          {
            path: "/student/ai-recommended-courses",
            label: "Qualifications Details",
          },

          {
            path: "/student/course-comparisons",
            label: "Compare Qualifications",
          },
        ],
      },
      {
        label: "Course Categories",

        dropdown: [
          {
            path: "/bachelor-degree-courses",
            label: "Bachelor Degrees",
          },
          {
            path: "/diploma-courses",
            label: "Diploma Courses",
          },
          {
            path: "/higher-certificate-courses",
            label: "Higher Certificates",
          },
          {
            path: "/extended-programmes",
            label: "Extended Programmes",
          },
          {
            path: "/courses-without-maths",
            label: "Courses Without Maths",
          },
        ],
      },

      {
        label: "Personality",

        dropdown: [
          {
            path: "/student/add/personality",
            label: "Add Personality",
          },
          {
            path: "/student/view/personality",
            label: "View Personality",
          },
        ],
      },

      {
        label: "Tools",
        dropdown: [
          {
            path: "/aps-calculator",
            label: "APS Calculator",
          },
          {
            path: "/nsfas-eligibility-checker",
            label: "NSFAS Eligibility Checker",
          },
          {
            path: "/university-prospectuses",
            label: "Prospectus Downloader",
          },
        ],
      },
    ],
    showUser: true,
    isAdmin: false,
  },
  parent: {
    main: [
      {
        path: "/parent/dashboard",
        label: "Dashboard",
      },

      {
        label: "My Child",

        dropdown: [
          { path: "/student/view/subjects", label: "Subjects" },
          { path: "/lessons", label: "Lessons" },
          { path: "/student/progress", label: "Progress" },
        ],
      },

      {
        label: "Course Insights",
        dropdown: [
          {
            path: "/matched-courses",
            label: "Matched Courses",
          },
          { path: "/view-courses", label: "All Courses" },
        ],
      },

      {
        path: "/student/manage-my-profile",
        label: "Manage Profile",
      },
    ],
    showUser: true,
    isAdmin: false,
  },

  tutor: {
    main: [
      {
        path: "/tutor/dashboard",
        label: "Dashboard",
      },

      {
        label: "My Students",

        dropdown: [
          { path: "/students", label: "All Students" },
          { path: "/student/view/subjects", label: "Subjects" },
          { path: "/student/progress", label: "Progress" },
        ],
      },

      {
        label: "Lessons",
        dropdown: [
          { path: "/lessons", label: "Upcoming Lessons" },
          {
            path: "/schedule-lesson",
            label: "Schedule Lesson",
          },
        ],
      },

      { path: "/tutor/subjects", label: "Subjects" },

      { path: "/messages", label: "Messages" },

      {
        path: "/student/manage-my-profile",
        label: "Manage Profile",
      },
    ],
    showUser: true,
    isAdmin: false,
  },

  admin: {
    main: [
      {
        path: "/admin/dashboard",
        label: "Dashboard",
      },
      {
        path: "/admin/manage-qualifications",
        label: "Qualifications",
      },
      {
        path: "/admin/manage-universities",
        label: "Universities",
      },
      {
        label: "Prospectus",
        dropdown: [
          {
            path: "/admin/add/university-prospectus",
            label: "Add Prospectus",
          },
          {
            path: "/admin/manage/university-prospectuses",
            label: "Manage Prospectus",
          },
        ],
      },
      {
        path: "/admin/manage-accounts",
        label: "Accounts",
      },

      {
        path: "/admin/manage-blogs",
        label: "Blogs",
      },
      {
        path: "/admin/reports",
        label: "Reports",
      },
    ],
    showUser: true,
    isAdmin: true,
  },
};
