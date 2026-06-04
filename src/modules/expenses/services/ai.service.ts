import { GoogleGenAI, Type, Schema } from '@google/genai';

// Instanciar el cliente usando la nueva SDK
// Asegurarse de tener configurada la variable GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const pdfExtractionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    period_month: {
      type: Type.INTEGER,
      description: 'El mes de la liquidación como número (1 = Enero, 12 = Diciembre)'
    },
    period_year: {
      type: Type.INTEGER,
      description: 'El año de la liquidación, ej: 2026'
    },
    total_expenses: {
      type: Type.NUMBER,
      description: 'El total final de las expensas a cobrar o gastadas'
    },
    ordinary_expenses: {
      type: Type.NUMBER,
      description: 'El subtotal de gastos ordinarios (si aplica, sino dejar null)'
    },
    extraordinary_expenses: {
      type: Type.NUMBER,
      description: 'El subtotal de gastos extraordinarios (si aplica, sino dejar null)'
    },
    reserve_fund: {
      type: Type.NUMBER,
      description: 'El monto total del fondo de reserva en pesos (suma de todos los fondos en ARS, si aplica)'
    },
    reserve_funds_detail: {
      type: Type.OBJECT,
      description: 'Detalle de los fondos de reserva por moneda/tipo',
      properties: {
        ars: {
          type: Type.OBJECT,
          description: 'Fondo de Reserva en Pesos',
          properties: {
            balance_prev: { type: Type.NUMBER, description: 'Saldo anterior en pesos' },
            movements: { type: Type.NUMBER, description: 'Ingresos/egresos del mes en pesos (positivo si ingreso, negativo si egreso)' },
            balance_final: { type: Type.NUMBER, description: 'Saldo final en pesos' }
          }
        },
        usd: {
          type: Type.OBJECT,
          description: 'Fondo de Reserva en D\u00f3lares',
          properties: {
            balance_prev: { type: Type.NUMBER, description: 'Saldo anterior en d\u00f3lares' },
            movements: { type: Type.NUMBER, description: 'Variaci\u00f3n del mes en d\u00f3lares' },
            balance_final: { type: Type.NUMBER, description: 'Saldo final en d\u00f3lares' }
          }
        },
        fci: {
          type: Type.OBJECT,
          description: 'Fondo Com\u00fan de Inversi\u00f3n',
          properties: {
            balance_prev: { type: Type.NUMBER, description: 'Saldo anterior del FCI en pesos' },
            interests: { type: Type.NUMBER, description: 'Intereses generados en el mes' },
            balance_final: { type: Type.NUMBER, description: 'Saldo final del FCI en pesos' }
          }
        }
      }
    },
    categories: {
      type: Type.ARRAY,
      description: 'Un desglose por grandes categorías de los gastos (ej: Sueldos, Energía, Mantenimiento)',
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: 'Nombre de la categoría de gasto'
          },
          amount: {
            type: Type.NUMBER,
            description: 'El monto total gastado en esta categoría'
          }
        },
        required: ['name', 'amount']
      }
    }
  },
  required: ['period_month', 'period_year', 'total_expenses', 'categories']
};

export const aiService = {
  /**
   * Toma un archivo PDF en formato base64 y utiliza Gemini 1.5 Flash 
   * para extraer estructuradamente la información de las expensas.
   */
  async extractExpensesFromPdf(base64Pdf: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: base64Pdf,
                  mimeType: 'application/pdf',
                }
              },
              {
                text: 'Eres un administrador de consorcios experto. Analiza este documento PDF de expensas (liquidación mensual) y extrae todos los datos financieros solicitados con suma precisión. Agrupa los gastos individuales en grandes categorías (Sueldos, Servicios, Limpieza, Mantenimiento, Seguros, etc).'
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: pdfExtractionSchema,
          temperature: 0.1, // Baja temperatura para mayor precisión y menor creatividad
        }
      });

      if (!response.text) throw new Error('No se pudo extraer el texto de la IA');
      
      const jsonResponse = JSON.parse(response.text);
      return jsonResponse;
      
    } catch (error) {
      console.error('Error al procesar PDF con Gemini:', error);
      throw new Error('Fallo en la lectura inteligente del PDF.');
    }
  },

  /**
   * Genera una explicación humana analizando la diferencia entre dos períodos
   */
  async generateInsights(currentPeriod: any, previousPeriod: any) {
    try {
      const prompt = `
        Sos el sistema de IA del edificio. Redacta un mensaje de "IA Insights" súper corto y directo (máximo 4 oraciones) 
        explicando a los vecinos por qué las expensas de este mes fueron $${currentPeriod.total_expenses} 
        frente a los $${previousPeriod.total_expenses} del mes anterior.

        Categorías de este mes: ${JSON.stringify(currentPeriod.categories)}
        Categorías del mes anterior: ${JSON.stringify(previousPeriod.categories)}

        Calculá la variación porcentual y mencioná directamente cuáles fueron las 2 categorías que más aumentaron o bajaron.
        Mantené un tono profesional pero amable.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      return response.text;
    } catch (error) {
      console.error('Error al generar insights con Gemini:', error);
      return 'No se pudo generar el análisis automático este mes.';
    }
  }
};
