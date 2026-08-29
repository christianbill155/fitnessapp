import { 
  Exercise, 
  WorkoutRoadmap, 
  WeeklyMealPlan, 
  UserProfile, 
  GeographicRegion, 
  BudgetTier,
  FitnessGoal,
  FitnessLevel,
  EquipmentType,
  Recipe
} from '../types';

export const REGIONS_META: Record<GeographicRegion, { name: string; icon: string; stapleCarbs: string; budgetProteins: string; description: string }> = {
  mediterranean: {
    name: 'Mediterranean & Southern Europe',
    icon: '🫒',
    stapleCarbs: 'Lentils, chickpeas, whole wheat pita, orzo, polenta',
    budgetProteins: 'Canned sardines/tuna, Greek yogurt, eggs, white beans, feta',
    description: 'Rich in healthy fats (olive oil), legumes, seasonal greens, and high-protein dairy.'
  },
  west_african: {
    name: 'West African & Sahel',
    icon: '🍲',
    stapleCarbs: 'Cassava/garri, brown rice, sweet potatoes, plantains, fonio',
    budgetProteins: 'Black-eyed peas (beans), mackerel/sardines, eggs, groundnuts/peanuts',
    description: 'Nutrient-dense stews, protein-rich legume porridges, iron-rich greens, and natural spices.'
  },
  east_asian: {
    name: 'East Asian',
    icon: '🥢',
    stapleCarbs: 'Jasmine rice, soba/buckwheat noodles, sweet potato starch noodles',
    budgetProteins: 'Tofu, eggs, edamame, chicken thighs, pork mince, canned fish',
    description: 'High in stir-fries, fermented probiotics, ginger-garlic aromatics, and affordable soy proteins.'
  },
  south_asian: {
    name: 'South Asian & Indian Subcontinent',
    icon: '🍛',
    stapleCarbs: 'Basmati rice, whole wheat roti/chapati, poha, millets',
    budgetProteins: 'Yellow/red lentils (dal), chana (chickpeas), paneer, eggs, curd/dahi',
    description: 'Spiced turmeric anti-inflammatory curries, high-fiber lentils, and cost-effective pulse proteins.'
  },
  latin_american: {
    name: 'Latin American & Caribbean',
    icon: '🥑',
    stapleCarbs: 'Corn tortillas, black/pinto beans, brown rice, yucca',
    budgetProteins: 'Black/pinto beans, eggs, canned tuna, chicken thighs, queso fresco',
    description: 'Complete protein pairings (rice & beans), lime, avocado, peppers, and savory stews.'
  },
  middle_eastern: {
    name: 'Middle Eastern & North African',
    icon: '🧆',
    stapleCarbs: 'Couscous, bulgur, freekeh, whole wheat flatbread',
    budgetProteins: 'Fava beans (ful), chickpeas (hummus), labneh, eggs, chicken gizzards/thighs',
    description: 'Hearty legumes, tahini, antioxidant sumac/zaatar spices, and fresh herbs.'
  },
  north_american: {
    name: 'North American Smart Budget',
    icon: '🥗',
    stapleCarbs: 'Oatmeal, brown rice, russet/sweet potatoes, whole wheat bread',
    budgetProteins: 'Eggs, peanut butter, canned tuna, cottage cheese, rotisserie chicken, dry beans',
    description: 'High-protein, quick prep batch cooking with standard supermarket staples.'
  },
  european_continental: {
    name: 'Central & Eastern European',
    icon: '🥖',
    stapleCarbs: 'Buckwheat kasha, rye bread, potatoes, pearl barley',
    budgetProteins: 'Cottage cheese (tvorog), kefir, eggs, pork loin, canned herring, lentils',
    description: 'Fermented gut-healthy foods, hearty grains, root vegetables, and affordable dairy.'
  },
  southeast_asian: {
    name: 'Southeast Asian',
    icon: '🍜',
    stapleCarbs: 'Rice noodles, brown rice, tapioca, sweet potatoes',
    budgetProteins: 'Tofu, tempeh, eggs, peanuts, canned sardines in tomato, chicken wings/thighs',
    description: 'Vibrant herbs (lemongrass, cilantro), coconut-curry broths, and affordable plant proteins.'
  }
};

export const BUDGET_TIERS_META: Record<BudgetTier, { name: string; costPerDay: string; description: string }> = {
  ultra_budget: {
    name: 'Ultra Budget ($2 - $4 / day)',
    costPerDay: '$2.50 - $4.00',
    description: 'Focuses heavily on dry pulses, eggs, bulk grains, in-season root vegetables, and bulk staples.'
  },
  smart_budget: {
    name: 'Smart Value ($5 - $8 / day)',
    costPerDay: '$5.00 - $8.00',
    description: 'Balanced mix of chicken thighs, canned fish, fresh yogurt, frozen veggies, and whole grains.'
  },
  moderate: {
    name: 'Moderate Balanced ($9 - $14 / day)',
    costPerDay: '$9.00 - $14.00',
    description: 'Includes fresh lean meats, berries, nuts, specialty cheeses, and premium produce.'
  },
  flexible: {
    name: 'Performance / Flexible ($15+ / day)',
    costPerDay: '$15.00+',
    description: 'Unconstrained fresh seafood, prime cuts, organic supplements, and premium prepped goods.'
  }
};

