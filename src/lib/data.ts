export const data = [
	{
		title: 'What is CORS (Cross-Origin Resource Sharing)?',
		short: 'It is a security mechanism that allows a server to indicate to browsers which origins (domains) are authorized to request its resources.',
		explained:
			'By default, browsers apply the "Same-Origin Policy", which prevents a web page from requesting resources from a different domain than the one that served it. CORS introduces HTTP headers (like `Access-Control-Allow-Origin`) that the server can use to "relax" this policy in a controlled way, allowing secure requests between different domains.',
		useCase:
			'A frontend application (React, Svelte, etc.) at `https://my-app.com` needs to get data from a backend API at `https://api.my-company.com`. Without CORS, the browser would block the request. The API server must be configured to send the `Access-Control-Allow-Origin: https://my-app.com` header to allow communication.'
	},
	{
		title: 'What is a JWT (JSON Web Token)?',
		short:
			'It is an open standard (RFC 7519) for creating access tokens that allow the propagation of identity and privileges securely and compactly between parties.',
		explained:
			'A JWT consists of three parts separated by dots: Header (algorithm and type), Payload (user data, permissions, etc.), and Signature (to verify authenticity). The server generates the token, signs it with a secret key, and sends it to the client. The client stores it and sends it in each subsequent request. The server can verify the signature without needing to query a database, which makes it very efficient.',
		useCase:
			'A user logs in with their email and password. The server validates the credentials, generates a JWT with the user ID and a "registered_user" role, and returns it. The client saves the JWT and adds it to the `Authorization` header of all requests to protected routes. The server verifies the JWT on each request to authorize access.'
	},
	{
		title: 'What is a RESTful API?',
		short:
			'It is an architectural style for designing networked applications. It is based on a set of principles that use standard HTTP methods (GET, POST, PUT, DELETE) to operate on resources.',
		explained:
			'REST (Representational State Transfer) is not a protocol, but a set of constraints. The main ones are: client-server architecture, stateless communication, cacheability, and a uniform interface. Resources (e.g., users, products) are identified with URIs (e.g., `/users/123`). Interactions are stateless, meaning that each client request must contain all the information necessary to be processed.',
		useCase:
			'An e-commerce application exposes a RESTful API. To get the list of products, the frontend makes a `GET /products` request. To add a new product to the cart, it makes a `POST /cart/items` with the product data in the body. To delete a product, `DELETE /cart/items/456`. The API is clear, predictable, and follows web standards.'
	},
	{
		title: 'SOLID Principles',
		short:
			'The SOLID principles are principles that apply to Object-Oriented Programming (OOP) and software design.',
		explained:
			`S - Single Responsibility Principle: A class should have one, and only one, reason to change.
L - Open/Closed Principle: Software entities (classes, modules, functions) should be open for extension, but closed for modification.
I - Interface Segregation Principle: No client should be forced to depend on interfaces it does not use. It is better to have many small, specific interfaces than one large, monolithic one.
D - Dependency Inversion Principle: High-level modules should not depend on low-level modules. Both should depend on abstractions.`,
		useCase:
			'When designing an order processing class, instead of having a single monolithic class that validates, processes payment, and notifies the user, SOLID principles are applied. An `OrderValidator` class is created for validation, a `PaymentProcessor` for payments, and a `NotificationService` for notifications. The main `OrderProcessor` class coordinates these smaller classes (Dependency Inversion), each with a single responsibility and able to be extended or replaced without modifying the others.'
	},
];
