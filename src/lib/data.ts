export const data = [
	{
		title: '¿Qué es CORS (Cross-Origin Resource Sharing)?',
		short: 'Es un mecanismo de seguridad que permite a un servidor indicar a los navegadores qué orígenes (dominios) están autorizados a solicitar sus recursos.',
		explained:
			'Por defecto, los navegadores aplican la "Same-Origin Policy" (Política del Mismo Origen), que impide que una página web solicite recursos a un dominio diferente al que la sirvió. CORS introduce cabeceras HTTP (como `Access-Control-Allow-Origin`) que el servidor puede usar para "relajar" esta política de forma controlada, permitiendo peticiones seguras entre diferentes dominios.',
		useCase:
			'Una aplicación frontend (React, Svelte, etc.) en `https://mi-app.com` necesita obtener datos de un API backend en `https://api.mi-empresa.com`. Sin CORS, el navegador bloquearía la petición. El servidor de la API debe configurarse para enviar la cabecera `Access-Control-Allow-Origin: https://mi-app.com` para permitir la comunicación.'
	},
	{
		title: '¿Qué es un JWT (JSON Web Token)?',
		short:
			'Es un estándar abierto (RFC 7519) para crear tokens de acceso que permiten la propagación de identidad y privilegios de forma segura y compacta entre partes.',
		explained:
			'Un JWT consta de tres partes separadas por puntos: Header (algoritmo y tipo), Payload (datos del usuario, permisos, etc.) y Signature (firma para verificar la autenticicad). El servidor genera el token, lo firma con una clave secreta y se lo envía al cliente. El cliente lo almacena y lo envía en cada petición posterior. El servidor puede verificar la firma sin necesidad de consultar una base de datos, lo que lo hace muy eficiente.',
		useCase:
			'Un usuario inicia sesión con su email y contraseña. El servidor valida las credenciales, genera un JWT con el ID de usuario y un rol de "usuario_registrado", y se lo devuelve. El cliente guarda el JWT y lo añade a la cabecera `Authorization` de todas las peticiones a rutas protegidas. El servidor verifica el JWT en cada petición para autorizar el acceso.'
	},
	{
		title: '¿Qué es una API RESTful?',
		short:
			'Es un estilo de arquitectura para diseñar aplicaciones en red. Se basa en un conjunto de principios que utilizan los métodos estándar de HTTP (GET, POST, PUT, DELETE) para operar sobre recursos.',
		explained:
			'REST (Representational State Transfer) no es un protocolo, sino un conjunto de restricciones. Las principales son: arquitectura cliente-servidor, comunicación sin estado (stateless), cacheabilidad, y una interfaz uniforme. Los recursos (ej: usuarios, productos) se identifican con URIs (ej: `/users/123`). Las interacciones son sin estado, lo que significa que cada petición del cliente debe contener toda la información necesaria para ser procesada.',
		useCase:
			'Una aplicación de e-commerce expone una API RESTful. Para obtener la lista de productos, el frontend hace una petición `GET /products`. Para añadir un nuevo producto al carrito, hace `POST /cart/items` con los datos del producto en el cuerpo. Para eliminar un producto, `DELETE /cart/items/456`. La API es clara, predecible y sigue los estándares de la web.'
	}
];