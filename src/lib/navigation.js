import {
  Utensils,
  HeartPulse,
  Home,
  Coffee,
  Pizza,
  Beer,
  ChefHat,
  Stethoscope,
  Dumbbell,
  Flower,
  Smile,
  Hammer,
  Wrench,
  Brush,
  Zap,
  Leaf,
  Anchor,
  Car,
  ShoppingBag,
  PawPrint,
  Briefcase,
  PartyPopper,
  GraduationCap,
  Scissors,
} from "lucide-react";
import categoriesData from "./categories-data.json";

const ICON_MAP = {
  Utensils: <Utensils size={20} />,
  HeartPulse: <HeartPulse size={20} />,
  Home: <Home size={20} />,
  Coffee: <Coffee size={20} />,
  Pizza: <Pizza size={20} />,
  Beer: <Beer size={20} />,
  ChefHat: <ChefHat size={20} />,
  Stethoscope: <Stethoscope size={20} />,
  Dumbbell: <Dumbbell size={20} />,
  Flower: <Flower size={20} />,
  Smile: <Smile size={20} />,
  Hammer: <Hammer size={20} />,
  Wrench: <Wrench size={20} />,
  Brush: <Brush size={20} />,
  Zap: <Zap size={20} />,
  Leaf: <Leaf size={20} />,
  Anchor: <Anchor size={20} />,
  Car: <Car size={20} />,
  ShoppingBag: <ShoppingBag size={20} />,
  PawPrint: <PawPrint size={20} />,
  Briefcase: <Briefcase size={20} />,
  PartyPopper: <PartyPopper size={20} />,
  GraduationCap: <GraduationCap size={20} />,
  Scissors: <Scissors size={20} />,
};

const SUB_ICON_MAP = {
  Utensils: <Utensils size={16} />,
  HeartPulse: <HeartPulse size={16} />,
  Home: <Home size={16} />,
  Coffee: <Coffee size={16} />,
  Pizza: <Pizza size={16} />,
  Beer: <Beer size={16} />,
  ChefHat: <ChefHat size={16} />,
  Stethoscope: <Stethoscope size={16} />,
  Dumbbell: <Dumbbell size={16} />,
  Flower: <Flower size={16} />,
  Smile: <Smile size={16} />,
  Hammer: <Hammer size={16} />,
  Wrench: <Wrench size={16} />,
  Brush: <Brush size={16} />,
  Zap: <Zap size={16} />,
  Leaf: <Leaf size={16} />,
  Anchor: <Anchor size={16} />,
  Car: <Car size={16} />,
  ShoppingBag: <ShoppingBag size={16} />,
  PawPrint: <PawPrint size={16} />,
  Briefcase: <Briefcase size={16} />,
  PartyPopper: <PartyPopper size={16} />,
  GraduationCap: <GraduationCap size={16} />,
  Scissors: <Scissors size={16} />,
};

// Curated top 10 most broad categories per directory type for the nav mega menu (30 total)
const MEGA_MENU_CATEGORY_SLUGS = {
  "food-drink": [
    "restaurants",
    "bars-nightlife",
    "cafes-bakeries",
    "breakfast-brunch",
    "seafood",
    "pizza",
    "mexican-latin",
    "breweries",
    "coffee-tea",
    "steakhouse",
  ],
  "health-wellness": [
    "medical-dental",
    "beauty-spas",
    "fitness-sports",
    "alternative-therapy",
    "primary-care-doctors",
    "dentists-orthodontics",
    "hair-salons",
    "gyms-health-clubs",
    "massage-therapy",
    "senior-care-services",
  ],
  "home-local-services": [
    "contractors-repair",
    "home-property",
    "boating-marine",
    "real-estate",
    "auto-transport",
    "shopping",
    "pet-services",
    "financial-services",
    "parties-events",
    "education",
  ],
};

export const categories = categoriesData.map((cat) => {
  const allowedSlugs = MEGA_MENU_CATEGORY_SLUGS[cat.slug];
  let subs = cat.subs;
  if (allowedSlugs) {
    subs = allowedSlugs
      .map((slug) => cat.subs.find((sub) => sub.slug === slug))
      .filter(Boolean);
  } else {
    subs = subs.slice(0, 10);
  }

  return {
    ...cat,
    icon: ICON_MAP[cat.iconName] || <Smile size={20} />,
    subs: subs.map((sub) => ({
      ...sub,
      icon: SUB_ICON_MAP[sub.iconName] || <Smile size={16} />,
    })),
  };
});