export const EXERCISE_LIBRARY: Exercise[] = [
  // BODYWEIGHT - NO EQUIPMENT
  {
    id: 'ex-pushups',
    name: 'Standard Push-Ups',
    targetMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Front Delts', 'Core'],
    equipment: 'bodyweight_only',
    difficulty: 'beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45,
    instructions: [
      'Place hands slightly wider than shoulder-width on the floor.',
      'Maintain a straight rigid plank line from heels to crown of head.',
      'Lower chest until 2 inches from floor, elbows angled at 45 degrees.',
      'Press firmly through your palms to return to full lockout.'
    ],
    tips: ['Keep core braced tight and glutes squeezed.', 'Drop to knees if full lockout is tough.'],
    caloriesPerMinute: 7,
    videoPlaceholderText: 'Controlled tempo 2s down, 1s explosive up'
  },
  {
    id: 'ex-bodyweight-squats',
    name: 'Air Squats (Prisoner/Hands Front)',
    targetMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    equipment: 'bodyweight_only',
    difficulty: 'beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 15,
    restSeconds: 45,
    instructions: [
      'Stand feet shoulder-width apart, toes flared slightly out.',
      'Hinge hips back and descend as if sitting into a deep chair.',
      'Drive knees out tracking over your 2nd toe; break parallel if mobile.',
      'Drive through mid-foot and heels to stand tall, squeezing glutes at top.'
    ],
    tips: ['Keep chest proud and eyes facing forward.', 'Never let knees cave inward.'],
    caloriesPerMinute: 8
  },
  {
    id: 'ex-glute-bridges',
    name: 'Floor Glute Bridges',
    targetMuscle: 'Glutes',
    secondaryMuscles: ['Hamstrings', 'Lower Back'],
    equipment: 'bodyweight_only',
    difficulty: 'beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 15,
    restSeconds: 30,
    instructions: [
      'Lie flat on your back, knees bent and feet flat on floor hip-width apart.',
      'Push through your heels to lift hips upward toward the ceiling.',
      'Hold a peak 2-second squeeze at top without arching lower back.',
      'Slowly lower back down with control.'
    ],
    tips: ['Drive weight through heels, not toes.', 'Squeeze glutes at top like holding a coin.'],
    caloriesPerMinute: 6
  },
  {
    id: 'ex-plank',
    name: 'Forearm Core Plank',
    targetMuscle: 'Core & Transverse Abdominis',
    secondaryMuscles: ['Shoulders', 'Glutes'],
    equipment: 'bodyweight_only',
    difficulty: 'beginner',
    type: 'time',
    defaultSets: 3,
    defaultDurationSeconds: 45,
    restSeconds: 45,
    instructions: [
      'Rest on forearms with elbows directly under shoulders.',
      'Extend legs back, engaging core, glutes, and quadriceps.',
      'Hold spine neutral like an iron board, neck aligned with spine.',
      'Breathe steadily into your diaphragm.'
    ],
    tips: ['Do not let hips sag or hike into the air.', 'Pull belly button inward.'],
    caloriesPerMinute: 5
  },
  {
    id: 'ex-lunges',
    name: 'Alternating Reverse Lunges',
    targetMuscle: 'Quads & Glutes',
    secondaryMuscles: ['Hamstrings', 'Balance & Calves'],
    equipment: 'bodyweight_only',
    difficulty: 'beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45,
    instructions: [
      'Stand upright with feet together.',
      'Step one leg backward, dropping the back knee toward the floor at a 90° angle.',
      'Front knee stays stacked over front ankle.',
      'Push forcefully off front foot to step back together, then alternate legs.'
    ],
    tips: ['Keep torso tall and proud.', 'Reverse lunges are gentler on knee joints than forward lunges.'],
    caloriesPerMinute: 7.5
  },
  {
    id: 'ex-mountain-climbers',
    name: 'Mountain Climbers (Cardio & Core)',
    targetMuscle: 'Core & Cardiovascular',
    secondaryMuscles: ['Shoulders', 'Hip Flexors'],
    equipment: 'bodyweight_only',
    difficulty: 'intermediate',
    type: 'time',
    defaultSets: 3,
    defaultDurationSeconds: 30,
    restSeconds: 30,
    instructions: [
      'Start in high plank position with hands under shoulders.',
      'Drive one knee quickly toward your chest, keeping hips level.',
      'Quickly switch legs in a running motion while maintaining a stable upper body.'
    ],
    tips: ['Keep hips down; do not bounce excessively.', 'Maintain rhythmic breathing.'],
    caloriesPerMinute: 10
  },
  {
    id: 'ex-chair-dips',
    name: 'Chair / Couch Tricep Dips',
    targetMuscle: 'Triceps',
    secondaryMuscles: ['Anterior Shoulders', 'Chest'],
    equipment: 'chair_bench',
    difficulty: 'beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45,
    instructions: [
      'Sit on the edge of a sturdy chair or couch, grip front edge with hands.',
      'Slide hips off edge with legs bent (or straight for harder challenge).',
      'Lower torso by bending elbows until 90 degrees.',
      'Press through palms to lockout arms.'
    ],
    tips: ['Keep back close to the chair edge.', 'Do not shrug shoulders up into ears.'],
    caloriesPerMinute: 6
  },
  {
    id: 'ex-incline-pushups',
    name: 'Incline Push-Ups (On Bed / Desk / Chair)',
    targetMuscle: 'Chest & Shoulders',
    secondaryMuscles: ['Triceps', 'Core'],
    equipment: 'chair_bench',
    difficulty: 'beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45,
    instructions: [
      'Place hands on sturdy chair or desk, step feet back into incline plank.',
      'Lower chest towards surface with control.',
      'Push back up to full extension.'
    ],
    tips: ['Great for beginners building up to floor push-ups.'],
    caloriesPerMinute: 5.5
  },
  {
    id: 'ex-db-goblet-squat',
    name: 'Dumbbell / Backpack Goblet Squat',
    targetMuscle: 'Quads & Glutes',
    secondaryMuscles: ['Core', 'Upper Back'],
    equipment: 'dumbbells',
    difficulty: 'intermediate',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 60,
    instructions: [
      'Hold a dumbbell vertically (or weighted water bottle/backpack) against your chest.',
      'Squat down between your hips with upright posture.',
      'Drive through heels to stand back up.'
    ],
    tips: ['Elbows should point down between your knees at bottom of squat.'],
    caloriesPerMinute: 8.5
  },
  {
    id: 'ex-db-row',
    name: 'Dumbbell Single-Arm Row (or Weighted Bag)',
    targetMuscle: 'Lats & Upper Back',
    secondaryMuscles: ['Biceps', 'Rear Deltoids'],
    equipment: 'dumbbells',
    difficulty: 'beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45,
    instructions: [
      'Hinge forward at hips with flat back, supporting non-working hand on a chair or knee.',
      'Pull dumbbell towards your hip pocket, driving elbow back.',
      'Squeeze shoulder blade at top, then lower with full stretch.'
    ],
    tips: ['Pull with your back muscles, not just your arm.'],
    caloriesPerMinute: 7
  },
  {
    id: 'ex-band-lat-pulldown',
    name: 'Resistance Band Lat Pulldown / Pull-Apart',
    targetMuscle: 'Upper Back & Posture',
    secondaryMuscles: ['Rear Delts', 'Rhomboids'],
    equipment: 'resistance_bands',
    difficulty: 'beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 15,
    restSeconds: 30,
    instructions: [
      'Hold resistance band overhead with hands shoulder-width apart.',
      'Pull band apart and down towards clavicle while squeezing shoulder blades together.',
      'Control return to overhead starting position.'
    ],
    tips: ['Fantastic for desk workers fixing rounded shoulders.'],
    caloriesPerMinute: 5
  },
  {
    id: 'ex-burpees',
    name: 'High-Energy Burpees',
    targetMuscle: 'Full Body & Cardio',
    secondaryMuscles: ['Chest', 'Quads', 'Core'],
    equipment: 'bodyweight_only',
    difficulty: 'advanced',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 60,
    instructions: [
      'From standing, drop hands to floor and kick feet back into plank.',
      'Perform a push-up (optional for beginner).',
      'Jump feet back in towards hands, then explode upward into a vertical jump with hands high.'
    ],
    tips: ['Land softly on balls of feet.'],
    caloriesPerMinute: 12
  }
];

