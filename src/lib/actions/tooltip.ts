import type { Props } from 'tippy.js';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export function tooltip(node: HTMLElement, options: Partial<Props> = {}) {
	const instance = tippy(node, {
		content: node.getAttribute('title') || '',
		placement: 'top',
		arrow: true,
		theme: 'custom',
		...options
	});

	node.removeAttribute('title');

	return {
		destroy() {
			instance.destroy();
		}
	};
}
