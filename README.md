# Your_Seville_Tour_Guide 🌍

[cite_start]**Your_Seville_Tour_Guide** es una aplicación móvil desarrollada para el módulo de **Desarrollo de Interfaces** (2º C.F.G.S. DAM) en el **IES Velázquez**[cite: 1, 2]. [cite_start]Se trata de una Guía Turística Inteligente de Sevilla que permite explorar monumentos, interactuar con un asistente virtual y generar informes visuales[cite: 6].

## 🛠️ Stack Tecnológico
* [cite_start]**Frontend**: React Native con Expo[cite: 53].
* [cite_start]**Backend & Auth**: Supabase[cite: 17].
* [cite_start]**IA/NLP**: Rasa Open Source[cite: 31].
* [cite_start]**Multimedia**: Expo Speech, Expo Print y Expo Sharing[cite: 36, 53, 55].

---

## 🚀 Funcionalidades Principales

### 🔒 Autenticación y Perfil
* [cite_start]**Seguridad**: Registro y login mediante **Supabase Authentication**[cite: 17].
* **Gestión de Perfil**: Uso de la tabla `profiles` para el manejo de `username` e `profile_image`.
* [cite_start]**Feedback**: Validaciones visuales ante errores de login o campos vacíos[cite: 18].

### 🛠️ Gestión de Datos (CRUD)
* [cite_start]**Control Total**: Operaciones de crear, leer, actualizar y eliminar en las tablas `tours` y `stops`[cite: 19, 20].
* [cite_start]**Sincronización**: Los cambios se reflejan inmediatamente en la interfaz de usuario[cite: 21].
* **Estructura**: Soporte para rutas complejas con orden de visita (`stop_order`) y geolocalización.

### 🗺️ Mapa Interactivo
* [cite_start]**Visualización**: Uso de `react-native-maps` para posicionar monumentos y paradas en Sevilla[cite: 23, 24].
* [cite_start]**Interacción**: Marcadores dinámicos alimentados por la base de datos con popups o tooltips informativos[cite: 26, 27].

### 🤖 Asistente Virtual (Chatbot)
* [cite_start]**Inteligencia Artificial**: Integración con un servidor **Rasa** para responder dudas sobre tours, horarios y consejos[cite: 31, 34].
* **Robustez**: El sistema incluye respuestas de *fallback* locales para garantizar la interacción si el servidor de IA no responde.
* **Accesibilidad**: Opción de reproducir en voz las respuestas del chat manteniendo presionado el mensaje.

### 🎙️ Multimedia y Accesibilidad
* [cite_start]**Text-to-Speech**: Lectura en voz de la historia de cada parada mediante **Expo Speech**[cite: 36, 43].
* [cite_start]**Controles**: Interfaz con botones de play, pause y stop para la locución[cite: 44].
* **Gestión de Imágenes**: Subida de archivos en base64 al almacenamiento de Supabase con feedback de éxito/error.

### 📄 Generación de Informes (Unidad 5)
* [cite_start]**Reportes PDF**: Creación de informes que incluyen el nombre del tour y la lista de paradas con su descripción[cite: 49, 51, 52].
* [cite_start]**Distribución**: Integración con el sistema nativo para compartir el documento generado[cite: 55].

---

## 📖 Guía de Uso (Sustitución de Vídeo)

Para evaluar correctamente todas las funcionalidades exigidas, siga este flujo:

1. **Acceso**: Inicie sesión o regístrese. [cite_start]Compruebe que la app impide el acceso con campos vacíos[cite: 18].
2. [cite_start]**Exploración**: Navegue al mapa y pulse sobre los marcadores para ver los detalles de los monumentos cargados desde la DB[cite: 26].
3. **Gestión CRUD**:
   * [cite_start]Cree un tour desde el formulario, edítelo o elimínelo[cite: 20].
   * Añada paradas turísticas indicando su latitud y longitud.
4. [cite_start]**Audioguía**: En el detalle de una parada, use los controles de audio para escuchar la descripción histórica[cite: 44].
5. **Chatbot**: Pregunte al asistente "¿Qué monumentos puedo visitar?". Mantenga presionado el mensaje recibido para activar la lectura por voz.
6. [cite_start]**Informe**: Genere el PDF del tour y utilice la opción de compartir para finalizar el proceso[cite: 53, 55].

---

## 🗄️ Esquema de Base de Datos
La aplicación utiliza un modelo relacional en Supabase con las siguientes tablas clave:
* **`profiles`**: Datos extendidos del usuario vinculados a la autenticación.
* **`tours`**: Información de las rutas (título, descripción, ciudad, precio).
* **`stops`**: Puntos de interés específicos vinculados a cada tour.
* **`tour_imagenes`**: Gestión de múltiples imágenes por ruta.

---

## 📂 Estructura del Proyecto
* `components/`: Elementos UI reutilizables (`ChatAssistant`, `TourImagePicker`).
* `screens/`: Pantallas de la aplicación (`MapScreen`, `ChatScreen`, `PDFReportScreen`).
* `services/`: Lógica de comunicación con APIs externas (`supabase.ts`, `rasa.ts`).
* `types/`: Definiciones de interfaces TypeScript para asegurar la integridad de datos.

## 🏫 Información Académica
* [cite_start]**Centro**: IES Velázquez[cite: 2].
* **Curso**: 2º C.F.G.S. [cite_start]Desarrollo de Aplicaciones Multiplataforma[cite: 1].
* **Módulo**: Desarrollo de Interfaces.