export const SAMPLE_REGIONAL_RECIPES: Recipe[] = [
  // WEST AFRICAN
  {
    id: 'rec-wa-jollof-beans',
    title: 'High-Protein One-Pot Jollof Black-Eyed Beans',
    cuisine: 'west_african',
    mealType: 'lunch',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    prepTimeMinutes: 10,
    cookTimeMinutes: 30,
    servings: 4,
    estimatedCostPerServing: 1.15,
    totalCost: 4.60,
    calories: 460,
    proteinGrams: 24,
    carbsGrams: 68,
    fatGrams: 8,
    fiberGrams: 14,
    ingredients: [
      { name: 'Dry or Canned Black-Eyed Peas', amount: '2 cans (400g drained)', estimatedCost: 1.80, category: 'protein' },
      { name: 'Brown or Long Grain Rice', amount: '1.5 cups', estimatedCost: 0.60, category: 'grains_pantry' },
      { name: 'Tomato Paste & Canned Crushed Tomatoes', amount: '1 cup blend', estimatedCost: 0.90, category: 'produce' },
      { name: 'Red Onion & Garlic', amount: '1 medium onion, 3 cloves', estimatedCost: 0.50, category: 'produce' },
      { name: 'Curry Powder, Thyme, Bouillon Cube, Ground Pepper', amount: '2 tbsp spice mix', estimatedCost: 0.30, category: 'spices_oils' },
      { name: 'Vegetable/Canola Oil', amount: '1.5 tbsp', estimatedCost: 0.50, category: 'spices_oils' }
    ],
    instructions: [
      'Sauté diced onion and garlic in 1.5 tbsp oil until fragrant (3 mins).',
      'Stir in tomato paste and fry for 4 minutes to remove raw acidity.',
      'Add curry powder, dried thyme, and bouillon cube.',
      'Pour in 2 cups of water or broth, rinsed rice, and drained black-eyed beans.',
      'Cover tightly and simmer on low heat for 25 minutes until rice is fluffy and flavors fuse.'
    ],
    budgetTips: [
      'Buying dry black-eyed peas in 1kg bags drops cost per serving below $0.70.',
      'Add leftover eggs or canned sardines for extra 15g protein at minimal cost.'
    ],
    regionalNotes: 'Popular nutrient powerhouse across Nigeria, Ghana, and Senegal combining complete amino acids from rice and legumes.',
    tags: ['High Protein', 'Budget Friendly', 'Meal Prep Ready', 'High Fiber']
  },
  // MEDITERRANEAN
  {
    id: 'rec-med-chickpea-shakshuka',
    title: 'Savory Chickpea & Egg Skillet Shakshuka',
    cuisine: 'mediterranean',
    mealType: 'breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop&q=80',
    prepTimeMinutes: 8,
    cookTimeMinutes: 18,
    servings: 3,
    estimatedCostPerServing: 1.65,
    totalCost: 4.95,
    calories: 410,
    proteinGrams: 22,
    carbsGrams: 42,
    fatGrams: 16,
    fiberGrams: 10,
    ingredients: [
      { name: 'Whole Eggs', amount: '6 large eggs', estimatedCost: 1.80, category: 'protein' },
      { name: 'Canned Chickpeas', amount: '1 can (400g)', estimatedCost: 0.90, category: 'protein' },
      { name: 'Canned Diced Tomatoes', amount: '1 can (400g)', estimatedCost: 1.00, category: 'produce' },
      { name: 'Bell Pepper & Garlic', amount: '1 pepper, 3 cloves', estimatedCost: 0.80, category: 'produce' },
      { name: 'Ground Cumin, Paprika, Olive Oil', amount: '1 tbsp spice + 1 tbsp oil', estimatedCost: 0.45, category: 'spices_oils' }
    ],
    instructions: [
      'Heat olive oil in wide skillet over medium heat; sauté bell pepper and garlic for 4 mins.',
      'Add cumin, paprika, and canned tomatoes. Simmer 8 mins until sauce thickens.',
      'Stir in drained chickpeas and season with salt and black pepper.',
      'Create 6 small wells in sauce and crack an egg into each.',
      'Cover skillet and simmer on low for 5-6 mins until egg whites are set and yolks remain runny.'
    ],
    budgetTips: [
      'Eggs + Chickpeas provide dual fast/slow digesting proteins for under $2.00.',
      'Serve with crusty whole wheat bread or toasted pita to scoop sauce.'
    ],
    regionalNotes: 'Traditional North African & Mediterranean staple known for high antioxidant lycopene from cooked tomatoes.',
    tags: ['Quick 20-Min', 'Iron Rich', 'Vegetarian High Protein', 'Skillet Meal']
  },
  // LATIN AMERICAN
  {
    id: 'rec-lat-burrito-bowl',
    title: 'Crispy Black Bean & Salsa Quinoa/Rice Bowl',
    cuisine: 'latin_american',
    mealType: 'dinner',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 4,
    estimatedCostPerServing: 1.45,
    totalCost: 5.80,
    calories: 490,
    proteinGrams: 21,
    carbsGrams: 76,
    fatGrams: 10,
    fiberGrams: 16,
    ingredients: [
      { name: 'Black Beans', amount: '2 cans (800g)', estimatedCost: 1.80, category: 'protein' },
      { name: 'Long Grain Brown Rice', amount: '1.5 cups dry', estimatedCost: 0.70, category: 'grains_pantry' },
      { name: 'Frozen Sweet Corn', amount: '1 cup', estimatedCost: 0.60, category: 'produce' },
      { name: 'Fresh Lime, Cilantro & Cumin', amount: '1 lime + bunch', estimatedCost: 0.80, category: 'produce' },
      { name: 'Sunflower Oil & Onion', amount: '1 onion + 1 tbsp oil', estimatedCost: 0.60, category: 'spices_oils' },
      { name: 'Queso Blanco or Hard Cheese', amount: '60g grated', estimatedCost: 1.30, category: 'dairy_alt' }
    ],
    instructions: [
      'Cook brown rice with a pinch of salt and lime zest.',
      'In a skillet, sauté diced onion, cumin, garlic, and add black beans with a splash of water.',
      'Mash roughly 1/3 of the beans with a fork to create a creamy texture while leaving rest whole.',
      'Char frozen sweet corn in dry hot pan for 3 minutes.',
      'Assemble bowls: rice base, seasoned black beans, charred corn, fresh lime squeeze, and cheese garnish.'
    ],
    budgetTips: [
      'Bulk dried black beans reduce cost to $0.40 per portion.',
      'Use frozen corn and store-brand salsa to avoid food waste.'
    ],
    regionalNotes: 'Classic Mesoamerican dietary foundation offering complete protein, resistant starch for gut microbiome, and sustained energy.',
    tags: ['Meal Prep Beast', 'Gluten Free', 'High Fiber', 'Post Workout']
  },
  // EAST ASIAN
  {
    id: 'rec-ea-tofu-egg-stirfry',
    title: 'Ginger Sesame Golden Tofu & Egg Scramble with Rice',
    cuisine: 'east_asian',
    mealType: 'lunch',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    prepTimeMinutes: 8,
    cookTimeMinutes: 10,
    servings: 2,
    estimatedCostPerServing: 1.70,
    totalCost: 3.40,
    calories: 440,
    proteinGrams: 28,
    carbsGrams: 48,
    fatGrams: 14,
    ingredients: [
      { name: 'Firm Tofu', amount: '350g block pressed', estimatedCost: 1.40, category: 'protein' },
      { name: 'Eggs', amount: '3 large', estimatedCost: 0.90, category: 'protein' },
      { name: 'Soy Sauce & Toasted Sesame Oil', amount: '2 tbsp soy, 1 tsp sesame', estimatedCost: 0.35, category: 'spices_oils' },
      { name: 'Green Onions & Fresh Ginger', amount: '2 scallions, 1 thumb ginger', estimatedCost: 0.40, category: 'produce' },
      { name: 'Cooked Steamed Rice', amount: '2 cups', estimatedCost: 0.35, category: 'grains_pantry' }
    ],
    instructions: [
      'Crumble pressed firm tofu into rustic bite-sized curds.',
      'Heat 1 tbsp oil in a wok or skillet over high heat. Add grated ginger and white parts of scallions.',
      'Add tofu and sear until golden and slightly crispy on edges (5 mins).',
      'Whisk eggs with 1 tbsp soy sauce; pour directly into pan, gently folding into the tofu until soft curds form.',
      'Drizzle with sesame oil and sliced scallion greens. Serve hot over steamed rice.'
    ],
    budgetTips: ['Tofu + Egg combination gives nearly 30g of fast-absorbing protein at 1/3 the cost of steak or salmon.'],
    regionalNotes: 'Fast, homestyle Cantonese & Japanese comfort food loaded with isoflavones and micronutrients.',
    tags: ['Ultra Fast 15-Min', 'High Protein', 'Cheap Eats', 'Vegetarian']
  },
  // SOUTH ASIAN
  {
    id: 'rec-sa-tadka-dal',
    title: 'Golden Turmeric Red Lentil Tadka Dal with Roti',
    cuisine: 'south_asian',
    mealType: 'dinner',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    prepTimeMinutes: 5,
    cookTimeMinutes: 20,
    servings: 4,
    estimatedCostPerServing: 0.95,
    totalCost: 3.80,
    calories: 420,
    proteinGrams: 20,
    carbsGrams: 64,
    fatGrams: 8,
    ingredients: [
      { name: 'Red Split Lentils (Masoor Dal)', amount: '1.5 cups dry', estimatedCost: 1.20, category: 'protein' },
      { name: 'Whole Wheat Flour (Atta) for Roti', amount: '1.5 cups', estimatedCost: 0.50, category: 'grains_pantry' },
      { name: 'Turmeric, Mustard Seeds, Cumin Seeds', amount: '1 tbsp total', estimatedCost: 0.30, category: 'spices_oils' },
      { name: 'Garlic, Ginger & Green Chili', amount: '3 cloves, 1 inch ginger', estimatedCost: 0.50, category: 'produce' },
      { name: 'Ghee or Vegetable Oil', amount: '1 tbsp', estimatedCost: 0.40, category: 'spices_oils' },
      { name: 'Canned Tomato or Fresh', amount: '1 medium', estimatedCost: 0.40, category: 'produce' }
    ],
    instructions: [
      'Rinse red lentils and boil with 3.5 cups water, 1/2 tsp turmeric, and salt for 15 minutes until soft and creamy.',
      'In a small separate pan, heat ghee/oil (the Tadka tempering). Add cumin seeds, mustard seeds, sliced garlic, and ginger until sizzling.',
      'Pour sizzling spiced oil directly into the simmering dal (hear the sizzle!).',
      'Mix wheat flour with warm water, knead into soft dough, roll flat discs and dry-toast in hot pan 1 min each side until puffed.',
      'Serve warm dal with fresh rotis.'
    ],
    budgetTips: ['One of the lowest cost-per-gram protein meals on Earth (under $1.00 per hearty dinner).'],
    regionalNotes: 'Time-tested Ayurvedic staple known for anti-inflammatory curcumin absorption and soothing digestion.',
    tags: ['Under $1 Meal', 'Pure Comfort', 'High Protein', 'Vegan']
  },
  // NORTH AMERICAN
  {
    id: 'rec-na-power-oats',
    title: 'High-Protein Peanut Butter & Berry Rolled Oats Bowl',
    cuisine: 'north_american',
    mealType: 'breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&auto=format&fit=crop&q=80',
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    servings: 1,
    estimatedCostPerServing: 0.85,
    totalCost: 0.85,
    calories: 450,
    proteinGrams: 25,
    carbsGrams: 58,
    fatGrams: 14,
    fiberGrams: 9,
    ingredients: [
      { name: 'Rolled Oats', amount: '1 cup', estimatedCost: 0.25, category: 'grains_pantry' },
      { name: 'Natural Peanut Butter', amount: '2 tbsp', estimatedCost: 0.30, category: 'protein' },
      { name: 'Milk or Soy Milk', amount: '1 cup', estimatedCost: 0.20, category: 'dairy_alt' },
      { name: 'Frozen Berries or Sliced Banana', amount: '1/2 cup', estimatedCost: 0.10, category: 'produce' }
    ],
    instructions: [
      'Simmer rolled oats with milk and a pinch of salt for 4 minutes until thick and creamy.',
      'Stir in peanut butter while hot so it melts evenly throughout.',
      'Top with thawed berries and a pinch of cinnamon.'
    ],
    budgetTips: ['Buy store-brand 1kg tubs of oats and peanut butter for huge savings.'],
    regionalNotes: 'Classic high-energy morning fuel packed with complex carbs and healthy fats.',
    tags: ['5-Minute Prep', 'High Protein', 'Under $1', 'Vegetarian']
  }
];

