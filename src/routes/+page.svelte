<script lang="ts">
	import Fuse from 'fuse.js';
	import { data } from '$lib/data';
	import { onMount } from 'svelte';

	let searchTerm = '';
	let mode: 'insert' | 'normal' = 'insert';

	// Variables para vincular a los elementos del DOM
	let searchInput: HTMLInputElement;
	let resultsContainer: HTMLDivElement;

	const fuse = new Fuse(data, {
		keys: ['title', 'short', 'explained', 'useCase'],
		includeScore: true,
		threshold: 0.4
	});

	$: results = searchTerm ? fuse.search(searchTerm).map((result) => result.item) : data;

	// --- Lógica de Navegación VIM ---

	function handleInputKeydown(event: KeyboardEvent) {
		// Salir a modo normal con Ctrl + j
		if (event.ctrlKey && event.key === 'j') {
			event.preventDefault();
			mode = 'normal';
			resultsContainer.focus();
		}
	}

	onMount(() => {
		// Empezar en el buscador por defecto
		searchInput.focus();

		const handleGlobalKeydown = (event: KeyboardEvent) => {
			if (mode === 'normal') {
				switch (event.key) {
					case 'j':
						event.preventDefault();
						window.scrollBy(0, 60); // Scroll hacia abajo
						break;
					case 'k':
						event.preventDefault();
						window.scrollBy(0, -60); // Scroll hacia arriba
						break;
					case 'i':
						event.preventDefault();
						mode = 'insert';
						searchInput.focus();
						searchInput.select();
						break;
				}
			}
		};

		window.addEventListener('keydown', handleGlobalKeydown);

		return () => {
			window.removeEventListener('keydown', handleGlobalKeydown);
		};
	});
</script>

<main class="container">
	<h1>Glosario Backend</h1>
	<p>
		Modo Inserción: <kbd>Ctrl</kbd> + <kbd>j</kbd> para navegar. Modo Scroll: <kbd>i</kbd> para buscar, <kbd>j</kbd>/<kbd>k</kbd> para navegar.
	</p>

	<input
		type="search"
		bind:value={searchTerm}
		bind:this={searchInput}
		on:keydown={handleInputKeydown}
		placeholder="Modo Inserción..."
		aria-label="Buscar en glosario"
	/>

	<div class="results-list" bind:this={resultsContainer} tabindex="-1">
		{#each results as item}
			<article class="result-item">
				<h2>{item.title}</h2>
				<div class="sub-section">
					<h3>Respuesta Corta</h3>
					<p>{item.short}</p>
				</div>
				<div class="sub-section">
					<h3>Respuesta Explicada</h3>
					<p>{item.explained}</p>
				</div>
				<div class="sub-section">
					<h3>Caso de Uso</h3>
					<p>{item.useCase}</p>
				</div>
			</article>
		{:else}
			<p>No se encontraron resultados.</p>
		{/each}
	</div>
</main>

<style>
	.container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family: sans-serif;
	}

	p kbd {
		display: inline-block;
		padding: 0.1em 0.3em;
		font-family: monospace;
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 3px;
		font-size: 0.9em;
	}

	input[type='search'] {
		width: 100%;
		padding: 0.75rem;
		margin-bottom: 1.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.results-list:focus {
		outline: 2px solid #a0c4ff; /* Resaltar cuando está en modo scroll */
	}

	.result-item {
		background-color: #f9f9f9;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.result-item h2 {
		margin-top: 0;
		font-size: 1.5rem;
		color: #333;
		border-bottom: 2px solid #eee;
		padding-bottom: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.sub-section {
		margin-bottom: 1.5rem;
	}

	.sub-section:last-child {
		margin-bottom: 0;
	}

	.sub-section h3 {
		font-size: 1.1rem;
		font-weight: bold;
		color: #444;
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.sub-section p {
		margin: 0;
		line-height: 1.6;
		color: #555;
	}
</style>