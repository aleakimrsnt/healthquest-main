const foodBank = [
  {
    name: "Egg",
    calories: 1.4,
    protein: 0.12,
    fiber: 0,
    fat: 0.1,
    other: 0.01,
  },
  {
    name: "Apple",
    calories: 0.52,
    protein: 0.001,
    fiber: 0.004,
    fat: 0.0003,
    other: 0.01
  },
  {
    name: "Banana",
    calories: 0.89,
    protein: 0.0015,
    fiber: 0.0015,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Chicken Breast",
    calories: 1.2,
    protein: 0.22,
    fiber: 0,
    fat: 0.02,
    other: 0.01
  },
  {
    name: "Salmon",
    calories: 2.03,
    protein: 0.21,
    fiber: 0,
    fat: 0.14,
    other: 0.01
  },
  {
    name: "Broccoli",
    calories: 0.34,
    protein: 0.025,
    fiber: 0.002,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Avocado",
    calories: 2.01,
    protein: 0.02,
    fiber: 0.015,
    fat: 0.18,
    other: 0.01
  },
  {
    name: "Rice (cooked)",
    calories: 1.3,
    protein: 0.025,
    fiber: 0,
    fat: 0.005,
    other: 0.01
  },
  {
    name: "Oats (cooked)",
    calories: 0.68,
    protein: 0.025,
    fiber: 0.01,
    fat: 0.005,
    other: 0.01
  },
  {
    name: "Potato",
    calories: 0.77,
    protein: 0.015,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Beef (lean)",
    calories: 1.3,
    protein: 0.21,
    fiber: 0,
    fat: 0.1,
    other: 0.01
  },
  {
    name: "Cucumber",
    calories: 0.15,
    protein: 0.006,
    fiber: 0.001,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Carrot",
    calories: 0.41,
    protein: 0.008,
    fiber: 0.003,
    fat: 0.0003,
    other: 0.01
  },
  {
    name: "Spinach",
    calories: 0.23,
    protein: 0.03,
    fiber: 0.002,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Strawberries",
    calories: 0.32,
    protein: 0.008,
    fiber: 0.002,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Blueberries",
    calories: 0.32,
    protein: 0.006,
    fiber: 0.003,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Cheese (cheddar)",
    calories: 3.22,
    protein: 0.25,
    fiber: 0,
    fat: 0.26,
    other: 0.01
  },
  {
    name: "Peanut Butter",
    calories: 5.9,
    protein: 0.1,
    fiber: 0.04,
    fat: 0.5,
    other: 0.01
  },
  {
    name: "Bread (whole wheat)",
    calories: 2.26,
    protein: 0.08,
    fiber: 0.02,
    fat: 0.01,
    other: 0.01
  },
  {
    name: "Milk (whole)",
    calories: 0.6,
    protein: 0.032,
    fiber: 0,
    fat: 0.036,
    other: 0.01
  },
  {
    name: "Yogurt (plain)",
    calories: 0.6,
    protein: 0.045,
    fiber: 0,
    fat: 0.036,
    other: 0.01
  },
  {
    name: "Tomato",
    calories: 0.18,
    protein: 0.004,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Lettuce",
    calories: 0.08,
    protein: 0.006,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Onion",
    calories: 0.4,
    protein: 0.01,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Bell Pepper",
    calories: 0.2,
    protein: 0.008,
    fiber: 0.001,
    fat: 0.0003,
    other: 0.01
  },
  {
    name: "Green Beans",
    calories: 0.31,
    protein: 0.018,
    fiber: 0.002,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Orange",
    calories: 0.47,
    protein: 0.007,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Grapes",
    calories: 0.69,
    protein: 0.003,
    fiber: 0.001,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Turkey Breast",
    calories: 1.11,
    protein: 0.22,
    fiber: 0,
    fat: 0.02,
    other: 0.01
  },
  {
    name: "Pork Loin",
    calories: 1.3,
    protein: 0.22,
    fiber: 0,
    fat: 0.03,
    other: 0.01
  },
  {
    name: "Quinoa (cooked)",
    calories: 1.44,
    protein: 0.025,
    fiber: 0.004,
    fat: 0.005,
    other: 0.01
  },
  {
    name: "Pasta (cooked)",
    calories: 1.3,
    protein: 0.025,
    fiber: 0,
    fat: 0.005,
    other: 0.01
  },
  {
    name: "Cashews",
    calories: 5.35,
    protein: 0.125,
    fiber: 0.016,
    fat: 0.44,
    other: 0.01
  },
  {
    name: "Almonds",
    calories: 5.37,
    protein: 0.124,
    fiber: 0.013,
    fat: 0.49,
    other: 0.01
  },
  {
    name: "Walnuts",
    calories: 6.01,
    protein: 0.125,
    fiber: 0.013,
    fat: 0.6,
    other: 0.01
  },
  {
    name: "Peanuts",
    calories: 5.82,
    protein: 0.25,
    fiber: 0.023,
    fat: 0.49,
    other: 0.01
  },
  {
    name: "Coconut (shredded)",
    calories: 4.29,
    protein: 0.028,
    fiber: 0.013,
    fat: 0.43,
    other: 0.01
  },
  {
    name: "Olive Oil",
    calories: 8.82,
    protein: 0,
    fiber: 0,
    fat: 1,
    other: 0.01
  },
  {
    name: "Butter",
    calories: 7.17,
    protein: 0.001,
    fiber: 0,
    fat: 0.81,
    other: 0.01
  },
  {
    name: "Honey",
    calories: 3.64,
    protein: 0.001,
    fiber: 0.0001,
    fat: 0,
    other: 0.85
  },
  {
    name: "Maple Syrup",
    calories: 3.52,
    protein: 0,
    fiber: 0,
    fat: 0,
    other: 0.85
  },
  {
    name: "Sugar",
    calories: 3.87,
    protein: 0,
    fiber: 0,
    fat: 0,
    other: 1
  },
  {
    name: "Brown Rice (cooked)",
    calories: 1.2,
    protein: 0.025,
    fiber: 0,
    fat: 0.005,
    other: 0.01
  },
  {
    name: "Soy Milk",
    calories: 0.35,
    protein: 0.04,
    fiber: 0.002,
    fat: 0.02,
    other: 0.01
  },
  {
    name: "Tofu",
    calories: 0.72,
    protein: 0.088,
    fiber: 0.005,
    fat: 0.045,
    other: 0.01
  },
  {
    name: "Chickpeas (cooked)",
    calories: 0.42,
    protein: 0.022,
    fiber: 0.006,
    fat: 0.004,
    other: 0.01
  },
  {
    name: "Lentils (cooked)",
    calories: 0.35,
    protein: 0.025,
    fiber: 0.006,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Black Beans (cooked)",
    calories: 0.35,
    protein: 0.022,
    fiber: 0.005,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Kidney Beans (cooked)",
    calories: 0.36,
    protein: 0.022,
    fiber: 0.005,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Pinto Beans (cooked)",
    calories: 0.36,
    protein: 0.022,
    fiber: 0.005,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Mango",
    calories: 0.6,
    protein: 0.005,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Pineapple",
    calories: 0.5,
    protein: 0.003,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Cantaloupe",
    calories: 0.35,
    protein: 0.003,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Watermelon",
    calories: 0.3,
    protein: 0.002,
    fiber: 0.001,
    fat: 0,
    other: 0.01
  },
  {
    name: "Corn (cooked)",
    calories: 1.14,
    protein: 0.034,
    fiber: 0.006,
    fat: 0.015,
    other: 0.01
  },
  {
    name: "Peas (cooked)",
    calories: 0.67,
    protein: 0.042,
    fiber: 0.019,
    fat: 0.002,
    other: 0.01
  },
  {
    name: "Zucchini",
    calories: 0.16,
    protein: 0.012,
    fiber: 0.002,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Asparagus",
    calories: 0.2,
    protein: 0.022,
    fiber: 0.002,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Celery",
    calories: 0.16,
    protein: 0.007,
    fiber: 0.003,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Peach",
    calories: 0.4,
    protein: 0.005,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Pear",
    calories: 0.57,
    protein: 0.003,
    fiber: 0.003,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Plum",
    calories: 0.46,
    protein: 0.002,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Cherry",
    calories: 0.53,
    protein: 0.0015,
    fiber: 0.0015,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Kiwi",
    calories: 0.48,
    protein: 0.007,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Tangerine",
    calories: 0.43,
    protein: 0.005,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Grapefruit",
    calories: 0.33,
    protein: 0.004,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Apricot",
    calories: 0.48,
    protein: 0.004,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Nectarine",
    calories: 0.48,
    protein: 0.005,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Cabbage",
    calories: 0.22,
    protein: 0.012,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Cauliflower",
    calories: 0.25,
    protein: 0.012,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Garlic",
    calories: 0.15,
    protein: 0.006,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Ginger",
    calories: 0.8,
    protein: 0.01,
    fiber: 0.002,
    fat: 0.002,
    other: 0.01
  },
  {
    name: "Pumpkin",
    calories: 0.26,
    protein: 0.01,
    fiber: 0.002,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Sweet Potato",
    calories: 0.76,
    protein: 0.017,
    fiber: 0.003,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Beets",
    calories: 0.4,
    protein: 0.012,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Eggplant",
    calories: 0.25,
    protein: 0.006,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Mushrooms",
    calories: 0.22,
    protein: 0.03,
    fiber: 0.002,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Squash (winter)",
    calories: 0.4,
    protein: 0.012,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Radish",
    calories: 0.16,
    protein: 0.006,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Turnip",
    calories: 0.28,
    protein: 0.006,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Blackberries",
    calories: 0.37,
    protein: 0.005,
    fiber: 0.003,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Raspberries",
    calories: 0.52,
    protein: 0.006,
    fiber: 0.003,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Cranberries",
    calories: 0.46,
    protein: 0.005,
    fiber: 0.002,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Pomegranate",
    calories: 0.52,
    protein: 0.005,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Lemon",
    calories: 0.29,
    protein: 0.005,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Lime",
    calories: 0.3,
    protein: 0.005,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Cantaloupe",
    calories: 0.35,
    protein: 0.003,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Watermelon",
    calories: 0.3,
    protein: 0.002,
    fiber: 0.001,
    fat: 0,
    other: 0.01
  },
  {
    name: "Honeydew Melon",
    calories: 0.36,
    protein: 0.003,
    fiber: 0.001,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Mango",
    calories: 0.6,
    protein: 0.005,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Kiwi",
    calories: 0.48,
    protein: 0.007,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Papaya",
    calories: 0.43,
    protein: 0.003,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Coconut",
    calories: 3.7,
    protein: 0.008,
    fiber: 0.002,
    fat: 0.35,
    other: 0.01
  },
  {
    name: "Dates",
    calories: 3.1,
    protein: 0.02,
    fiber: 0.006,
    fat: 0.002,
    other: 0.01
  },
  {
    name: "Figs",
    calories: 0.74,
    protein: 0.005,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Raisins",
    calories: 3.8,
    protein: 0.007,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Prunes",
    calories: 0.31,
    protein: 0.002,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Apricots",
    calories: 0.48,
    protein: 0.004,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Peaches",
    calories: 0.4,
    protein: 0.005,
    fiber: 0.002,
    fat: 0.0002,
    other: 0.01
  },
  {
    name: "Cantaloupe",
    calories: 0.35,
    protein: 0.003,
    fiber: 0.002,
    fat: 0.0001,
    other: 0.01
  },
  {
    name: "Watermelon",
    calories: 0.3,
    protein: 0.002,
    fiber: 0.001,
    fat: 0,
    other: 0.01
  },
  {
    name: "Cucumber",
    calories: 0.15,
    protein: 0.006,
    fiber: 0.001,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Carrot",
    calories: 0.41,
    protein: 0.008,
    fiber: 0.003,
    fat: 0.0003,
    other: 0.01
  },
  {
    name: "Spinach",
    calories: 0.23,
    protein: 0.03,
    fiber: 0.002,
    fat: 0.001,
    other: 0.01
  },
  {
    name: "Strawberries",
    calories: 0.32,
    protein: 0.008,
    fiber: 0.002,
    fat: 0.001,
    other: 0.01
  },
  // Continue adding more items...
  {
    name: "Pumpkin Seeds",
    calories: 5.23,
    protein: 0.25,
    fiber: 0.03,
    fat: 0.45,
    other: 0.01
  },
  {
    name: "Sunflower Seeds",
    calories: 5.77,
    protein: 0.25,
    fiber: 0.02,
    fat: 0.51,
    other: 0.01
  },
  {
    name: "Chia Seeds",
    calories: 4.86,
    protein: 0.17,
    fiber: 0.04,
    fat: 0.31,
    other: 0.01
  },
  {
    name: "Flaxseeds",
    calories: 5.04,
    protein: 0.18,
    fiber: 0.03,
    fat: 0.41,
    other: 0.01
  },
  {
    name: "Sesame Seeds",
    calories: 5.24,
    protein: 0.18,
    fiber: 0.03,
    fat: 0.45,
    other: 0.01
  },
  {
    name: "Pistachios",
    calories: 5.75,
    protein: 0.21,
    fiber: 0.032,
    fat: 0.45,
    other: 0.01
  },
  {
    name: "Hazelnuts",
    calories: 6.1,
    protein: 0.15,
    fiber: 0.037,
    fat: 0.63,
    other: 0.01
  },
  {
    name: "Pecans",
    calories: 6.28,
    protein: 0.09,
    fiber: 0.034,
    fat: 0.72,
    other: 0.01
  },
  {
    name: "Macadamia Nuts",
    calories: 7.03,
    protein: 0.07,
    fiber: 0.034,
    fat: 0.76,
    other: 0.01
  },
  {
    name: "Brazil Nuts",
    calories: 6.76,
    protein: 0.17,
    fiber: 0.018,
    fat: 0.66,
    other: 0.01
  },
  {
    name: "Cashews",
    calories: 5.35,
    protein: 0.125,
    fiber: 0.016,
    fat: 0.44,
    other: 0.01
  },
  {
    name: "Almonds",
    calories: 5.37,
    protein: 0.124,
    fiber: 0.013,
    fat: 0.49,
    other: 0.01
  },
  {
    name: "Walnuts",
    calories: 6.01,
    protein: 0.125,
    fiber: 0.013,
    fat: 0.6,
    other: 0.01
  },
  {
    name: "Peanuts",
    calories: 5.82,
    protein: 0.25,
    fiber: 0.023,
    fat: 0.49,
    other: 0.01
  },
  // Add more items here...
];

export default foodBank;