// CULINARY IMAGE CATALOG & HELPER
export const MEAL_IMAGE_CATALOG: Record<string, string> = {
  breakfast_oats: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&auto=format&fit=crop&q=80',
  breakfast_eggs: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
  breakfast_shakshuka: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop&q=80',
  breakfast_smoothie: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80',
  lunch_bowl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
  lunch_stirfry: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
  lunch_salad: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80',
  lunch_rice_beans: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
  dinner_curry: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
  dinner_salmon: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80',
  dinner_chicken: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&auto=format&fit=crop&q=80',
  dinner_stew: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80'
};

export function getMealImageUrl(recipe: Partial<Recipe> | undefined): string {
  if (!recipe) return MEAL_IMAGE_CATALOG.lunch_bowl;
  if (recipe.imageUrl && recipe.imageUrl.startsWith('http')) {
    return recipe.imageUrl;
  }

  const titleLower = (recipe.title || '').toLowerCase();
  const mealType = recipe.mealType || 'lunch';

  if (titleLower.includes('shakshuka')) return MEAL_IMAGE_CATALOG.breakfast_shakshuka;
  if (titleLower.includes('oat') || titleLower.includes('porridge')) return MEAL_IMAGE_CATALOG.breakfast_oats;
  if (titleLower.includes('egg') || titleLower.includes('toast')) return MEAL_IMAGE_CATALOG.breakfast_eggs;
  if (titleLower.includes('smoothie')) return MEAL_IMAGE_CATALOG.breakfast_smoothie;
  if (titleLower.includes('tofu') || titleLower.includes('stir-fry') || titleLower.includes('noodle')) return MEAL_IMAGE_CATALOG.lunch_stirfry;
  if (titleLower.includes('jollof') || titleLower.includes('bean') || titleLower.includes('rice')) return MEAL_IMAGE_CATALOG.lunch_rice_beans;
  if (titleLower.includes('dal') || titleLower.includes('curry') || titleLower.includes('lentil')) return MEAL_IMAGE_CATALOG.dinner_curry;
  if (titleLower.includes('salmon') || titleLower.includes('fish') || titleLower.includes('tuna')) return MEAL_IMAGE_CATALOG.dinner_salmon;
  if (titleLower.includes('chicken') || titleLower.includes('turkey')) return MEAL_IMAGE_CATALOG.dinner_chicken;
  if (titleLower.includes('stew') || titleLower.includes('soup')) return MEAL_IMAGE_CATALOG.dinner_stew;
  if (titleLower.includes('salad') || titleLower.includes('greek')) return MEAL_IMAGE_CATALOG.lunch_salad;

  if (mealType === 'breakfast') return MEAL_IMAGE_CATALOG.breakfast_eggs;
  if (mealType === 'dinner') return MEAL_IMAGE_CATALOG.dinner_stew;
  return MEAL_IMAGE_CATALOG.lunch_bowl;
}

