import { TagKey } from "./tags";

export type ImageDisplay = "cover" | "contain" | "top";
export type AspectRatio = "fourthirds" | "square" | "portrait";

export interface Project {
  id: string;
  image: string;
  date: string;
  altImages: string[];
  tags: TagKey[];
  imageDisplay?: ImageDisplay;
  aspectRatio?: AspectRatio;
}

export const projects: Project[] = [
  {
    id: "angel",
    image: "/images/angel_00.JPG",
    date: "2014-01-20",
    altImages: [],
    tags: ["illustration", "ink"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
  {
    id: "batman",
    image: "/images/batman_00.jpg",
    date: "2015-01-01",
    altImages: [],
    tags: ["illustration", "fan_art"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
  {
    id: "bebop",
    image: "/images/bebop_00.jpeg",
    date: "2018-01-20",
    altImages: ["/images/bebop_01.jpeg"],
    tags: ["illustration", "anime"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
  {
    id: "berserk",
    image: "/images/berserk_00.jpeg",
    date: "2020-05-20",
    altImages: ["/images/berserk_01.jpeg", "/images/berserk_02.jpeg"],
    tags: ["illustration", "manga"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
  {
    id: "chaplin",
    image: "/images/chaplin_00.jpg",
    date: "2016-03-03",
    altImages: [],
    tags: ["portrait", "cinema"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
  {
    id: "chucky",
    image: "/images/chucky_00.jpg",
    date: "2013-01-01",
    altImages: [],
    tags: ["illustration", "horror"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
  {
    id: "fear",
    image: "/images/fear_00.jpg",
    date: "2014-01-10",
    altImages: [],
    tags: ["illustration", "concept"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
  {
    id: "fubuki",
    image: "/images/fubuki_00.jpeg",
    date: "2020-04-04",
    altImages: ["/images/fubuki_01.jpeg", "/images/fubuki_02.jpeg"],
    tags: ["illustration", "anime"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
  {
    id: "ink_cat",
    image: "/images/ink_cat_00.jpg",
    date: "2024-05-07",
    altImages: ["/images/ink_cat_01.jpg"],
    tags: ["ink", "animals"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
  {
    id: "joker",
    image: "/images/joker_00.jpg",
    date: "2019-11-30",
    altImages: [],
    tags: ["illustration", "fan_art"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
  {
    id: "linea_puntos",
    image: "/images/linea_puntos_00.png",
    date: "2019-12-12",
    altImages: [],
    tags: ["technique", "pointillism"],
    imageDisplay: "cover",
    aspectRatio: "fourthirds",
  },
  {
    id: "nicky",
    image: "/images/nicky_00.png",
    date: "2023-09-20",
    altImages: ["/images/nicky_01.jpg", "/images/nicky_02.jpeg"],
    tags: ["portrait", "illustration"],
    imageDisplay: "cover",
    aspectRatio: "fourthirds",
  },
  {
    id: "petit_princep",
    image: "/images/petit_princep_00.JPG",
    date: "2016-07-10",
    altImages: [],
    tags: ["illustration", "literature"],
    imageDisplay: "cover",
    aspectRatio: "fourthirds",
  },
  {
    id: "skull_ink",
    image: "/images/skull_ink_00.jpeg",
    date: "2024-09-25",
    altImages: ["/images/skull_ink_01.jpeg", "/images/skull_ink_02.jpeg"],
    tags: ["ink", "skull"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
  {
    id: "superman",
    image: "/images/superman_00.jpg",
    date: "2018-01-01",
    altImages: [],
    tags: ["illustration", "fan_art"],
    imageDisplay: "cover",
    aspectRatio: "fourthirds",
  },
  {
    id: "woman_portrait",
    image: "/images/woman_portrait_00.jpeg",
    date: "2019-01-10",
    altImages: [],
    tags: ["portrait", "realism"],
    imageDisplay: "cover",
    aspectRatio: "portrait",
  },
];
