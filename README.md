# Your_Seville_Tour_Guide 🌍

**Your_Seville_Tour_Guide** es una aplicación móvil desarrollada para el módulo de **Desarrollo de Interfaces** (2º C.F.G.S. DAM) en el **IES Velázquez**. Se trata de una Guía Turística Inteligente de Sevilla que permite explorar monumentos, interactuar con un asistente virtual y generar informes visuales.

## 🛠️ Stack Tecnológico
* **Frontend**: React Native con Expo.
* **Backend & Auth**: Supabase.
* **IA/NLP**: Rasa Open Source.
* **Multimedia**: Expo Speech, Expo Print y Expo Sharing.

---

## 🚀 Funcionalidades Principales

### 🔒 Autenticación y Perfil
* **Seguridad**: Registro y login mediante **Supabase Authentication**.
* **Gestión de Perfil**: Uso de la tabla `profiles` para el manejo de `username` e `profile_image`.
* **Feedback**: Validaciones visuales ante errores de login o campos vacíos.

### 🛠️ Gestión de Datos (CRUD)
* **Control Total**: Operaciones de crear, leer, actualizar y eliminar en las tablas `tours` y `stops`.
* **Sincronización**: Los cambios se reflejan inmediatamente en la interfaz de usuario.
* **Estructura**: Soporte para rutas complejas con orden de visita (`stop_order`) y geolocalización.

### 🗺️ Mapa Interactivo
* **Visualización**: Uso de `react-native-maps` para posicionar monumentos y paradas en Sevilla.
* **Interacción**: Marcadores dinámicos alimentados por la base de datos con popups o tooltips informativos.

### 🤖 Asistente Virtual (Chatbot)
* **Inteligencia Artificial**: Integración con un servidor **Rasa** para responder dudas sobre tours, horarios y consejos.
* **Robustez**: El sistema incluye respuestas de *fallback* locales para garantizar la interacción si el servidor de IA no responde.
* **Accesibilidad**: Opción de reproducir en voz las respuestas del chat manteniendo presionado el mensaje.

### 🎙️ Multimedia y Accesibilidad
* **Text-to-Speech**: Lectura en voz de la historia de cada parada mediante **Expo Speech**.
* **Controles**: Interfaz con botones de play, pause y stop para la locución.
* **Gestión de Imágenes**: Subida de archivos en base64 al almacenamiento de Supabase con feedback de éxito/error.

### 📄 Generación de Informes (Unidad 5)
* **Reportes PDF**: Creación de informes que incluyen el nombre del tour y la lista de paradas con su descripción.
* **Distribución**: Integración con el sistema nativo para compartir el documento generado.

---

## 📖 Guía de Uso (Sustitución de Vídeo)

Para evaluar correctamente todas las funcionalidades exigidas, siga este flujo:

1. **Acceso**: Inicie sesión o regístrese.Compruebe que la app impide el acceso con campos vacíos.
2. **Exploración**: Navegue al mapa y pulse sobre los marcadores para ver los detalles de los monumentos cargados desde la DB.
3. **Gestión CRUD**:
   * Cree un tour desde el formulario, edítelo o elimínelo.
   * Añada paradas turísticas indicando su latitud y longitud.
4. **Audioguía**: En el detalle de una parada, use los controles de audio para escuchar la descripción histórica.
5. **Chatbot**: Pregunte al asistente "¿Qué monumentos puedo visitar?". Mantenga presionado el mensaje recibido para activar la lectura por voz.
6. **Informe**: Genere el PDF del tour y utilice la opción de compartir para finalizar el proceso.

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
* **Centro**: IES Velázquez.
* **Curso**: 2º C.F.G.S. Desarrollo de Aplicaciones Multiplataforma.
* **Módulo**: Desarrollo de Interfaces.