// DAILY WORKOUT MOTIVATIONAL PHRASES FOR TRAINING KICKOFF
export interface WorkoutMotivationQuote {
  id: string;
  quote: string;
  author: string;
  category: 'strength' | 'discipline' | 'resilience' | 'energy' | 'mindset';
  sparkIcon: string;
}

export const DAILY_WORKOUT_MOTIVATIONS: WorkoutMotivationQuote[] = [
  {
    id: 'mot-1',
    quote: '⚡ The body achieves what the mind believes. Give every single rep your total focus!',
    author: 'Athletic Mindset',
    category: 'mindset',
    sparkIcon: '🔥'
  },
  {
    id: 'mot-2',
    quote: '💪 Small daily disciplines repeated consistently build unbreakable strength.',
    author: 'Consistency Law',
    category: 'discipline',
    sparkIcon: '🏆'
  },
  {
    id: 'mot-3',
    quote: '🚀 You don’t have to be extreme, you just have to show up. Step up and crush this workout!',
    author: 'Coach Principle',
    category: 'energy',
    sparkIcon: '⚡'
  },
  {
    id: 'mot-4',
    quote: '🛡️ Today’s effort is tomorrow’s power. Breathe deep, stay in control, and win today.',
    author: 'Spartan Wisdom',
    category: 'strength',
    sparkIcon: '🛡️'
  },
  {
    id: 'mot-5',
    quote: '🌟 Your future self is watching your effort right now. Make them proud with this set!',
    author: 'Daily Momentum',
    category: 'resilience',
    sparkIcon: '✨'
  },
  {
    id: 'mot-6',
    quote: '🔥 Action creates motivation, not the other way around. Let’s ignite your workout energy!',
    author: 'Biokinetic Focus',
    category: 'energy',
    sparkIcon: '💥'
  },
  {
    id: 'mot-7',
    quote: '👑 The only bad workout is the one that didn’t happen. You made it here — now own it!',
    author: 'Champion Drive',
    category: 'strength',
    sparkIcon: '👑'
  }
];

