import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString() 
  });
});

// Endpoint: AI Workout Roadmap Generator
app.post('/api/generate-workout-roadmap', async (req, res) => {
  try {
    const { goal, level, equipment, daysPerWeek, minutesPerSession, limitations } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.status(503).json({ 
        error: 'Gemini API is not configured on server. Switching to local offline generator.' 
      });
    }

    const prompt = `
      Create a detailed ${daysPerWeek}-day home fitness workout roadmap for a ${level} level person.
      Goal: ${goal}
      Available Equipment: ${Array.isArray(equipment) && equipment.length > 0 ? equipment.join(', ') : 'Bodyweight only (no equipment)'}
      Target Duration per Session: ${minutesPerSession} minutes
      Physical limitations / injury concerns: ${limitations || 'None'}

      Generate a comprehensive 7-day schedule where ${daysPerWeek} days are active workouts and the remainder are active recovery/rest.
      For each workout day, include:
      - dayName (e.g. "Day 1: Lower Body Power & Core")
      - focus (e.g. "Quadriceps, Glutes, Transverse Abdominis")
      - estimatedMinutes (${minutesPerSession})
      - estimatedCaloriesBurn
      - exercises array: 4-6 exercises with:
        - name
        - targetMuscle
        - equipment ('bodyweight_only', 'dumbbells', 'resistance_bands', 'chair_bench', etc.)
        - type ('reps' or 'time')
        - sets (e.g. 3)
        - reps (if reps, e.g. 12)
        - durationSeconds (if time, e.g. 45)
        - restSeconds (e.g. 45)
        - instructions (array of 3-4 bullet steps)
        - tips (array of 1-2 form advice)
        - caloriesPerMinute (e.g. 7.5)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite certified strength & conditioning specialist and biomechanics coach. Provide structured, safe, progressive home workout routines tailored strictly to user equipment and time constraints.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            goal: { type: Type.STRING },
            level: { type: Type.STRING },
            daysPerWeek: { type: Type.INTEGER },
            minutesPerSession: { type: Type.INTEGER },
            weeksTotal: { type: Type.INTEGER },
            currentWeek: { type: Type.INTEGER },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  dayNumber: { type: Type.INTEGER },
                  dayName: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  estimatedMinutes: { type: Type.INTEGER },
                  estimatedCaloriesBurn: { type: Type.INTEGER },
                  equipmentNeeded: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        exercise: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            targetMuscle: { type: Type.STRING },
                            equipment: { type: Type.STRING },
                            difficulty: { type: Type.STRING },
                            type: { type: Type.STRING },
                            defaultSets: { type: Type.INTEGER },
                            defaultReps: { type: Type.INTEGER },
                            defaultDurationSeconds: { type: Type.INTEGER },
                            restSeconds: { type: Type.INTEGER },
                            instructions: {
                              type: Type.ARRAY,
                              items: { type: Type.STRING }
                            },
                            tips: {
                              type: Type.ARRAY,
                              items: { type: Type.STRING }
                            },
                            caloriesPerMinute: { type: Type.NUMBER }
                          },
                          required: ['id', 'name', 'targetMuscle', 'equipment', 'instructions', 'tips']
                        },
                        sets: { type: Type.INTEGER },
                        reps: { type: Type.INTEGER },
                        durationSeconds: { type: Type.INTEGER },
                        restSeconds: { type: Type.INTEGER },
                        notes: { type: Type.STRING }
                      },
                      required: ['exercise', 'sets', 'restSeconds']
                    }
                  }
                },
                required: ['id', 'dayNumber', 'dayName', 'focus', 'estimatedMinutes', 'exercises']
              }
            }
          },
          required: ['title', 'description', 'schedule']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.id = `roadmap-${Date.now()}`;
    parsed.generatedByAI = true;
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating workout roadmap:', error);
    res.status(500).json({ error: error.message || 'Failed to generate workout roadmap' });
  }
});

// Endpoint: AI Budget & Regional Nutrition Plan Generator
app.post('/api/generate-meal-plan', async (req, res) => {
  try {
    const { 
      region, 
      budgetTier, 
      customDailyBudgetUSD, 
      calorieTarget, 
      dietaryRestrictions, 
      goal, 
      availablePantry 
    } = req.body;
    
    const ai = getAiClient();

    if (!ai) {
      return res.status(503).json({ 
        error: 'Gemini API is not configured on server. Switching to local offline generator.' 
      });
    }

    const prompt = `
      Create a 7-day budget-optimized nutrition meal plan tailored specifically to the ${region} culinary region.
      Budget Constraint: ${budgetTier} (approx $${customDailyBudgetUSD || 5}/day total).
      Target Daily Calories: ${calorieTarget} kcal.
      Dietary Preferences / Restrictions: ${dietaryRestrictions?.length ? dietaryRestrictions.join(', ') : 'None'}.
      Fitness Goal: ${goal}.
      Pantry items to prioritize if possible: ${availablePantry || 'Standard regional staples'}.

      For the region (${region}), leverage authentic local low-cost staples:
      - West African: beans (black-eyed peas), local greens, plantains, rice, eggs, canned fish, groundnuts.
      - Mediterranean: lentils, chickpeas, eggs, canned tuna/sardines, olive oil, seasonal vegetables, yogurt.
      - East Asian: tofu, eggs, cabbage, edamame, rice/noodles, ginger, soy, chicken thighs.
      - Latin American: black/pinto beans, corn tortillas, rice, eggs, salsa, cabbage.
      - South Asian: yellow/red lentils (dal), chana, whole wheat roti/atta, eggs, curd/yogurt, seasonal veggies.
      - North American: oats, peanut butter, canned tuna, cottage cheese, eggs, brown rice, frozen veggies.

      Calculate realistic costs per serving ($0.80 - $2.50 per meal).
      Provide:
      - title
      - targetRegion
      - budgetTier
      - targetDailyCalories
      - estimatedWeeklyBudget
      - currency ('$')
      - days array (7 days: Monday to Sunday) with breakfast, lunch, dinner recipes (including ingredients with costs, instructions, macros, budgetTips).
      - shoppingList grouped by category with estimated grocery costs.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert sports nutritionist and culinary budget strategist. You excel at creating appetizing, culturally authentic, high-protein, nutrient-dense meals on strict household budgets.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            targetRegion: { type: Type.STRING },
            budgetTier: { type: Type.STRING },
            targetDailyCalories: { type: Type.INTEGER },
            estimatedWeeklyBudget: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  dayName: { type: Type.STRING },
                  totalCalories: { type: Type.INTEGER },
                  totalProtein: { type: Type.INTEGER },
                  totalCarbs: { type: Type.INTEGER },
                  totalFat: { type: Type.INTEGER },
                  estimatedDailyCost: { type: Type.NUMBER },
                  breakfast: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      cuisine: { type: Type.STRING },
                      mealType: { type: Type.STRING },
                      prepTimeMinutes: { type: Type.INTEGER },
                      cookTimeMinutes: { type: Type.INTEGER },
                      servings: { type: Type.INTEGER },
                      estimatedCostPerServing: { type: Type.NUMBER },
                      totalCost: { type: Type.NUMBER },
                      calories: { type: Type.INTEGER },
                      proteinGrams: { type: Type.INTEGER },
                      carbsGrams: { type: Type.INTEGER },
                      fatGrams: { type: Type.INTEGER },
                      ingredients: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            amount: { type: Type.STRING },
                            estimatedCost: { type: Type.NUMBER },
                            category: { type: Type.STRING }
                          },
                          required: ['name', 'amount', 'estimatedCost']
                        }
                      },
                      instructions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      budgetTips: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      regionalNotes: { type: Type.STRING }
                    },
                    required: ['title', 'calories', 'proteinGrams', 'ingredients', 'instructions']
                  },
                  lunch: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      cuisine: { type: Type.STRING },
                      mealType: { type: Type.STRING },
                      prepTimeMinutes: { type: Type.INTEGER },
                      cookTimeMinutes: { type: Type.INTEGER },
                      servings: { type: Type.INTEGER },
                      estimatedCostPerServing: { type: Type.NUMBER },
                      totalCost: { type: Type.NUMBER },
                      calories: { type: Type.INTEGER },
                      proteinGrams: { type: Type.INTEGER },
                      carbsGrams: { type: Type.INTEGER },
                      fatGrams: { type: Type.INTEGER },
                      ingredients: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            amount: { type: Type.STRING },
                            estimatedCost: { type: Type.NUMBER },
                            category: { type: Type.STRING }
                          },
                          required: ['name', 'amount', 'estimatedCost']
                        }
                      },
                      instructions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      budgetTips: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      regionalNotes: { type: Type.STRING }
                    },
                    required: ['title', 'calories', 'proteinGrams', 'ingredients', 'instructions']
                  },
                  dinner: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      cuisine: { type: Type.STRING },
                      mealType: { type: Type.STRING },
                      prepTimeMinutes: { type: Type.INTEGER },
                      cookTimeMinutes: { type: Type.INTEGER },
                      servings: { type: Type.INTEGER },
                      estimatedCostPerServing: { type: Type.NUMBER },
                      totalCost: { type: Type.NUMBER },
                      calories: { type: Type.INTEGER },
                      proteinGrams: { type: Type.INTEGER },
                      carbsGrams: { type: Type.INTEGER },
                      fatGrams: { type: Type.INTEGER },
                      ingredients: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            amount: { type: Type.STRING },
                            estimatedCost: { type: Type.NUMBER },
                            category: { type: Type.STRING }
                          },
                          required: ['name', 'amount', 'estimatedCost']
                        }
                      },
                      instructions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      budgetTips: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      regionalNotes: { type: Type.STRING }
                    },
                    required: ['title', 'calories', 'proteinGrams', 'ingredients', 'instructions']
                  }
                },
                required: ['dayName', 'totalCalories', 'totalProtein', 'breakfast', 'lunch', 'dinner']
              }
            },
            shoppingList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        amount: { type: Type.STRING },
                        estimatedCost: { type: Type.NUMBER }
                      },
                      required: ['name', 'amount', 'estimatedCost']
                    }
                  }
                },
                required: ['category', 'items']
              }
            }
          },
          required: ['title', 'targetRegion', 'targetDailyCalories', 'days', 'shoppingList']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.id = `mealplan-${Date.now()}`;
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ error: error.message || 'Failed to generate meal plan' });
  }
});

