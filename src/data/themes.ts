export interface ThemeInfo {
  slug: string;
  name: string;
  color: string;
  icon: string;
  taskCount: number;
}

export const themes: ThemeInfo[] = [
  {
    slug: "la-classe",
    name: "La classe",
    color: "#6C5CE7",
    icon: "✏️",
    taskCount: 12,
  },
  {
    slug: "l-escola",
    name: "L'escola",
    color: "#0984E3",
    icon: "🏫",
    taskCount: 12,
  },
  {
    slug: "el-cos",
    name: "El cos",
    color: "#E17055",
    icon: "🧍",
    taskCount: 12,
  },
  {
    slug: "la-roba",
    name: "La roba",
    color: "#E84393",
    icon: "👕",
    taskCount: 12,
  },
  {
    slug: "la-casa",
    name: "La casa",
    color: "#FDCB6E",
    icon: "🏠",
    taskCount: 12,
  },
  {
    slug: "la-familia",
    name: "La família",
    color: "#00B894",
    icon: "👨‍👩‍👧‍👦",
    taskCount: 12,
  },
  {
    slug: "les-botigues",
    name: "Les botigues",
    color: "#00CECE",
    icon: "🛒",
    taskCount: 12,
  },
  {
    slug: "el-menjar",
    name: "El menjar",
    color: "#FF9F43",
    icon: "🍽️",
    taskCount: 12,
  },
  {
    slug: "els-animals",
    name: "Els animals",
    color: "#A29BFE",
    icon: "🐾",
    taskCount: 12,
  },
  {
    slug: "la-ciutat",
    name: "La ciutat",
    color: "#55A3F5",
    icon: "🏙️",
    taskCount: 12,
  },
  {
    slug: "els-vehicles",
    name: "Els vehicles",
    color: "#FF6B6B",
    icon: "🚗",
    taskCount: 12,
  },
  {
    slug: "els-oficis",
    name: "Els oficis",
    color: "#1DD1A1",
    icon: "👷",
    taskCount: 12,
  },
];