export function getDailyWorkoutMotivation(dayNumber?: number): WorkoutMotivationQuote {
  if (dayNumber !== undefined && dayNumber > 0) {
    const idx = (dayNumber - 1) % DAILY_WORKOUT_MOTIVATIONS.length;
    return DAILY_WORKOUT_MOTIVATIONS[idx];
  }
  const dayOfWeek = new Date().getDay(); // 0 to 6
  return DAILY_WORKOUT_MOTIVATIONS[dayOfWeek % DAILY_WORKOUT_MOTIVATIONS.length];
}

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user-default-1',
  name: 'Fitness Champion',
  age: 28,
  gender: 'female',
  heightCm: 172,
  weightKg: 68,
  targetWeightKg: 64,
  activityLevel: 'moderately_active',
  fitnessGoal: 'weight_loss',
  fitnessLevel: 'beginner',
  availableEquipment: ['bodyweight_only', 'chair_bench'],
  timePerWorkoutMinutes: 25,
  workoutDaysPerWeek: 4,
  geographicRegion: 'mediterranean',
  monthlyFoodBudgetUSD: 180,
  budgetTier: 'smart_budget',
  dietaryRestrictions: [],
  dailyCalorieTarget: 1950,
  dailyProteinTarget: 125,
  dailyCarbsTarget: 210,
  dailyFatTarget: 65,
  subscription: {
    plan: 'free',
    status: 'trial',
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    autoRenew: false,
    pricePaid: 0,
    billingCycle: 'free'
  }
};