// Endpoint: AI Nutrition & Fitness Coach Advisor
app.post('/api/nutrition-coach', async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        reply: "You're currently in Offline Mode. For high-protein budget meals, prioritize dry eggs, black-eyed peas, lentils, canned tuna, and oats. For workouts, focus on progressive air squats, push-ups, and chair dips!",
        offlineFallback: true
      });
    }

    const systemPrompt = `
      You are 'FitCoach AI', a compassionate, world-class personal fitness trainer and budget nutrition strategist.
      User Profile Context:
      - Goal: ${userContext?.fitnessGoal || 'general health & fitness'}
      - Region: ${userContext?.geographicRegion || 'Global'}
      - Daily Food Budget: $${userContext?.monthlyFoodBudgetUSD ? Math.round(userContext.monthlyFoodBudgetUSD / 30) : 5}/day (${userContext?.budgetTier || 'smart_budget'})
      - Calorie Target: ${userContext?.dailyCalorieTarget || 2000} kcal (Protein: ${userContext?.dailyProteinTarget || 120}g)
      - Available Equipment: ${userContext?.availableEquipment?.join(', ') || 'No equipment / Bodyweight'}
      - Time per workout: ${userContext?.timePerWorkoutMinutes || 25} minutes

      Guidelines:
      1. Give actionable, hyper-practical advice on cooking tasty, high-protein meals on a strict budget according to their local geographic region.
      2. Suggest substitutions for ingredients that might be expensive or hard to find in their region.
      3. For workouts, provide clear form tips, bodyweight progressions, and alternatives if they have no equipment or physical limitations.
      4. Keep answers motivating, structured with bullet points, concise and easy to read on mobile.
    `;

    // Construct conversation history for Gemini
    const lastUserMessage = messages[messages.length - 1]?.text || 'Hello coach';
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: lastUserMessage,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in coach advisor:', error);
    res.status(500).json({ error: error.message || 'Failed to get coach response' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitRegion Server running on port ${PORT}`);
  });
}

startServer();
