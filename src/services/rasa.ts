import axios, { AxiosInstance } from 'axios';

// Configuración del servidor Rasa
const RASA_SERVER_URL = 'https://glowing-halibut-wrv9vww6j9vvfgrvr-5005.app.github.dev/';

// Tipo de respuesta de Rasa
export interface RasaResponse {
    recipient_id: string;
    text?: string;
    buttons?: Array<{
        title: string;
        payload: string;
    }>;
    image?: string;
}

class RasaService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: RASA_SERVER_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    //Envía un mensaje a Rasa y obtiene la respuesta
    async sendMessage(message: string): Promise<string[]> {
        try {
            const response = await this.axiosInstance.post<RasaResponse[]>(
                '/webhooks/rest/webhook',
                {
                    message: message,
                }
            );

            // Procesar las respuestas
            const botMessages = this.processResponse(response.data);
            return botMessages;
        } catch (error: any) {
            console.error('Error conectando con Rasa:', error.message);
            throw new Error(
                `No se pudo conectar con el asistente: ${error.message}`
            );
        }
    }

    //Procesa la respuesta de Rasa
    private processResponse(responses: RasaResponse[]): string[] {
        const messages: string[] = [];

        responses.forEach((response) => {
            // Agregar texto si existe
            if (response.text) {
                messages.push(response.text);
            }

            // Procesar botones si existen
            if (response.buttons && response.buttons.length > 0) {
                const buttonText = response.buttons
                    .map((btn) => `• ${btn.title}`)
                    .join('\n');
                messages.push(`Opciones:\n${buttonText}`);
            }

            // Procesar imagen si existe
            if (response.image) {
                messages.push(`[Imagen: ${response.image}]`);
            }
        });

        return messages.length > 0
            ? messages
            : ['No entiendo tu mensaje. ¿Puedes intentar de nuevo?'];
    }

    //Obtiene el estado de la conexión con Rasa
    async checkConnection(): Promise<boolean> {
        try {
            const response = await this.axiosInstance.get('/status');
            return response.status === 200;
        } catch (error) {
            console.error('Rasa no está disponible:', error);
            return false;
        }
    }

    //Reinicia la conversación
    resetConversation(): void {

    }
}

// Instancia única del servicio
const rasaService = new RasaService();

export async function sendMessageToRasa(message: string): Promise<string[]> {
    return rasaService.sendMessage(message);
}

//Conexión
export async function checkRasaConnection(): Promise<boolean> {
    return rasaService.checkConnection();
}


export default rasaService;