// OFFLINE FALLBACK WORKOUT ROADMAP GENERATOR
export function generateLocalWorkoutRoadmap(
  goal: FitnessGoal,
  level: FitnessLevel,
  equipment: EquipmentType[],
  daysPerWeek: number,
  minutesPerSession: number
): WorkoutRoadmap {
  const matchingExercises = EXERCISE_LIBRARY.filter(ex => 
    equipment.includes(ex.equipment) || ex.equipment === 'bodyweight_only'
  );

  const days: WorkoutRoadmap['schedule'] = [];
  const splits = [
    { name: 'Lower Body & Core Strength', focus: 'Legs, Glutes & Abs' },
    { name: 'Upper Body & Posture Push-Pull', focus: 'Chest, Arms & Back' },
    { name: 'Full-Body Metabolic Circuit', focus: 'High-Energy Calorie Burn' },
    { name: 'Core Sculpt & Active Mobility', focus: 'Functional Core & Recovery' },
    { name: 'Dynamic Strength & Endurance', focus: 'Muscular Stamina' },
    { name: 'Total Body HIIT Power', focus: 'High Intensity Intervals' },
    { name: 'Rest & Guided Stretch', focus: 'Mobility & Muscle Restoration' }
  ];

  for (let i = 1; i <= daysPerWeek; i++) {
    const splitInfo = splits[(i - 1) % splits.length];
    
    // Pick 4-6 exercises matching session duration
    const count = minutesPerSession <= 15 ? 3 : minutesPerSession <= 30 ? 5 : 6;
    const shuffled = [...matchingExercises].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    days.push({
      id: `day-${i}`,
      dayNumber: i,
      dayName: `Day ${i}: ${splitInfo.name}`,
      focus: splitInfo.focus,
      estimatedMinutes: minutesPerSession,
      estimatedCaloriesBurn: Math.round(minutesPerSession * (level === 'advanced' ? 9.5 : level === 'intermediate' ? 8 : 6.5)),
      equipmentNeeded: equipment.length > 0 ? equipment : ['bodyweight_only'],
      exercises: selected.map(ex => ({
        exercise: ex,
        sets: level === 'advanced' ? 4 : 3,
        reps: ex.type === 'reps' ? (level === 'beginner' ? 10 : level === 'intermediate' ? 14 : 18) : undefined,
        durationSeconds: ex.type === 'time' ? (level === 'beginner' ? 30 : level === 'intermediate' ? 45 : 60) : undefined,
        restSeconds: level === 'beginner' ? 45 : 30,
        notes: `Maintain strict posture. ${ex.tips[0] || 'Breathe steadily.'}`
      }))
    });
  }

  return {
    id: `roadmap-${Date.now()}`,
    title: `${goal.replace('_', ' ').toUpperCase()} Home Roadmap (${equipment.includes('dumbbells') ? 'Equipped' : 'Zero Equipment'})`,
    description: `Structured ${daysPerWeek}-day progressive routine optimized for ${minutesPerSession} min workouts in home space.`,
    goal,
    level,
    equipment,
    daysPerWeek,
    minutesPerSession,
    weeksTotal: 4,
    currentWeek: 1,
    schedule: days,
    generatedByAI: false
  };
}

