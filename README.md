# TI Solutions

Sitio comercial de TI Solutions orientado a sitios web, aplicaciones, software a medida, tiendas en línea, automatización y mejoras de sistemas. HTML, CSS y JavaScript con Bootstrap 5.3.8. El contenido es provisional y está listo para una siguiente revisión editorial.

## Abrir y editar

Abre `dist/index.html` directamente en un navegador. No hay compilación, dependencias de Node ni instalación necesaria. Bootstrap está incluido localmente; la página no necesita un CDN ni fuentes externas.

Para servirlo en tu computadora, de forma opcional:

```sh
python3 -m http.server 8080 --directory dist
```

## Archivos

- `dist/index.html`: las ocho secciones y los textos del sitio.
- `dist/assets/css/styles.css`: diseño, colores y adaptación a pantallas.
- `dist/assets/js/config.js`: WhatsApp, correo, Facebook e Instagram.
- `dist/assets/js/app.js`: navegación, enlaces de contacto y envío del formulario por correo.
- `dist/assets/img/ti-solutions-logo.png`: logo original proporcionado por Daniel.
- `dist/assets/img/ti-solutions-header-v2.svg`: composición horizontal para la cabecera; contiene el PNG refinado incrustado y elimina solo márgenes transparentes del encuadre. El arte original se conserva también como `ti-solutions-header-v2.png`.
- `dist/assets/img/favicon-sphere.svg`: esfera vectorial simplificada para la pestaña del navegador, con color adaptado a modo claro u oscuro.
- `dist/assets/vendor/`: Bootstrap CSS y JavaScript, con sus avisos de licencia.

## Secciones

Inicio, servicios, soluciones para tu negocio, clientes, proyectos/demostraciones, nosotros, proceso de trabajo, preguntas frecuentes y contacto. El pie de página incluye navegación para volver al inicio.

## Configurar contacto

Edita `dist/assets/js/config.js` con datos reales. WhatsApp debe contener código de país y número, solo dígitos (por ejemplo, para México: 52 seguido del número de 10 dígitos). Las redes sociales deben ser URLs HTTPS completas. Si su URL está vacía, el icono se muestra como próximamente y no es un enlace.

El botón de WhatsApp abre una conversación al número configurado con un mensaje predeterminado editable en `whatsappMessage`. El visitante decide enviarlo desde WhatsApp.

El formulario funciona en GitHub Pages y otros hostings estáticos, sin PHP, API propia ni claves SMTP en el navegador. Envía los datos directamente desde el sitio a FormSubmit mediante AJAX, para recibirlos en el correo comercial configurado. Incluye correo del visitante para responder, teléfono opcional, validación, campo antispam y estados de envío. No abre la aplicación de correo. Si JavaScript o las APIs de envío no están disponibles, el formulario utiliza el POST nativo al servicio. El correo de `config.js` sincroniza el destino del formulario cuando se ejecuta JavaScript. Si cambias el destinatario, actualiza también el atributo `action` de `projectForm` en `dist/index.html` para mantener el envío sin JavaScript.

**Activación necesaria:** abre el sitio publicado y realiza un primer envío de prueba. FormSubmit enviará un correo de confirmación a `gdrmgdrm2@gmail.com`; confirma el enlace y vuelve a probar el formulario. Hasta esa confirmación no debe considerarse habilitada la recepción. No se realizaron envíos reales ni se verificó la entrega en el buzón durante la implementación. El proveedor requiere acceso por HTTP/HTTPS; abrir `index.html` como archivo local no valida este envío.

Los datos se procesan mediante FormSubmit, que documenta retención de solicitudes durante 30 días. Documentación: https://formsubmit.co/documentation y https://formsubmit.co/ajax-documentation . El sitio no añade almacenamiento propio de consultas ni analítica.

## Contenido pendiente

- Revisar textos y servicios definitivos.
- Añadir los enlaces definitivos de Facebook e Instagram.
- Sustituir o ampliar las demostraciones con proyectos autorizados.
- Definir las condiciones comerciales de cada proyecto.
- Definir dominio y material final para compartir en redes.

Los conceptos del inicio y las muestras de proyectos son ficticios y están identificados como demostraciones. Las pestañas del inicio utilizan el componente Tab de Bootstrap. No se incluyen clientes, testimonios ni resultados comerciales inventados.

## Publicación y licencia

Para hosting estático, publica el contenido de `dist/`.

Para GitHub Pages, copia el contenido de `dist/` a la raíz del repositorio (o a `docs/`) y configura esa carpeta en Settings → Pages → Deploy from a branch. Conserva la carpeta `assets/` junto a `index.html`; sus rutas relativas también funcionan en sitios bajo `/nombre-del-repositorio/`. No necesitas desplegar ningún backend para el formulario: utiliza FormSubmit y completa la activación descrita arriba. Prueba la recepción desde la URL HTTPS publicada, no desde un archivo local.

 La carpeta `.openai/` contiene metadatos del proveedor de vista privada; no es necesaria para usar el sitio en otro hosting.

Bootstrap es de sus autores y se distribuye bajo MIT. Sus avisos se conservan en los archivos originales. El logo y la identidad de TI Solutions pertenecen a su titular.

## Esfera animada

La sección Nosotros utiliza una interpretación 3D de la esfera de conexiones, basada en los puntos del símbolo. Se dibuja en Canvas, sin dependencias, con una vuelta aproximada cada 36 segundos. El PNG del símbolo sirve como alternativa estática. Incluye pausa manual y respeta la preferencia de movimiento reducido; la animación se detiene fuera de pantalla y en pestañas ocultas.

## Clientes

La sección Clientes muestra únicamente los logos de Aplimet y Biosima. Los PNG originales proporcionados por Daniel se conservan sin modificaciones en `dist/assets/img/clients/`. La sección presenta la relación comercial previa sin describir proyectos ni añadir testimonios, métricas o enlaces.

## Información confirmada

WhatsApp: +52 667 192 0834. Correo: gdrmgdrm2@gmail.com. Atención remota desde Culiacán. Daniel se presenta como director de TI Solutions, con más de ocho años de experiencia. No se publica Google Maps, horario, información de facturación ni condiciones de pago específicas. El dominio propio y las URLs de redes siguen pendientes.

Las tarjetas de demostración son muestras visuales estáticas y no abren modales.

## Ajustes visuales

Las tarjetas de la sección 04 presentan movimiento sutil al pasar el cursor, solo con un puntero preciso y sin preferencia de movimiento reducido. No abren modales. Se retiraron las etiquetas de demostración y el texto introductorio señalado. El botón de WhatsApp utiliza verde de alto contraste, el icono de Bootstrap Icons y conserva el mensaje predeterminado. Se retiraron las referencias a reuniones presenciales.

Icono de WhatsApp: https://icons.getbootstrap.com/icons/whatsapp/ . Fuente SVG: https://github.com/twbs/icons/blob/main/icons/whatsapp.svg . Licencia MIT de Bootstrap Icons incluida en assets/vendor.
