// data/navigation.js
export const mainDepartments = [
  {
    title: "Department of Academic Services",
    href: "/departments/academic-services",
    submenu: [
      { title: "Sports Activities", href: "/sports-activities" },
      {
        title: "Agricultural and Greening Activities",
        href: "/agricultural-greening",
      },
    ],
  },
  {
    title: "Department of Monitoring and Evaluation",
    href: "/departments/monitoring-evaluation",
    submenu: [
      { title: "Quality Assurance Activities", href: "/quality-assurance" },
      { title: "Centralized Exams", href: "/centralized-exams" },
    ],
  },
  {
    title: "Department of Finance and Accounts",
    href: "/departments/finance-accounts",
    // no submenu
  },
  {
    title: "Department of Administration and Supplies",
    href: "/departments/administration-supplies",
    submenu: [
      { title: "Registry", href: "/registry" },
      { title: "Human Resource and People", href: "/human-resource" },
    ],
  },
  {
    title: "Department of Social Mobilization",
    href: "/departments/social-mobilization",
    submenu: [{ title: "SBMC/Project Activities", href: "/sbmc-projects" }],
  },
  {
    title: "Department of Teacher Professional Development",
    href: "/departments/teacher-development",
    submenu: [{ title: "Trainings", href: "/trainings" }],
  },
  {
    title: "Department of Physical Planning and Technical Services",
    href: "/departments/physical-planning",
    submenu: [{ title: "Project Activities", href: "/projects" }],
  },
  {
    title: "Audit Department",
    href: "/departments/audit",
  },
  {
    title: "Department of Legal Services",
    href: "/departments/legal-services",
  },
  {
    title: "Department of Planning, Research and Statistics",
    href: "/departments/planning-research",
  },
];

export const units = [
  { title: "Stores", href: "/units/stores" },
  { title: "Digital Resource Centre", href: "/units/digital-resource" },
  { title: "Special Programs", href: "/units/special-programs" },
  { title: "Procurement", href: "/units/procurement" },
];

export const projects = [
  { title: "Project BRACE-UP", href: "/projects/brace-up" },
  { title: "HOPE-EDU", href: "/projects/hope-edu" },
];
