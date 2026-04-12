import { animate } from 'motion/mini';

function fadeIn(element: HTMLElement, predicate: boolean = true) {
	if (predicate) {
		element.style.opacity = '0';
		element.style.filter = 'blur(1px)';

		animate(
			element,
			{
				opacity: 1,
				filter: 'blur(0px)'
			},
			{ duration: 0.12, ease: 'easeOut' }
		);
	}

	return {
		destroy() {}
	};
}

function growToWidth(element: HTMLElement, width: string) {
	element.style.width = '0px';
	animate(
		element,
		{ width },
		{
			duration: 0.25,
			ease: 'easeOut'
		}
	);

	return {
		destroy() {}
	};
}

function growToHeight(element: HTMLElement, height: string) {
	element.style.height = '0px';
	element.style.opacity = '0';

	animate(
		element,
		{
			height,
			opacity: 1
		},
		{
			duration: 0.4,
			ease: 'easeOut'
		}
	);

	return {
		destroy() {}
	};
}

function fadeInForward(element: HTMLElement, predicate: boolean = true) {
	if (predicate) {
		element.style.opacity = '0';
		element.style.transform = 'scale(.99)';
		element.style.filter = 'blur(2px)';

		animate(
			element,
			{
				opacity: 1,
				transform: 'scale(1)',
				filter: 'blur(0px)'
			},
			{ duration: 0.12, ease: 'easeOut' }
		);
	}

	return {
		destroy() {}
	};
}

function fadeInForwardOnScroll(element: HTMLElement) {
	element.style.opacity = '0';
	element.style.transform = 'scale(.99)';
	element.style.filter = 'blur(2px)';

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				animate(
					element,
					{
						opacity: 1,
						transform: 'scale(1)',
						filter: 'blur(0px)'
					},
					{ duration: 0.12, delay: 0.2, ease: 'easeOut' }
				);
				observer.unobserve(element);
			}
		},
		{ threshold: 0.5 }
	);

	observer.observe(element);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

function fadeOut(element: HTMLElement, predicate: boolean = true) {
	if (predicate) {
		element.style.opacity = '1';
		element.style.transform = 'scale(1)';
		element.style.filter = 'blur(0px)';

		animate(
			element,
			{
				opacity: 0,
				transform: 'scale(.99)',
				filter: 'blur(2px)'
			},
			{ duration: 0.12, ease: 'easeOut' }
		);
	}

	return {
		destroy() {}
	};
}

function fadeOutRightLeft(element: HTMLElement, predicate: boolean = true) {
	element.style.opacity = '0';
	element.style.transform = 'translateX(8px) scale(0.99)';
	element.style.filter = 'blur(2px)';

	animate(
		element,
		{
			opacity: 1,
			transform: 'translateX(0px) scale(1)',
			filter: 'blur(0px)'
		},
		{ duration: 0.12, ease: 'easeOut' }
	);

	return {
		destroy() {}
	};
}

function animateCounterTransition(
	outgoing: HTMLElement,
	incoming: HTMLElement,
	direction: 'up' | 'down' = 'up'
) {
	const outY = direction === 'up' ? '-100%' : '100%';
	const inY = direction === 'up' ? '100%' : '-100%';

	outgoing.style.position = 'absolute';
	outgoing.style.top = '0';
	outgoing.style.left = '0';

	incoming.style.position = 'absolute';
	incoming.style.top = '0';
	incoming.style.left = '0';
	incoming.style.transform = `translateY(${inY})`;
	incoming.style.opacity = '0';

	const duration = 0.2;

	animate(
		outgoing,
		{
			transform: `translateY(${outY})`,
			opacity: 0
		},
		{ duration, ease: 'easeOut' }
	);

	animate(
		incoming,
		{
			transform: 'translateY(0%)',
			opacity: 1
		},
		{ duration, ease: 'easeOut' }
	);

	return {
		destroy() {}
	};
}

export const animations = {
	fadeInForward,
	fadeOut,
	fadeIn,
	fadeOutRightLeft,
	fadeInForwardOnScroll,
	growToWidth,
	growToHeight,
	animateCounterTransition
};
