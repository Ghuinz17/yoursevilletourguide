Your_Seville_Tour_Guide 🌍

Your_Seville_Tour_Guide es una aplicación móvil desarrollada para el módulo de Desarrollo de Interfaces (2º C.F.G.S. DAM). Se trata de una guía turística inteligente que combina mapas interactivos, asistencia por inteligencia artificial y herramientas multimedia para explorar Sevilla.
+1

🛠️ Stack Tecnológico

Frontend: React Native con Expo.
+1


Backend & Auth: Supabase.
+1


IA/NLP: Rasa Open Source.
+1


Multimedia: Expo Speech, Expo Print y Expo Sharing.
+2

🚀 Funcionalidades Principales
🔒 Autenticación y Perfil

Seguridad: Registro y login mediante Supabase Authentication.


Gestión de Perfil: Uso de la tabla profiles para el manejo de username e profile_image.
+1

Servicios: Implementados en authService y profileService dentro de supabase.ts.

🛠️ Gestión de Datos (CRUD)

Control Total: Operaciones CRUD completas en las tablas tours y stops.


Sincronización: Los cambios se reflejan inmediatamente en la interfaz de usuario con confirmaciones visuales.


Estructura: Soporte para rutas complejas con múltiples paradas y orden de visita (stop_order).

🗺️ Mapa Interactivo

Visualización: Uso de react-native-maps para posicionar monumentos y paradas.


Interacción: Marcadores dinámicos alimentados por la base de datos con popups informativos.

🤖 Asistente Virtual e IA

Chatbot Rasa: Integración con un servidor Rasa para responder sobre tours, horarios y consejos turísticos.
+1

Lógica de Respaldo: El sistema incluye respuestas de fallback locales en caso de que el servidor de IA no esté disponible (FALLBACK_RESPONSES).

Interfaz: Chat interactivo con estados de carga ("Escribiendo...") y scroll automático.

🎙️ Multimedia y Accesibilidad

Text-to-Speech: Lectura en voz de la descripción de paradas y mensajes del chat mediante Expo Speech.
+1


Controles: Funcionalidad de Play, Pause y Stop integrada.


Gestión de Imágenes: Subida de archivos en base64 al almacenamiento de Supabase (imageService) con feedback de estado.
+1

📄 Generación de Informes

Reportes PDF: Creación de documentos profesionales con el nombre del tour y la lista de paradas visitadas.
+1


Compartir: Integración con expo-sharing para distribuir el informe generado.
+1

📖 Guía de Uso de la Aplicación
Debido a que este documento sustituye al vídeo demostrativo, se detallan los pasos para evaluar las funcionalidades:

Inicio: Acceda con su cuenta. La app validará los campos y mostrará errores si los datos son incorrectos.

Mapa: Explore Sevilla en el mapa. Pulse los marcadores para ver la información de los monumentos cargada desde Supabase.

Gestión (CRUD):

Cree un nuevo Tour y añádale paradas (Stops) con sus coordenadas.

Suba una imagen de perfil o del tour desde ProfileScreen o EditTourScreen.

Chat e IA: Abra el asistente y pregunte: "¿Qué tours hay disponibles?". Si mantiene presionado un mensaje, la app lo leerá en voz alta.


Informe: Desde el detalle de un tour, genere el informe PDF para ver el resumen de la ruta y compártalo.
+1

🗄️ Esquema de Base de Datos

profiles: Información del usuario vinculada a auth.users.


tours: Datos principales de las rutas (título, ciudad, precio, duración).


stops: Paradas individuales vinculadas a un tour_id.


tour_imagenes: Tabla para la gestión de múltiples fotos por tour.

📂 Estructura del Código
components/: Elementos UI como ChatAssistant y TourImagePicker.

screens/: Pantallas de navegación (MapScreen, ChatScreen, PDFReportScreen, etc.).

services/: Lógica de conexión con supabase.ts y rasa.ts.

types/: Definiciones de interfaces TypeScript (Tour, Stop, Profile).

🎓 Información Académica

Centro: IES Velázquez.


Módulo: Desarrollo de Interfaces.

Curso: 2º C.F.G.S. Desarrollo de Aplicaciones Multiplataforma.