// OFFLINE FALLBACK MEAL PLAN GENERATOR
export function generateLocalMealPlan(
  region: GeographicRegion,
  budgetTier: BudgetTier,
  calorieTarget: number
): WeeklyMealPlan {
  const regionRecipes = SAMPLE_REGIONAL_RECIPES.filter(r => r.cuisine === region);
  const baseRecipe = regionRecipes.length > 0 ? regionRecipes[0] : SAMPLE_REGIONAL_RECIPES[0];
  const secondRecipe = SAMPLE_REGIONAL_RECIPES[1] || baseRecipe;
  const thirdRecipe = SAMPLE_REGIONAL_RECIPES[2] || baseRecipe;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dailyPlans = daysOfWeek.map((dayName, idx) => {
    const b = idx % 2 === 0 ? baseRecipe : secondRecipe;
    const l = idx % 3 === 0 ? secondRecipe : thirdRecipe;
    const d = baseRecipe;
    const dailyCost = b.estimatedCostPerServing + l.estimatedCostPerServing + d.estimatedCostPerServing;

    return {
      id: `day-plan-${idx}`,
      dayName,
      totalCalories: calorieTarget,
      totalProtein: Math.round(calorieTarget * 0.25 / 4), // 25% protein
      totalCarbs: Math.round(calorieTarget * 0.50 / 4), // 50% carbs
      totalFat: Math.round(calorieTarget * 0.25 / 9), // 25% fat
      estimatedDailyCost: Math.round(dailyCost * 100) / 100,
      breakfast: { ...b, mealType: 'breakfast' as const },
      lunch: { ...l, mealType: 'lunch' as const },
      dinner: { ...d, mealType: 'dinner' as const }
    };
  });

  const weeklyBudget = dailyPlans.reduce((acc, d) => acc + d.estimatedDailyCost, 0);

  return {
    id: `mealplan-${Date.now()}`,
    title: `${REGIONS_META[region].name} Budget Meal Plan`,
    targetRegion: region,
    budgetTier,
    targetDailyCalories: calorieTarget,
    estimatedWeeklyBudget: Math.round(weeklyBudget * 100) / 100,
    currency: '$',
    days: dailyPlans,
    shoppingList: [
      {
        category: 'Grains & Pantry Staples',
        items: [
          { name: 'Brown Rice / Whole Grains (2kg bag)', amount: '2 kg', estimatedCost: 3.50, checked: false },
          { name: 'Dry Lentils & Black Beans', amount: '1.5 kg', estimatedCost: 2.80, checked: false },
          { name: 'Rolled Oats (1kg)', amount: '1 kg', estimatedCost: 1.90, checked: false }
        ]
      },
      {
        category: 'Proteins & Dairy / Alternatives',
        items: [
          { name: 'Fresh Eggs (Large)', amount: '2 dozen', estimatedCost: 5.40, checked: false },
          { name: 'Canned Tuna / Sardines', amount: '4 cans', estimatedCost: 3.80, checked: false },
          { name: 'Firm Tofu / Cottage Cheese', amount: '2 packs', estimatedCost: 3.20, checked: false }
        ]
      },
      {
        category: 'Fresh & Frozen Produce',
        items: [
          { name: 'Yellow Onions & Garlic', amount: '1 bag', estimatedCost: 1.80, checked: false },
          { name: 'Seasonal Greens / Frozen Spinach', amount: '2 bags', estimatedCost: 2.50, checked: false },
          { name: 'Carrots & Sweet Potatoes', amount: '1.5 kg', estimatedCost: 2.20, checked: false }
        ]
      }
    ]
  };
}
